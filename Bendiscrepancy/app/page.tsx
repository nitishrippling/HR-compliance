"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { ErrorReportTable } from "@/components/error-report-table"
import { AllErrorsTable } from "@/components/all-errors-table"
import { errorReportData as initialErrorReportData, allErrorsData } from "@/lib/data"
import type { ErrorReportRow, AllErrorRow } from "@/lib/data"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read tab and highlight from URL params
  const tabParam = searchParams.get("tab")
  const highlightParam = searchParams.get("highlight")

  const [activeTab, setActiveTab] = useState<"error-report" | "all-errors">(
    tabParam === "all-errors" ? "all-errors" : "error-report"
  )

  // ── Error Report state ──
  const [errorReportRows] = useState<ErrorReportRow[]>(initialErrorReportData)

  // ── All Errors state ──
  const [highlightRowId, setHighlightRowId] = useState<string | null>(null)

  // Handle URL params on mount
  useEffect(() => {
    if (tabParam === "all-errors") {
      setActiveTab("all-errors")
    }
    if (highlightParam) {
      setHighlightRowId(highlightParam)
      setTimeout(() => setHighlightRowId(null), 2500)
    }
  }, [tabParam, highlightParam])

  // ── Handlers ──

  // Navigate to Error Report detail page
  const handleErRowClick = useCallback((row: ErrorReportRow) => {
    router.push(`/error-report/${row.id}`)
  }, [router])

  // Navigate to All Errors detail page
  const handleAeRowClick = useCallback((row: AllErrorRow) => {
    router.push(`/all-errors/${row.id}`)
  }, [router])

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopNav />

      <main className="px-8 py-6">
        {/* Page heading */}
        <h1 className="text-xl font-semibold text-foreground mb-4 text-balance">Benefit Tasks</h1>

        {/* Page-level tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-6">
          <button
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "error-report"
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("error-report")}
          >
            Error report
          </button>
          <button
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "all-errors"
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("all-errors")}
          >
            All errors
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "error-report" ? (
          <ErrorReportTable data={errorReportRows} onRowClick={handleErRowClick} />
        ) : (
          <AllErrorsTable
            data={allErrorsData}
            highlightRowId={highlightRowId}
            onRowClick={handleAeRowClick}
          />
        )}
      </main>
    </div>
  )
}
