import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border-transparent bg-brand-50 text-brand-700": variant === "default",
          "border-transparent bg-slate-100 text-slate-600": variant === "secondary",
          "border-transparent bg-red-50 text-red-700": variant === "destructive",
          "border-transparent bg-emerald-50 text-emerald-700": variant === "success",
          "border-transparent bg-amber-50 text-amber-700": variant === "warning",
          "border-[var(--color-border-default)] text-slate-600": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
