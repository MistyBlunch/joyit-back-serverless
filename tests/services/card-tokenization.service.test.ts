import { Card } from "../../src/model/card.model";
import { CardRepository } from "../../src/model/repositories/interfaces/card.repository.interface";
import { CardTokenizationService } from "../../src/services/card-tokenization.service";
import { CardService } from "../../src/services/shared/card.service";
import { ServiceError } from "../../src/utils/errors/service.error";

describe('CardTokenizationService', () => {
  const cardServiceMock: CardService = {
    validateAndReturnCardInterface: jest.fn(),
    validateCardNumber: jest.fn().mockReturnValue({ status: true }),
    cardTokenGenerator: jest.fn().mockReturnValue('ND486o4U9k3wH4O7'),
  };

  const cardRepositoryMock: CardRepository = {
    saveCard: jest.fn(),
    getCard: jest.fn(),
  };

  const cardTokenizationService = new CardTokenizationService(cardServiceMock, cardRepositoryMock);

  beforeEach(() => {
    cardServiceMock.validateAndReturnCardInterface = jest.fn();
    cardServiceMock.validateCardNumber = jest.fn().mockReturnValue({ status: true })
    cardServiceMock.cardTokenGenerator = jest.fn().mockReturnValue('ND486o4U9k3wH4O7')
  })

  it('should throw ServiceError if card is missing', async () => {
    await expect(cardTokenizationService.cardVerificationAndTokenGeneration(null)).rejects.toThrowError(
      new ServiceError('The card is missing')
    );
  });

  it('should throw ServiceError if card number is invalid', async () => {
    const invalidCard: Card = {
      "email": "",
      "card_number": "4111111111111112",
      "cvv": "",
      "expiration_year": "",
      "expiration_month": ""
    };

    (cardServiceMock.validateCardNumber as any).mockReturnValue({ status: false, message: 'Invalid card number' });

    await expect(cardTokenizationService.cardVerificationAndTokenGeneration(invalidCard)).rejects.toThrowError(
      new ServiceError('Invalid card number')
    );
  });

  it('should call cardRepository.saveCard with correct parameters', async () => {
    const validCard: Card = {
      "email": "",
      "card_number": "4111111111111111",
      "cvv": "123",
      "expiration_year": "2028",
      "expiration_month": "09"
    }

    await cardTokenizationService.cardVerificationAndTokenGeneration(validCard);

    expect(cardRepositoryMock.saveCard).toHaveBeenCalledWith('ND486o4U9k3wH4O7', validCard);
  });

  it('should call cardRepository.getCard with correct parameters', async () => {
    const token = 'ND486o4U9k3wH4O7';

    await cardTokenizationService.findCardInfoByToken(token);

    expect(cardRepositoryMock.getCard).toHaveBeenCalledWith(token);
  });
});