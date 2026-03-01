import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

interface StatusCount {
  label: string
  count: number
  color: string
}

interface Highlight {
  title: string
  detail: string
}

interface ServiceBucketProps {
  icon: ReactNode
  title: string
  statuses: StatusCount[]
  highlights: Highlight[]
  ctaLabel: string
}

export function ServiceBucket({
  icon,
  title,
  statuses,
  highlights,
  ctaLabel,
}: ServiceBucketProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-border px-5 py-3">
        {statuses.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{s.count}</span>{" "}
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-0 px-0">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border-b border-border px-5 py-3 last:border-b-0"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
            <div>
              <p className="text-sm font-medium text-foreground">{h.title}</p>
              <p className="text-xs text-muted-foreground">{h.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {ctaLabel}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
