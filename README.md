# htmx-router

My attempt at making a router for htmx that copies a bunch of features from react-rotuer.

## Nested routes

Easily create nested routes that automatically handles what fragments to swap.

- Automatically attach `[data-children="${parentId}"]` to the top children element
- Automatically target `[data-children="${parentId}"]` with headers `hx-retarget` and `hx-reswap`
- Automatically only send sub-segments when navigating to a nested route

## File based routes

Using the same file structure as react-router, we can easily create routes.

```bash
_header.tsx # pathless layout route
_header.about.tsx # /about
_header.contact.tsx # /contact
_header.store.products._index.tsx # /store/products
_header.store.products.$id.tsx # /store/products/:id
```

## Loaders

Supports loaders that all run simultaneously when navigating to a route, and are then passed to the rendering components.

## Actions

Supports actions that will pick up any non-get requests, however they are not used in rendering. Meaning no ActionData. However, since htmx uses html swaps you can simply send back the granular swap you want.

## Partial navigation

By default, only the route segment that is changing will be re-rendered. However any parent will have a `partial` function that will run and push elements to the end of the response. These should be oob elements for any partial updates that needs to be piggybacked.

For example in the \_header.tsx file in this repo I swap out the active and inactive links whenever navigating between routes.

```tsx
export const partial = ({ request }: t.PartialArgs) => {
  const currentUrl = request.headers.get("hx-current-url");
  if (!currentUrl) return null;

  const findLink = (pathname: string) => {
    return links.find(({ to }) => isActive(pathname, to));
  };

  const prev = findLink(new URL(currentUrl).pathname);
  const next = findLink(new URL(request.url).pathname);
  if (prev === next) return null;
  if (!next) return null;
  if (!prev) return null;

  return (
    <>
      <HeaderLink to={prev.to} hx-swap-oob="morph">
        {prev.label}
      </HeaderLink>
      <HeaderLink to={next.to} active hx-swap-oob="morph">
        {next.label}
      </HeaderLink>
    </>
  );
};
```
