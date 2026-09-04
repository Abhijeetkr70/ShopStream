"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { tokens } from "../tokens";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#FF5200 0%,#FF7A3D 60%,#FFB07A 100%)",
        color: tokens.color.text,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(600px at var(--mx,50%) var(--my,40%), rgba(255,255,255,0.55), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-4 py-12 md:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-pill bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Free delivery above ₹499
          </span>
          <h1
            className="mt-4 font-extrabold leading-[1.1] text-white"
            style={{ fontFamily: tokens.font.display }}
          >
            <span className="block text-4xl md:text-6xl">Stream shopping,</span>
            <span className="block text-4xl md:text-6xl">the Swiggy way.</span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-white/90 md:text-lg">
            Fashion, electronics, grocery & more — delivered fast to your door.
          </p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex w-full max-w-xl flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-textMuted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search "shoes", "milk", "iPhone"...'
                className="h-14 w-full rounded-pill bg-white pl-12 pr-4 text-base text-text shadow-md placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-white px-6 text-base font-bold text-brand shadow-md hover:bg-white/90"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = `/search?q=${encodeURIComponent(q)}`;
                }
              }}
            >
              <MapPin className="h-4 w-4" />
              Shop now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
