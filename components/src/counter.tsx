import { useSignal } from "runtime";

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
      {children}
      {count.get() > 3 ? "greater than 3" : "less than 3"}
      <div>{() => count.get()}</div>
      {count.get() > 3 ? <div>wha, wha</div> : <p>cool</p>}
    </div>
  );
}
