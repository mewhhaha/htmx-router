import path from "node:path";
import { mkdir, readdir, writeFile, rm } from "node:fs/promises";

const unescapedDotRegex = /(?<!\[)\.(?![^[]*\])/g;
const tsRegex = /\.(m)?ts(x)?$/;

export const generateTypes = async (appFolder: string) => {
  const routesFolder = path.join(appFolder, "routes");

  const files = await readdir(routesFolder);

  const tasks: Promise<void>[] = [];
  await rm(path.join(".router"), { recursive: true, force: true });
  await mkdir(path.join(".router", "types", routesFolder), { recursive: true });
  for (const file of files) {
    const params = file
      .replace(tsRegex, "")
      .split(unescapedDotRegex)
      .map((name) => {
        if (name.startsWith("$")) {
          return name.slice(1);
        }

        if (name === "*") {
          return "*";
        }

        if (name.startsWith("($") && name.endsWith(")")) {
          return name.slice(2, -1);
        }

        return null;
      })
      .filter((name) => name !== null)
      .map((name) => `\t${name}: string;`)
      .join("\n");

    const template = createTemplate(file, params);

    const task = writeFile(
      path.join(
        ".router",
        "types",
        routesFolder,
        `+types.${file.replace(tsRegex, ".d.ts")}`,
      ),
      template,
    );
    tasks.push(task);
  }

  const rootTemplate = createTemplate("root", "");
  const task = writeFile(
    path.join(".router", "types", appFolder, "+types.root.d.ts"),
    rootTemplate,
  );
  tasks.push(task);

  await Promise.all(tasks);
};

const createTemplate = (file: string, params: string) => {
  const template = `
import {
  InferActionArgs,
  InferComponentProps,
  InferHeaderArgs,
  InferLoaderArgs,
  InferPartialArgs,
} from "@mewhhaha/htmx-router/types";
import * as r from "./${file.replace(tsRegex, ".js")}";

export type RouteParams = {
  ${params}
};

export type ComponentProps = InferComponentProps<typeof r>;
export type LoaderArgs = InferLoaderArgs<RouteParams>;
export type PartialArgs = InferPartialArgs<RouteParams>;
export type ActionArgs = InferActionArgs<RouteParams>;
export type HeaderArgs = InferHeaderArgs<RouteParams, typeof r>;
    `.trim();

  return template;
};
