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

const folders = ["./public"];
const jsonOutput = "./app/import-map.json";
const folderOutput = "./dist/assets";

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
    await copyFile(
      `${folder}/${file}`,
      `./${folderOutput}/${fingerprints[file]}`,
    );
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

await removeFolder(folderOutput);
await mkdir(folderOutput, { recursive: true });

const fingerprints = await Promise.all(folders.map(generateFingerprints)).then(
  (f) => Object.assign({}, ...f),
);

await Promise.all(folders.map((folder) => copyFolder(folder, fingerprints)));

const importMap = JSON.stringify(readImportMap(fingerprints), null, 2);

await writeFile(jsonOutput, importMap);
