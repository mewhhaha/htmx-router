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
  fetch: router.handle,
};

export default handler;