export class InitiateAuthCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
