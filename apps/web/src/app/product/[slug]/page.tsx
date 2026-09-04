import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@shopstream/db";
import { products, categories } from "@shopstream/db/schema";
import { eq } from "drizzle-orm";
import { TopBar, Footer, Badge, Button } from "@shopstream/ui";
import { discountPct, inr } from "@shopstream/lib";

export const revalidate = 60;

async function getProduct(slug: string) {
  const [row] = await db
    .select({ product: products, category: categories })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product not found" };
  const p = data.product;
  return {
    title: `${p.title}`,
    description: p.description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: "product",
      title: p.title,
      description: p.description,
      images: p.images.map((u) => ({ url: u })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return notFound();
  const { product: p, category } = data;

  const off = discountPct(p.priceMrp, p.priceSale);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: p.images,
    description: p.description,
    sku: p.id,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.ratingAvg,
      reviewCount: p.ratingCount,
    },
    offers: {
      "@type": "Offer",
      url: `https://shopstream.app/product/${p.slug}`,
      priceCurrency: "INR",
      price: (p.priceSale / 100).toFixed(2),
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${p.title} in stock?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: p.stock > 0 ? "Yes, currently in stock." : "Currently out of stock.",
        },
      },
      {
        "@type": "Question",
        name: `How long does delivery take for ${p.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Metro: same-day. Other cities: 2-5 business days.",
        },
      },
      {
        "@type": "Question",
        name: "What is the return policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "10-day no-questions-asked returns for unopened items.",
        },
      },
    ],
  };

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-[1280px] px-4 py-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-textSecondary">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${category.slug}`} className="hover:text-brand">
            {category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-text">{p.title}</span>
        </nav>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2 md:grid-cols-2">
            {p.images.slice(0, 4).map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surfaceMuted"
              >
                <Image
                  src={src}
                  alt={`${p.title} — view ${i + 1}`}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <div>
            {p.brand && (
              <p className="text-sm font-semibold uppercase tracking-wide text-textMuted">
                {p.brand}
              </p>
            )}
            <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">{p.title}</h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-textSecondary">
              <span>★ {p.ratingAvg.toFixed(1)}</span>
              <span>·</span>
              <span>{p.ratingCount} ratings</span>
              {p.stock > 0 ? (
                <Badge tone="success">In stock</Badge>
              ) : (
                <Badge tone="danger">Out of stock</Badge>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-extrabold">
                {inr(p.priceSale)}
              </span>
              {off > 0 && (
                <>
                  <span className="font-mono text-base text-textMuted line-through">
                    {inr(p.priceMrp)}
                  </span>
                  <Badge tone="success">{off}% OFF</Badge>
                </>
              )}
            </div>

            <p className="mt-4 text-base leading-relaxed text-textSecondary">
              {p.description}
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <form action="/api/cart/add" method="POST" className="flex-1">
                <input type="hidden" name="productId" value={p.id} />
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="title" value={p.title} />
                <input type="hidden" name="image" value={p.images[0] ?? ""} />
                <input type="hidden" name="unitPrice" value={p.priceSale} />
                <Button type="submit" size="lg" fullWidth>
                  Add to cart
                </Button>
              </form>
              <Link
                href="/cart"
                className="inline-flex h-14 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold hover:bg-surfaceMuted"
              >
                Go to cart
              </Link>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-border p-3">
                <dt className="text-xs text-textMuted">Delivery</dt>
                <dd className="font-semibold">Free above ₹499</dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="text-xs text-textMuted">Returns</dt>
                <dd className="font-semibold">10 days</dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="text-xs text-textMuted">Payments</dt>
                <dd className="font-semibold">Razorpay · UPI</dd>
              </div>
              <div className="rounded-md border border-border p-3">
                <dt className="text-xs text-textMuted">Author</dt>
                <dd className="font-semibold">
                  <Link
                    href="/author/shopstream"
                    className="text-brand hover:underline"
                  >
                    ShopStream Team
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
