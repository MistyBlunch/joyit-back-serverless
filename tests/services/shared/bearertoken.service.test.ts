import { BearerTokenService } from "../../../src/services/shared/bearertoken.service";

describe('BearerTokenService', () => {
  let bearerTokenService = new BearerTokenService();

  it('should return true status if a valid token is provided in Authorization header', () => {
    const validToken = 'pk_test_abcdefgh12345678';

    const result = bearerTokenService.validateToken({ Authorization: `Bearer ${validToken}` });

    expect(result.status).toBe(true);
    expect(result.message).toBe('Authorization Token is valid.');
  });

  it('should return false status and error message if no Authorization header is provided', () => {
    const result = bearerTokenService.validateToken({});

    expect(result.status).toBe(false);
    expect(result.message).toBe('Authorization Token was not provided or is not valid.');
  });

  it('should return false status and error message if Authorization header does not start with "Bearer "', () => {
    const result = bearerTokenService.validateToken({ Authorization: 'InvalidToken' });

    expect(result.status).toBe(false);
    expect(result.message).toBe('Authorization Token was not provided or is not valid.');
  });

  it('should return false status and error message if Authorization token is not valid', () => {
    const invalidToken = 'invalidToken';

    const result = bearerTokenService.validateToken({ Authorization: `Bearer ${invalidToken}` });

    expect(result.status).toBe(false);
    expect(result.message).toBe('Authorization Token is not valid.');
  });

  it('should return true if the token is a valid Bearer token', () => {
    const validToken = 'pk_test_abcdefgh12345678';

    const result = bearerTokenService['isValidTokenBearer'](validToken);

    expect(result).toBe(true);
  });

  it('should return false if the token does not start with "pk_test_"', () => {
    const invalidToken = 'invalidToken';

    const result = bearerTokenService['isValidTokenBearer'](invalidToken);

    expect(result).toBe(false);
  });

  it('should return false if the token length is not 24 characters', () => {
    const invalidToken = 'pk_test_invalidLength';

    const result = bearerTokenService['isValidTokenBearer'](invalidToken);

    expect(result).toBe(false);
  });

  it('should return false if the token contains invalid characters after the initial 8 characters', () => {
    const invalidToken = 'pk_test_abcdefgh1234567890!';

    const result = bearerTokenService['isValidTokenBearer'](invalidToken);

    expect(result).toBe(false);
  });
});