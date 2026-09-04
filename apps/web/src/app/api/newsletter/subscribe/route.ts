import { NextResponse } from "next/server";
import { db } from "@shopstream/db";
import { newsletterSubscribers } from "@shopstream/db/schema";
import { z } from "zod";

const Body = z.object({ email: z.string().email(), source: z.string().optional() });

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    const form = await req.formData();
    json = Object.fromEntries(form.entries());
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email: parsed.data.email, source: parsed.data.source ?? "footer" });
  } catch {
    // unique violation = already subscribed, ignore
  }
  return NextResponse.json({ ok: true });
}
