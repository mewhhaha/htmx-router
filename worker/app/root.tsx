export default function Root({ children }: { children?: string }) {
  return (
    "<!doctype html>" +
    (
      <html hx-boost="true">
        <head>
          <meta charset="UTF-8"></meta>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
          <script type="importmap">
            {JSON.stringify({
              imports: {
                "hydrate-me": "/hydrate-me.mjs",
                "signal-polyfill": "/signal-polyfill.mjs",
                counter: "/counter.mjs",
                runtime: "/runtime.mjs",
                "runtime/client/jsx-runtime": "/jsx-runtime.mjs",
              },
            })}
          </script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/htmx.org@2.0.3"></script>
          <script type="module">
            {`
            `}
          </script>
          <script type="module" defer="true">
            {`
             import { define} from "hydrate-me";
             import counter from "counter";
            window.components = {
              counter,
            };
            define();

            `}
          </script>
        </head>
        <body class="bg-black text-white">{children}</body>
      </html>
    )
  );
}
