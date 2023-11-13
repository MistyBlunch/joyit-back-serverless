import { ServiceError } from "../utils/errors/service.error";
import { Card } from "../model/card.model";
import { CardService } from "./shared/card.service";
import { CardRepository } from "../model/repositories/interfaces/card.repository.interface";

export class CardTokenizationService {
  private cardService: CardService
  private cardRepository: CardRepository

  constructor(cardService: CardService, cardRepository: CardRepository) {
    this.cardService = cardService
    this.cardRepository = cardRepository
  }

  async cardVerificationAndTokenGeneration(card: Card | null) {
    if(!card)
      throw new ServiceError("The card is missing")

    const cardNumberIsValid = this.cardService.validateCardNumber(card.card_number)
    if(!cardNumberIsValid.status) {
      throw new ServiceError(cardNumberIsValid.message)
    }

    const token = this.cardService.cardTokenGenerator();

    await this.cardRepository.saveCard(token, card)

    return token
  }

  async findCardInfoByToken(token: string) {
    return await this.cardRepository.getCard(token);
  }
}