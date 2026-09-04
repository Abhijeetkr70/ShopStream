import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@shopstream/ui";
import { BRAND } from "@shopstream/lib";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: `${BRAND.author.name} — Author profile`,
    description: `Author profile for ${BRAND.author.name}, ${BRAND.author.jobTitle} of ShopStream.`,
    alternates: { canonical: `/author/${handle}` },
    openGraph: {
      title: `${BRAND.author.name} — Author profile`,
      description: `${BRAND.author.name}, ${BRAND.author.jobTitle} of ShopStream.`,
      type: "profile",
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: BRAND.author.name,
    jobTitle: BRAND.author.jobTitle,
    url: BRAND.author.url,
    sameAs: [
      "https://github.com/shopstream",
      "https://www.linkedin.com/company/shopstream",
    ],
    worksFor: {
      "@type": "Organization",
      name: BRAND.legalName,
      url: "https://shopstream.app",
    },
  };

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Author
        </p>
        <h1 className="mt-1 text-3xl font-extrabold">{BRAND.author.name}</h1>
        <p className="mt-1 text-textSecondary">{BRAND.author.jobTitle}</p>

        <p className="mt-6 text-textSecondary">
          {BRAND.author.name} is the {BRAND.author.jobTitle.toLowerCase()} behind ShopStream.
          The same identity — name, job title, profile URL — is mirrored across our
          GitHub org, LinkedIn page, About page, sitemap, and llms-full.txt, so
          search engines and answer engines can confidently attribute content to
          a real, consistent author.
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-4">
            <dt className="text-xs font-semibold uppercase text-textMuted">Name</dt>
            <dd className="mt-1 font-mono">{BRAND.author.name}</dd>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <dt className="text-xs font-semibold uppercase text-textMuted">Job title</dt>
            <dd className="mt-1 font-mono">{BRAND.author.jobTitle}</dd>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <dt className="text-xs font-semibold uppercase text-textMuted">Handle</dt>
            <dd className="mt-1 font-mono">@{handle}</dd>
          </div>
          <div className="rounded-lg border border-border bg-white p-4">
            <dt className="text-xs font-semibold uppercase text-textMuted">URL</dt>
            <dd className="mt-1 break-all font-mono text-sm">{BRAND.author.url}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
          >
            About ShopStream →
          </Link>
          <Link
            href="/llms-full.txt"
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-surfaceMuted"
          >
            llms-full.txt
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
