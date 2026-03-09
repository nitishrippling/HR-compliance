"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  CalendarDays,
  Copy,
  AlertTriangle,
  CircleCheck,
  CircleX,
  ChevronDown,
  ChevronRight,
  Info,
  Mail,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TopNav } from "@/components/top-nav"
import { allErrorsData } from "@/lib/data"
import type { AllErrorRow } from "@/lib/data"

// ── Preview state ──
type PreviewState =
  | { type: "edi"; transmissionId: string; transmissionDate: string }
  | { type: "census"; transmissionId: string; transmissionDate: string }
  | { type: "attachment"; filename: string }
  | { type: "email" }

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
INS*Y*18*021*28*A*E**FT~
REF*0F*110379410~
REF*1L*00654277~
NM1*IL*1*JONES*SAMUEL****34*430028875~
DMG*D8*19800315*M~
DTP*336*D8*20250501~
HD*021**HLT*MHDP0004*EMP~
DTP*348*D8*20250501~
INS*N*01*021*28*A*E**FT~
REF*0F*110379410~
NM1*IL*1*SMITH*KATIE****34*430028876~
DMG*D8*19820922*F~
DTP*336*D8*20250501~
HD*021**DEN*DNTL0001*ESP~
DTP*348*D8*20250501~
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

// ── Census JSON sample data ──
const CENSUS_JSON = {
  census_list: [
    {
      company: {
        subscriber_count: 304,
        name: "Electric Hydrogen Co",
        plans: [
          {
            plan_id: "6775703657d889ad40e14929",
            plan_name: "Sun Life Critical Illness 2025-26",
            line: "CRITICAL_ILLNESS",
            plan_effective_date: "04/01/2025",
            plan_expiry_date: "03/31/2026",
            if_supports_cobra: false,
            carrier_id: "583fdf270971c5546929c8a8",
            group_id: "966133",
            benefit_description: "",
            ref_38: "",
            oe_deadline: "03/14/2025"
          },
          {
            plan_id: "6775704357d889ad40e149ef",
            plan_name: "Sun Life Basic Life/AD&D 2025-26",
            line: "LIFE",
            plan_effective_date: "04/01/2025",
            plan_expiry_date: "03/31/2026",
            if_supports_cobra: false,
            carrier_id: "583fdf270971c5546929c8a8",
            group_id: "966133",
            benefit_description: "",
            ref_38: "",
            oe_deadline: "03/14/2025"
          },
          {
            plan_id: "6775703b57d889ad40e14961",
            plan_name: "Sun Life Voluntary Life 2025-26",
            line: "VOLUNTARY_LIFE",
            plan_effective_date: "04/01/2025",
            plan_expiry_date: "03/31/2026",
            if_supports_cobra: false,
            carrier_id: "583fdf270971c5546929c8a8",
            group_id: "966133",
            benefit_description: "",
            ref_38: "",
            oe_deadline: "03/14/2025"
          }
        ]
      }
    }
  ]
}

// ── Transmissions ──
const TRANSMISSIONS = [
  { id: "TR-2025-0210", date: "Feb 10, 2025", time: "12:05 PM EST", segments: 26, members: 3, status: "Processed" },
  { id: "TR-2025-0203", date: "Feb 3, 2025", time: "11:42 AM EST", segments: 24, members: 2, status: "Processed" },
  { id: "TR-2025-0127", date: "Jan 27, 2025", time: "10:15 AM EST", segments: 18, members: 1, status: "Processed" },
]

// ── Attachments ──
const ATTACHMENTS = [
  { name: "benefits_report_q1.pdf", size: "245 KB" },
  { name: "eligibility_data_export.xlsx", size: "128 KB" },
]

// ── Helper to get preview label ──
function getPreviewLabel(preview: PreviewState): string {
  switch (preview.type) {
    case "edi": return `EDI 834 File -- ${preview.transmissionDate}`
    case "census": return `Census Data -- ${preview.transmissionDate}`
    case "attachment": return preview.filename
    case "email": return "Email"
  }
}

