import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF5200",
          dark: "#E64A00",
          soft: "#FFE6DA",
        },
        accent: "#16A34A",
        warning: "#F59E0B",
        info: "#2563EB",
        danger: "#DC2626",
        surface: { DEFAULT: "#FFFFFF", muted: "#F7F7F7", dark: "#0F172A" },
        text: { DEFAULT: "#0F172A", secondary: "#475569", muted: "#94A3B8" },
        border: { DEFAULT: "#E5E7EB", strong: "#CBD5E1" },
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        pill: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15,23,42,0.06)",
        sm: "0 2px 8px rgba(15,23,42,0.08)",
        md: "0 8px 24px rgba(15,23,42,0.10)",
        lg: "0 20px 48px rgba(15,23,42,0.14)",
      },
      keyframes: {
        "drawer-slide": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "drawer-slide": "drawer-slide 0.24s cubic-bezier(.2,.8,.2,1)",
        "slide-in": "slide-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
