import type { NextFunction, Request, Response } from "express";
import { verifyJwt } from "@shopstream/lib/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: "user" | "admin"; email?: string };
    }
  }
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.["ss_jwt"];
  if (token) {
    const payload = verifyJwt<{
      sub: string;
      role: "user" | "admin";
      email?: string;
    }>(token);
    if (payload) {
      req.user = { id: payload.sub, role: payload.role ?? "user", email: payload.email };
    }
  }
  next();
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ error: { code: 401, message: "Unauthorized" } });
  }
  next();
}
