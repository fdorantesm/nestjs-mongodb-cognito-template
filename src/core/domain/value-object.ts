import { InvalidValueException } from '@/core/domain/exceptions/invalid-value.exception';

export abstract class ValueObject<T> {
  private _value: T;

  constructor(value: T) {
    if (this.isValid && !this.isValid(value)) {
      throw new InvalidValueException(`Invalid value: ${String(value)}`);
    }
    this._value = value;
  }

  public getValue(): T {
    return this._value;
  }

  public isEqual(valueObject: ValueObject<T>): boolean {
    return this._value === valueObject.getValue();
  }

  public isValid(value: T): boolean {
    return Boolean(value);
  }
}
