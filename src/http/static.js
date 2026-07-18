import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { send } from "./response.js";

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

function contentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function cacheControl(filePath) {
  return path.extname(filePath).toLowerCase() === ".html"
    ? "no-cache"
    : "public, max-age=3600, stale-while-revalidate=86400";
}

function isOutsideRoot(rootDir, filePath) {
  const relativePath = path.relative(rootDir, filePath);
  return (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}

async function serveFile(req, res, filePath) {
  const body = req.method === "HEAD" ? "" : await readFile(filePath);
  send(res, 200, body, contentType(filePath), {
    "Cache-Control": cacheControl(filePath),
  });
}

export async function serveStatic(req, res, pathname, publicDir) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed.", undefined, { Allow: "GET, HEAD" });
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    throw Object.assign(new Error("Invalid URL path."), { status: 400 });
  }

  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const rootDir = path.resolve(publicDir);
  const filePath = path.resolve(rootDir, `.${requestedPath}`);

  if (isOutsideRoot(rootDir, filePath)) {
    send(res, 403, "Forbidden.");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    await serveFile(req, res, filePath);
    return;
  }

  await serveFile(req, res, path.join(rootDir, "index.html"));
}
