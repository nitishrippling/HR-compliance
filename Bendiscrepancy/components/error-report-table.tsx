"use client"

import { useState } from "react"
import { Search, LayoutGrid, SlidersHorizontal, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ErrorReportRow } from "@/lib/data"

interface ErrorReportTableProps {
  data: ErrorReportRow[]
  onRowClick: (row: ErrorReportRow) => void
}

function PlainHead({ children }: { children: React.ReactNode }) {
  return (
    <TableHead className="text-xs text-muted-foreground font-medium whitespace-nowrap">
      {children}
    </TableHead>
  )
}

function SortHead({ children, sortKey, currentSort, onSort }: { children: React.ReactNode; sortKey: string; currentSort: { key: string; dir: "asc" | "desc" } | null; onSort: (key: string) => void }) {
  const isActive = currentSort?.key === sortKey
  return (
    <TableHead
      className="text-xs text-muted-foreground font-medium whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {isActive ? (
          currentSort?.dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </span>
    </TableHead>
  )
}

export function ErrorReportTable({ data, onRowClick }: ErrorReportTableProps) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.dir === "asc" ? { key, dir: "desc" } : null
      }
      return { key, dir: "asc" }
    })
  }

  const toggleAll = () => {
    setSelected(selected.length === data.length ? [] : data.map(r => r.id))
  }

  const toggleRow = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Grid title</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Assigned to me</Button>
          <Button variant="outline" size="icon-sm" aria-label="Grid view">
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9 h-9" />
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={selected.length === data.length && data.length > 0}
                onCheckedChange={toggleAll}
                aria-label="Select all rows"
              />
            </TableHead>
            <PlainHead>SFDC</PlainHead>
            <PlainHead>Company</PlainHead>
            <PlainHead>Carrier</PlainHead>
            <PlainHead>Assignee</PlainHead>
            <PlainHead>Status</PlainHead>
            <SortHead sortKey="sla" currentSort={sort} onSort={handleSort}>SLA</SortHead>
            <SortHead sortKey="createdAt" currentSort={sort} onSort={handleSort}>Created at</SortHead>
            <SortHead sortKey="issues" currentSort={sort} onSort={handleSort}>Issues</SortHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer group"
              onClick={() => onRowClick(row)}
            >
              <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selected.includes(row.id)}
                  onCheckedChange={() => toggleRow(row.id)}
                  aria-label={`Select ${row.company}`}
                />
              </TableCell>
              <TableCell className="text-sm text-foreground">{row.sfdc}</TableCell>
              <TableCell className="text-sm text-foreground">{row.company}</TableCell>
              <TableCell className="text-sm text-foreground">{row.carrier}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-7 border border-border">
                    <AvatarImage src="/placeholder.svg?height=28&width=28" alt={row.assignee} />
                    <AvatarFallback className="text-xs bg-accent text-accent-foreground">RS</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                    {row.assignee}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground">{row.status}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      row.sla.status === "green"
                        ? "bg-emerald-500"
                        : row.sla.status === "amber"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className={row.sla.status === "red" ? "text-red-500 font-medium" : "text-foreground"}>
                    {row.sla.label}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{row.createdAt}</TableCell>
              <TableCell className="text-sm text-foreground text-center">{row.issues}</TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
