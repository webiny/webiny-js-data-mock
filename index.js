#!/usr/bin/env node
import { URL } from "node:url";
import { register } from "tsx/esm/api";

register({
    tsconfig: new URL("./tsconfig.json", import.meta.url).pathname
});

await import("./src/index.ts");
