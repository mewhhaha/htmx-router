import { useSignal, $, Effect, SignalState } from "runtime";

type CounterProps = {
  children: JSX.AnyNode;
};

export default function Counter({ children }: CounterProps) {
  const count = useSignal(0);
  const todo = useSignal<[number, null | unknown, "request" | "load" | "done"]>(
    [1, null, "request"],
  );

  return (
    <div>
      <button
        onClick={() => {
          count.set(count.get() + 1);
          todo.set([todo.get()[0] + 1, todo.get()[1], "request"]);
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
      {test(todo)}
    </div>
  );
}

function* test(
  todo: SignalState<[number, null | unknown, "request" | "load" | "done"]>,
): Effect<JSX.Element> {
  while (true) {
    const [number, value, status] = todo.get();
    if (status === "request") {
      fetch(`https://jsonplaceholder.typicode.com/todos/${todo.get()[0]}`).then(
        async (response) => {
          const json = await response.json();
          if (todo.get()[0] !== number) {
            return;
          }
          todo.set([number, json, "done"]);
        },
      );
      todo.set([number, value, "load"]);
    }

    yield <div>{JSON.stringify(value)}</div>;
  }
}
