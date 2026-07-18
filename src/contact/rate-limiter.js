function clientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

export function createRateLimiter({ maxRequests, windowMs, now = Date.now }) {
  const attemptsByIp = new Map();
  let nextCleanup = now() + windowMs;

  return function isRateLimited(req) {
    const currentTime = now();
    const cutoff = currentTime - windowMs;
    const ip = clientIp(req);

    if (currentTime >= nextCleanup) {
      for (const [storedIp, attempts] of attemptsByIp) {
        const recentAttempts = attempts.filter((time) => time > cutoff);
        if (recentAttempts.length === 0) {
          attemptsByIp.delete(storedIp);
        } else {
          attemptsByIp.set(storedIp, recentAttempts);
        }
      }
      nextCleanup = currentTime + windowMs;
    }

    const attempts = (attemptsByIp.get(ip) || []).filter((time) => time > cutoff);

    if (attempts.length >= maxRequests) {
      return true;
    }

    attempts.push(currentTime);
    attemptsByIp.set(ip, attempts);
    return false;
  };
}
