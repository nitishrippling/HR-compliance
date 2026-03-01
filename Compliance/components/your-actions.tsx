"use client"

import { useState } from "react"
import { HelpCircle, ExternalLink } from "lucide-react"
import { AIHelpDrawer } from "@/components/ai-help-drawer"
import { Button } from "@/components/ui/button"

const tasks = [
  {
    task: "Texas Withholding Registration",
    category: "State Tax",
    dueDate: "Feb 28, 2026",
    daysLeft: -2, // negative means overdue
    risk: "Payroll blocked if unresolved",
  },
  {
    task: "Ohio Municipal Tax Setup",
    category: "Local Tax",
    dueDate: "Mar 1, 2026",
    daysLeft: 2,
    risk: "Withholding non-compliant",
  },
  {
    task: "Upload Certificate of Incorporation",
    category: "Foreign Qualification",
    dueDate: "Mar 5, 2026",
    daysLeft: 6,
    risk: "Registration delayed",
  },
  {
    task: "California SUI Rate Verification",
    category: "State Tax",
    dueDate: "Mar 10, 2026",
    daysLeft: 11,
    risk: "Rate mismatch possible",
  },
  {
    task: "Confirm ACA Headcount",
    category: "Federal Filing",
    dueDate: "Mar 31, 2026",
    daysLeft: 32,
    risk: "Annual compliance confirmation",
  },
]

function getPenaltyInfo(daysLeft: number) {
  if (daysLeft < 0) {
    return { text: "$250 fine already charged", isOverdue: true }
  }
  return { text: `${daysLeft} days left before $250 fee`, isOverdue: false }
}

export function YourActions() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(null)

  const sorted = [...tasks].sort((a, b) => a.daysLeft - b.daysLeft)

  function openHelp(task: (typeof tasks)[0]) {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Your Actions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Items requiring your input to keep compliance on track.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Task
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Due Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Penalty Status
                </th>
                <th className="w-10 px-3 py-3">
                  <span className="sr-only">Help</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((task, index) => {
                const penalty = getPenaltyInfo(task.daysLeft)
                return (
                  <tr
                    key={index}
                    onClick={() => openHelp(task)}
                    className="group cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-accent/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${penalty.isOverdue ? "bg-destructive" : "bg-amber-400"}`} />
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {task.task}
                          </span>
                          {penalty.isOverdue && (
                            <span className="ml-2 text-xs text-destructive font-medium">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">
                        {task.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground">{task.dueDate}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium ${penalty.isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                        {penalty.text}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to the relevant detail tab
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Take Action
                        </Button>
                        <span 
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            openHelp(task)
                          }}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AIHelpDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        actionItem={selectedTask}
      />
    </section>
  )
}
