import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-12 rounded-full border border-white/10 bg-noir/80 px-4 text-sm text-cream outline-none transition placeholder:text-cream/30 focus:border-gold/70 focus:bg-noir",
        className
      )}
      {...props}
    />
  );
}
