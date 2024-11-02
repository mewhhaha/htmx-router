import { Signal } from "signal-polyfill";
import morphdom from "morphdom";

export const s = Symbol();

declare global {
  namespace JSX {
    export type AnyNode =
      | HTMLElement
      | string
      | number
      | null
      | false
      | undefined
      | Generator<JSX.Element, JSX.Element, any>;
    export type Element = AnyNode | AnyNode[];

    export interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

export const Fragment = ({ children }: { children: JSX.Element }) => children;

export function jsx(
  tag: string | Function,
  { children, ...props }: { children?: JSX.AnyNode } & Record<string, any>,
): Element {
  if (typeof tag === "function") {
    return tag({ children, ...props });
  }

  const demount: (() => void)[] = [];

  const element = document.createElement(tag);
  const f = (child: JSX.Element): (HTMLElement | Text | Comment)[] => {
    if (Array.isArray(child)) {
      return child.flatMap(f);
    } else if (
      child instanceof HTMLElement ||
      child instanceof Text ||
      child instanceof Comment
    ) {
      return [child];
    } else if (child === null || child === false || child === undefined) {
      return [];
    } else if (
      typeof child === "object" &&
      typeof child[Symbol.iterator] == "function" &&
      typeof child["next"] == "function" &&
      typeof child["throw"] == "function"
    ) {
      const s = child;
      const placeholder = document.createComment(`effect`);

      let previous: (HTMLElement | Text | Comment)[] = f(s.next().value);
      if (previous.length === 0) {
        previous.push(placeholder);
      }

      const unwatch = effect(() => {
        const next = f(s.next(previous).value);
        if (next.length === 0) {
          next.push(placeholder);
        }

        let morphed: (HTMLElement | Text | Comment)[] = [];

        for (let i = 0; i < Math.max(previous.length, next.length); i++) {
          const p = previous[i];
          const n = next[i];
          if (p && n) {
            // @ts-expect-error morphdom returns the new element but isn't typed that way
            const el: HTMLElement | Text | Comment = morphdom(
              p,
              n ?? placeholder,
            );
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
      demount.push(unwatch);

      return previous;
    } else {
      const textNode = document.createTextNode(child.toString());
      return [textNode];
    }
  };

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

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (node === element) {
          observer.disconnect();
          for (const unwatch of demount) {
            unwatch();
          }
          break;
        }
      }
    }
  });
  observer.observe(element, { characterData: true });
  return element;
}

export function jsxs(tag: any, props: any): Element {
  return jsx(tag, props);
}

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
