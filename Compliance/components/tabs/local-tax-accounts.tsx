"use client"

import { Search, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface LocalTaxAccount {
  type: "Municipal" | "County" | "School District"
  locality: string
  state: string
  agencyName: string
  accountNumber: string
  createdBy: "Rippling" | "Client"
  taxRate?: string
  status: "completed" | "in-progress" | "blocked"
  statusDetail: string
  dueDate?: string
  actionRequired?: boolean
}

const accounts: LocalTaxAccount[] = [
  {
    type: "Municipal",
    locality: "Philadelphia",
    state: "PA",
    agencyName: "Philadelphia Revenue Dept",
    accountNumber: "Pending",
    createdBy: "Rippling",
    status: "blocked",
    statusDetail: "Your action required",
    dueDate: "Due Mar 1, 2026",
    actionRequired: true,
  },
  {
    type: "School District",
    locality: "Lakota",
    state: "OH",
    agencyName: "Lakota School District Tax Office",
    accountNumber: "Pending",
    createdBy: "Rippling",
    status: "in-progress",
    statusDetail: "Submitted Feb 15, 2026",
  },
  {
    type: "Municipal",
    locality: "Westerville",
    state: "OH",
    agencyName: "Westerville Income Tax Dept",
    accountNumber: "WV-001234",
    createdBy: "Rippling",
    taxRate: "2.0%",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "Municipal",
    locality: "Columbus",
    state: "OH",
    agencyName: "Columbus Income Tax Division",
    accountNumber: "COL-998877",
    createdBy: "Rippling",
    taxRate: "2.5%",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "County",
    locality: "Marion County",
    state: "IN",
    agencyName: "Marion County Tax Office",
    accountNumber: "MC-554433",
    createdBy: "Client",
    taxRate: "1.77%",
    status: "completed",
    statusDetail: "Account active",
  },
]

const statusOrder = { blocked: 0, "in-progress": 1, completed: 2 }

const typeBadgeStyle: Record<string, string> = {
  Municipal: "bg-primary/10 text-primary border-primary/20",
  County: "bg-sky-50 text-sky-700 border-sky-200",
  "School District": "bg-amber-50 text-amber-700 border-amber-200",
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  blocked: { dot: "bg-red-500", label: "Blocked" },
  "in-progress": { dot: "bg-amber-400", label: "In Progress" },
  completed: { dot: "bg-emerald-500", label: "Completed" },
}

export function LocalTaxAccounts() {
  const [search, setSearch] = useState("")

  const filtered = accounts
    .filter(
      (a) =>
        a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        a.locality.toLowerCase().includes(search.toLowerCase()) ||
        a.state.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Local Tax Accounts
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
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
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Locality</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Agency Name</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{"Account #"}</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Created By</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="w-10 px-3 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((account, index) => {
                  const sc = statusConfig[account.status]
                  return (
                    <tr
                      key={index}
                      className="group cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-accent/50"
                    >
                      <td className="px-6 py-4 align-top">
                        <Badge variant="outline" className={`text-[11px] font-medium ${typeBadgeStyle[account.type]}`}>
                          {account.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div>
                          <span className="text-sm font-bold text-foreground">{account.locality}</span>
                          <span className="text-sm text-muted-foreground">{`, ${account.state}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-foreground">{account.agencyName}</span>
                        {account.taxRate && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {"Rate: "}
                            <span className="font-medium">{account.taxRate}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono text-sm text-foreground">{account.accountNumber}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <Badge
                          variant="outline"
                          className={
                            account.createdBy === "Rippling"
                              ? "border-primary/20 bg-primary/5 text-[11px] font-medium text-primary"
                              : "border-border bg-muted/50 text-[11px] font-medium text-muted-foreground"
                          }
                        >
                          {account.createdBy}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${sc.dot}`} />
                            <span className="text-sm font-semibold text-foreground">{sc.label}</span>
                          </div>
                          <p className="pl-[18px] text-xs leading-relaxed text-muted-foreground">
                            {account.statusDetail}
                          </p>
                          {account.dueDate && (
                            <p className="pl-[18px] text-xs font-medium text-destructive">
                              {account.dueDate}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        {account.actionRequired && (
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
                    <td colSpan={7} className="px-6 py-16 text-center text-sm text-muted-foreground">
                      No accounts match your search.
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
