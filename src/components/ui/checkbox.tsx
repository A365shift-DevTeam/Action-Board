import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <div className="relative flex items-center justify-center w-5 h-5">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            ref={ref}
            {...props}
          />
          <div className={cn(
            "w-5 h-5 border-2 rounded transition-all duration-200",
            checked
              ? "bg-brand-600 border-brand-600 shadow-sm shadow-brand-600/20"
              : "border-slate-300 bg-white hover:border-slate-400",
            className
          )}>
            {checked && <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" strokeWidth={3} />}
          </div>
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
