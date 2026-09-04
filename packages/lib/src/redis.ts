import { Redis as UpstashRedis } from "@upstash/redis";
import { Redis as NodeRedis, type RedisOptions } from "ioredis";

let upstash: UpstashRedis | null = null;
let node: NodeRedis | null = null;

function getRest(): UpstashRedis {
  if (upstash) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Upstash Redis env not configured");
  }
  upstash = new UpstashRedis({ url, token });
  return upstash;
}

function parseRedisUrl(raw: string): RedisOptions {
  const u = new URL(raw);
  const opts: RedisOptions = {
    host: u.hostname,
    port: Number(u.port || 6379),
    password: u.password || undefined,
    username: u.username && u.username !== "default" ? u.username : undefined,
    tls: u.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
  return opts;
}

export function getNodeRedis(): NodeRedis {
  if (node) return node;
  const url = process.env.REDIS_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  if (!url) throw new Error("REDIS_URL (or UPSTASH_REDIS_REST_URL) not configured");
  if (url.startsWith("http://") || url.startsWith("https://")) {
    throw new Error(
      "REDIS_URL must be a redis:// or rediss:// connection string, not the REST URL. BullMQ needs a TCP connection.",
    );
  }
  node = new NodeRedis(parseRedisUrl(url));
  return node;
}

export function redis(): UpstashRedis {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (restUrl && restToken) return getRest();
  return getNodeRedis() as unknown as UpstashRedis;
}

export async function cache<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const r = redis() as unknown as UpstashRedis;
  const hit = await r.get<T>(key);
  if (hit !== null && hit !== undefined) return hit;
  const fresh = await loader();
  await r.set(key, fresh as never, { ex: ttlSeconds });
  return fresh;
}

export async function invalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const r = redis() as unknown as UpstashRedis;
  await r.del(...keys);
}
