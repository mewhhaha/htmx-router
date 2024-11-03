#!/usr/bin/env node

import { generateRouter } from "./generate-router.mjs";
import path from "node:path";
import { generateTypes } from "./generate-types.mjs";

const appFolder = path.normalize(process.argv[2]);

console.log("Generating router for", appFolder);
await generateRouter(appFolder);
console.log("Generating types for", appFolder);
await generateTypes(appFolder);
