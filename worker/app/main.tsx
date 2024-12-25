import { routes } from "./routes";
import { Router, type Env } from "@mewhhaha/htmx-router";

declare module "@mewhhaha/htmx-router" {
  interface Env {
    DB: D1Database;
  }
}

const router = Router(routes);

const handler: ExportedHandler<Env> = {
  fetch: async (request, env, ctx) => {
    const response = await router.handle(request, env, ctx);
    if (response.headers.get("HX-Reswap")) {
      response.headers.set("HX-Reswap", "morph:outerHTML show:no-scroll");
    }
    return response;
  },
};

export default handler;
