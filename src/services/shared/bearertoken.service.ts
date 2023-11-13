export class BearerTokenService {
  validateToken(header: any) {
    const authorizationHeader =
      header.Authorization || header.authorization

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith('Bearer ')
    )
      return {
        status: false,
        message: 'Authorization Token was not provided or is not valid.',
      }

    const token = authorizationHeader.substring(7)
    if (!this.isValidTokenBearer(token))
      return {
        status: false,
        message: 'Authorization Token is not valid.',
      }

    return {
      status: true,
      message: 'Authorization Token is valid.',
    }
  }

  private isValidTokenBearer(token: string): boolean {
    if (!token.startsWith('pk_test_')) return false

    if (token.length !== 24) return false

    for (const char of token.slice(8))
      if (!/[a-zA-Z0-9]/.test(char)) return false

    return true
  }
}