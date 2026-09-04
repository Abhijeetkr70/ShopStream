import Link from "next/link";
import { db } from "@shopstream/db";
import { products } from "@shopstream/db/schema";
import { ilike, or, sql } from "drizzle-orm";
import { TopBar, Footer, ProductCard } from "@shopstream/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const results = q
    ? await db
        .select()
        .from(products)
        .where(
          or(
            ilike(products.title, `%${q}%`),
            ilike(products.brand, `%${q}%`),
            ilike(products.description, `%${q}%`),
          ),
        )
        .limit(48)
    : [];

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-[1280px] px-4 py-6">
        <h1 className="text-2xl font-extrabold">Search</h1>
        <p className="mt-1 text-sm text-textSecondary">
          {q ? `Results for "${q}" (${results.length})` : "Type a query above."}
        </p>

        {q && results.length === 0 && (
          <div className="mt-10 rounded-md border border-border bg-surfaceMuted p-6 text-center">
            <p className="font-semibold">No matches yet.</p>
            <p className="mt-1 text-sm text-textSecondary">
              Try a broader query like &quot;shoes&quot;, &quot;milk&quot;, or
              &quot;iPhone&quot;.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
            >
              Back to home
            </Link>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              title={p.title}
              brand={p.brand ?? undefined}
              image={p.images[0] ?? `https://picsum.photos/seed/${p.slug}/800/800`}
              priceMrp={p.priceMrp}
              priceSale={p.priceSale}
              ratingAvg={p.ratingAvg}
              ratingCount={p.ratingCount}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
