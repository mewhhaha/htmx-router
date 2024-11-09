export const redirect = (
  location: string,
  { headers: incoming, status = 302, ...init }: ResponseInit = {},
) => {
  const headers = mergeHeaders(incoming, new Headers());
  headers.set("Location", location);
  headers.set("HX-Location", location);

  return new Response(null, {
    status,
    headers,
    ...init,
  });
};

const mergeHeaders = (incoming: HeadersInit | undefined, headers: Headers) => {
  if (!incoming) {
    return headers;
  }

  if (Array.isArray(incoming)) {
    for (const [key, value] of incoming) {
      headers.set(key, value);
    }
  } else if (incoming instanceof Headers) {
    for (const [key, value] of incoming.entries()) {
      headers.set(key, value);
    }
  } else {
    for (const key in incoming) {
      headers.set(key, incoming[key]);
    }
  }

  return headers;
};

export const htmx = async (
  body: string | Promise<string>,
  { headers: incoming, status = 200 }: ResponseInit = {},
) => {
  const headers = mergeHeaders(incoming, new Headers());
  headers.set("Content-Type", "text/html");

  return new Response(await body, {
    status,
    headers,
  });
};
