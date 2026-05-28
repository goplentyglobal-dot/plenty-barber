import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "gold" | "outline" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-noir hover:bg-gold-light shadow-gold",
  outline: "border border-gold/35 text-cream hover:border-gold hover:bg-gold/10",
  ghost: "text-cream/78 hover:bg-white/5 hover:text-cream"
};

export function Button({
  className,
  variant = "gold",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-noir disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
