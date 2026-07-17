import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const rootDir = existsSync(distDir) ? distDir : __dirname;
const port = Number(process.env.PORT) || 3000;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

async function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = contentTypes[ext] || "application/octet-stream";
  const body = await readFile(filePath);
  send(res, 200, body, type);
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url || "/", `http://${req.headers.host}`).pathname);
    const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(rootDir, safePath);

    if (existsSync(filePath)) {
      await serveFile(res, filePath);
      return;
    }

    filePath = path.join(rootDir, "index.html");
    await serveFile(res, filePath);
  } catch {
    send(res, 500, "Internal Server Error", "text/plain; charset=utf-8");
  }
});

server.listen(port, () => {
  console.log(`Static preview is running at http://localhost:${port}`);
});
