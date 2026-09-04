import { Redis } from "ioredis";

let client: Redis | null = null;

export function redis(): Redis {
  if (client) return client;
  const url =
    process.env.REDIS_URL ??
    "rediss://default:" +
      (process.env.UPSTASH_REDIS_REST_TOKEN ?? "") +
      "@" +
      new URL(process.env.UPSTASH_REDIS_REST_URL ?? "https://x.upstash.io").host;
  client = new Redis(url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    tls: url.startsWith("rediss://") ? {} : undefined,
  });
  return client;
}
