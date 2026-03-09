"use client"

import { useState, useEffect, useCallback } from "react"
import { X, MoreVertical, ArrowRight, FileText, Download, Eye, CheckCircle2, Copy, AlertTriangle, CircleCheck, CircleX, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ErrorReportRow, IssueRow } from "@/lib/data"

// ── Sample EDI 834 content ──
const SAMPLE_EDI_CONTENT = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *250210*1205*^*00501*000000001*0*P*:~
GS*BE*SENDER*RECEIVER*20250210*1205*1*X*005010X220A1~
ST*834*0001*005010X220A1~
BGN*00*12456789*20250210*120000****4~
REF*38*ABCD123456~
DTP*007*D8*20250101~
N1*P5*ACME CORPORATION*FI*123456789~
N1*IN*CIGNA HEALTH*FI*987654321~
INS*Y*18*021*28*A*E**FT~
REF*0F*123456789~
REF*1L*00654277~
REF*23*MHDP0004~
REF*ZZ*A001~
NM1*IL*1*WILLIAMS*ANGELA****34*430028874~
PER*IP**HP*5551234567*EM*angela.williams@email.com~
N3*123 MAIN ST*APT 4B~
N4*CHICAGO*IL*60601~
DMG*D8*19640710*F~
DTP*336*D8*20250501~
DTP*337*D8*20251231~
HD*021**HLT*MHDP0004*EMP~
DTP*348*D8*20250501~
REF*1L*00654277~
SE*38*0001~
GE*1*1~
IEA*1*000000001~`

// ── Cigna Eligibility Discrepancy Report ──
const DISCREPANCY_ROWS = [
  { id: "d1", field: "Member ID", sourceValue: "CGN-110379410", carrierValue: "CGN-110379410", severity: "match" as const },
  { id: "d2", field: "Subscriber SSN", sourceValue: "430-02-8874", carrierValue: "430-02-8874", severity: "match" as const },
  { id: "d3", field: "Group Number", sourceValue: "00654277", carrierValue: "00654277", severity: "match" as const },
  { id: "d4", field: "Coverage Eff. Date", sourceValue: "01/01/2025", carrierValue: "05/01/2025", severity: "critical" as const },
  { id: "d5", field: "Plan Code", sourceValue: "MHDP0004", carrierValue: "MHDP0009", severity: "critical" as const },
  { id: "d6", field: "Class ID", sourceValue: "A001", carrierValue: "A002", severity: "critical" as const },
  { id: "d7", field: "Subscriber Last Name", sourceValue: "Williams", carrierValue: "Williams", severity: "match" as const },
  { id: "d8", field: "Subscriber First Name", sourceValue: "Angela", carrierValue: "Angela", severity: "match" as const },
  { id: "d9", field: "Date of Birth", sourceValue: "07/10/1964", carrierValue: "07/10/1964", severity: "match" as const },
  { id: "d10", field: "Gender", sourceValue: "F", carrierValue: "M", severity: "critical" as const },
  { id: "d11", field: "Relationship Code", sourceValue: "SB (Subscriber)", carrierValue: "18 (Self)", severity: "warning" as const },
  { id: "d12", field: "Dependent Last Name", sourceValue: "Smith", carrierValue: "Smyth", severity: "warning" as const },
  { id: "d13", field: "Plan Term Date", sourceValue: "None", carrierValue: "12/31/2025", severity: "warning" as const },
  { id: "d14", field: "Benefit Type", sourceValue: "HLT (Health)", carrierValue: "HLT (Health)", severity: "match" as const },
  { id: "d15", field: "Coverage Level", sourceValue: "EMP (Employee Only)", carrierValue: "EMP (Employee Only)", severity: "match" as const },
]

interface ErrorReportDetailPanelProps {
  open: boolean
  onClose: () => void
  row: ErrorReportRow | null
  onGoToError: (errorRowId: string) => void
  onUpdateRow: (updatedRow: ErrorReportRow) => void
}

// ── Sub-tab navigation ──
function SubTab({
  label,
  count,
  active,
  onClick,
  accentCount,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  accentCount?: boolean
}) {
  return (
    <button
      className={`relative pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {label}
      {count > 0 && (
        <Badge
          className={`ml-2 text-xs px-1.5 py-0 rounded-full ${
            accentCount
              ? "bg-primary text-primary-foreground hover:bg-primary"
              : "bg-secondary text-secondary-foreground hover:bg-secondary"
          }`}
        >
          {count}
        </Badge>
      )}
    </button>
  )
}

