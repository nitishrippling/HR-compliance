"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CommandCenter } from "@/components/tabs/command-center"
import { StateTaxAccounts } from "@/components/tabs/state-tax-accounts"
import { LocalTaxAccounts } from "@/components/tabs/local-tax-accounts"
import { ForeignQualification } from "@/components/tabs/foreign-qualification"
import { AdditionalFilings } from "@/components/tabs/additional-filings"
import { WorkplacePosters } from "@/components/tabs/workplace-posters"

const tabs = [
  { id: "command-center", label: "Command Center" },
  { id: "state-tax", label: "State Tax Accounts" },
  { id: "local-tax", label: "Local Tax Accounts" },
  { id: "foreign-qual", label: "Foreign Qualification" },
  { id: "additional-filings", label: "Additional Filings" },
  { id: "workplace-posters", label: "Workplace Posters" },
] as const

export type TabId = (typeof tabs)[number]["id"]

export function PageTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("command-center")

  function navigateToTab(id: TabId) {
    setActiveTab(id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div>
      {/* Tab Bar */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-0 overflow-x-auto" aria-label="HR Services tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-6" role="tabpanel">
        {activeTab === "command-center" && (
          <CommandCenter onNavigate={navigateToTab} />
        )}
        {activeTab === "state-tax" && <StateTaxAccounts />}
        {activeTab === "local-tax" && <LocalTaxAccounts />}
        {activeTab === "foreign-qual" && <ForeignQualification />}
        {activeTab === "additional-filings" && <AdditionalFilings />}
        {activeTab === "workplace-posters" && <WorkplacePosters />}
      </div>
    </div>
  )
}
