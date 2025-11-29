export class ConfirmRegisterCommand {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}
