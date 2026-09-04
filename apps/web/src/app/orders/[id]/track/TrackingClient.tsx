"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function TrackingClient({ orderId }: { orderId: string }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const sock = new (require("socket.io-client"))(url, {
      query: { orderId },
      transports: ["websocket"],
    });
    sock.on("location", (p: { lat: number; lng: number }) => setCoords(p));
    sock.on("eta", (m: number) => setEta(m));
    return () => {
      sock.disconnect();
    };
  }, [orderId]);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
      <div className="aspect-[4/3] w-full md:aspect-[16/9]">
        <Map coords={coords} />
      </div>
      <div className="flex items-center justify-between border-t border-border p-3 text-sm">
        <span>
          {coords
            ? `Live · ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : "Waiting for first fix…"}
        </span>
        <span className="font-mono">
          {eta !== null ? `${eta} min away` : "—"}
        </span>
      </div>
    </div>
  );
}
