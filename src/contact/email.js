import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { divisions } from "./contact.js";

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

export async function sendContactEmail(contact) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    const error = new Error("Contact email is not configured.");
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }

  const divisionLabel = divisions[contact.division];
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safeDivision = escapeHtml(divisionLabel);
  const safeMessage = escapeHtml(contact.message).replace(/\r?\n/g, "<br />");
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "Bone's Website";
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send(
    {
      from: `${fromName} <${from}>`,
      to: [to],
      replyTo: contact.email,
      subject: `Website enquiry: ${divisionLabel}`,
      text: [
        "New website enquiry",
        "",
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Interested in: ${divisionLabel}`,
        "",
        contact.message,
      ].join("\n"),
      html: `
        <h1 style="font-size:22px">New website enquiry</h1>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Interested in:</strong> ${safeDivision}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    },
    { idempotencyKey: `contact-${randomUUID()}` },
  );

  if (error) {
    const resendError = new Error(error.message || "Resend rejected the email.");
    resendError.code = "RESEND_ERROR";
    throw resendError;
  }

  return data;
}
