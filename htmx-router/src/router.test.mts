import { describe, expect, test } from "vitest";
import { diff, fragment } from "./router.mjs";

const path = (val: string | undefined, params: Record<string, string> = {}) => {
  return {
    params,
    fragments:
      val === undefined
        ? []
        : val.split("/").map((id): fragment => {
            if (id.startsWith(":")) {
              return { id, mod: {}, params: [id.slice(1)] };
            }

            return { id, mod: {}, params: [] };
          }),
  };
};

describe("diffs", () => {
  test("partial current", () => {
    const current = path("a");
    const next = path("a/b/c");

    const fragments = diff(current, next);
    expect(fragments).toEqual({ target: "a", ...path("b/c") });
  });

  test("different current", () => {
    const current = path("a/b/c");
    const next = path("a/c/d");

    const fragments = diff(current, next);
    expect(fragments).toEqual({ target: "a", ...path("c/d") });
  });

  test("longer current", () => {
    const current = path("a/b/c/d");
    const next = path("a/b/c");

    const fragments = diff(current, next);
    expect(fragments).toEqual({ target: "b", ...path("c") });
  });

  test("longer diff params", () => {
    const current = path("a/:a/c", { a: "b" });
    const next = path("a/:a/c", { a: "c" });

    const fragments = diff(current, next);
    expect(fragments).toEqual({ target: "a", ...path(":a/c", { a: "c" }) });
  });
});
