import "./jsx.d.js";

export const Fragment = ({ children }: { children: JSX.Element }) => children;

export function jsx(
  tag: string | Function,
  { children, ...props }: { children?: unknown } & Record<string, any>,
) {
  if (typeof tag === "function") {
    return tag({ children, ...props });
  }

  const attrs = Object.entries(props)
    .map(([key, value]) => {
      const sanitized = sanitize(value);
      if (sanitized === undefined) {
        return "";
      }
      return `${key}="${sanitized}"`;
    })
    .join(" ");

  const pre = `<${tag}${attrs ? ` ${attrs}` : ""}>`;

  const post = `</${tag}>`;
  return [pre, ...(Array.isArray(children) ? children : [children]), post];
}

const sanitize = (value: any) => {
  if (typeof value === "string") {
    return value.replace(/"/g, "&quot;");
  }
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value.toString().replace(/"/, "&quot");
  }
};

export function jsxs(tag: any, props: any): Element {
  return jsx(tag, props);
}
