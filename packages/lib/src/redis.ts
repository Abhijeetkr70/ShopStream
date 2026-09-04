import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function redis(): Redis {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash Redis env not configured");
  client = new Redis({ url, token });
  return client;
}

export async function cache<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const r = redis();
  const hit = await r.get<T>(key);
  if (hit !== null && hit !== undefined) return hit;
  const fresh = await loader();
  await r.set(key, fresh as never, { ex: ttlSeconds });
  return fresh;
}

export async function invalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await redis().del(...keys);
}

export async function tokenBucket(opts: {
  key: string;
  capacity: number;
  refillPerSec: number;
  cost?: number;
}): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const { key, capacity, refillPerSec } = opts;
  const cost = opts.cost ?? 1;
  const r = redis();
  const now = Date.now();
  const bucket = (await r.get<{ tokens: number; ts: number }>(key)) ?? {
    tokens: capacity,
    ts: now,
  };
  const elapsed = (now - bucket.ts) / 1000;
  const refilled = Math.min(capacity, bucket.tokens + elapsed * refillPerSec);
  if (refilled < cost) {
    const resetAt = now + ((cost - refilled) / refillPerSec) * 1000;
    await r.set(key, { tokens: refilled, ts: now }, { ex: 60 });
    return { allowed: false, remaining: Math.floor(refilled), resetAt };
  }
  const next = { tokens: refilled - cost, ts: now };
  await r.set(key, next, { ex: 60 });
  return {
    allowed: true,
    remaining: Math.floor(next.tokens),
    resetAt: now + 60_000,
  };
}
