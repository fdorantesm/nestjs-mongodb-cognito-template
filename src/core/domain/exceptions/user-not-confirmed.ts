export class UserNotConfirmedException extends Error {
  constructor(message?: string) {
    super(message || 'User not confirmed');
  }
}
