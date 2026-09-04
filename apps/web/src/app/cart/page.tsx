"use client";

import { TopBar, Footer, CartDrawer } from "@shopstream/ui";
import { useCartStore } from "@shopstream/ui";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { inr } from "@shopstream/lib";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());
  const shipping = subtotal > 49900 || subtotal === 0 ? 0 : 4900;
  const total = subtotal + shipping;

  return (
    <>
      <TopBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Your cart</h1>
        {lines.length === 0 ? (
          <div className="mt-8 rounded-md border border-border bg-surfaceMuted p-6 text-center">
            <p className="font-semibold">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brandDark"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-white">
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surfaceMuted">
                    <Image src={l.image} alt={l.title} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${l.slug}`}
                      className="font-semibold hover:underline"
                    >
                      {l.title}
                    </Link>
                    <div className="mt-1 font-mono text-sm font-bold">{inr(l.unitPrice)}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex h-9 items-center rounded-md border border-brand">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.productId, l.quantity - 1)}
                          className="flex h-full w-9 items-center justify-center text-brand"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-9 text-center font-mono text-sm font-bold text-brand">
                          {l.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.productId, l.quantity + 1)}
                          className="flex h-full w-9 items-center justify-center text-brand"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${l.title}`}
                        onClick={() => remove(l.productId)}
                        className="text-textSecondary hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="mt-6 rounded-lg border border-border bg-white p-4">
              <h2 className="text-lg font-bold">Order summary</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-mono">{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="font-mono">{shipping === 0 ? "Free" : inr(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="font-mono">{inr(total)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-brand text-base font-bold text-white hover:bg-brandDark"
              >
                Checkout
              </Link>
            </aside>
          </>
        )}
      </main>
      <Footer />
      <CartDrawer open={false} onClose={() => undefined} />
    </>
  );
}
