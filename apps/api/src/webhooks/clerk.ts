import type { Request, Response } from "express";
import { Webhook } from "svix";
import { db } from "@shopstream/db";
import { users } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { env } from "../config";

export async function clerkWebhook(req: Request, res: Response) {
  const svixId = req.header("svix-id");
  const svixTimestamp = req.header("svix-timestamp");
  const svixSignature = req.header("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let payload: { type: string; data: { id: string; email_addresses?: { email_address: string }[]; first_name?: string; last_name?: string } };
  try {
    payload = wh.verify(JSON.stringify(req.body), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof payload;
  } catch {
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (payload.type === "user.created" || payload.type === "user.updated") {
    const email = payload.data.email_addresses?.[0]?.email_address ?? "";
    const name = [payload.data.first_name, payload.data.last_name].filter(Boolean).join(" ");
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, payload.data.id))
      .limit(1);
    if (existing) {
      await db
        .update(users)
        .set({ email, name })
        .where(eq(users.clerkId, payload.data.id));
    } else {
      await db.insert(users).values({ clerkId: payload.data.id, email, name });
    }
  }

  res.json({ ok: true });
}
