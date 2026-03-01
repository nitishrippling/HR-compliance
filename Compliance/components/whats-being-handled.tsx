import { FileText, ScrollText, Building2 } from "lucide-react"
import { ServiceBucket } from "@/components/service-bucket"
import { ActivityTimeline } from "@/components/activity-timeline"

const buckets = [
  {
    icon: <ScrollText className="h-4.5 w-4.5" />,
    title: "State & Local Tax Accounts",
    statuses: [
      { label: "Completed", count: 18, color: "bg-success" },
      { label: "In Progress", count: 3, color: "bg-warning" },
      { label: "Blocked", count: 1, color: "bg-destructive" },
    ],
    highlights: [
      {
        title: "Ohio Withholding Account",
        detail: "Submitted Feb 12 -- awaiting agency confirmation",
      },
      {
        title: "California SUI Rate Updated",
        detail: "New rate of 2.7% applied to payroll",
      },
      {
        title: "Westerville City Tax Account Created",
        detail: "Municipal withholding now active",
      },
      {
        title: "Texas Workforce Commission",
        detail: "Pending agency response on registration",
      },
    ],
    ctaLabel: "View All Accounts",
  },
  {
    icon: <FileText className="h-4.5 w-4.5" />,
    title: "Compliance Filings",
    statuses: [
      { label: "Filed This Year", count: 14, color: "bg-success" },
      { label: "In Progress", count: 2, color: "bg-warning" },
      { label: "Late", count: 0, color: "bg-muted-foreground" },
    ],
    highlights: [
      {
        title: "EEO-1 Filed",
        detail: "Component 1 data submitted for all establishments",
      },
      {
        title: "ACA 1094/1095 Prepared",
        detail: "Forms generated and ready for distribution",
      },
      {
        title: "CA Pay Data Submitted",
        detail: "SB 973 compliance filing completed",
      },
      {
        title: "Healthy SF Mandate Completed",
        detail: "Healthcare expenditure requirements met for Q1",
      },
    ],
    ctaLabel: "View All Filings",
  },
  {
    icon: <Building2 className="h-4.5 w-4.5" />,
    title: "Foreign Qualification & Entity Compliance",
    statuses: [
      { label: "Qualified", count: 5, color: "bg-success" },
      { label: "Pending", count: 1, color: "bg-warning" },
    ],
    highlights: [
      {
        title: "CA Qualification Approved",
        detail: "Certificate of good standing obtained",
      },
      {
        title: "NY Registered Agent Active",
        detail: "Agent of record confirmed and compliant",
      },
      {
        title: "TX Qualification Submitted",
        detail: "Application filed with Secretary of State",
      },
    ],
    ctaLabel: "View All Qualifications",
  },
]

export function WhatsBeingHandled() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          What Rippling Is Handling
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Compliance operations being managed behind the scenes.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {buckets.map((bucket) => (
          <ServiceBucket key={bucket.title} {...bucket} />
        ))}
      </div>

      <div className="mt-5">
        <ActivityTimeline />
      </div>
    </section>
  )
}
