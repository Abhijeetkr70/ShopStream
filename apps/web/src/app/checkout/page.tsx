import { TopBar, Footer } from "@shopstream/ui";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold">Checkout</h1>
        <p className="mt-1 text-textSecondary">
          Signed in as {user?.emailAddresses[0]?.emailAddress ?? "guest"}.
        </p>
        <ol className="mt-6 grid gap-2 text-sm">
          <li className="rounded-md border border-border bg-white p-4">
            <strong>1. Address</strong> — confirm delivery address.
          </li>
          <li className="rounded-md border border-border bg-white p-4">
            <strong>2. Payment</strong> — Razorpay (UPI / cards / net-banking).
          </li>
          <li className="rounded-md border border-border bg-white p-4">
            <strong>3. Review & place order</strong> — Brevo email confirmation.
          </li>
        </ol>
        <p className="mt-6 text-sm text-textSecondary">
          Full Razorpay integration lives on the API (apps/api). This page is
          wired up via the <code>/api/checkout</code> route.
        </p>
      </main>
      <Footer />
    </>
  );
}
