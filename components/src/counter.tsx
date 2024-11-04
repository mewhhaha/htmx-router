import { useSignal, $, Effect } from "htmx-router-runtime";

type CounterProps = {
  children: JSX.AnyNode;
};

export default function Counter({ children }: CounterProps) {
  const count = useSignal(0);

  return (
    <div>
      <button
        onClick={() => {
          count.set(count.get() + 1);
        }}
      >
        increment
      </button>
      {() => (count.get() > 3 ? children : null)}
      {() => (count.get() > 3 ? "greater than 3" : "less than 3")}
      <div>{() => count.get()}</div>
      {() => (count.get() > 3 ? <div>wha, wha</div> : <p>cool</p>)}
      {() => {
        if (count.get() % 2 === 0) {
          return <div class="bg-black text-white">wha, wha</div>;
        }
        return (
          <>
            <p class="text-red-500 bg-white">cool</p>
            <div class="bg-black text-white">ok</div>
          </>
        );
      }}
      <Test />
    </div>
  );
}

function* Test(): Effect<JSX.Element> {
  const todo = useSignal<[number, null | unknown, "request" | "load" | "done"]>(
    [1, null, "request"],
  );
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

    yield (
      <div>
        {JSON.stringify(value)}
        <button
          onClick={() => {
            const [number, value] = todo.get();
            todo.set([number + 1, value, "request"]);
          }}
        >
          refetch
        </button>
      </div>
    );
  }
}
