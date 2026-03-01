"use client"

import { Search, Download, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Filing {
  type: "Federal" | "State" | "Local"
  name: string
  jurisdiction: string
  createdBy: "Rippling" | "Client"
  dueDate: string
  year: number
  status: "filed" | "in-progress" | "upcoming"
  statusDetail: string
}

const filings: Filing[] = [
  {
    type: "State",
    name: "NY Paid Family Leave Annual Statement",
    jurisdiction: "NY",
    createdBy: "Rippling",
    dueDate: "Mar 1, 2026",
    year: 2026,
    status: "in-progress",
    statusDetail: "Preparing filing",
  },
  {
    type: "Federal",
    name: "VETS-4212 Report",
    jurisdiction: "Federal",
    createdBy: "Rippling",
    dueDate: "Sep 30, 2026",
    year: 2026,
    status: "upcoming",
    statusDetail: "Scheduled",
  },
  {
    type: "Federal",
    name: "EEO-1 Component 1 Report",
    jurisdiction: "Federal",
    createdBy: "Rippling",
    dueDate: "Mar 31, 2026",
    year: 2026,
    status: "filed",
    statusDetail: "Filed Feb 17, 2026",
  },
  {
    type: "Federal",
    name: "ACA 1094-C / 1095-C",
    jurisdiction: "Federal",
    createdBy: "Rippling",
    dueDate: "Feb 28, 2026",
    year: 2026,
    status: "filed",
    statusDetail: "Filed Feb 14, 2026",
  },
  {
    type: "State",
    name: "California Pay Data Report (SB 973)",
    jurisdiction: "CA",
    createdBy: "Rippling",
    dueDate: "Mar 31, 2026",
    year: 2026,
    status: "filed",
    statusDetail: "Filed Feb 10, 2026",
  },
  {
    type: "Local",
    name: "Healthy SF Expenditure Report",
    jurisdiction: "San Francisco, CA",
    createdBy: "Client",
    dueDate: "Apr 30, 2026",
    year: 2026,
    status: "filed",
    statusDetail: "Filed Feb 8, 2026",
  },
  // 2025 filings
  {
    type: "Federal",
    name: "EEO-1 Component 1 Report",
    jurisdiction: "Federal",
    createdBy: "Rippling",
    dueDate: "Mar 31, 2025",
    year: 2025,
    status: "filed",
    statusDetail: "Filed Feb 20, 2025",
  },
  {
    type: "Federal",
    name: "ACA 1094-C / 1095-C",
    jurisdiction: "Federal",
    createdBy: "Rippling",
    dueDate: "Feb 28, 2025",
    year: 2025,
    status: "filed",
    statusDetail: "Filed Feb 10, 2025",
  },
]

const statusOrder = { "in-progress": 0, upcoming: 1, filed: 2 }

const typeBadgeStyle: Record<string, string> = {
  Federal: "bg-primary/10 text-primary border-primary/20",
  State: "bg-amber-50 text-amber-700 border-amber-200",
  Local: "bg-sky-50 text-sky-700 border-sky-200",
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  filed: { dot: "bg-emerald-500", label: "Filed" },
  "in-progress": { dot: "bg-amber-400", label: "In Progress" },
  upcoming: { dot: "bg-gray-400", label: "Upcoming" },
}

const availableYears = [2026, 2025, 2024]

export function AdditionalFilings() {
  const [search, setSearch] = useState("")
  const [selectedYear, setSelectedYear] = useState("2026")

  const filtered = filings
    .filter((f) => f.year === parseInt(selectedYear))
    .filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Compliance Filings
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search filings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jurisdiction</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Filing Name</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Due Date</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Created By</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="w-28 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((filing, index) => {
                  const sc = statusConfig[filing.status]
                  return (
                    <tr
                      key={index}
                      className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-accent/50"
                    >
                      <td className="px-6 py-4 align-top">
                        <Badge variant="outline" className={`text-[11px] font-medium ${typeBadgeStyle[filing.type]}`}>
                          {filing.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm font-bold text-foreground">{filing.jurisdiction}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-foreground">{filing.name}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-foreground">{filing.dueDate}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <Badge
                          variant="outline"
                          className={
                            filing.createdBy === "Rippling"
                              ? "border-primary/20 bg-primary/5 text-[11px] font-medium text-primary"
                              : "border-border bg-muted/50 text-[11px] font-medium text-muted-foreground"
                          }
                        >
                          {filing.createdBy}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${sc.dot}`} />
                            <span className="text-sm font-semibold text-foreground">{sc.label}</span>
                          </div>
                          <p className="pl-[18px] text-xs leading-relaxed text-muted-foreground">
                            {filing.statusDetail}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        {filing.status === "filed" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-sm text-muted-foreground">
                      No filings match your search for {selectedYear}.
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
