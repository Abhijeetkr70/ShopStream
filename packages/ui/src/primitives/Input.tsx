"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border bg-white px-3 text-sm text-text placeholder:text-textMuted transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-1",
        invalid ? "border-danger focus:ring-danger" : "border-border hover:border-borderStrong",
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = "Input";
