import Link from "next/link";
import { db } from "@shopstream/db";
import { products, categories } from "@shopstream/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  TopBar,
  Hero,
  CategoryStrip,
  ProductCarousel,
  BannerStrip,
  DealCountdown,
  Footer,
} from "@shopstream/ui";

export const revalidate = 60;

async function getHomeData() {
  const allCats = await db
    .select()
    .from(categories)
    .orderBy(categories.position);

  const top = await db
    .select()
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(desc(products.ratingAvg), desc(products.ratingCount))
    .limit(20);

  const deals = await db
    .select()
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(desc(products.ratingAvg))
    .limit(8);

  return { allCats, top, deals };
}

function toCard(p: typeof products.$inferSelect) {
  return {
    slug: p.slug,
    title: p.title,
    brand: p.brand ?? undefined,
    image: p.images[0] ?? `https://picsum.photos/seed/${p.slug}/800/800`,
    priceMrp: p.priceMrp,
    priceSale: p.priceSale,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
  };
}

export default async function HomePage() {
  const { allCats, top, deals } = await getHomeData();

  const endsAt = new Date(Date.now() + 6 * 3600_000).toISOString();

  const banners = [
    {
      id: "b1",
      title: "Up to 60% off Fashion",
      subtitle: "Top brands · New arrivals every week",
      cta: "Shop fashion",
      href: "/category/fashion",
      tone: "brand" as const,
    },
    {
      id: "b2",
      title: "Electronics Fest",
      subtitle: "Earbuds, watches, keyboards & more",
      cta: "Explore deals",
      href: "/category/electronics",
      tone: "info" as const,
    },
    {
      id: "b3",
      title: "Grocery in 30 minutes",
      subtitle: "Daily essentials at your doorstep",
      cta: "Order now",
      href: "/category/grocery",
      tone: "accent" as const,
    },
  ];

  return (
    <>
      <TopBar />
      <main id="main">
        <Hero />
        <CategoryStrip
          items={allCats.map((c) => ({
            slug: c.slug,
            name: c.name,
            icon: (["shirt", "zap", "basket", "sparkles", "sofa", "book"] as const)[
              allCats.findIndex((x) => x.id === c.id) % 6
            ] ?? "shirt",
          }))}
        />
        <BannerStrip banners={banners} />
        <ProductCarousel
          title="Top picks for you"
          seeAllHref="/category/fashion"
          items={top.slice(0, 12).map(toCard)}
        />
        <DealCountdown endsAt={endsAt} items={deals.map(toCard)} />
        <ProductCarousel
          title="Trending now"
          seeAllHref="/category/electronics"
          items={top.slice(8, 20).map(toCard)}
        />
        <section className="mx-auto max-w-[1280px] px-4 py-10">
          <div className="rounded-lg bg-gradient-to-br from-brand to-brandDark p-8 text-white shadow-md md:p-12">
            <h2 className="text-2xl font-extrabold md:text-4xl">
              Get ₹200 off your first order
            </h2>
            <p className="mt-1 max-w-xl opacity-90">
              Sign up for the ShopStream newsletter and we&apos;ll send you a
              one-time code valid on orders above ₹999.
            </p>
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-pill bg-white px-4 text-sm text-text placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Email"
              />
              <button
                type="submit"
                className="h-12 rounded-pill bg-white px-6 text-sm font-bold text-brand hover:bg-white/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <Link
        href="/about"
        className="sr-only"
        aria-label="About ShopStream"
      >
        About
      </Link>
    </>
  );
}
