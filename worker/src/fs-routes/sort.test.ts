import { expect, describe, it } from "vitest";
import { bySpecificity } from "./sort.mts";

describe("sorting", () => {
  it("should sort by specificity", () => {
    const routes = ["a", "a.b", "a.b.c"];
    routes.sort(bySpecificity);
    expect(routes).toStrictEqual(["a.b.c", "a.b", "a"]);
  });

  it("should sort dynamic paths later", () => {
    const routes = ["a.$a", "a.a"];
    routes.sort(bySpecificity);
    expect(routes).toStrictEqual(["a.a", "a.$a"]);
  });

  it("should sort by splat routes last", () => {
    const routes = ["a.$", "a.a", "a.$a"];
    routes.sort(bySpecificity);
    expect(routes).toStrictEqual(["a.a", "a.$a", "a.$"]);
  });
});
