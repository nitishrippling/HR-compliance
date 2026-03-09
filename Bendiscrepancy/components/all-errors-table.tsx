"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight, Search, LayoutGrid, SlidersHorizontal, X, Bookmark, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AllErrorRow } from "@/lib/data"

interface AllErrorsTableProps {
  data: AllErrorRow[]
  highlightRowId: string | null
  onRowClick: (row: AllErrorRow) => void
}

function SlaIndicator({ sla }: { sla: AllErrorRow["sla"] }) {
  const dotColor = {
    green: "bg-sla-green",
    amber: "bg-sla-amber",
    red: "bg-sla-red",
  }[sla.status]

  const textColor = {
    green: "text-sla-green",
    amber: "text-sla-amber",
    red: "text-sla-red",
  }[sla.status]

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className={`size-2 rounded-full ${dotColor}`} />
      <span className={`text-sm ${textColor}`}>{sla.label}</span>
    </span>
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

function PlainHead({ children }: { children: React.ReactNode }) {
  return (
    <TableHead className="text-xs text-muted-foreground font-medium whitespace-nowrap">
      {children}
    </TableHead>
  )
}

// Static filter presets
const STATIC_FILTERS = [
  { key: "coverage", label: "Coverage: Medical" },
  { key: "stage", label: "Stage: Triage" },
]

export function AllErrorsTable({ data, highlightRowId, onRowClick }: AllErrorsTableProps) {
  const [selected, setSelected] = useState<string[]>([])
  const highlightRef = useRef<HTMLTableRowElement>(null)
  const [flashId, setFlashId] = useState<string | null>(null)
  const [filterActive, setFilterActive] = useState(false)
  const [savedViews, setSavedViews] = useState<{ name: string; filters: typeof STATIC_FILTERS }[]>([
    { name: "Medical Triage", filters: STATIC_FILTERS },
  ])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null)

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.dir === "asc" ? { key, dir: "desc" } : null
      }
      return { key, dir: "asc" }
    })
  }

  // Filter data when active: coverage=Medical AND stage=Triage
  const filteredData = filterActive
    ? data.filter((row) => row.coverage === "Medical" && row.stageCategory === "Coverage issue" || row.stage === "Triage" && row.coverage === "Medical")
    : data

  useEffect(() => {
    if (highlightRowId) {
      setFlashId(highlightRowId)
      // Scroll into view
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
      // Clear flash after animation
      const timer = setTimeout(() => setFlashId(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [highlightRowId])

  const toggleAll = () => {
    setSelected(selected.length === filteredData.length ? [] : filteredData.map(r => r.id))
  }

  const toggleRow = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="p-6 pb-0">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Grid title</h3>
          <div className="flex items-center gap-2">
            {/* Saved Views dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Bookmark className="size-3.5" />
                  Saved Views
                  <ChevronDown className="size-3 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Saved views</p>
                {savedViews.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-3">No saved views yet</p>
                ) : (
                  savedViews.map((view, idx) => (
                    <button
                      key={idx}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
                      onClick={() => setFilterActive(true)}
                    >
                      {view.name}
                      <X
                        className="size-3.5 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSavedViews((prev) => prev.filter((_, i) => i !== idx))
                        }}
                      />
                    </button>
                  ))
                )}
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm">Assigned to me</Button>
            <Button variant="outline" size="icon-sm" aria-label="Grid view">
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 h-9" />
          </div>
          <Button
            variant={filterActive ? "default" : "ghost"}
            size="sm"
            className={`gap-2 ${filterActive ? "" : "text-muted-foreground"}`}
            onClick={() => setFilterActive(!filterActive)}
          >
            <SlidersHorizontal className="size-4" />
            Filter
          </Button>
        </div>

        {/* Active filter chips */}
        {filterActive && (
          <div className="mb-4 flex items-center gap-2">
            {STATIC_FILTERS.map((f) => (
              <span key={f.key} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
                {f.label}
                <X className="size-3 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setFilterActive(false)} />
              </span>
            ))}
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
              onClick={() => setFilterActive(false)}
            >
              Clear all
            </button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { setNewViewName(""); setSaveDialogOpen(true) }}>
              <Bookmark className="size-3.5" />
              Save this view
            </Button>
          </div>
        )}
      </div>

      {/* Save view dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save Filter View</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="View name (e.g., Medical Triage)"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => {
                if (newViewName.trim()) {
                  setSavedViews((prev) => [...prev, { name: newViewName.trim(), filters: STATIC_FILTERS }])
                  setSaveDialogOpen(false)
                  setNewViewName("")
                }
              }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Horizontally scrollable container */}
      <div className="overflow-x-auto">
        <Table className="min-w-[1650px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={selected.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <PlainHead>SFDC</PlainHead>
              <PlainHead>Employee</PlainHead>
              <PlainHead>Member</PlainHead>
              <PlainHead>Company</PlainHead>
              <PlainHead>Carrier</PlainHead>
              <PlainHead>Assignee</PlainHead>
              <PlainHead>Status</PlainHead>
              <PlainHead>Stage</PlainHead>
              <SortHead sortKey="createdAt" currentSort={sort} onSort={handleSort}>Created at</SortHead>
              <SortHead sortKey="sla" currentSort={sort} onSort={handleSort}>SLA</SortHead>
              <PlainHead>Coverage</PlainHead>
              <PlainHead>Root Cause</PlainHead>
              <SortHead sortKey="followUp" currentSort={sort} onSort={handleSort}>Follow up</SortHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => {
              const isFlashing = flashId === row.id
              return (
                <TableRow
                  key={row.id}
                  ref={highlightRowId === row.id ? highlightRef : undefined}
                  className={`cursor-pointer group transition-colors duration-500 ${
                    isFlashing ? "animate-highlight-pulse" : ""
                  }`}
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
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-primary">{row.employeeName}</span>
                      <span className="text-xs text-muted-foreground">{row.employeeSsn}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{row.memberName}</span>
                      <span className="text-xs text-muted-foreground">
                        {row.employeeSsn} <span className="font-semibold ml-1">{row.relation}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{row.company}</TableCell>
                  <TableCell className="text-sm text-foreground">{row.carrier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 border border-border">
                        <AvatarImage src="/placeholder.svg?height=28&width=28" alt={row.assignee} />
                        <AvatarFallback className="text-xs bg-accent text-accent-foreground">RS</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                        {row.assignee.length > 16 ? row.assignee.slice(0, 16) + "..." : row.assignee}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{row.status}</TableCell>
                  <TableCell className="text-sm text-foreground whitespace-nowrap">{row.stage}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{row.createdAt}</TableCell>
                  <TableCell>
                    <SlaIndicator sla={row.sla} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-secondary text-secondary-foreground border-border text-xs whitespace-nowrap"
                    >
                      {row.coverage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground whitespace-nowrap">{row.stageCategory}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{row.followUp}</TableCell>
                  <TableCell>
                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
