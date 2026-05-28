import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("luxury-panel rounded-lg p-5 backdrop-blur", className)} {...props} />;
}
