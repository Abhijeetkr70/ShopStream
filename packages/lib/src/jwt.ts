import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SECRET = () => process.env.JWT_SECRET ?? "dev-secret-change-me-please-32+chars";

export interface JwtPayload {
  sub: string;
  role?: "user" | "admin";
  email?: string;
  iat?: number;
  exp?: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecode(input: string): Buffer {
  const pad = 4 - (input.length % 4);
  const safe = input.replace(/-/g, "+").replace(/_/g, "/") + (pad < 4 ? "=".repeat(pad) : "");
  return Buffer.from(safe, "base64");
}

export function signJwt(payload: Omit<JwtPayload, "iat" | "exp">, ttlSec = 60 * 60 * 24 * 7): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + ttlSec }));
  const sig = createHmac("sha256", SECRET()).update(`${header}.${body}`).digest();
  return `${header}.${body}.${b64url(sig)}`;
}

export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts as [string, string, string];
  const expected = createHmac("sha256", SECRET()).update(`${header}.${body}`).digest();
  const got = b64urlDecode(sig);
  if (expected.length !== got.length) return null;
  if (!timingSafeEqual(expected, got)) return null;
  const payload = JSON.parse(b64urlDecode(body).toString("utf8")) as JwtPayload;
  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) return null;
  return payload as T;
}

export function randomToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
