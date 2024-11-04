import "../common/typed.mjs";
import { Signal } from "signal-polyfill";
import morphdom from "morphdom";
import { $ } from "../runtime.mjs";

declare global {
  namespace JSX {
    type Element = AnyNode | AnyNode[];
    type AnyNode =
      | HTMLElement
      | string
      | number
      | null
      | false
      | undefined
      | Generator<JSX.Element, JSX.Element, any>
      | AsyncGenerator<JSX.Element, JSX.Element, any>;
  }
}

export const s = Symbol();

export const Fragment = ({ children }: { children: JSX.Element }) => children;

export function jsx(
  tag: string | Function,
  { children, ...props }: { children?: JSX.AnyNode } & Record<string, any>,
): (HTMLElement | Text | Comment) | (HTMLElement | Text | Comment)[] {
  const f = (child: JSX.Element): (HTMLElement | Text | Comment)[] => {
    if (Array.isArray(child)) {
      return child.flatMap(f);
    }

    if (
      child instanceof HTMLElement ||
      child instanceof Text ||
      child instanceof Comment
    ) {
      return [child];
    }

    if (child === null || child === false || child === undefined) {
      return [];
    }

    if (typeof child === "function") {
      child = $(child);
    }

    if (isGenerator(child)) {
      const previous = runGeneratorEffect(child, f);
      return previous;
    }

    const textNode = document.createTextNode(child.toString());
    return [textNode];
  };

  if (typeof tag === "function") {
    return tag({ children, ...props });
  }

  const element = document.createElement(tag);

  if (children) {
    const elements = f(children);
    for (const el of elements) {
      element.appendChild(el);
    }
  }

  for (const prop in props) {
    if (prop.match(/on[A-Z]/)) {
      element.addEventListener(prop.toLowerCase().slice(2), props[prop]);
    } else {
      element.setAttribute(prop, props[prop]);
    }
  }

  return element;
}

export function jsxs(
  tag: any,
  props: any,
): (HTMLElement | Text | Comment) | (HTMLElement | Text | Comment)[] {
  return jsx(tag, props);
}

const runGeneratorEffect = (
  s: Generator<JSX.Element, JSX.Element, any>,
  html: (value: JSX.Element) => (HTMLElement | Text | Comment)[],
) => {
  const placeholder = document.createComment(`effect`);

  let previous: (HTMLElement | Text | Comment)[] = html(s.next().value);
  if (previous.length === 0) {
    previous.push(placeholder);
  }

  let unwatch: (() => void) | undefined;

  unwatch = effect(() => {
    const next = html(s.next(previous).value);
    if (next.length === 0) {
      next.push(placeholder);
    }

    let morphed: (HTMLElement | Text | Comment)[] = [];

    if (unwatch && !previous.every((el) => document.contains(el))) {
      unwatch();
      return;
    }

    for (let i = 0; i < Math.max(previous.length, next.length); i++) {
      const p = previous[i];
      const n = next[i];
      if (p && n) {
        // @ts-expect-error morphdom returns the new element but isn't typed that way
        const el: HTMLElement | Text | Comment = morphdom(p, n ?? placeholder);
        morphed.push(el);
      } else if (!n && p) {
        p.remove();
      } else if (!p && n) {
        const lastElement = morphed[morphed.length - 1];
        lastElement.after(n);
        morphed.push(n);
      }
    }

    previous = morphed;
  });

  return previous;
};

let needsEnqueue = true;

const w = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});

function processPending() {
  needsEnqueue = true;

  for (const s of w.getPending()) {
    s.get();
  }

  w.watch();
}

function effect(callback: () => (() => void) | void) {
  let cleanup: (() => void) | void;

  const computed = new Signal.Computed(() => {
    typeof cleanup === "function" && cleanup();
    cleanup = callback();
  });

  w.watch(computed);
  computed.get();

  return () => {
    w.unwatch(computed);
    typeof cleanup === "function" && cleanup();
    cleanup = undefined;
  };
}

const isGenerator = (
  value: JSX.AnyNode,
): value is Generator<JSX.Element, JSX.Element, any> => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value[Symbol.iterator as keyof typeof value] === "function"
  );
};
