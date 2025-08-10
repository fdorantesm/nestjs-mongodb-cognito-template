export class StateMachine<T> {
  private transitions: StateTransitions<T>;

  constructor(transitions: StateTransitions<T>) {
    this.transitions = transitions;
  }

  public canTransition(from: EnumKeys<T>, to: EnumKeys<T>): boolean {
    const validTransitions = this.transitions[from];
    return validTransitions ? validTransitions.includes(to) : false;
  }
}

type EnumKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

type StateTransitions<T> = {
  [key in EnumKeys<T>]?: EnumKeys<T>[];
};
