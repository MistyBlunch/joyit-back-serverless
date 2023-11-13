import { CardService } from '../../../src/services/shared/card.service';

describe('CardService', () => {
  let cardService: CardService;

  beforeEach(() => {
    cardService = new CardService();
  });

  describe('validateAndReturnCardInterface', () => {
    it('should return valid status and card if card parameters are valid', () => {
      const validCard = {
        "email": "gian.corzo@gmail.com",
        "card_number": "4111111111111111",
        "cvv": "123",
        "expiration_year": "2028",
        "expiration_month": "09"
      };

      const result = cardService.validateAndReturnCardInterface(validCard);

      expect(result.status).toBe(true);
      expect(result.message).toBe('The card is valid');
      expect(result.card).toEqual(validCard);
    });

    it('should return false status and error message if card parameters are invalid', () => {
      const invalidCard = {
        "email": "invalid",
        "card_number": "411111111111111",
        "cvv": "123a",
        "expiration_year": "1920",
        "expiration_month": "99"
      };

      const result = cardService.validateAndReturnCardInterface(invalidCard);

      expect(result.status).toBe(false);
      expect(result.message).toBeTruthy();
      expect(result.card).toBeNull();
    });
  });

  describe('validateCardNumber', () => {
    it('should return true status if card number is valid', () => {
      const validCardNumber = '4111111111111111';

      const result = cardService.validateCardNumber(validCardNumber);

      expect(result.status).toBe(true);
      expect(result.message).toBe('The card is valid');
    });

    it('should return false status and error message if card number is invalid', () => {
      const invalidCardNumber = '4111111111111112';

      const result = cardService.validateCardNumber(invalidCardNumber);

      expect(result.status).toBe(false);
      expect(result.message).toBe('Invalid card number');
    });
  });

  describe('cardTokenGenerator', () => {
    it('should generate a random token of the correct length', () => {
      const result = cardService.cardTokenGenerator();

      expect(result.length).toBe(16);
      expect(/^[a-zA-Z0-9]+$/.test(result)).toBe(true); // Ensure it only contains alphanumeric characters
    });
  });
});
