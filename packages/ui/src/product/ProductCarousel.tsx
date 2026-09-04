"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export function ProductCarousel({
  title,
  seeAllHref,
  items,
}: {
  title: string;
  seeAllHref?: string;
  items: ProductCardProps[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: 1 | -1) =>
    ref.current?.scrollBy({ left: d * 600, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
            >
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          <div className="hidden gap-1 md:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-pill bg-white shadow-sm hover:bg-surfaceMuted"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-pill bg-white shadow-sm hover:bg-surfaceMuted"
            >
              ›
            </button>
          </div>
        </div>
      </header>
      <div
        ref={ref}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:gap-4"
      >
        {items.map((p) => (
          <div
            key={p.slug}
            className="w-[calc(50%-6px)] shrink-0 snap-start md:w-[240px]"
          >
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </section>
  );
}
