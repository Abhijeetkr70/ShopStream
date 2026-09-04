"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      add: (line, qty = 1) =>
        set((s) => {
          const i = s.lines.findIndex((l) => l.productId === line.productId);
          if (i >= 0) {
            const next = [...s.lines];
            next[i] = { ...next[i]!, quantity: Math.min(99, next[i]!.quantity + qty) };
            return { lines: next };
          }
          return { lines: [...s.lines, { ...line, quantity: Math.min(99, qty) }] };
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity: Math.min(99, qty) } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((acc, l) => acc + l.quantity, 0),
      subtotal: () => get().lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0),
    }),
    {
      name: "ss_cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
