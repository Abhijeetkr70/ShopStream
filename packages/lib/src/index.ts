export const BRAND = {
  name: "ShopStream",
  domain: "shopstream.app",
  legalName: "ShopStream Commerce Pvt. Ltd.",
  tagline: "Stream shopping, the Swiggy way.",
  primary: "#FF5200",
  supportEmail: "support@shopstream.app",
  author: {
    name: "ShopStream Team",
    handle: "shopstream",
    jobTitle: "Founder & Engineering",
    url: "https://shopstream.app/author/shopstream",
  },
} as const;

export const ROUTES = {
  home: "/",
  search: "/search",
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders",
  wishlist: "/wishlist",
  account: "/account",
  about: "/about",
  author: (handle = BRAND.author.handle) => `/author/${handle}`,
  category: (slug: string) => `/category/${slug}`,
  product: (slug: string) => `/product/${slug}`,
  trackOrder: (id: string) => `/orders/${id}/track`,
} as const;

export const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
] as const;

export function inr(amountPaise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

export function pct(num: number, denom: number): number {
  if (denom <= 0) return 0;
  return Math.round((num / denom) * 100);
}

export function discountPct(mrp: number, sale: number): number {
  if (mrp <= 0 || sale >= mrp) return 0;
  return Math.round(((mrp - sale) / mrp) * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function ttl(seconds: number): number {
  return Math.floor(Date.now() / 1000) + seconds;
}

export const COOKIES = {
  jwt: "ss_jwt",
  csrf: "ss_csrf",
  cart: "ss_cart",
  locale: "ss_locale",
} as const;

export const CACHE_KEYS = {
  categoryList: (slug?: string) => `cat:${slug ?? "root"}`,
  product: (slug: string) => `prod:${slug}`,
  search: (q: string) => `search:${q}`,
  rateLimit: (ip: string, route: string) => `rl:${route}:${ip}`,
} as const;
