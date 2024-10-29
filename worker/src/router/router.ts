import { match } from "./match";

export type ctx = {
  request: Request;
  params: Record<string, string>;
  context: unknown;
};

export type loader = (params: ctx) => Promise<unknown> | unknown;
export type action = (params: ctx) => Promise<unknown> | unknown;
export type renderer = (props: {}) => JSX.Element;

export type mod = {
  loader?: loader;
  action?: action;
  default?: renderer;
};

export type fragment = { id: string; mod: mod; params?: string[] };

export type route = [path: string, fragments: fragment[]];

export type router = {
  handle: (request: Request, ...args: unknown[]) => Promise<Response>;
};

export const Router = (routes: route[]): router => {
  const handle = async (
    request: Request,
    ...args: unknown[]
  ): Promise<Response> => {
    const { target, fragments, params } = matchRoute(routes, request);
    if (!fragments) {
      return new Response(null, { status: 404 });
    }

    const ctx = { request, params, context: args };

    try {
      const leafToRoot = fragments.toReversed();
      const leaf = leafToRoot[0].mod;

      if (request.method === "GET") {
        if (leaf.default) {
          return await routeResponse(target, leafToRoot, ctx);
        }

        if (leaf.loader) {
          return await loaderResponse(leaf.loader, ctx);
        }
      } else {
        if (leaf.action) {
          return await actionResponse(leaf.action, ctx);
        }
      }

      return new Response(null, { status: 404 });
    } catch (e) {
      if (e instanceof Response) {
        return e;
      }

      if (e instanceof Error) {
        console.error(e.message);
      }

      return new Response(null, { status: 500 });
    }
  };

  return {
    handle,
  };
};

const disallowedHeaders = new Set(["content-type"]);
const appendHeaders = (headers: Headers, appended: Headers) => {
  for (const [key, value] of appended.entries()) {
    if (disallowedHeaders.has(key.toLowerCase())) {
      continue;
    }

    headers.append(key, value);
  }
};

export const diff = (
  current: { params: Record<string, string>; fragments: fragment[] },
  next: { params: Record<string, string>; fragments: fragment[] },
) => {
  const index = findDiffIndex(current, next);

  return {
    target: next.fragments.at(index - 1)?.id,
    params: next.params,
    fragments: next.fragments.slice(index),
  };
};

const matchRoute = (routes: route[], request: Request) => {
  const url = new URL(request.url);
  const next = findRoute(routes, url.pathname);
  if (!next) {
    return { target: undefined, fragments: undefined, params: undefined };
  }

  const browserUrl = request.headers.get("hx-current-url");
  if (!browserUrl) {
    return { target: undefined, ...next };
  }
  const current = findRoute(routes, new URL(browserUrl).pathname);
  if (!current) {
    return { target: undefined, ...next };
  }

  return diff(current, next);
};

const findRoute = (routes: route[], pathname: string) => {
  const segments = pathname.split("/");
  for (const route of routes) {
    const params = match(segments, route[0].split("/"));
    if (params) {
      return { fragments: route[1], params };
    }
  }
  return undefined;
};

const actionResponse = async (action: action, ctx: ctx) => {
  const value = await action(ctx);
  if (value instanceof Response) {
    return value;
  }
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const loaderResponse = async (loader: loader, ctx: ctx) => {
  const value = await loader(ctx);
  if (value instanceof Response) {
    return value;
  }
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const routeResponse = async (
  target: string | undefined,
  leafToRoot: fragment[],
  ctx: ctx,
) => {
  const loaders = await Promise.all(
    leafToRoot.map((fragment) => fragment.mod.loader?.(ctx)),
  );

  const headers = new Headers();

  let html: string | undefined = undefined;

  for (let i = 0; i < leafToRoot.length; i++) {
    let loaderData = loaders[i];
    if (loaderData instanceof Response) {
      appendHeaders(headers, loaderData.headers);
      loaderData = await loaderData.json();
    }

    const {
      id,
      mod: { default: Component },
    } = leafToRoot[i];
    if (!Component) {
      continue;
    }

    const props = {
      loaderData,
      children: html?.replace(/(\s*<[a-zA-Z-]+)/, `$1 data-children="${id}"`),
    };

    html = Component(props);
    html = html.toString(); // typed-html actually returns a Node
  }

  if (target) {
    headers.set("hx-retarget", `[data-children="${target}"]`);
    headers.set("hx-swap", "outerHTML");
    headers.set("hx-trigger", "true");
  }
  headers.set("content-type", "text/html");

  return new Response(html, { headers, status: 200 });
};

const findDiffIndex = (
  current: { params: Record<string, string>; fragments: fragment[] },
  next: { params: Record<string, string>; fragments: fragment[] },
) => {
  for (let index = 0; index < next.fragments.length; index++) {
    const c = current.fragments[index];
    const n = next.fragments[index];
    if (!c) {
      return index;
    }

    if (!n) {
      return -1;
    }

    if (c.id !== n.id) {
      return index;
    }

    if (
      n.params?.some((param) => current.params[param] !== next.params[param])
    ) {
      return index;
    }
  }
  return -1;
};
