# htmx-router

A router for htmx that supports dynamic routes, params, and fragments.

## Routes

A route that renders children will automatically have an id injected into it for outerHTML swaps. These swaps will happen automatically by adding headers to the response.

## Responses

Responses will be decorated with the following headers:

- `HX-Reswap`: "outerHTML"
- `HX-Retarget`: "${target}"

where `target` is the id of the element to retarget.