// ── Sub components ──

function BottomTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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

function ErrorRawTooltip({ content }: { content: string }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <p className="text-xs text-muted-foreground font-mono leading-relaxed break-all line-clamp-3 cursor-default">{content}</p>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-md bg-foreground text-background text-xs font-mono p-3 leading-relaxed break-all whitespace-pre-wrap">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

function SeverityBadge({ severity }: { severity: "critical" | "warning" | "match" }) {
  if (severity === "critical") return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground"><CircleX className="size-3.5" />Mismatch</span>
  if (severity === "warning") return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><AlertTriangle className="size-3.5" />Warning</span>
  return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><CircleCheck className="size-3.5" />Match</span>
}

function TransmissionsSection({ onViewEdi, onViewCensus }: { onViewEdi: (t: typeof TRANSMISSIONS[0]) => void; onViewCensus: (t: typeof TRANSMISSIONS[0]) => void }) {
  const [expanded, setExpanded] = useState(false)
  const latest = TRANSMISSIONS[0]
  const older = TRANSMISSIONS.slice(1)

  return (
    <div className="rounded-lg border border-border p-4 mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">Recent Transmission</h3>
      <div className="flex items-center justify-between rounded-md bg-accent p-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">{latest.id}</p>
          <p className="text-xs text-muted-foreground">{latest.date} at {latest.time} &middot; {latest.segments} segments &middot; {latest.members} members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => onViewEdi(latest)}>View EDI</Button>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => onViewCensus(latest)}>View Census</Button>
        </div>
      </div>
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
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => onViewEdi(t)}>View EDI</Button>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => onViewCensus(t)}>View Census</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Preview Panel Components ──

