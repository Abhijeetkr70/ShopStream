import { Router } from "express";
import { db } from "@shopstream/db";
import { users } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { signJwt } from "@shopstream/lib/jwt";
import { randomToken, sha256 } from "@shopstream/lib/jwt";
import { env } from "../config";

export const authRouter = Router();

authRouter.post("/csrf", (req, res) => {
  const token = randomToken(24);
  res.cookie("ss_csrf", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 3600_000,
  });
  const hash = sha256(token);
  res.json({ token: hash });
});

authRouter.post("/issue", async (req, res, next) => {
  try {
    const clerkId = String(req.body?.clerkId ?? "");
    if (!clerkId) {
      return res.status(400).json({ error: { code: 400, message: "Missing clerkId" } });
    }
    const [u] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!u) {
      return res.status(404).json({ error: { code: 404, message: "User not synced" } });
    }
    const token = signJwt({ sub: u.id, role: u.role as "user" | "admin", email: u.email });
    res.cookie("ss_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 3600_000,
      path: "/",
    });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("ss_jwt", { path: "/" });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
