import { createServer } from "node:http";
import { config } from "./config.js";
import { createContactRoute } from "./contact/route.js";
import { sendJson } from "./http/response.js";
import { serveStatic } from "./http/static.js";

export function createAppServer({
  publicDir = config.publicDir,
  emailSender,
  now = Date.now,
} = {}) {
  const contactRoute = createContactRoute({
    emailSender,
    maxBodyBytes: config.contact.maxBodyBytes,
    rateLimit: config.contact.rateLimit,
    now,
  });

  return createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

      if (requestUrl.pathname === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
      }
      if (requestUrl.pathname === "/api/contact") {
        await contactRoute(req, res);
        return;
      }
      if (requestUrl.pathname.startsWith("/api/")) {
        sendJson(res, 404, { error: "Not found." });
        return;
      }

      await serveStatic(req, res, requestUrl.pathname, publicDir);
    } catch (error) {
      const status = Number(error.status) || 500;
      if (status >= 500) {
        console.error("Request failed:", error);
      }
      if (!res.headersSent) {
        sendJson(res, status, {
          error: status >= 500 ? "Internal server error." : error.message,
        });
      } else {
        res.end();
      }
    }
  });
}
