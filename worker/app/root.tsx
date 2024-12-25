import * as t from "./+types.root";
import importMap from "./import-map.json";

export const headers = ({ headers }: t.HeaderArgs) => {
  headers.set("strict-transport-security", "max-age=31536000");
};

export default function Root({ children }: { children?: string }) {
  return (
    <html>
      <head>
        <meta charset="UTF-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
        {Object.values(importMap.imports).map((src) => {
          if (src.endsWith(".js")) {
            return <script src={src}></script>;
          }
          if (src.endsWith(".css")) {
            return <link rel="stylesheet" href={src} />;
          }
          return null;
        })}
      </head>
      <body
        class={`
        bg-black text-white

        [&_*]:focus:outline-none

        [&_*]:focus-visible:outline-4 [&_*]:focus-visible:outline-offset-0 [&_*]:focus-visible:outline-blue-500
        `}
        hx-boost="true"
        hx-ext="morph"
      >
        {children}
      </body>
    </html>
  );
}
