"use client";

import { Heart, Plus, Minus, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { cn } from "../cn";
import { discountPct, inr } from "@shopstream/lib";

export interface ProductCardProps {
  slug: string;
  title: string;
  brand?: string;
  image: string;
  priceMrp: number;
  priceSale: number;
  ratingAvg: number;
  ratingCount: number;
  deal?: boolean;
}

export function ProductCard({
  slug,
  title,
  brand,
  image,
  priceMrp,
  priceSale,
  ratingAvg,
  ratingCount,
  deal,
}: ProductCardProps) {
  const [qty, setQty] = useState<number | null>(null);
  const off = discountPct(priceMrp, priceSale);
  const inCart = qty !== null;

  return (
    <article
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-white p-3 transition-all duration-150",
        "hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-square overflow-hidden rounded-md"
        aria-label={title}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 240px"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {deal && (
          <span
            className="absolute left-2 top-2 rounded-pill bg-accent px-2 py-0.5 text-[11px] font-bold text-white"
            aria-label="Deal"
          >
            DEAL
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-pill bg-white/90 text-textSecondary hover:text-danger"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {brand && <div className="text-xs font-medium text-textMuted">{brand}</div>}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-text">
          <Link href={`/product/${slug}`}>{title}</Link>
        </h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-textSecondary">
          <Star className="h-3.5 w-3.5 fill-warning stroke-warning" />
          <span className="font-semibold">{ratingAvg.toFixed(1)}</span>
          <span className="text-textMuted">({ratingCount})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-base font-bold text-text">{inr(priceSale)}</span>
          {off > 0 && (
            <>
              <span className="font-mono text-xs text-textMuted line-through">{inr(priceMrp)}</span>
              <Badge tone="success">{off}% OFF</Badge>
            </>
          )}
        </div>

        <div className="mt-3">
          {inCart ? (
            <div className="flex h-9 items-center justify-between rounded-md border border-brand">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => (q! > 1 ? q! - 1 : null))}
                className="flex h-full w-10 items-center justify-center text-brand hover:bg-brandSoft"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-mono font-bold text-brand">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, (q ?? 0) + 1))}
                className="flex h-full w-10 items-center justify-center text-brand hover:bg-brandSoft"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onClick={() => setQty(1)}
            >
              ADD
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
