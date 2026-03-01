"use client"

import { Search, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Qualification {
  state: string
  sosRegistrationNumber: string
  createdBy: "Rippling" | "Client"
  status: "complete" | "pending" | "action-required"
  statusDetail: string
  dueDate?: string
  actionRequired?: boolean
}

const qualifications: Qualification[] = [
  {
    state: "WA",
    sosRegistrationNumber: "Pending",
    createdBy: "Rippling",
    status: "action-required",
    statusDetail: "Certificate of Good Standing expired",
    dueDate: "Due Mar 5, 2026",
    actionRequired: true,
  },
  {
    state: "TX",
    sosRegistrationNumber: "Pending",
    createdBy: "Rippling",
    status: "pending",
    statusDetail: "Filed Feb 3, 2026",
  },
  {
    state: "CA",
    sosRegistrationNumber: "C4821456",
    createdBy: "Rippling",
    status: "complete",
    statusDetail: "Registration active",
  },
  {
    state: "NY",
    sosRegistrationNumber: "NY-6789012",
    createdBy: "Client",
    status: "complete",
    statusDetail: "Registration active",
  },
  {
    state: "IL",
    sosRegistrationNumber: "LLC-00123456",
    createdBy: "Rippling",
    status: "complete",
    statusDetail: "Registration active",
  },
  {
    state: "FL",
    sosRegistrationNumber: "L26000012345",
    createdBy: "Rippling",
    status: "complete",
    statusDetail: "Registration active",
  },
]

const statusOrder = { "action-required": 0, pending: 1, complete: 2 }

const statusConfig: Record<string, { dot: string; label: string }> = {
  "action-required": { dot: "bg-red-500", label: "Action Required" },
  pending: { dot: "bg-amber-400", label: "Pending" },
  complete: { dot: "bg-emerald-500", label: "Complete" },
}

export function ForeignQualification() {
  const [search, setSearch] = useState("")

  const filtered = qualifications
    .filter(
      (q) =>
        q.state.toLowerCase().includes(search.toLowerCase()) ||
        q.sosRegistrationNumber.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Foreign Qualifications
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search qualifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">State</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">SoS Registration #</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Created By</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="w-10 px-3 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, index) => {
                  const sc = statusConfig[q.status]
                  return (
                    <tr
                      key={index}
                      className="group cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-accent/50"
                    >
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm font-bold text-foreground">{q.state}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono text-sm text-foreground">{q.sosRegistrationNumber}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <Badge
                          variant="outline"
                          className={
                            q.createdBy === "Rippling"
                              ? "border-primary/20 bg-primary/5 text-[11px] font-medium text-primary"
                              : "border-border bg-muted/50 text-[11px] font-medium text-muted-foreground"
                          }
                        >
                          {q.createdBy}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${sc.dot}`} />
                            <span className="text-sm font-semibold text-foreground">{sc.label}</span>
                          </div>
                          <p className="pl-[18px] text-xs leading-relaxed text-muted-foreground">
                            {q.statusDetail}
                          </p>
                          {q.dueDate && (
                            <p className="pl-[18px] text-xs font-medium text-destructive">
                              {q.dueDate}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        {q.actionRequired && (
                          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary">
                            <ExternalLink className="h-3 w-3" />
                            Take Action
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-muted-foreground">
                      No qualifications match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
