import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

const filesToCopy = ["index.html", "styles.css", "script.js", "favicon.svg"];
const directoriesToCopy = ["assets"];

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const file of filesToCopy) {
  cpSync(path.join(__dirname, file), path.join(distDir, file));
}

for (const directory of directoriesToCopy) {
  const source = path.join(__dirname, directory);
  if (existsSync(source)) {
    cpSync(source, path.join(distDir, directory), { recursive: true });
  }
}

const indexHtml = readFileSync(path.join(__dirname, "index.html"), "utf8");
writeFileSync(path.join(distDir, "404.html"), indexHtml);

console.log("Static deploy bundle created in ./dist");