// ── Bottom tab navigation ──
function BottomTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`relative pb-3 text-sm font-medium transition-colors ${
        active
          ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// ── Empty state when all issues are reviewed ──
function AllReviewedEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="20" width="40" height="50" rx="4" fill="#1a1a1a" transform="rotate(-8 10 20)" />
          <rect x="25" y="15" width="40" height="50" rx="4" fill="#9333ea" transform="rotate(5 25 15)" />
          <path d="M30 42 L42 54 L62 28" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-base font-semibold text-foreground mb-1">All errors are reviewed</p>
      <p className="text-sm text-muted-foreground">{"You can go to 'accepted' tab or 'all errors'"}</p>
    </div>
  )
}

// ── Attachment popover content ──
function AttachmentList({ onPreview }: { onPreview: (filename: string) => void }) {
  return (
    <div className="flex flex-col gap-2 p-1">
      <p className="text-xs font-medium text-muted-foreground mb-1">Attachments (2)</p>
      <div className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-accent transition-colors">
        <FileText className="size-5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">benefits_report_q1.pdf</p>
          <p className="text-xs text-muted-foreground">245 KB</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded p-1 hover:bg-secondary transition-colors"
            aria-label="Preview file"
            onClick={() => onPreview("benefits_report_q1.pdf")}
          >
            <Eye className="size-4 text-muted-foreground" />
          </button>
          <button className="rounded p-1 hover:bg-secondary transition-colors" aria-label="Download file">
            <Download className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-md border border-border p-2.5 hover:bg-accent transition-colors">
        <FileText className="size-5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">eligibility_data_export.xlsx</p>
          <p className="text-xs text-muted-foreground">128 KB</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded p-1 hover:bg-secondary transition-colors"
            aria-label="Preview file"
            onClick={() => onPreview("eligibility_data_export.xlsx")}
          >
            <Eye className="size-4 text-muted-foreground" />
          </button>
          <button className="rounded p-1 hover:bg-secondary transition-colors" aria-label="Download file">
            <Download className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Success toast ──
function SuccessToast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm text-background shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <CheckCircle2 className="size-4 text-sla-green" />
      {message}
    </div>
  )
}

// ── Error content hover tooltip ──
function ErrorContentCell({ content }: { content: string }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span className="text-sm text-muted-foreground truncate max-w-[140px] block cursor-default">
          {content}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-sm bg-foreground text-background text-xs font-mono p-3 leading-relaxed break-all whitespace-pre-wrap"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Severity badge helper (monotone) ──
function SeverityBadge({ severity }: { severity: "critical" | "warning" | "match" }) {
  if (severity === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
        <CircleX className="size-3.5" />
        Mismatch
      </span>
    )
  }
  if (severity === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <AlertTriangle className="size-3.5" />
        Warning
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <CircleCheck className="size-3.5" />
      Match
    </span>
  )
}

// ── Transmissions section ──
const TRANSMISSIONS = [
  { id: "TR-2025-0210", date: "Feb 10, 2025", time: "12:05 PM EST", segments: 26, members: 3, status: "Processed" },
  { id: "TR-2025-0203", date: "Feb 3, 2025", time: "11:42 AM EST", segments: 24, members: 2, status: "Processed" },
  { id: "TR-2025-0127", date: "Jan 27, 2025", time: "10:15 AM EST", segments: 18, members: 1, status: "Processed" },
]

function TransmissionsSection({ onViewEdi }: { onViewEdi: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const latest = TRANSMISSIONS[0]
  const older = TRANSMISSIONS.slice(1)

  return (
    <div className="rounded-lg border border-border p-4 mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">Recent Transmission</h3>

      {/* Latest transmission */}
      <div className="flex items-center justify-between rounded-md bg-accent p-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">{latest.id}</p>
          <p className="text-xs text-muted-foreground">{latest.date} at {latest.time} &middot; {latest.segments} segments &middot; {latest.members} members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={onViewEdi}>View EDI</Button>
          <Button variant="outline" size="sm" className="text-xs h-7">View Census</Button>
        </div>
      </div>

      {/* Expandable older transmissions */}
      <button
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`} />
        View all transmissions ({TRANSMISSIONS.length})
      </button>

      {expanded && (
        <div className="mt-2 flex flex-col gap-2">
          {older.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md bg-accent p-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">{t.id}</p>
                <p className="text-xs text-muted-foreground">{t.date} at {t.time} &middot; {t.segments} segments &middot; {t.members} members</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={onViewEdi}>View EDI</Button>
                <Button variant="outline" size="sm" className="text-xs h-7">View Census</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ErrorReportDetailPanel({
  open,
  onClose,
  row,
  onGoToError,
  onUpdateRow,
}: ErrorReportDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"issues" | "accepted" | "dismissed">("issues")
  const [bottomTab, setBottomTab] = useState<"comment" | "past" | "activities">("comment")
  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [ediModalOpen, setEdiModalOpen] = useState(false)
  const [discrepancyModalOpen, setDiscrepancyModalOpen] = useState(false)
  const [discrepancyFile, setDiscrepancyFile] = useState("")
  const [approvedAccepted, setApprovedAccepted] = useState(false)
  const [approvedDismissed, setApprovedDismissed] = useState(false)
  const [dismissModalOpen, setDismissModalOpen] = useState(false)
  const [dismissingIssue, setDismissingIssue] = useState<IssueRow | null>(null)
  const [dismissReason, setDismissReason] = useState<string | null>(null)
  const [dismissCustomReason, setDismissCustomReason] = useState("")

  // Reset tab when opening a new row
  useEffect(() => {
    if (open) {
      setActiveTab("issues")
      setBottomTab("comment")
      setCommentText("")
      setApprovedAccepted(false)
      setApprovedDismissed(false)
    }
  }, [open, row?.id])

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }, [])

  if (!open || !row) return null

  const handleAccept = (issue: IssueRow) => {
    const updated: ErrorReportRow = {
      ...row,
      toReview: row.toReview.filter((i) => i.id !== issue.id),
      accepted: [...row.accepted, issue],
    }
    onUpdateRow(updated)
    showToast(`Issue accepted: ${issue.member}`)
  }

  const handleDismissClick = (issue: IssueRow) => {
    setDismissingIssue(issue)
    setDismissReason(null)
    setDismissCustomReason("")
    setDismissModalOpen(true)
  }

  const handleDismissConfirm = () => {
    if (!dismissingIssue) return
    const updated: ErrorReportRow = {
      ...row,
      toReview: row.toReview.filter((i) => i.id !== dismissingIssue.id),
      dismissed: [...row.dismissed, dismissingIssue],
    }
    onUpdateRow(updated)
    const reason = dismissReason === "custom" ? dismissCustomReason : dismissReason
    showToast(`Issue dismissed: ${dismissingIssue.member}${reason ? ` (${reason})` : ""}`)
    setDismissModalOpen(false)
    setDismissingIssue(null)
  }

  const handleDismissSkip = () => {
    if (!dismissingIssue) return
    const updated: ErrorReportRow = {
      ...row,
      toReview: row.toReview.filter((i) => i.id !== dismissingIssue.id),
      dismissed: [...row.dismissed, dismissingIssue],
    }
    onUpdateRow(updated)
    showToast(`Issue dismissed: ${dismissingIssue.member}`)
    setDismissModalOpen(false)
    setDismissingIssue(null)
  }

  const handleMoveToDismissed = (issue: IssueRow) => {
    const updated: ErrorReportRow = {
      ...row,
      accepted: row.accepted.filter((i) => i.id !== issue.id),
      dismissed: [...row.dismissed, issue],
    }
    onUpdateRow(updated)
    showToast(`Moved to dismissed: ${issue.member}`)
  }

  const handleMoveToAccepted = (issue: IssueRow) => {
    const updated: ErrorReportRow = {
      ...row,
      dismissed: row.dismissed.filter((i) => i.id !== issue.id),
      accepted: [...row.accepted, issue],
    }
    onUpdateRow(updated)
    showToast(`Moved to accepted: ${issue.member}`)
  }

  const handleSaveApproveAccepted = () => {
    setApprovedAccepted(true)
    showToast(`${row.accepted.length} errors approved and moved to All Errors`)
  }

  const handleSaveApproveDismissed = () => {
    setApprovedDismissed(true)
    showToast(`${row.dismissed.length} errors dismissed and resolved`)
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    showToast("Comment added successfully")
    setCommentText("")
  }

  const handleCopyEdi = () => {
    navigator.clipboard.writeText(SAMPLE_EDI_CONTENT).then(() => {
      showToast("EDI content copied to clipboard")
    }).catch(() => {
      showToast("Failed to copy EDI content")
    })
  }

  const handleAttachmentPreview = (filename: string) => {
    setDiscrepancyFile(filename)
    setDiscrepancyModalOpen(true)
  }

  const currentIssues =
    activeTab === "issues"
      ? row.toReview
      : activeTab === "accepted"
        ? row.accepted
        : row.dismissed

  const criticalCount = DISCREPANCY_ROWS.filter((r) => r.severity === "critical").length
  const warningCount = DISCREPANCY_ROWS.filter((r) => r.severity === "warning").length
  const matchCount = DISCREPANCY_ROWS.filter((r) => r.severity === "match").length

  return (
    <>
      <SuccessToast message={toastMessage} visible={toastVisible} />

      {/* Dismiss Reason Modal */}
      <Dialog open={dismissModalOpen} onOpenChange={(open) => { if (!open) { setDismissModalOpen(false); setDismissingIssue(null) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dismiss issue</DialogTitle>
            <DialogDescription>
              Help us improve by sharing why this issue is being dismissed. This is optional.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {[
                { value: "Duplicate error", label: "Duplicate error" },
                { value: "Ignorable error", label: "Ignorable error" },
                { value: "Already resolved", label: "Already resolved" },
                { value: "Not actionable", label: "Not actionable" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setDismissReason(dismissReason === option.value ? null : option.value); setDismissCustomReason("") }}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    dismissReason === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div>
              <textarea
                value={dismissCustomReason}
                onChange={(e) => { setDismissCustomReason(e.target.value); if (e.target.value) setDismissReason("custom") }}
                placeholder="Or describe your reason..."
                className="w-full rounded-lg border border-border bg-background p-3 min-h-[80px] text-sm text-foreground leading-relaxed resize-none outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleDismissSkip}>
                Skip & Dismiss
              </Button>
              <Button
                size="sm"
                onClick={handleDismissConfirm}
                disabled={!dismissReason && !dismissCustomReason}
              >
                Submit & Dismiss
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDI File Modal */}
      <Dialog open={ediModalOpen} onOpenChange={setEdiModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              EDI 834 File Preview
            </DialogTitle>
            <DialogDescription>
              Benefit Enrollment and Maintenance (834) transaction for {row.company} / {row.carrier}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">Version: 005010X220A1</Badge>
              <Badge variant="outline" className="text-xs">Type: 834</Badge>
              <Badge variant="outline" className="text-xs">Segments: 26</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleCopyEdi}>
                <Copy className="size-3.5" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto rounded-lg bg-accent border border-border">
            <div className="flex">
              <div className="shrink-0 pr-3 pl-3 py-3 select-none border-r border-border">
                {SAMPLE_EDI_CONTENT.split("\n").map((_, i) => (
                  <div key={i} className="text-xs text-muted-foreground font-mono leading-5 text-right">
                    {i + 1}
                  </div>
                ))}
              </div>
              <pre className="flex-1 p-3 text-xs font-mono text-foreground leading-5 overflow-x-auto whitespace-pre">
                {SAMPLE_EDI_CONTENT}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cigna Eligibility Discrepancy Report Modal */}
      <Dialog open={discrepancyModalOpen} onOpenChange={setDiscrepancyModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Cigna Eligibility Discrepancy Report
            </DialogTitle>
            <DialogDescription>
              834 enrollment comparison for Group 00654277 &middot; {discrepancyFile}
            </DialogDescription>
          </DialogHeader>

          {/* Summary chips -- monotone */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5">
              <CircleX className="size-3.5 text-foreground" />
              <span className="text-xs font-medium text-foreground">{criticalCount} Mismatches</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5">
              <AlertTriangle className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{warningCount} Warnings</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5">
              <CircleCheck className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{matchCount} Matches</span>
            </div>
          </div>

          {/* Discrepancy table */}
          <div className="flex-1 overflow-y-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-accent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Field</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Source Value</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Cigna Value</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DISCREPANCY_ROWS.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-sm font-medium text-foreground">{d.field}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{d.sourceValue}</TableCell>
                    <TableCell className={`text-sm font-mono ${d.severity !== "match" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {d.carrierValue}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={d.severity} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              {DISCREPANCY_ROWS.length} fields compared &middot; Cigna feed 02/10/2025 12:05 PM EST
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Download className="size-3.5" />
                Export CSV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed inset-0 z-50 flex">
        {/* Overlay */}
        <div className="flex-1 bg-foreground/40" onClick={onClose} />

        {/* Panel */}
        <div className="w-full max-w-5xl bg-background border-l border-border overflow-y-auto shadow-xl animate-in slide-in-from-right-5 duration-200">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Error details</h2>
              <button
                onClick={onClose}
                className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close panel"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Action buttons - "Geneva" header section */}
            <div className="rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Geneva</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Proxy Link</Button>
                </div>
              </div>

              {/* Info card */}
              <div className="rounded-lg bg-accent p-4">
                <div className="flex flex-wrap gap-x-10 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      Carrier
                      <Sparkles className="size-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">AI-suggested</span>
                    </p>
                    <Select defaultValue={row.carrier}>
                      <SelectTrigger className="h-7 w-36 text-sm font-medium bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={row.carrier}>{row.carrier}</SelectItem>
                        <SelectItem value="Aetna">Aetna</SelectItem>
                        <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                        <SelectItem value="Cigna">Cigna</SelectItem>
                        <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
                        <SelectItem value="Humana">Humana</SelectItem>
                        <SelectItem value="Kaiser">Kaiser</SelectItem>
                        <SelectItem value="Anthem">Anthem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Group ID{" "}
                      <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-muted-foreground/20 text-[8px] text-muted-foreground align-middle">i</span>
                    </p>
                    <p className="text-sm font-medium text-foreground">{row.groupId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      Company
                      <Sparkles className="size-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">AI-suggested</span>
                    </p>
                    <Select defaultValue={row.company}>
                      <SelectTrigger className="h-7 w-40 text-sm font-medium bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={row.company}>{row.company}</SelectItem>
                        <SelectItem value="Acme">Acme</SelectItem>
                        <SelectItem value="Globex">Globex</SelectItem>
                        <SelectItem value="Initech">Initech</SelectItem>
                        <SelectItem value="Umbrella">Umbrella</SelectItem>
                        <SelectItem value="Wayne Enterprises">Wayne Enterprises</SelectItem>
                        <SelectItem value="Stark Industries">Stark Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                    <p className="text-sm font-medium text-foreground">{row.assignee.split(" ").slice(0, 2).join(" ").replace("Satherland", "Smith")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-medium text-foreground">{row.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Line of Coverage{" "}
                      <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-muted-foreground/20 text-[8px] text-muted-foreground align-middle">i</span>
                    </p>
                    <Badge variant="outline" className="bg-background text-foreground border-border text-xs mt-0.5">
                      {row.lineOfCoverage}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Details section */}
            <div className="rounded-lg bg-accent p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Email Details</h3>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-background">
                        View Attachments
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <AttachmentList onPreview={handleAttachmentPreview} />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="sm" className="bg-background">View Email</Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Sender: {row.senderEmail}</p>
              <p className="text-sm text-foreground leading-relaxed">{row.emailBody}</p>
            </div>

            {/* Recent Transmissions */}
            <TransmissionsSection onViewEdi={() => setEdiModalOpen(true)} />

            {/* Issues sub-tabs */}
            <div className="mb-4">
              <div className="flex items-center gap-6 border-b border-border">
                <SubTab
                  label="Issues to review"
                  count={row.toReview.length}
                  active={activeTab === "issues"}
                  onClick={() => setActiveTab("issues")}
                  accentCount
                />
                <SubTab
                  label="Accepted"
                  count={row.accepted.length}
                  active={activeTab === "accepted"}
                  onClick={() => setActiveTab("accepted")}
                />
                <SubTab
                  label="Dismissed"
                  count={row.dismissed.length}
                  active={activeTab === "dismissed"}
                  onClick={() => setActiveTab("dismissed")}
                />
              </div>
            </div>

            {/* Issues content */}
            {activeTab === "issues" && row.toReview.length === 0 ? (
              <AllReviewedEmpty />
            ) : activeTab === "issues" && currentIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground font-medium">Member <ChevronIcon /></TableHead>
                      <TableHead className="text-xs text-muted-foreground font-medium">Employee <ChevronIcon /></TableHead>
                      <TableHead className="text-xs text-muted-foreground font-medium">Role ID <ChevronIcon /></TableHead>
                      <TableHead className="text-xs text-muted-foreground font-medium">Error reason <ChevronIcon /></TableHead>
                      <TableHead className="text-xs text-muted-foreground font-medium">Block <ChevronIcon /></TableHead>
                      <TableHead className="text-xs text-muted-foreground font-medium">Error content</TableHead>
                      <TableHead className="w-40" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentIssues.map((issue) => (
                      <TableRow key={issue.id} className="group">
                        <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.member}</TableCell>
                        <TableCell className="text-sm text-foreground">{issue.employee}</TableCell>
                        <TableCell className="text-sm text-foreground">{issue.roleId}</TableCell>
                        <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.errorReason}</TableCell>
                        <TableCell className="text-sm text-foreground">{issue.block}</TableCell>
                        <TableCell><ErrorContentCell content={issue.errorContent} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5" onClick={(e) => { e.stopPropagation(); handleAccept(issue) }}>Accept</Button>
                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5" onClick={(e) => { e.stopPropagation(); handleDismissClick(issue) }}>Dismiss</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : activeTab === "accepted" ? (
              row.accepted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-sm text-muted-foreground">No accepted issues yet</p>
                </div>
              ) : (
                <div>
                  {/* Info banner */}
                  <div className="rounded-lg bg-accent border border-border p-3 mb-4 flex items-center justify-between">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{row.accepted.length} error{row.accepted.length !== 1 ? "s" : ""} accepted.</span>{" "}
                      {approvedAccepted
                        ? "Errors have been moved to All Errors."
                        : "These will be created as individual tasks in All Errors once approved."}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs text-muted-foreground font-medium">Member <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Employee <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Error reason <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Error content</TableHead>
                          <TableHead className="w-44" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {row.accepted.map((issue) => (
                          <TableRow key={issue.id} className="group">
                            <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.member}</TableCell>
                            <TableCell className="text-sm text-foreground">{issue.employee}</TableCell>
                            <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.errorReason}</TableCell>
                            <TableCell><ErrorContentCell content={issue.errorContent} /></TableCell>
                            <TableCell>
                              {approvedAccepted ? (
                                <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 gap-1" onClick={(e) => { e.stopPropagation(); onGoToError(row.id) }}>
                                  Go to error <ArrowRight className="size-3" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5 text-muted-foreground" onClick={(e) => { e.stopPropagation(); handleMoveToDismissed(issue) }}>
                                  Move to Dismissed
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Save & Approve footer */}
                  {!approvedAccepted && (
                    <div className="mt-4 flex justify-end border-t border-border pt-4">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveApproveAccepted}>
                        Save & Approve
                      </Button>
                    </div>
                  )}
                </div>
              )
            ) : activeTab === "dismissed" ? (
              row.dismissed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-sm text-muted-foreground">No dismissed issues yet</p>
                </div>
              ) : (
                <div>
                  {/* Info banner */}
                  <div className="rounded-lg bg-accent border border-border p-3 mb-4 flex items-center justify-between">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{row.dismissed.length} error{row.dismissed.length !== 1 ? "s" : ""} dismissed.</span>{" "}
                      {approvedDismissed
                        ? "Errors have been marked as resolved."
                        : "These will be marked as resolved once approved."}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs text-muted-foreground font-medium">Member <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Employee <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Error reason <ChevronIcon /></TableHead>
                          <TableHead className="text-xs text-muted-foreground font-medium">Error content</TableHead>
                          <TableHead className="w-44" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {row.dismissed.map((issue) => (
                          <TableRow key={issue.id} className="group">
                            <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.member}</TableCell>
                            <TableCell className="text-sm text-foreground">{issue.employee}</TableCell>
                            <TableCell className="text-sm text-foreground whitespace-nowrap">{issue.errorReason}</TableCell>
                            <TableCell><ErrorContentCell content={issue.errorContent} /></TableCell>
                            <TableCell>
                              {!approvedDismissed && (
                                <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5 text-muted-foreground" onClick={(e) => { e.stopPropagation(); handleMoveToAccepted(issue) }}>
                                  Move to Accepted
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Save & Approve footer */}
                  {!approvedDismissed && (
                    <div className="mt-4 flex justify-end border-t border-border pt-4">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveApproveDismissed}>
                        Save & Approve
                      </Button>
                    </div>
                  )}
                </div>
              )
            ) : null}

            {/* Comment / Past transmission / Activities */}
            <div className="mt-8">
              <div className="flex items-center gap-6 border-b border-border mb-4">
                <BottomTab label="Comment" active={bottomTab === "comment"} onClick={() => setBottomTab("comment")} />
                <BottomTab label="Past transmission" active={bottomTab === "past"} onClick={() => setBottomTab("past")} />
                <BottomTab label="Activities" active={bottomTab === "activities"} onClick={() => setBottomTab("activities")} />
              </div>

              {bottomTab === "comment" ? (
                <>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type your comment here..."
                    className="w-full rounded-lg bg-accent p-4 min-h-[100px] text-sm text-foreground leading-relaxed resize-none outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                  />
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" onClick={handleComment}>Comment</Button>
                  </div>
                </>
              ) : bottomTab === "past" ? (
                <div className="rounded-lg bg-accent p-4 text-sm text-muted-foreground">
                  No past transmissions available.
                </div>
              ) : (
                <div className="rounded-lg bg-accent p-4 text-sm text-muted-foreground">
                  No recent activity.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ChevronIcon() {
  return (
    <svg className="inline-block ml-1 size-3 text-muted-foreground opacity-50" viewBox="0 0 12 12" fill="none">
      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
