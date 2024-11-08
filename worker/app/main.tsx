import { routes } from "./routes";
import { Router } from "htmx-router";

type Env = {};

declare global {
  interface ctx {
    context: [Env, ExecutionContext];
  }
}

const router = Router(routes);

const handler: ExportedHandler<Env> = {
  fetch: async (request, env, ctx) => {
    const response = await router.handle(request, env, ctx);
    if (response.headers.get("HX-Reswap")) {
      response.headers.set("HX-Reswap", "morph:outerHTML");
    }
    return response;
  },
};

export default handler;
