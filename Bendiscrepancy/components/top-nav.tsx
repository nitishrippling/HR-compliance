"use client"

import { Search, HelpCircle, Crosshair, MessageSquare, Bell, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopNav() {
  return (
    <header className="flex h-12 items-center bg-primary px-4 text-primary-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-primary-foreground">
          <rect x="0" y="0" width="5" height="8" rx="1" fill="currentColor" />
          <rect x="7" y="0" width="5" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="0" width="5" height="20" rx="1" fill="currentColor" />
        </svg>
        <span className="text-sm font-semibold">Benefits</span>
        <ChevronDown className="size-4 opacity-70" />
      </div>

      {/* Search bar */}
      <div className="mx-6 flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-foreground/50" />
          <input
            type="text"
            placeholder="Search or jump to..."
            className="h-8 w-full rounded-md bg-primary-foreground/10 pl-9 pr-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus:bg-primary-foreground/15 transition-colors"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        <button className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Help">
          <HelpCircle className="size-5" />
        </button>
        <button className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Targets">
          <Crosshair className="size-5" />
        </button>
        <button className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Messages">
          <MessageSquare className="size-5" />
        </button>
        <button className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Notifications">
          <Bell className="size-5" />
        </button>
        <button className="rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Settings">
          <Settings className="size-5" />
        </button>
        <div className="ml-2 flex items-center gap-2">
          <span className="text-sm">Acme, Inc.</span>
          <Avatar className="size-8 border-2 border-primary-foreground/30">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">AI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
