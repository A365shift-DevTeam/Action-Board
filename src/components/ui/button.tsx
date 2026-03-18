import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
          {
            "bg-brand-600 text-white shadow-md shadow-brand-600/15 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20": variant === "default",
            "bg-amber-500 text-white shadow-md shadow-amber-500/15 hover:bg-amber-600": variant === "secondary",
            "bg-red-500 text-white shadow-md shadow-red-500/15 hover:bg-red-600": variant === "destructive",
            "border border-[var(--color-border-emphasis)] bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900": variant === "outline",
            "hover:bg-slate-100 text-slate-600 hover:text-slate-900": variant === "ghost",
            "h-11 px-5 py-2": size === "default",
            "h-9 rounded-lg px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
