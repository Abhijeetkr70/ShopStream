import type { Metadata, Viewport } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import { BRAND } from "@shopstream/lib";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { ToastHost } from "@shopstream/ui";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#FF5200",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "ShopStream is a Swiggy-style e-commerce experience: discover fashion, electronics, grocery and more, with fast delivery across India.",
  applicationName: BRAND.name,
  keywords: [
    "ShopStream",
    "e-commerce",
    "online shopping India",
    "fashion",
    "electronics",
    "grocery",
    "beauty",
    "home",
    "books",
    "fast delivery",
  ],
  authors: [{ name: BRAND.author.name, url: BRAND.author.url }],
  creator: BRAND.author.name,
  publisher: BRAND.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/llms-full.txt",
    },
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Stream shopping the Swiggy way. Fashion, electronics, grocery and more.",
    locale: "en_IN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description:
      "Stream shopping the Swiggy way. Fashion, electronics, grocery and more.",
    creator: "@shopstream",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  category: "shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${mono.variable}`}
    >
      <body className="bg-white text-text antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <ToastHost />
      </body>
    </html>
  );
}
