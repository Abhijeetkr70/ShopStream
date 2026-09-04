import { NextResponse } from "next/server";
import { db } from "@shopstream/db";
import { products, categories } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const cats = await db.select().from(categories).orderBy(categories.position);
  const featured = await db
    .select()
    .from(products)
    .where(eq(products.status, "active"))
    .limit(50);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    categories: cats.map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon,
    })),
    products: featured.map((p) => ({
      slug: p.slug,
      title: p.title,
      brand: p.brand,
      priceSale: p.priceSale,
      priceMrp: p.priceMrp,
      url: `/product/${p.slug}`,
      image: p.images[0] ?? null,
    })),
  });
}
