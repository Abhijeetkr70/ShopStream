"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../cn";

type ToastTone = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

type ToastListener = (t: ToastItem) => void;

class ToastBus {
  private listeners = new Set<ToastListener>();
  subscribe(fn: ToastListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  push(t: Omit<ToastItem, "id">) {
    const item: ToastItem = { id: crypto.randomUUID(), duration: 4000, ...t };
    this.listeners.forEach((fn) => fn(item));
  }
}

export const toast = new ToastBus();

const tones: Record<ToastTone, string> = {
  success: "border-l-4 border-accent",
  error: "border-l-4 border-danger",
  info: "border-l-4 border-info",
  warning: "border-l-4 border-warning",
};

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = toast.subscribe((t) => {
      setItems((prev) => [...prev, t]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== t.id));
      }, t.duration ?? 4000);
    });
    return () => {
      unsub();
    };
  }, []);

  if (!mounted) return null;
  return createPortal(
    <div
      aria-live="polite"
      aria-atomic
      className="pointer-events-none fixed bottom-4 right-4 z-[400] flex w-full max-w-sm flex-col gap-2"
    >
      {items.map((i) => (
        <div
          key={i.id}
          className={cn(
            "pointer-events-auto rounded-md border border-border bg-white p-3 shadow-md",
            "animate-[slide-in_0.2s_ease-out]",
            tones[i.tone ?? "info"],
          )}
          role="status"
        >
          <div className="text-sm font-semibold text-text">{i.title}</div>
          {i.description && (
            <div className="mt-0.5 text-sm text-textSecondary">{i.description}</div>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
}
