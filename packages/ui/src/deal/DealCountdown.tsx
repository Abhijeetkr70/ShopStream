"use client";

import { useEffect, useState } from "react";
import { ProductCard, type ProductCardProps } from "../product/ProductCard";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function DealCountdown({
  endsAt,
  items,
}: {
  endsAt: string;
  items: ProductCardProps[];
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const ms = Math.max(0, new Date(endsAt).getTime() - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);

  return (
    <section className="bg-surfaceMuted">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold md:text-2xl">Deals of the day</h2>
          <div
            className="inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1 text-sm font-bold text-danger shadow-xs"
            aria-live="polite"
          >
            <span className="font-mono">{pad(h)}</span>:
            <span className="font-mono">{pad(m)}</span>:
            <span className="font-mono">{pad(s)}</span>
            <span className="ml-1 text-xs font-medium text-textSecondary">
              left
            </span>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((p) => (
            <ProductCard key={p.slug} {...p} deal />
          ))}
        </div>
      </div>
    </section>
  );
}
