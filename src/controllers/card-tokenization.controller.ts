import { HandlerEvent } from "../utils/interfaces/event.interface"
import { HandlerError } from "../utils/errors/handler.error"
import { CardTokenizationService } from "../services/card-tokenization.service"
import { CardService } from "../services/shared/card.service"
import { BearerTokenService } from "../services/shared/bearertoken.service"

export class CardTokenizationController {
  private cardTokenizationService: CardTokenizationService
  private cardService: CardService
  private bearerTokenService: BearerTokenService

  constructor(
    cardTokenizationService: CardTokenizationService,
    cardService: CardService,
    bearerTokenService: BearerTokenService
  ) {
    this.cardTokenizationService = cardTokenizationService
    this.cardService = cardService
    this.bearerTokenService = bearerTokenService
  }

  createToken = async (event: HandlerEvent) => {
    try {
      const requestData = JSON.parse(event.body)

      const cardIsValid = this.cardService.validateAndReturnCardInterface(requestData);
      if (!cardIsValid.status)
        throw new HandlerError(cardIsValid.message, 400)

      const authTokenIsValid = this.bearerTokenService.validateToken(event.headers)
      if (!authTokenIsValid.status)
        throw new HandlerError(authTokenIsValid.message, 401)

      const token = await this.cardTokenizationService.cardVerificationAndTokenGeneration(cardIsValid.card)

      return {
        statusCode: 200,
        body: JSON.stringify({
          token: token
        }),
      }
    } catch (error: any) {
      return {
        statusCode: error.code || 500,
        body: JSON.stringify({
          error: error.message,
        }),
      }
    }
  }

  findByToken = async (event: HandlerEvent) => {
    try {
      const authTokenIsValid = this.bearerTokenService.validateToken(event.headers)
      if (!authTokenIsValid.status)
        throw new HandlerError(authTokenIsValid.message, 401)

      const token = event.pathParameters.token;

      const card = await this.cardTokenizationService.findCardInfoByToken(token)

      if(!card)
        throw new HandlerError("The token is invalid or has already expired.", 404)

      return {
        statusCode: 200,
        body: JSON.stringify(card),
      }
    } catch (error: any) {
      return {
        statusCode: error.code || 500,
        body: JSON.stringify({
          error: error.message,
        }),
      }
    }
  }
}