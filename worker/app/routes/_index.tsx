import { redirect } from "@mewhhaha/htmx-router";

export const loader = () => {
  throw redirect("/blog");
};
