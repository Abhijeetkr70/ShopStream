import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopBar, Footer } from "@shopstream/ui";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold">Account</h1>
        <p className="mt-2 text-textSecondary">
          Profile, addresses, and security — backed by Clerk + sync via{" "}
          <code>/api/auth/sync</code>.
        </p>
      </main>
      <Footer />
    </>
  );
}
