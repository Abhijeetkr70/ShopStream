import { Router } from "express";
import { z } from "zod";
import { chat } from "../ai/router";

export const aiRouter = Router();

const Body = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
});

aiRouter.post("/chat", async (req, res, next) => {
  try {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: { code: 400, message: "Bad body" } });
    const out = await chat(parsed.data.message);
    res.json(out);
  } catch (e) {
    next(e);
  }
});
