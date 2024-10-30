import { Signal } from "signal-polyfill";

declare global {
  namespace JSX {
    export type AnyNode =
      | HTMLElement
      | string
      | number
      | null
      | false
      | undefined
      | typeof Signal;
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

  const element = document.createElement(tag);
  const f = (child: JSX.Element) => {
    console.log(child);
    if (Array.isArray(child)) {
      child.forEach(f);
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (
      typeof child === "object" &&
      child !== null &&
      "get" in child &&
      typeof child.get === "function"
    ) {
      f(child.get());
    } else if (child === null || child === false || child === undefined) {
      // Do nothing
    } else {
      const textNode = document.createTextNode(child.toString());
      element.appendChild(textNode);
    }
  };

  if (Array.isArray(children)) {
    children.forEach(f);
  } else {
    f(children);
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

export function jsxs(tag: any, props: any): Element {
  return jsx(tag, props);
}
