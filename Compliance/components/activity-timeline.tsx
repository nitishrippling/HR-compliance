const events = [
  {
    date: "Feb 18",
    title: "23 workplace posters distributed across 10 states",
    description: "Annual poster compliance update completed for all active locations.",
    status: "completed" as const,
  },
  {
    date: "Feb 17",
    title: "EEO-1 filed with federal agency",
    description: "Component 1 data submitted for all establishments.",
    status: "completed" as const,
  },
  {
    date: "Feb 15",
    title: "California SUI rate updated and applied",
    description: "New rate of 2.7% applied to payroll effective immediately.",
    status: "completed" as const,
  },
  {
    date: "Feb 12",
    title: "Ohio Withholding Registration submitted",
    description: "Application sent to Ohio Department of Taxation. Awaiting confirmation.",
    status: "in-progress" as const,
  },
  {
    date: "Feb 10",
    title: "CA Pay Data report submitted",
    description: "SB 973 compliance filing completed with California CRD.",
    status: "completed" as const,
  },
  {
    date: "Feb 8",
    title: "Healthy SF mandate assessment completed",
    description: "San Francisco healthcare expenditure requirements met for Q1.",
    status: "completed" as const,
  },
]

const statusDot = {
  completed: "bg-success",
  "in-progress": "bg-warning",
}

export function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          Operational Activity Timeline
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Recent compliance actions handled on your behalf.
        </p>
      </div>
      <div className="max-h-[400px] overflow-y-auto px-6 py-4">
        <div className="relative">
          <div className="absolute left-[3px] top-2 h-[calc(100%-16px)] w-px bg-border" />
          <div className="flex flex-col gap-6">
            {events.map((event, index) => (
              <div key={index} className="relative flex gap-4 pl-6">
                <span
                  className={`absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full ${statusDot[event.status]} ring-2 ring-card`}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {event.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
