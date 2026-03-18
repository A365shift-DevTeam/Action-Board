import * as React from "react"
import { cn } from "@/src/lib/utils"
import { motion } from "motion/react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  indicatorColor?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorColor = "bg-brand-500", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn("h-full rounded-full", indicatorColor)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value || 0, 100)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
