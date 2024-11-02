import { Signal } from "signal-polyfill";

export const useSignal = <t>(value: t) => {
  const signal = new Signal.State(value);
  return signal;
};
