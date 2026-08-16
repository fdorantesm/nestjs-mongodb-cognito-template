import { InvalidUuid } from '@/core/domain/exceptions/invalid-uuid.exception';
import { ValueObject } from '@/core/domain/value-object';

export class Uuid extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public isValid(value: string): boolean {
    if (!value.match(/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i)) {
      throw new InvalidUuid('Invalid UUID');
    }

    return true;
  }
}
