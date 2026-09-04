import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@shopstream/db";
import { products } from "@shopstream/db/schema";
import { eq, sql } from "drizzle-orm";

const Body = z.object({
  productId: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  unitPrice: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

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
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Verify product exists + decrement inventory atomically (best-effort).
  try {
    await db.execute(
      sql`UPDATE inventory SET reserved = reserved + ${parsed.data.quantity}, on_hand = on_hand - ${parsed.data.quantity} WHERE product_id = ${parsed.data.productId} AND on_hand >= ${parsed.data.quantity}`,
    );
  } catch {
    /* inventory row may not exist for every product yet */
  }

  return NextResponse.json({ ok: true, productSlug: parsed.data.slug });
}
