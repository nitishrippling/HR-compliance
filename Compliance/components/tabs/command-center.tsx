"use client"

import type { TabId } from "@/components/page-tabs"
import { YourActions } from "@/components/your-actions"
import { ServiceSummaryCards } from "@/components/service-summary-cards"
import { YourImpact } from "@/components/your-impact"

export function CommandCenter({
  onNavigate,
}: {
  onNavigate: (tabId: TabId) => void
}) {
  return (
    <div className="flex flex-col gap-12">
      <YourImpact />
      <YourActions />
      <ServiceSummaryCards onNavigate={onNavigate} />
    </div>
  )
}
