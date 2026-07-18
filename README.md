# Bone's Farming & Transport Co.

Static website with a small Node service for contact enquiries.

## Project structure

```text
public/            Browser assets served as-is
src/
  contact/         Contact validation, rate limiting, and email delivery
  http/            HTTP body, response, and static-file helpers
  app.js           Request routing and server creation
  config.js        Runtime configuration
  server.js        Application entry point
```

No build step or test suite is required.

## Development

Requires Node.js 20 or newer.

1. Copy `.env.example` to `.env` and add the Resend values.
2. Install dependencies with `npm ci`.
3. Run `npm run dev`.

Nodemon restarts the service when a file in `src/` changes. The site is
available at `http://localhost:3000` by default.

## Production

Set the environment variables in the hosting platform, then run:

```sh
npm ci --omit=dev
npm start
```

Deploy this as a web service because `POST /api/contact` runs on the server.
Use `GET /health` as the health-check endpoint. There is no build command.

## Email configuration

Create a Resend API key and verify the domain used by `CONTACT_FROM_EMAIL`.
The visitor's address is used only as the reply-to address.

Required variables:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Optional variables:

- `PORT` (defaults to `3000`)
- `CONTACT_FROM_NAME` (defaults to `Bone's Website`)
