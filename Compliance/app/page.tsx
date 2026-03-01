import { Navbar } from "@/components/navbar"
import { PageTabs } from "@/components/page-tabs"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            HR Services, Compliance Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your compliance for state and local tax accounts, foreign qualification and additional filings.
          </p>
        </div>

        {/* Tabbed Content */}
        <PageTabs />
      </main>
    </div>
  )
}
