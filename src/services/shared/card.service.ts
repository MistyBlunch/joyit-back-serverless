import { Card } from "../../model/card.model";
import { CardSchema } from "../../utils/schemas/card.schema";
import * as luhn from 'luhn'

export class CardService {
  validateAndReturnCardInterface(card: any) {
    const cardParamsMessageError = CardSchema.validate(card).error?.message

    if (cardParamsMessageError)
      return {
        status: false,
        message: cardParamsMessageError,
        card: null
      }

    return {
      status: true,
      message: 'The card is valid',
      card: card as Card
    }
  }

  validateCardNumber(cardNumber: string) {
    if (!luhn.validate(cardNumber))
      return {
        status: false,
        message: 'Invalid card number'
      }

    return {
      status: true,
      message: 'The card is valid'
    }
  }

  cardTokenGenerator() {
    const length = 16;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomToken: string[] = [];

    for (let i = 0; i < length; i++) {
      randomToken.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }

    return randomToken.join("");
  }
}