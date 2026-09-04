import Link from "next/link";
import { TopBar, Footer } from "@shopstream/ui";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">You&apos;re offline</h1>
        <p className="mt-3 text-textSecondary">
          ShopStream is a PWA. Some pages need a connection. Reconnect to
          continue browsing, or revisit cached items from your home screen.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
        >
          Retry
        </Link>
      </main>
      <Footer />
    </>
  );
}
