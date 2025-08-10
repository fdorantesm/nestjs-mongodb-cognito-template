export class UserAlreadyRegisteredException extends Error {
  constructor(message?: string) {
    super(message || 'User already registered');
  }
}
