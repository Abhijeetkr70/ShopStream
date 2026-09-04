import { Link2 } from "lucide-react";
import Link from "next/link";
import { tokens } from "../tokens";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "Fashion", href: "/category/fashion" },
      { label: "Electronics", href: "/category/electronics" },
      { label: "Grocery", href: "/category/grocery" },
      { label: "Beauty", href: "/category/beauty" },
      { label: "Home", href: "/category/home" },
      { label: "Books", href: "/category/books" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track order", href: "/orders" },
      { label: "Returns", href: "/help/returns" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Contact", href: "/help/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/about/careers" },
      { label: "Press", href: "/about/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Refund policy", href: "/legal/refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="mt-12"
      style={{ backgroundColor: tokens.color.surfaceDark, color: "#E2E8F0" }}
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
              {c.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 py-6 text-xs md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link2 className="h-4 w-4" />
            <span>Secure payments by Razorpay · UPI · Cards · NetBanking</span>
          </div>
          <div>
            Built by{" "}
            <Link href="/author/shopstream" className="font-semibold text-white hover:underline">
              {tokens.font.display === "Manrope, system-ui, sans-serif" ? "ShopStream Team" : "ShopStream Team"}
            </Link>{" "}
            · © {new Date().getFullYear()} ShopStream
          </div>
        </div>
      </div>
    </footer>
  );
}
