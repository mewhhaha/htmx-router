import { Signal } from "signal-polyfill";
import morphdom from "morphdom";

declare global {
  namespace JSX {
    export type AnyNode =
      | HTMLElement
      | string
      | number
      | null
      | false
      | undefined
      | (() => AnyNode);
    export type Element = AnyNode | AnyNode[];

    export interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

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
    } else if (typeof child === "function") {
      const s = child;
      const placeholder = document.createComment(`effect`);
      let previous: HTMLElement | Text | Comment = f(s())[0];
      const unwatch = effect(() => {
        const [next] = f(s()) ?? [placeholder];
        // @ts-expect-error morphdom returns the new element but isn't typed that way
        const morphed: HTMLElement | Text | Comment = morphdom(previous, next);
        previous = morphed;
      });
      demount.push(unwatch);
      return [previous];
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
