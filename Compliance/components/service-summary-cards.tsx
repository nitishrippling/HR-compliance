"use client"

import type { TabId } from "@/components/page-tabs"
import {
  ScrollText,
  Building,
  FileText,
  Building2,
  ClipboardList,
  ChevronRight,
} from "lucide-react"

interface ServiceSummary {
  tabId: TabId
  icon: React.ReactNode
  title: string
  description: string
  counts: { label: string; count: number; color: string }[]
}

const services: ServiceSummary[] = [
  {
    tabId: "state-tax",
    icon: <ScrollText className="h-5 w-5" />,
    title: "State Tax Accounts",
    description: "Withholding & SUI account registrations across all states.",
    counts: [
      { label: "Completed", count: 5, color: "bg-[#4CAF50]" },
      { label: "In Progress", count: 1, color: "bg-[#FF9800]" },
      { label: "Blocked", count: 2, color: "bg-destructive" },
    ],
  },
  {
    tabId: "local-tax",
    icon: <Building className="h-5 w-5" />,
    title: "Local Tax Accounts",
    description: "Municipal, county, and school district tax accounts.",
    counts: [
      { label: "Completed", count: 3, color: "bg-[#4CAF50]" },
      { label: "In Progress", count: 1, color: "bg-[#FF9800]" },
      { label: "Blocked", count: 1, color: "bg-destructive" },
    ],
  },
  {
    tabId: "foreign-qual",
    icon: <Building2 className="h-5 w-5" />,
    title: "Foreign Qualification",
    description: "Entity qualification & registered agent management.",
    counts: [
      { label: "Qualified", count: 4, color: "bg-[#4CAF50]" },
      { label: "Pending", count: 1, color: "bg-[#FF9800]" },
      { label: "Action Required", count: 1, color: "bg-destructive" },
    ],
  },
  {
    tabId: "additional-filings",
    icon: <FileText className="h-5 w-5" />,
    title: "Additional Filings",
    description: "Federal, state, and local compliance filings.",
    counts: [
      { label: "Filed", count: 4, color: "bg-[#4CAF50]" },
      { label: "In Progress", count: 1, color: "bg-[#FF9800]" },
      { label: "Upcoming", count: 1, color: "bg-muted-foreground" },
    ],
  },
  {
    tabId: "workplace-posters",
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Workplace Posters",
    description: "Labor law poster distribution & compliance tracking.",
    counts: [
      { label: "Current", count: 6, color: "bg-[#4CAF50]" },
      { label: "Update Available", count: 2, color: "bg-[#FF9800]" },
    ],
  },
]

export function ServiceSummaryCards({
  onNavigate,
}: {
  onNavigate: (tabId: TabId) => void
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Service Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Click any card to view full details and manage items.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.tabId}
            type="button"
            onClick={() => onNavigate(service.tabId)}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {service.icon}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Title */}
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {service.title}
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {service.description}
            </p>

            {/* Counts */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {service.counts.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${c.color}`} />
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{c.count}</span>{" "}
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
