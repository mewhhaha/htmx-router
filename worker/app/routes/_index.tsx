import { redirect } from "htmx-router";

export const loader = () => {
  throw redirect("/blog");
};
