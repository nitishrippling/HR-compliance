"use client"

import { Clock, Building2, MapPin, Landmark, FileText } from "lucide-react"
import type { ReactNode } from "react"

const kpis: { icon: ReactNode; value: string; label: string }[] = [
  {
    icon: <Clock className="h-5 w-5" />,
    value: "62+",
    label: "Estimated Hours Saved",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    value: "18",
    label: "State Registrations Completed",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    value: "5",
    label: "Local Registrations Completed",
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    value: "6",
    label: "Foreign Qualifications Completed",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    value: "14",
    label: "Additional Filings Done",
  },
]

export function YourImpact() {
  return (
    <section>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-6 text-center"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {kpi.icon}
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {kpi.value}
            </span>
            <span className="mt-1 text-xs leading-tight text-muted-foreground">
              {kpi.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
