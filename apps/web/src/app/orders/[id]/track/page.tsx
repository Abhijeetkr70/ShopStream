import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopBar, Footer } from "@shopstream/ui";
import TrackingClient from "./TrackingClient";

export const metadata = { title: "Live order tracking" };

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Tracking {id}</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Live updates stream over Socket.io from the API. Map below uses Leaflet.
        </p>
        <TrackingClient orderId={id} />
      </main>
      <Footer />
    </>
  );
}
