"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          /* offline-first SW is best-effort */
        });
    }
  }, []);

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#FF5200",
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      {children}
      <Analytics />
      <SpeedInsights />
    </ClerkProvider>
  );
}
