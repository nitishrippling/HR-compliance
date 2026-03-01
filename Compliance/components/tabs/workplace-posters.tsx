"use client"

import { Download, Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Poster {
  state: string
  posterSet: string
  postersDistributed: number
  employees: number
}

const posters: Poster[] = [
  {
    state: "CA",
    posterSet: "California All-In-One Labor Law Poster",
    postersDistributed: 12,
    employees: 45,
  },
  {
    state: "NY",
    posterSet: "New York All-In-One Labor Law Poster",
    postersDistributed: 8,
    employees: 32,
  },
  {
    state: "TX",
    posterSet: "Texas All-In-One Labor Law Poster",
    postersDistributed: 6,
    employees: 28,
  },
  {
    state: "FL",
    posterSet: "Florida All-In-One Labor Law Poster",
    postersDistributed: 4,
    employees: 15,
  },
  {
    state: "IL",
    posterSet: "Illinois All-In-One Labor Law Poster",
    postersDistributed: 5,
    employees: 18,
  },
  {
    state: "OH",
    posterSet: "Ohio All-In-One Labor Law Poster",
    postersDistributed: 3,
    employees: 12,
  },
  {
    state: "WA",
    posterSet: "Washington All-In-One Labor Law Poster",
    postersDistributed: 2,
    employees: 9,
  },
  {
    state: "NC",
    posterSet: "North Carolina All-In-One Labor Law Poster",
    postersDistributed: 3,
    employees: 14,
  },
]

export function WorkplacePosters() {
  const [search, setSearch] = useState("")

  const filtered = posters
    .filter(
      (p) =>
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.posterSet.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.employees - a.employees)

  const totalDistributed = posters.reduce((sum, p) => sum + p.postersDistributed, 0)

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              All Workplace Posters
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {totalDistributed} posters distributed across {posters.length} states
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posters..."
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
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Poster Set</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Posters Distributed</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Employees</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((poster, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-b-0 transition-colors hover:bg-accent/50"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-foreground">{poster.state}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">{poster.posterSet}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">{poster.postersDistributed}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{poster.employees}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No posters match your search.
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
