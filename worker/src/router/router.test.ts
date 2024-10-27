import { expect, describe, it } from "vitest";

import { Router } from "./router";

describe("router", () => {
  it("should return 404", async () => {
    const router = Router([]);
    const url = new URL("http://example.com");
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(404);
  });

  it("should return 200 loader", async () => {
    const router = Router([
      [
        "/a",
        {
          loader: () => new Response("hello", { status: 200 }),
        },
      ],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("hello");
  });

  it("should return 200 html", async () => {
    const router = Router([
      [
        "/a",
        {
          default: () => "<html></html>",
        },
      ],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<html></html>");
  });

  it("should work with loaders", async () => {
    const router = Router([
      [
        "/a",
        {
          loader: () => "hello",
          default: ({ loaderData }) => `<html>${loaderData}</html>`,
        },
      ],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<html>hello</html>");
  });

  it("should work with intermediate loaders", async () => {
    const router = Router([
      [
        "/a",
        {
          default: ({ children }) => `<html>${children}</html>`,
        },
      ],
      [
        "/a/b",
        {
          loader: () => "hello",
        },
      ],
      [
        "/a/b/c",
        {
          default: () => "world",
        },
      ],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a/b/c";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<html>world</html>");
  });

  it("should work with layouts", async () => {
    const router = Router([
      [
        "/a",
        {
          default: ({ children }) => `<html>${children}</html>`,
        },
      ],
      ["/a/b", { default: () => "<div>hello</div>" }],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a/b";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<html><div>hello</div></html>");
  });

  it("should send fragments compared to hx-current-url", async () => {
    const router = Router([
      [
        "/a",
        {
          default: ({ children }) => `<html>${children}</html>`,
        },
      ],
      ["/a/b", { default: ({ children }) => "<div>hello{children}</div>" }],
    ]);
    const url = new URL("http://example.com");
    url.pathname = "/a/b";
    const response = await router.handle(new Request(url));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<html><div>hello</div></html>");
  });
});
