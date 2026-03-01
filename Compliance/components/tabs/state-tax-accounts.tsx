"use client"

import { Search, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TaxAccount {
  type: "Withholding" | "SUI" | "Unemployment"
  state: string
  agencyName: string
  accountNumber: string
  createdBy: "Rippling" | "Client"
  suiRate?: string
  status: "completed" | "in-progress" | "blocked"
  statusDetail: string
  dueDate?: string
  actionRequired?: boolean
}

const accounts: TaxAccount[] = [
  {
    type: "Withholding",
    state: "TX",
    agencyName: "Texas Workforce Commission",
    accountNumber: "Pending",
    createdBy: "Rippling",
    status: "blocked",
    statusDetail: "Your action required",
    dueDate: "Due Feb 28, 2026",
    actionRequired: true,
  },
  {
    type: "SUI",
    state: "NJ",
    agencyName: "NJ Department of Labor",
    accountNumber: "Pending",
    createdBy: "Rippling",
    status: "blocked",
    statusDetail: "Waiting on NJ Department of Labor",
  },
  {
    type: "Withholding",
    state: "OH",
    agencyName: "Ohio Dept of Taxation",
    accountNumber: "Pending",
    createdBy: "Rippling",
    status: "in-progress",
    statusDetail: "Submitted Feb 12, 2026",
  },
  {
    type: "Withholding",
    state: "CA",
    agencyName: "California EDD",
    accountNumber: "CA-998877",
    createdBy: "Rippling",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "Withholding",
    state: "NC",
    agencyName: "NC Dept of Revenue",
    accountNumber: "NC-88776655",
    createdBy: "Rippling",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "SUI",
    state: "FL",
    agencyName: "Florida Dept of Revenue",
    accountNumber: "1234567",
    createdBy: "Rippling",
    suiRate: "2.7%",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "Withholding",
    state: "NY",
    agencyName: "NY Dept of Taxation",
    accountNumber: "NY-44332211",
    createdBy: "Client",
    status: "completed",
    statusDetail: "Account active",
  },
  {
    type: "SUI",
    state: "TX",
    agencyName: "Texas Workforce Commission",
    accountNumber: "TX-9988776",
    createdBy: "Rippling",
    suiRate: "1.82%",
    status: "completed",
    statusDetail: "Account active",
  },
]

const statusOrder = { blocked: 0, "in-progress": 1, completed: 2 }

const typeBadgeStyle: Record<string, string> = {
  Withholding: "bg-primary/10 text-primary border-primary/20",
  SUI: "bg-amber-50 text-amber-700 border-amber-200",
  Unemployment: "bg-orange-50 text-orange-700 border-orange-200",
}

const statusConfig: Record<string, { dot: string; label: string }> = {
  blocked: { dot: "bg-red-500", label: "Blocked" },
  "in-progress": { dot: "bg-amber-400", label: "In Progress" },
  completed: { dot: "bg-emerald-500", label: "Completed" },
}

export function StateTaxAccounts() {
  const [search, setSearch] = useState("")

  const filtered = accounts
    .filter(
      (a) =>
        a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        a.state.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All State Tax Accounts
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
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">State</th>
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
                        <span className="text-sm font-bold text-foreground">{account.state}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-sm text-foreground">{account.agencyName}</span>
                        {account.suiRate && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {"SUI Rate: "}
                            <span className="font-medium">{account.suiRate}</span>
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
