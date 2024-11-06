export default function Root({ children }: { children?: string }) {
  return (
    <html hx-boost="true">
      <head>
        <meta charset="UTF-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/htmx.org@2.0.3"></script>
        <script src="idiomorph.js"></script>
        <script src="idiomorph-htmx.js"></script>
      </head>
      <body class="bg-black text-white">{children}</body>
    </html>
  );
}
