import express from "express";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static(__dirname, { extensions: ["html"] }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  app.listen(port, () => {
    console.log(`Bone's site is running at http://localhost:${port}`);
  });
}

export { app };
