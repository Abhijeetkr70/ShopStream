import type { NextFunction, Request, Response } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (SAFE_METHODS.has(req.method)) return next();
  const headerToken = req.header("x-csrf-token");
  const cookieToken = req.cookies?.["ss_csrf"];
  if (!headerToken || !cookieToken) {
    return res.status(403).json({ error: { code: 403, message: "CSRF token missing" } });
  }
  const a = createHmac("sha256", env.CSRF_SECRET).update(headerToken).digest();
  const b = createHmac("sha256", env.CSRF_SECRET).update(cookieToken).digest();
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(403).json({ error: { code: 403, message: "CSRF mismatch" } });
  }
  next();
}
