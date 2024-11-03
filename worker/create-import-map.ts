import {
  readdir,
  copyFile,
  writeFile,
  readFile,
  unlink,
} from "node:fs/promises";
import { createHash } from "node:crypto";

const folders = ["../components/dist"];

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
    await copyFile(`${folder}/${file}`, `./public/${fingerprints[file]}`);
  }
};

const readImportMap = (fingerprints: Record<string, string>) => {
  const importMap: { imports: Record<string, string> } = {
    imports: {},
  };

  for (const file in fingerprints) {
    const name = file.split(".").slice(0, -1).join("/");
    importMap.imports[name] = `/${fingerprints[file]}`;
  }

  return importMap;
};

await removeFolder("./public");

const fingerprints = await Promise.all(folders.map(generateFingerprints)).then(
  (f) => Object.assign({}, ...f),
);

await Promise.all(folders.map((folder) => copyFolder(folder, fingerprints)));

const importMap = JSON.stringify(readImportMap(fingerprints), null, 2);

await writeFile("./app/import-map.json", importMap);
