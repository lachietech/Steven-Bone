import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const config = {
  port: Number(process.env.PORT) || 3000,
  publicDir: path.join(projectRoot, "public"),
  contact: {
    maxBodyBytes: 20_000,
    rateLimit: {
      maxRequests: 5,
      windowMs: 10 * 60 * 1000,
    },
  },
};
