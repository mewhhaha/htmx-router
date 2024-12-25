#!/usr/bin/env node --experimental-strip-types --no-warnings

import {
  readdir,
  copyFile,
  writeFile,
  readFile,
  mkdir,
  unlink,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import process from "node:process";

const dev = process.argv.includes("--dev");

const args: Record<string, string[]> = {};
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith("-")) {
    const key = arg.slice(1);
    const previous = args[key];
    if (previous) {
      previous.push(process.argv[i + 1]);
    } else {
      args[key] = [process.argv[i + 1]];
    }
    i++;
  }
}

const input = args.i || args.input || ["./public"];
const output = args.o?.[0] || args.output?.[0] || "./dist/assets";
const map = args.m?.[0] || args["import-map"]?.[0];

const generateFingerprints = async (folder: string) => {
  const files = await readdir(folder);
  const fingerprints: Record<string, string> = {};
  for (const file of files) {
    const content = await readFile(`${folder}/${file}`);
    fingerprints[file] =
      `${createHash("sha256").update(content).digest("hex").slice(0, 16)}-${file}`;
  }
  return fingerprints;
};

const removeFolder = async (folder: string) => {
  if (!existsSync(folder)) {
    return;
  }

  const files = await readdir(folder);
  for (const file of files) {
    await unlink(`${folder}/${file}`);
  }
};

const copyFolder = async (
  folder: string,
  fingerprints: Record<string, string>,
) => {
  const files = await readdir(folder);

  for (const file of files) {
    await copyFile(`${folder}/${file}`, `./${output}/${fingerprints[file]}`);
  }
};

const readImportMap = (fingerprints: Record<string, string>) => {
  const importMap: { imports: Record<string, string> } = {
    imports: {},
  };

  for (const file in fingerprints) {
    const name = file.split(".").slice(0, -1).join("/");
    if (dev) {
      importMap.imports[name] = `/${file}`;
    } else {
      importMap.imports[name] = `/${fingerprints[file]}`;
    }
  }

  return importMap;
};

await removeFolder(output);
await mkdir(output, { recursive: true });

const fingerprints = await Promise.all(input.map(generateFingerprints)).then(
  (f) => Object.assign({}, ...f),
);

await Promise.all(input.map((folder) => copyFolder(folder, fingerprints)));

if (map) {
  const importMap = JSON.stringify(readImportMap(fingerprints), null, 2);

  await writeFile(map, importMap);
}
