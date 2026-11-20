import * as React from "react"
import { cn } from "@/lib/utils"

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-4 py-1.5",
        "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
