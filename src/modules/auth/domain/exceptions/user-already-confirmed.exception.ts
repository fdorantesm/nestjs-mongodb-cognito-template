export class UserAlreadyConfirmedException extends Error {
  constructor(message?: string) {
    super(message || 'User already confirmed');
  }
}
