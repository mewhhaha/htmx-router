import { useSignal, $, Effect, SignalState } from "runtime";

type CounterProps = {
  children: JSX.AnyNode;
};

export default function Counter({ children }: CounterProps) {
  const count = useSignal(0);
  const next = useSignal(0);

  return (
    <div>
      <button
        onClick={() => {
          count.set(count.get() + 1);
          next.set(next.get() + 1);
        }}
      >
        increment
      </button>
      {children}
      {$(() => (count.get() > 3 ? "greater than 3" : "less than 3"))}
      <div>{$(() => count.get())}</div>
      {$(() => (count.get() > 3 ? <div>wha, wha</div> : <p>cool</p>))}
      {$(() => {
        if (count.get() % 2 === 0) {
          return <div class="bg-black text-white">wha, wha</div>;
        }
        return (
          <>
            <p class="text-red-500 bg-white">cool</p>
            <div class="bg-black text-white">ok</div>
          </>
        );
      })}
      {test(next)}
    </div>
  );
}

function* test(t: SignalState<number>): Effect<JSX.Element> {
  while (true) {
    t.get();
    yield <div>{t.get()}</div>;
    t.get();
    yield (
      <div>
        <div>hello there</div>
      </div>
    );
    t.get();
    yield <div>3</div>;
  }
}