function EdiPreview({ company, carrier, transmissionId, transmissionDate, onCopy }: { company: string; carrier: string; transmissionId: string; transmissionDate: string; onCopy: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">EDI 834 File Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={onCopy}>
            <Copy className="size-3" />Copy
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
            <Download className="size-3" />Download
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-accent border border-border px-3 py-2 mb-3">
        <span className="text-xs text-muted-foreground">Transmission:</span>
        <span className="text-xs font-medium text-foreground">{transmissionId}</span>
        <span className="text-xs text-muted-foreground">&middot;</span>
        <span className="text-xs font-medium text-foreground">{transmissionDate}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        Benefit Enrollment and Maintenance (834) transaction for {company} / {carrier}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs">Version: 005010X220A1</Badge>
        <Badge variant="outline" className="text-xs">Type: 834</Badge>
        <Badge variant="outline" className="text-xs">Segments: 42</Badge>
      </div>
      <div className="flex-1 overflow-y-auto rounded-lg bg-accent border border-border">
        <div className="flex">
          <div className="shrink-0 pr-3 pl-3 py-3 select-none border-r border-border">
            {SAMPLE_EDI_CONTENT.split("\n").map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground font-mono leading-5 text-right">{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 p-3 text-xs font-mono text-foreground leading-5 overflow-x-auto whitespace-pre">
            {SAMPLE_EDI_CONTENT}
          </pre>
        </div>
      </div>
    </div>
  )
}

function AttachmentPreview({ filename }: { filename: string }) {
  const criticalCount = DISCREPANCY_ROWS.filter((r) => r.severity === "critical").length
  const warningCount = DISCREPANCY_ROWS.filter((r) => r.severity === "warning").length
  const matchCount = DISCREPANCY_ROWS.filter((r) => r.severity === "match").length

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Cigna Eligibility Discrepancy Report</h3>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
          <Download className="size-3" />Export CSV
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        834 enrollment comparison for Group 00654277 &middot; {filename}
      </p>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
          <CircleX className="size-3.5 text-foreground" /><span className="text-xs font-medium text-foreground">{criticalCount} Mismatches</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
          <AlertTriangle className="size-3.5 text-muted-foreground" /><span className="text-xs font-medium text-foreground">{warningCount} Warnings</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
          <CircleCheck className="size-3.5 text-muted-foreground" /><span className="text-xs font-medium text-foreground">{matchCount} Matches</span>
        </div>
      </div>
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
                <TableCell className={`text-sm font-mono ${d.severity !== "match" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{d.carrierValue}</TableCell>
                <TableCell><SeverityBadge severity={d.severity} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {DISCREPANCY_ROWS.length} fields compared &middot; Cigna feed 02/10/2025 12:05 PM EST
      </p>
    </div>
  )
}

function CensusPreview({ transmissionId, transmissionDate }: { transmissionId: string; transmissionDate: string }) {
  const censusString = JSON.stringify(CENSUS_JSON, null, 2)
  const lines = censusString.split("\n")
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Census File Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
            <Copy className="size-3" />Copy
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
            <Download className="size-3" />Download
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-accent border border-border px-3 py-2 mb-3">
        <span className="text-xs text-muted-foreground">Transmission:</span>
        <span className="text-xs font-medium text-foreground">{transmissionId}</span>
        <span className="text-xs text-muted-foreground">&middot;</span>
        <span className="text-xs font-medium text-foreground">{transmissionDate}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        Census JSON file for employee enrollment data
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs">Format: JSON</Badge>
        <Badge variant="outline" className="text-xs">Plans: 3</Badge>
        <Badge variant="outline" className="text-xs">Subscribers: 304</Badge>
      </div>
      <div className="flex-1 overflow-y-auto rounded-lg bg-accent border border-border">
        <div className="flex">
          <div className="shrink-0 pr-3 pl-3 py-3 select-none border-r border-border">
            {lines.map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground font-mono leading-5 text-right">{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 p-3 text-xs font-mono text-foreground leading-5 overflow-x-auto whitespace-pre">
            {censusString}
          </pre>
        </div>
      </div>
    </div>
  )
}

function EmailPreview({ row }: { row: AllErrorRow }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Email Preview</h3>
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden flex-1">
        <div className="bg-accent px-4 py-3 border-b border-border">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-12">From</span>
              <span className="text-sm text-foreground">{row.senderEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-12">To</span>
              <span className="text-sm text-foreground">benefits-team@acme.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-12">Subject</span>
              <span className="text-sm font-medium text-foreground">Eligibility Discrepancy - {row.company} / {row.carrier}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-12">Date</span>
              <span className="text-sm text-muted-foreground">{row.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{row.emailBody}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Attachments ({ATTACHMENTS.length})</p>
            <div className="flex flex-col gap-2">
              {ATTACHMENTS.map((file) => (
                <div key={file.name} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──

export default function AllErrorsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [row, setRow] = useState<AllErrorRow | null>(null)
  useEffect(() => {
    const found = allErrorsData.find((r) => r.id === id)
    if (found) setRow({ ...found })
  }, [id])

  // Tabs
  const [bottomTab, setBottomTab] = useState<"comment" | "activities">("comment")

  // Toast
  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [commentText, setCommentText] = useState("")

  // Form fields
  const [statusValue, setStatusValue] = useState("pending")
  const [rcaValue, setRcaValue] = useState("")
  const rcaRequired = statusValue === "resolved" && !rcaValue

  // Preview panel -- default to attachment
  const [preview, setPreview] = useState<PreviewState>({ type: "census", transmissionId: TRANSMISSIONS[0].id, transmissionDate: TRANSMISSIONS[0].date })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  if (!row) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <TopNav />
        <main className="px-8 py-6">
          <p className="text-sm text-muted-foreground">Error not found.</p>
        </main>
      </div>
    )
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    showToast("Comment added successfully")
    setCommentText("")
  }

  const handleCopyEdi = () => {
    navigator.clipboard.writeText(SAMPLE_EDI_CONTENT).then(() => showToast("EDI content copied to clipboard")).catch(() => showToast("Failed to copy EDI content"))
  }

  return (
    <>
      <SuccessToast message={toastMessage} visible={toastVisible} />

      <div className="min-h-screen bg-background font-sans">
        <TopNav />

        {/* Breadcrumb */}
        <div className="px-8 pt-4 pb-2">
          <nav className="flex items-center gap-1.5 text-sm">
            <button onClick={() => router.push("/")} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft className="size-3.5" />
              Benefit Tasks
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button onClick={() => router.push("/?tab=all-errors")} className="text-muted-foreground hover:text-foreground transition-colors">
              All errors
            </button>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="text-foreground font-medium">SFDC {row.sfdc}</span>
          </nav>
        </div>

        {/* Two-column layout */}
        <div className="flex px-8 pb-8 gap-6" style={{ height: "calc(100vh - 108px)" }}>
          {/* Left column - scrollable details */}
          <div className="w-[55%] overflow-y-auto pr-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pt-2">
              <h2 className="text-xl font-semibold text-foreground">Error details</h2>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" size="sm">Employee Debugger</Button>
              <Button variant="outline" size="sm">Proxy Link</Button>
            </div>

            {/* Info card */}
            <div className="rounded-lg bg-accent p-4 mb-6">
              {/* Row 1: Carrier, Company, Employee Name, Dependent */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Carrier</p>
                  <p className="text-sm font-medium text-foreground">{row.carrier}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="text-sm font-medium text-foreground">{row.company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Employee Name</p>
                  <p className="text-sm font-medium text-foreground">{row.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dependent</p>
                  <Badge variant="outline" className={`text-xs ${row.dependent === "Self" ? "bg-background text-foreground border-border" : "bg-primary/10 text-primary border-primary/20"}`}>
                    {row.dependent}
                  </Badge>
                </div>
              </div>
              {/* Row 2: Role ID, Employee ID, Line of Coverage */}
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Role ID <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-muted-foreground/20 text-[8px] text-muted-foreground align-middle">i</span>
                  </p>
                  <p className="text-sm font-medium text-foreground">{row.groupId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Employee ID</p>
                  <p className="text-sm font-medium text-foreground">{row.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Line of Coverage <span className="inline-flex items-center justify-center size-3.5 rounded-full bg-muted-foreground/20 text-[8px] text-muted-foreground align-middle">i</span>
                  </p>
                  <Badge variant="outline" className="bg-background text-foreground border-border text-xs">{row.coverage}</Badge>
                </div>
              </div>
            </div>

            {/* Form fields row 1 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                <Select value={statusValue} onValueChange={setStatusValue}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In review</SelectItem>
                    <SelectItem value="in-progress">In progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Stage</label>
                <Select defaultValue={row.stage.toLowerCase().replace(" ", "-")}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="triage">Triage</SelectItem>
                    <SelectItem value="investigation">Investigation</SelectItem>
                    <SelectItem value="carrier-outreach">Carrier outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Assignee</label>
                <Select defaultValue="assigned">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">{row.assignee}</SelectItem>
                    <SelectItem value="sam">Sam Smith</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Form fields row 2 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${rcaRequired ? "text-sla-red" : "text-foreground"}`}>
                  RCA {rcaRequired && <span className="text-xs font-normal">-- Required before resolving</span>}
                </label>
                <Select value={rcaValue} onValueChange={setRcaValue}>
                  <SelectTrigger className={`w-full transition-colors ${rcaRequired ? "border-sla-red ring-1 ring-sla-red/30" : ""}`}>
                    <SelectValue placeholder="Select RCA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carrier-error">Carrier error</SelectItem>
                    <SelectItem value="data-mismatch">Data mismatch</SelectItem>
                    <SelectItem value="system-error">System error</SelectItem>
                    <SelectItem value="enrollment-gap">Enrollment gap</SelectItem>
                    <SelectItem value="duplicate-record">Duplicate record</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Follow up date</label>
                <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground cursor-pointer hover:bg-accent transition-colors">
                  <CalendarDays className="mr-2 size-4" />
                  {row.followUp || "MM/DD/YYYY"}
                </div>
              </div>
            </div>

            {/* Issue Detail */}
            <div className="rounded-lg bg-accent p-4 mb-6">
              <p className="text-xs text-muted-foreground font-medium tracking-wide mb-3">ISSUE DETAIL</p>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">ISSUE</p>
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-background gap-1.5 ${preview.type === "census" ? "border-primary text-primary" : ""}`}
                  onClick={() => setPreview({ type: "census", transmissionId: TRANSMISSIONS[0].id, transmissionDate: `${TRANSMISSIONS[0].date} at ${TRANSMISSIONS[0].time}` })}
                >
                  <FileText className="size-3.5" />
                  View File
                </Button>
              </div>
              <p className="text-base text-foreground mb-4">{row.errorTitle}</p>
              <p className="text-xs text-muted-foreground font-medium mb-2">CONTENT</p>
              <ErrorRawTooltip content={row.errorRaw} />
            </div>

            {/* Transmissions */}
            <TransmissionsSection
              onViewEdi={(t) => setPreview({ type: "edi", transmissionId: t.id, transmissionDate: `${t.date} at ${t.time}` })}
              onViewCensus={(t) => setPreview({ type: "census", transmissionId: t.id, transmissionDate: `${t.date} at ${t.time}` })}
            />

            {/* Email Details -- clickable preview buttons */}
            <div className="rounded-lg bg-accent p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Email Details</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-background gap-1.5 ${preview.type === "attachment" ? "border-primary text-primary" : ""}`}
                    onClick={() => setPreview({ type: "attachment", filename: ATTACHMENTS[0].name })}
                  >
                    <Paperclip className="size-3.5" />
                    View Attachments
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-background gap-1.5 ${preview.type === "email" ? "border-primary text-primary" : ""}`}
                    onClick={() => setPreview({ type: "email" })}
                  >
                    <Mail className="size-3.5" />
                    View Email
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Sender: {row.senderEmail}</p>
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">{row.emailBody}</p>
            </div>

            {/* Bottom tabs */}
            <div className="mt-6 pb-8">
              <div className="flex items-center gap-6 border-b border-border mb-4">
                <BottomTab label="Comments" active={bottomTab === "comment"} onClick={() => setBottomTab("comment")} />
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
              ) : (
                <div className="rounded-lg bg-accent p-4 text-sm text-muted-foreground">No recent activity.</div>
              )}
            </div>
          </div>

          {/* Right column - sticky preview panel */}
          <div className="w-[45%] sticky top-0 flex flex-col border-l border-border pl-6 overflow-hidden">
            {/* Preview banner */}
            <div className="flex items-center gap-2 rounded-lg bg-accent border border-border px-3 py-2 mb-4 mt-2 shrink-0">
              <Info className="size-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                Select any file to preview &middot; Currently viewing:{" "}
                <span className="font-medium text-foreground">
                  {getPreviewLabel(preview)}
                </span>
              </p>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-hidden">
              {preview.type === "edi" && (
                <EdiPreview
                  company={row.company}
                  carrier={row.carrier}
                  transmissionId={preview.transmissionId}
                  transmissionDate={preview.transmissionDate}
                  onCopy={handleCopyEdi}
                />
              )}
              {preview.type === "census" && (
                <CensusPreview
                  transmissionId={preview.transmissionId}
                  transmissionDate={preview.transmissionDate}
                />
              )}
              {preview.type === "attachment" && (
                <AttachmentPreview filename={preview.filename} />
              )}
              {preview.type === "email" && (
                <EmailPreview row={row} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
