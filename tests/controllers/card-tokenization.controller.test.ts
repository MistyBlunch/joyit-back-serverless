import { CardTokenizationController } from "../../src/controllers/card-tokenization.controller";

describe('CardTokenizationController', () => {
  const cardTokenizationServiceMock: any = {
    cardVerificationAndTokenGeneration: jest.fn(),
    findCardInfoByToken: jest.fn(),
  };

  const cardServiceMock: any = {
    validateAndReturnCardInterface: jest.fn(),
  };

  const bearerTokenServiceMock: any = {
    validateToken: jest.fn(),
  };

  const cardTokenizationController = new CardTokenizationController(
    cardTokenizationServiceMock,
    cardServiceMock,
    bearerTokenServiceMock
  );

  beforeEach(() => {
    cardServiceMock.validateAndReturnCardInterface.mockReset();
    cardTokenizationServiceMock.cardVerificationAndTokenGeneration.mockReset();
    cardTokenizationServiceMock.findCardInfoByToken.mockReset();
    bearerTokenServiceMock.validateToken.mockReset();
  });

  it('should return 200 and a token if card and token are valid', async () => {
    const validEvent = {
      body: '{"card_number": "4111111111111111", "cvv": "123", "expiration_year": "2028", "expiration_month": "09"}',
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: {}
    };

    cardServiceMock.validateAndReturnCardInterface.mockReturnValue({ status: true, card: {} });
    bearerTokenServiceMock.validateToken.mockReturnValue({ status: true });

    cardTokenizationServiceMock.cardVerificationAndTokenGeneration.mockResolvedValue('ND486o4U9k3wH4O7');

    const result = await cardTokenizationController.createToken(validEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ token: 'ND486o4U9k3wH4O7' });
  });

  it('should return 400 if card is invalid', async () => {
    const invalidCardEvent = {
      body: '{"card_number": "4111111111111112", "cvv": "123", "expiration_year": "2028", "expiration_month": "09"}',
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: {}
    };

    cardServiceMock.validateAndReturnCardInterface.mockReturnValue({ status: false, message: 'Invalid card' });

    const result = await cardTokenizationController.createToken(invalidCardEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid card' });
  });

  it('should return 401 if authorization token is invalid', async () => {
    const invalidTokenEvent = {
      body: '{"card_number": "4111111111111111", "cvv": "123", "expiration_year": "2028", "expiration_month": "09"}',
      headers: { Authorization: 'Bearer invalidToken' },
      pathParameters: {}
    };

    cardServiceMock.validateAndReturnCardInterface.mockReturnValue({ status: true, card: {} });
    bearerTokenServiceMock.validateToken.mockReturnValue({ status: false, message: 'Invalid token' });

    const result = await cardTokenizationController.createToken(invalidTokenEvent);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid token' });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const unexpectedErrorEvent = {
      body: '{"card_number": "4111111111111111", "cvv": "123", "expiration_year": "2028", "expiration_month": "09"}',
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: {}
    };

    cardServiceMock.validateAndReturnCardInterface.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = await cardTokenizationController.createToken(unexpectedErrorEvent);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Unexpected error' });
  });

  it('should return 200 and card information if token is valid', async () => {
    const validTokenEvent = {
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: { token: 'ND486o4U9k3wH4O7' },
      body: ''
    };

    bearerTokenServiceMock.validateToken.mockReturnValue({ status: true });
    cardTokenizationServiceMock.findCardInfoByToken.mockResolvedValue({ cardInfo: 'someCardInfo' });

    const result = await cardTokenizationController.findByToken(validTokenEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ cardInfo: 'someCardInfo' });
  });

  it('should return 401 if authorization token is invalid', async () => {
    const invalidTokenEvent = {
      headers: { Authorization: 'Bearer invalidToken' },
      pathParameters: { token: 'ND486o4U9k3wH4O7' },
      body: ''
    };

    bearerTokenServiceMock.validateToken.mockReturnValue({ status: false, message: 'Invalid token' });

    const result = await cardTokenizationController.findByToken(invalidTokenEvent);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid token' });
  });

  it('should return 404 if token is invalid or has expired', async () => {
    const invalidTokenEvent = {
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: { token: 'ND486o4U' },
      body: ''
    };

    bearerTokenServiceMock.validateToken.mockReturnValue({ status: true });
    cardTokenizationServiceMock.findCardInfoByToken.mockResolvedValue(null);

    const result = await cardTokenizationController.findByToken(invalidTokenEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: 'The token is invalid or has already expired.' });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const unexpectedErrorEvent = {
      headers: { Authorization: 'Bearer pk_test_abcdefgh12345678' },
      pathParameters: { token: 'ND486o4U9k3wH4O7' },
      body: ''
    };

    bearerTokenServiceMock.validateToken.mockReturnValue({ status: true });
    cardTokenizationServiceMock.findCardInfoByToken.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = await cardTokenizationController.findByToken(unexpectedErrorEvent);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Unexpected error' });
  });
});