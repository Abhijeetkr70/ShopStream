"use client";

import { useCartStore } from "../state/useCartStore";
import { Button } from "../primitives/Button";
import { Drawer } from "../overlay/Drawer";
import { inr } from "@shopstream/lib";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = lines.reduce((a, l) => a + l.quantity, 0);

  return (
    <Drawer open={open} onClose={onClose} side="right" title={`Your cart (${totalItems})`}>
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
          <p className="text-base text-textSecondary">Your cart is empty.</p>
          <Link
            href="/"
            onClick={onClose}
            className="mt-4 text-sm font-semibold text-brand hover:underline"
          >
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-border">
            {lines.map((l) => (
              <li key={l.productId} className="flex gap-3 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surfaceMuted">
                  <Image src={l.image} alt={l.title} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/product/${l.slug}`}
                    className="text-sm font-semibold text-text hover:underline"
                  >
                    {l.title}
                  </Link>
                  <div className="mt-1 font-mono text-sm font-bold">{inr(l.unitPrice)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex h-8 items-center rounded-md border border-brand">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(l.productId, l.quantity - 1)}
                        className="flex h-full w-8 items-center justify-center text-brand"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-mono text-sm font-bold text-brand">
                        {l.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(l.productId, l.quantity + 1)}
                        className="flex h-full w-8 items-center justify-center text-brand"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(l.productId)}
                      aria-label={`Remove ${l.title}`}
                      className="text-textSecondary hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-textSecondary">Subtotal</span>
              <span className="font-mono text-base font-bold">{inr(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <Button fullWidth size="lg">
                Checkout
              </Button>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full text-center text-sm font-semibold text-textSecondary hover:text-text"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
