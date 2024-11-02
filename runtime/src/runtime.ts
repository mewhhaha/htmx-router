import { Signal } from "signal-polyfill";

export const useSignal = <t>(value: t) => {
  const signal = new Signal.State(value);
  return signal;
};

export function* $<T extends JSX.Element>(fn: () => T): Generator<T, T, T> {
  while (true) {
    yield fn();
  }
}

export type SignalState<T> = Signal.State<T>;

export type Effect<T extends JSX.Element = JSX.Element> = Generator<
  T,
  T,
  HTMLElement | Text | Comment
>;
