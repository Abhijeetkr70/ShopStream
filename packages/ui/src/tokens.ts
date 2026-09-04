export const tokens = {
  color: {
    brand: "#FF5200",
    brandDark: "#E64A00",
    brandSoft: "#FFE6DA",
    accent: "#16A34A",
    warning: "#F59E0B",
    info: "#2563EB",
    danger: "#DC2626",
    surface: "#FFFFFF",
    surfaceMuted: "#F7F7F7",
    surfaceDark: "#0F172A",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E5E7EB",
    borderStrong: "#CBD5E1",
  },
  radius: { xs: "4px", sm: "8px", md: "12px", lg: "20px", pill: "9999px" },
  font: {
    display: "Manrope, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, ui-monospace, monospace",
  },
} as const;

export type Tokens = typeof tokens;
