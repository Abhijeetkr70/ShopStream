import type { Request, Response } from "express";

/**
 * Liveness probe.
 *
 * - If `HEALTH_TOKEN` is set in env, the caller must send
 *   `Authorization: Bearer <HEALTH_TOKEN>`. Used by cron-job.org so
 *   random scanners can't trigger the keepalive ping.
 * - If `HEALTH_TOKEN` is not set, the route is open (local dev).
 *
 * Mounted at `GET /healthz`.
 */
export function healthz(req: Request, res: Response) {
  const expected = process.env.HEALTH_TOKEN;
  if (expected) {
    const got = req.header("authorization") ?? "";
    const want = `Bearer ${expected}`;
    if (got !== want) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }
    return res.json({ ok: true, ts: Date.now(), auth: "token" });
  }
  return res.json({ ok: true, ts: Date.now(), auth: "open" });
}
