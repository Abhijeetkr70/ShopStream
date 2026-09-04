"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brandDark active:scale-[0.98] disabled:opacity-50",
  secondary:
    "bg-brandSoft text-brand hover:bg-brandSoft/80 active:scale-[0.98] disabled:opacity-50",
  ghost:
    "bg-transparent text-text hover:bg-surfaceMuted active:scale-[0.98] disabled:opacity-50",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:scale-[0.98] disabled:opacity-50",
  outline:
    "bg-white text-text border border-border hover:bg-surfaceMuted active:scale-[0.98] disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-11 px-4 text-sm rounded-md",
  lg: "h-14 px-6 text-base rounded-lg",
  icon: "h-10 w-10 rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-[background-color,transform,opacity] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
