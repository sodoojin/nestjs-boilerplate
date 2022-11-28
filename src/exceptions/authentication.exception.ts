export class AuthenticationException extends Error {
  constructor(
    public readonly message: string,
    public readonly redirectUrl?: string,
  ) {
    super();
  }
}
