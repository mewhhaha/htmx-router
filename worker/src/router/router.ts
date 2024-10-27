import { match } from "./match";
import { bySpecificity } from "./sort";

type context = { request: Request; params: Record<string, string> };

type loader = (
  context: context,
  ...args: unknown[]
) => Promise<unknown> | unknown;
type action = (
  context: context,
  ...args: unknown[]
) => Promise<unknown> | unknown;
type renderer = (props: { children?: unknown; loaderData: unknown }) => string;

type definition = {
  loader?: loader;
  action?: action;
  default?: renderer;
};

export type route = [path: string, definition: definition];

type router = {
  handle: (request: Request, ...args: unknown[]) => Promise<Response>;
};

export const Router = (routes: route[]): router => {
  routes.sort((a, b) => bySpecificity(a[0], b[0]));
  const handle = async (
    request: Request,
    ...args: unknown[]
  ): Promise<Response> => {
    const url = new URL(request.url);

    const { params, routes: matches } = findRoutes(routes, url.pathname);
    if (!matches) {
      return new Response(null, { status: 404 });
    }

    const fragments = matches.filter((route) => isNewSegment(ctx, route));

    const ctx = { request, params };

    try {
      const target = fragments[0][1];

      if (request.method === "GET") {
        if (target.default) {
          return await routeResponse(routes, ctx, args);
        }

        if (target.loader) {
          return await loaderResponse(target.loader, ctx, args);
        }
      } else {
        if (target.action) {
          return await actionResponse(target.action, ctx, args);
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

const findRoutes = (routes: route[], pathname: string) => {
  const segments = pathname.split("/");
  let found = [];
  let matched = null;
  let params = null;
  for (const route of routes) {
    if (matched === null) {
      params = match(segments, route[0].split("/"));
      if (params) {
        found.push(route);
        matched = route[0];
      }
    }

    if (matched?.startsWith(route[0] + "/")) {
      found.push(route);
    }
  }

  if (params === null) {
    return {};
  }
  return { routes: found, params };
};

const actionResponse = async (
  action: action,
  ctx: context,
  args: unknown[],
) => {
  const value = await action(ctx, ...args);
  if (value instanceof Response) {
    return value;
  }
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const loaderResponse = async (
  loader: loader,
  ctx: context,
  args: unknown[],
) => {
  const value = await loader(ctx, ...args);
  if (value instanceof Response) {
    return value;
  }
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const isNewSegment = (ctx: context, route: route) => {
  const header = ctx.request.headers.get("hx-current-url");
  if (!header) {
    return true;
  }

  const originalUrl = new URL(header);
  const url = new URL(ctx.request.url);

  if (originalUrl.origin !== url.origin) {
    return true;
  }

  const originalPathname = originalUrl.pathname;
  const pathname = url.pathname;
  let same = "";
  for (let i = 0; i < originalPathname.length; i++) {
    const a = originalPathname.charAt(i);
    const b = pathname.charAt(i);
    if (a !== b) {
      same = originalPathname.slice(0, i - 1);
      break;
    }
  }

  if (!same) {
    return true;
  }

  const routeSegments = route[0].split("/").length;
  const sameSegments = same.split("/").length;

  if (sameSegments > routeSegments) {
    return true;
  }

  return false;
};

const routeResponse = async (
  routes: route[],
  ctx: context,
  args: unknown[],
) => {
  const loaders = await Promise.all(
    routes.map((route) => route[1]?.loader?.(ctx, ...args)),
  );

  let headers = new Headers();
  let html = "";

  for (let i = 0; i < routes.length; i++) {
    let loaderData = loaders[i];
    if (loaderData instanceof Response) {
      appendHeaders(headers, loaderData.headers);
      loaderData = await loaderData.json();
    }

    const { default: Component } = routes[i][1];
    if (!Component) {
      continue;
    }

    html = Component({ loaderData, children: html });
  }

  return new Response(html, { headers, status: 200 });
};

const unescapedDotRegex = /(?<!\[)\.(?![^[]*\])/g;

const tsRegex = /\.ts(x)?$/;

const paramRegex = /^\$/g;

const splatRegex = /\$$/g;

const methodRegex = /^(post)|(get)|(delete)|(put)|(options)|(all)|(patch)/;

const indexRegex = /^_index$/;
