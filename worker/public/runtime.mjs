import { Signal } from "signal-polyfill";
export const useSignal = (value) => {
    return new Signal.State(value);
};
