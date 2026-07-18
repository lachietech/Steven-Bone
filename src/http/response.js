function baseHeaders(contentType) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
}

export function send(
  res,
  status,
  body,
  contentType = "text/plain; charset=utf-8",
  extraHeaders = {},
) {
  res.writeHead(status, { ...baseHeaders(contentType), ...extraHeaders });
  res.end(body);
}

export function sendJson(res, status, body, extraHeaders = {}) {
  send(res, status, JSON.stringify(body), "application/json; charset=utf-8", extraHeaders);
}
