import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status =
    typeof (err as { status?: number })?.status === "number"
      ? (err as { status: number }).status
      : 500;
  const message =
    (err as { message?: string })?.message ?? "Internal Server Error";
  if (status >= 500) console.error("[api error]", err);
  res.status(status).json({ error: { code: status, message } });
}
