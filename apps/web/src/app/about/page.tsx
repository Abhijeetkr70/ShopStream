import Link from "next/link";
import { TopBar, Footer } from "@shopstream/ui";
import { BRAND } from "@shopstream/lib";

export const metadata = {
  title: "About ShopStream",
  description:
    "Learn about ShopStream, the team behind it, and how we approach e-commerce.",
};

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">About ShopStream</h1>
        <p className="mt-3 text-textSecondary">
          ShopStream is a Swiggy-style e-commerce experience built for India.
          We&apos;re a small team obsessed with two things: making everyday
          shopping feel as fast as ordering food, and showing up beautifully
          on a slow 4G phone.
        </p>

        <h2 className="mt-8 text-xl font-bold">Who runs it</h2>
        <p className="mt-2 text-textSecondary">
          {BRAND.author.name} — {BRAND.author.jobTitle}.{" "}
          <Link
            href={BRAND.author.url}
            className="font-semibold text-brand hover:underline"
          >
            Author profile →
          </Link>
        </p>

        <h2 className="mt-8 text-xl font-bold">How we work</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-textSecondary">
          <li>Mobile-first, app-like UI (PWA-installable).</li>
          <li>Category-driven discovery, search-emphasised, deal-driven.</li>
          <li>Open documentation under <code>/docs/</code>.</li>
          <li>Machine-readable catalog at <code>/llms-full.txt</code>.</li>
          <li>Indexable for AI crawlers via <code>/.well-known/agent.json</code>.</li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">Contact</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-textSecondary">
          <li>Support: support@shopstream.app</li>
          <li>Press: press@shopstream.app</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
