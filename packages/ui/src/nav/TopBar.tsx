"use client";

import { Search, MapPin, Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "../cn";
import { tokens } from "../tokens";

export interface TopBarProps {
  cartCount?: number;
  onSearch?: (q: string) => void;
  city?: string;
}

export function TopBar({ cartCount = 0, onSearch, city = "Bengaluru" }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full transition-colors",
        scrolled
          ? "border-b border-border bg-white/85 backdrop-blur"
          : "bg-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-lg font-extrabold text-white"
            style={{ backgroundColor: tokens.color.brand }}
          >
            S
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight md:inline">
            Shop<span style={{ color: tokens.color.brand }}>Stream</span>
          </span>
        </Link>

        <button
          type="button"
          className="ml-1 hidden items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-text hover:bg-surfaceMuted md:inline-flex"
          aria-label={`Current city ${city}, change location`}
        >
          <MapPin className="h-4 w-4" style={{ color: tokens.color.brand }} />
          {city}
          <span className="text-textMuted">▾</span>
        </button>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch?.(q);
          }}
          className="hidden flex-1 md:block"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search "shoes", "milk", "iPhone"...'
              className="h-10 w-full rounded-md border border-border bg-surfaceMuted pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-info"
              aria-label="Search products"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-text hover:bg-surfaceMuted md:inline-flex"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart with ${cartCount} items`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-text hover:bg-surfaceMuted"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-pill px-1 text-[11px] font-bold text-white"
                style={{ backgroundColor: tokens.color.brand }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="ml-1 hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-text hover:bg-surfaceMuted md:inline-flex"
          >
            <User className="h-4 w-4" />
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
