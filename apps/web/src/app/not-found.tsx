import Link from "next/link";
import { TopBar, Footer } from "@shopstream/ui";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
        <p className="mt-2 text-textSecondary">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
        >
          Back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
