import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TopBar, Footer } from "@shopstream/ui";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold">My orders</h1>
        <p className="mt-2 text-textSecondary">
          Order history is fetched from <code>/api/orders</code> on the backend.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
