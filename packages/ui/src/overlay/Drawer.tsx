"use client";

import { useEffect, useRef } from "react";
import { cn } from "../cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
}: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          "absolute top-0 h-full w-full max-w-md bg-white shadow-lg focus:outline-none",
          "animate-[drawer-slide_0.24s_cubic-bezier(.2,.8,.2,1)]",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-textSecondary hover:bg-surfaceMuted"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
