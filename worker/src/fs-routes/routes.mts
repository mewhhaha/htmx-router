import { readdir, writeFile } from "node:fs/promises";
import path from "node:path/posix";
import { bySpecificity } from "./sort.mts";

const appFolder = path.normalize(process.argv[2]);
const routesFolder = path.join(appFolder, "routes");

const unescapedDotRegex = /(?<!\[)\.(?![^[]*\])/g;

const tsRegex = /\.ts(x)?$/;

const paramRegex = /^\$/g;

const splatRegex = /\$$/g;

const pathlessRegex = /^_.*/;

const files = await readdir(routesFolder);

const varName = (file: string) => {
  return "$" + file.replace(tsRegex, "").replace(/[^a-zA-Z0-9]/g, "_");
};

const routeImports = files
  .map((file) => {
    const name = varName(file);
    return `import * as ${name} from "./routes/${file}";`;
  })
  .join("\n");

const routes = files
  .map((file) => file.replace(tsRegex, ""))
  .sort(bySpecificity)
  .map((file) => {
    const route = file
      .split(unescapedDotRegex)
      .map((segment) => {
        return segment
          .replace(paramRegex, ":")
          .replace(splatRegex, "*")
          .replace(pathlessRegex, "");
      })
      .filter((segment) => segment !== "")
      .join("/");

    return [file, varName(file), `/${route}`] as const;
  });

const routeVars = routes
  .map(([file, name]) => {
    const params = file
      .split(unescapedDotRegex)
      .filter((segment) => segment.startsWith("$"))
      .map((segment) => `"${segment.slice(1)}"`)
      .join(",");

    if (params) {
      return `const $${name} = { id: "${file}", mod: ${name}, params: [${params}] };`;
    }
    return `const $${name} = { id: "${file}", mod: ${name} };`;
  })
  .join("\n");

const routeItems = routes
  .filter(([file]) => {
    return routes.every(([suffix]) => {
      return !suffix.startsWith(`${file}.`);
    });
  })
  .map(([file, name, path]) => {
    const fragments = [
      "$root",
      ...routes
        .filter(([prefix]) => file.startsWith(`${prefix}.`))
        .map(([, name]) => {
          return `$${name}`;
        })
        .reverse(),
      `$${name}`,
    ];

    return `["${path}", [${fragments.join(",")}]]`;
  })
  .join(",\n");

const file = `
import * as root from "./root.tsx";
import { route } from "../src/router/router.ts";
${routeImports}
${routeVars}
const $root = { id: "", mod: root };

export const routes: route[] = [${routeItems}];
`;

await writeFile(path.join(appFolder, "routes.ts"), file);
