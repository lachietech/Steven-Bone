export function readJson(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = "";
    let receivedBytes = 0;
    let settled = false;

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      if (settled) return;

      receivedBytes += Buffer.byteLength(chunk);
      if (receivedBytes > maxBytes) {
        settled = true;
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      if (settled) return;

      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}
