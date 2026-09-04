"use client";

import {
  Shirt,
  Zap,
  ShoppingBasket,
  Sparkles,
  Sofa,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "../cn";
import { tokens } from "../tokens";

export interface CategoryItem {
  slug: string;
  name: string;
  icon: keyof typeof ICONS;
}

const ICONS = {
  shirt: Shirt,
  zap: Zap,
  basket: ShoppingBasket,
  sparkles: Sparkles,
  sofa: Sofa,
  book: BookOpen,
} as const satisfies Record<string, LucideIcon>;

export function CategoryStrip({ items }: { items: CategoryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="cat-strip" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-6">
        <div className="relative">
          <div
            ref={ref}
            className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:gap-4"
          >
            {items.map((c) => {
              const Icon = ICONS[c.icon];
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-md transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:shadow-sm",
                    )}
                    style={{ backgroundColor: tokens.color.brandSoft }}
                  >
                    <Icon className="h-9 w-9" style={{ color: tokens.color.brand }} strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-semibold text-text">{c.name}</span>
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill bg-white shadow-sm hover:bg-surfaceMuted md:inline-flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-pill bg-white shadow-sm hover:bg-surfaceMuted md:inline-flex"
          >
            ›
          </button>
        </div>
      </div>
      <h2 id="cat-strip" className="sr-only">
        Shop by category
      </h2>
    </section>
  );
}
