const flushSymbol = Symbol();
/**
 * @returns a special element that will flush the stream, good for forcing a partial render of the initial html
 */
export const flush = () => ({ t: flushSymbol }) as unknown as JSX.Element;

export const isFlush = (value: unknown): value is { t: typeof flushSymbol } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "t" in value &&
    value.t === flushSymbol
  );
};
