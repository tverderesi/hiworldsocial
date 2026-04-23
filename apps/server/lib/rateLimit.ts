const counters = new Map<string, number[]>();

interface RateLimitOptions {
  key: string;
  windowMs: number;
  maxRequests: number;
}

export function checkRateLimit({
  key,
  windowMs,
  maxRequests,
}: RateLimitOptions): boolean {
  const now = Date.now();
  const recentRequests = (counters.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (recentRequests.length >= maxRequests) {
    counters.set(key, recentRequests);
    return false;
  }

  recentRequests.push(now);
  counters.set(key, recentRequests);
  return true;
}
