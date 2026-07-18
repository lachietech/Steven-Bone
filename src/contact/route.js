import { readJson } from "../http/body.js";
import { sendJson } from "../http/response.js";
import { validateContact } from "./contact.js";
import { sendContactEmail } from "./email.js";
import { createRateLimiter } from "./rate-limiter.js";

export function createContactRoute({
  emailSender = sendContactEmail,
  maxBodyBytes,
  rateLimit,
  now,
}) {
  const isRateLimited = createRateLimiter({ ...rateLimit, now });

  return async function contactRoute(req, res) {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed." }, { Allow: "POST" });
      return;
    }

    if (isRateLimited(req)) {
      sendJson(
        res,
        429,
        { error: "Too many enquiries. Please wait a few minutes and try again." },
        { "Retry-After": String(Math.ceil(rateLimit.windowMs / 1000)) },
      );
      return;
    }

    const payload = await readJson(req, maxBodyBytes);
    const { contact, errors } = validateContact(payload);

    if (contact.website) {
      sendJson(res, 200, { ok: true });
      return;
    }
    if (errors.length > 0) {
      sendJson(res, 400, { error: errors[0] });
      return;
    }

    try {
      await emailSender(contact);
      sendJson(res, 200, { ok: true });
    } catch (error) {
      if (error.code === "EMAIL_NOT_CONFIGURED") {
        console.error("Contact form is missing required Resend environment variables.");
        sendJson(res, 503, {
          error: "The contact form is temporarily unavailable. Please try again later.",
        });
        return;
      }

      console.error("Unable to send contact enquiry:", error.message);
      sendJson(res, 502, {
        error: "We could not send your enquiry. Please try again in a moment.",
      });
    }
  };
}
