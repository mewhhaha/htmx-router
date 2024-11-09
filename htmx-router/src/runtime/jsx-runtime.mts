import "./typed.mjs";
declare global {
  namespace JSX {
    type Element = Promise<string>;
  }
}

export const Fragment = (props: any) => jsx("", props);

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

  const f = async (): Promise<string> => {
    let html = "";
    if (tag) {
      html = `<${tag}${attrs ? ` ${attrs}` : ""}>`;
    }

    const rec = async (child: unknown) => {
      if (child === undefined || child === null || child === false) {
        return;
      }
      if (Array.isArray(child)) {
        for (const c of child) {
          await rec(c);
        }
        return;
      }
      if (isPromise(child)) {
        await rec(await child);
        return;
      }
      if (typeof child === "function") {
        await rec(child());
        return;
      }

      html += child.toString();
    };

    await rec(children);

    if (tag) {
      html += `</${tag}>`;
    }

    return html;
  };

  return f();
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

const isPromise = (value: unknown): value is Promise<string> =>
  typeof value === "object" && value !== null && "then" in value;
