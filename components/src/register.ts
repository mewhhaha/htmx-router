import counter from "./counter.js";

export const register = () => {
  (window as any).components ??= {};
  (window as any).components["counter"] = counter;
};
