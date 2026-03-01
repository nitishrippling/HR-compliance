import { Search, HelpCircle, Bell, Settings, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between bg-primary px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <div className="h-4 w-1 rounded-sm bg-primary-foreground" />
            <div className="h-4 w-1 rounded-sm bg-primary-foreground" />
            <div className="h-4 w-1 rounded-sm bg-primary-foreground" />
          </div>
        </div>
        <span className="text-sm font-semibold text-primary-foreground">
          HR Services
        </span>
      </div>

      <div className="hidden w-full max-w-md md:block">
        <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-1.5">
          <Search className="h-4 w-4 text-primary-foreground/60" />
          <span className="text-sm text-primary-foreground/60">
            Search or jump to...
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          aria-label="Help"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          aria-label="Messages"
        >
          <MessageSquare className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-primary-foreground/90 lg:block">
            Acme, Inc.
          </span>
          <Avatar className="h-7 w-7 border border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground/10 text-xs text-primary-foreground">
              AC
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
