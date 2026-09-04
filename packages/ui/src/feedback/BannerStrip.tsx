"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../cn";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  tone?: "brand" | "accent" | "info";
}

const tones: Record<NonNullable<Banner["tone"]>, string> = {
  brand: "from-[#FF5200] to-[#FF7A3D]",
  accent: "from-[#16A34A] to-[#34D399]",
  info: "from-[#2563EB] to-[#60A5FA]",
};

export function BannerStrip({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % banners.length), 5000);
    return () => window.clearInterval(id);
  }, [paused, banners.length]);

  if (banners.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-[1280px] px-4 py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-sm">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {banners.map((b) => (
            <a
              key={b.id}
              href={b.href}
              className={cn(
                "relative w-full shrink-0 bg-gradient-to-br p-6 text-white md:p-10",
                tones[b.tone ?? "brand"],
              )}
            >
              <div className="max-w-md">
                <h3 className="text-xl font-extrabold md:text-3xl">{b.title}</h3>
                <p className="mt-1 text-sm opacity-90 md:text-base">{b.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-1 rounded-pill bg-white px-4 py-2 text-sm font-bold text-brand">
                  {b.cta} →
                </span>
              </div>
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous banner"
          onClick={() => setI((v) => (v - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill bg-white/85 text-text hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next banner"
          onClick={() => setI((v) => (v + 1) % banners.length)}
          className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill bg-white/85 text-text hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Go to banner ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-pill transition-all",
                idx === i ? "w-6 bg-white" : "w-1.5 bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
