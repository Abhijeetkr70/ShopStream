import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@shopstream/db";
import { categories, products } from "@shopstream/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  TopBar,
  Footer,
  ProductCard,
} from "@shopstream/ui";

export const revalidate = 60;

async function getCategory(slug: string) {
  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (!cat) return null;
  const items = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, cat.id))
    .orderBy(asc(products.title));
  return { cat, items };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) return { title: "Category not found" };
  return {
    title: `${data.cat.name} — ShopStream`,
    description: `Shop ${data.cat.name.toLowerCase()} on ShopStream. ${data.items.length} products.`,
    alternates: { canonical: `/category/${data.cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.cat.name,
    url: `https://shopstream.app/category/${data.cat.slug}`,
    hasPart: data.items.slice(0, 25).map((p) => ({
      "@type": "Product",
      name: p.title,
      url: `https://shopstream.app/product/${p.slug}`,
    })),
  };

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-[1280px] px-4 py-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-textSecondary">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-text">{data.cat.name}</span>
        </nav>
        <h1 className="text-2xl font-extrabold md:text-3xl">{data.cat.name}</h1>
        <p className="mt-1 text-sm text-textSecondary">
          {data.items.length} products
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {data.items.map((p) => (
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
