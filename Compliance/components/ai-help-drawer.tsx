"use client"

import { useState, useRef, useEffect } from "react"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Send,
  X,
  Sparkles,
  Menu,
  User,
  Columns2,
  Maximize2,
  Upload,
} from "lucide-react"

interface ActionItem {
  priority: "High" | "Medium" | "Low"
  task: string
  category: string
  risk: string
  dueDate: string
  action: string
}

interface Message {
  role: "assistant" | "user"
  content: string
}

// Mock AI responses based on task context
const mockResponses: Record<string, string> = {
  "Texas Withholding Registration":
    "Here's what you need to do to resolve the **Texas Withholding Registration**:\n\n**Why this is blocked:**\nTexas requires employers to register with the Texas Workforce Commission (TWC) before processing payroll in the state. Without this registration, your payroll for Texas-based employees cannot be processed.\n\n**Steps to resolve:**\n1. Go to the TWC Employer Portal at twc.texas.gov\n2. File Form C-1 (Employer's Status Report) if you're a new employer in TX\n3. You'll receive your TWC Account Number within 5-7 business days\n4. Enter the account number back here so Rippling can configure withholding\n\n**What you'll need:**\n- Federal EIN\n- Date of first wages paid in Texas\n- Business entity type and formation date\n- Number of employees in Texas\n\nWould you like me to walk you through any of these steps in more detail?",

  "Upload Certificate of Incorporation":
    "Here's what's needed for the **Certificate of Incorporation upload**:\n\n**Why this is required:**\nForeign qualification in new states requires proof that your company is a legal entity. The Certificate of Incorporation (or Certificate of Formation) is the foundational document needed.\n\n**What to upload:**\n- Your original Certificate of Incorporation from your home state\n- It should be a certified copy (stamped by Secretary of State)\n- Accepted formats: PDF, JPG, PNG (max 10MB)\n\n**Where to find it:**\n- Check your company formation documents from your registered agent\n- You can request a certified copy from your home state's Secretary of State office (usually $10-25)\n- If you used a service like LegalZoom or Stripe Atlas, it should be in your account\n\n**Timeline impact:**\nUntil this is uploaded, foreign qualification filings for new states cannot proceed. Current estimated delay: 5-10 business days after upload.\n\nNeed help locating this document?",

  "Confirm ACA Headcount":
    "Here's what's needed for **ACA Headcount Confirmation**:\n\n**What is this?**\nUnder the Affordable Care Act (ACA), employers with 50+ full-time equivalent employees must provide health coverage. This annual confirmation verifies your employee count for reporting purposes.\n\n**What to review:**\n- Total full-time employees (30+ hours/week) as of Jan 1, 2026\n- Full-time equivalent count for variable-hour employees\n- Any employees excluded under the look-back measurement period\n\n**Rippling has pre-calculated your count:**\n- Full-time employees: 47\n- FTE from part-time: 6.2\n- Total ALE count: 53.2\n\n**What you need to do:**\n1. Review the pre-calculated headcount\n2. Confirm or adjust if any employees were misclassified\n3. Click 'Confirm' to lock in the count for 1095-C filing\n\n**Deadline:** March 31, 2026 (IRS Form 1095-C distribution deadline)\n\nWould you like me to explain how full-time equivalents are calculated?",

  "California SUI Rate Verification":
    "Here's what's needed for **California SUI Rate Verification**:\n\n**What happened:**\nCalifornia EDD issued your 2026 SUI (State Unemployment Insurance) rate notice. Rippling detected a potential mismatch between the rate on file (3.4%) and what may be on your DE 2088 notice.\n\n**Why it matters:**\nIf the rate in the system doesn't match your actual rate, your quarterly tax deposits will be incorrect, potentially resulting in penalties or underpayment.\n\n**Steps to resolve:**\n1. Locate your DE 2088 (Unemployment Insurance Rate Notice) -- mailed by CA EDD in December 2025\n2. Check the \"UI Rate\" line on the notice\n3. Compare it with the 3.4% currently configured\n4. If different, enter the correct rate and upload the DE 2088 as verification\n\n**Can't find your DE 2088?**\n- Log into your EDD employer account at edd.ca.gov\n- Navigate to Rate Inquiry\n- The current year rate is displayed on your account summary\n\nWant help interpreting the DE 2088 notice?",

  "Ohio Municipal Tax Setup":
    "Here's what's needed for **Ohio Municipal Tax Setup**:\n\n**Why this is critical:**\nOhio is one of the few states where cities/municipalities levy their own income tax. If you have employees working in Ohio municipalities, you're required to withhold municipal income tax in addition to state tax.\n\n**What's blocking:**\nRippling needs the specific municipal tax jurisdictions for your Ohio employees to configure correct withholding.\n\n**Steps to resolve:**\n1. Identify which Ohio municipalities your employees work and/or live in\n2. For each municipality, determine the local tax rate (typically 1-3%)\n3. Check if each municipality uses RITA or CCA for tax administration\n4. Provide the employer account numbers for each jurisdiction\n\n**Common Ohio municipal tax administrators:**\n- **RITA** (Regional Income Tax Agency) - handles 300+ municipalities\n- **CCA** (Central Collection Agency) - handles Cleveland-area cities\n- Some cities self-administer (Columbus, Cincinnati, Toledo)\n\n**Register here:**\n- RITA: ritaohio.com/Employers\n- CCA: ccatax.ci.cleveland.oh.us\n\nNeed help figuring out which municipalities apply to your employees?",
}

const followUpResponses: Record<string, string> = {
  default:
    "That's a great question. Based on the specific requirements for this task, I'd recommend reaching out to your state's regulatory agency directly for the most up-to-date guidance. However, I can tell you that most employers in similar situations typically resolve this within 3-5 business days once all documentation is submitted.\n\nIs there anything else specific about this task I can help clarify?",
  timeline:
    "Typical processing times vary by state, but here's what to expect:\n\n- **State registrations:** 5-10 business days\n- **Document reviews:** 2-3 business days after upload\n- **Rate verifications:** Immediate once confirmed\n- **Municipal setups:** 3-7 business days per jurisdiction\n\nRippling will automatically update the status once the agency processes your submission. You'll get a notification when it's complete.",
  help: "If you're stuck, here are your options:\n\n1. **Rippling Support** - Click the help icon in the top nav for live chat\n2. **Your HR Admin** - They may have handled similar registrations before\n3. **State Agency** - Direct contact info is usually on the registration form\n4. **Your CPA/Accountant** - They often handle state registrations for clients\n\nWould you like me to provide the specific contact info for the relevant agency?",
}

function getFollowUpResponse(input: string): string {
  const lower = input.toLowerCase()
  if (
    lower.includes("how long") ||
    lower.includes("timeline") ||
    lower.includes("when") ||
    lower.includes("time")
  ) {
    return followUpResponses.timeline
  }
  if (
    lower.includes("help") ||
    lower.includes("stuck") ||
    lower.includes("contact") ||
    lower.includes("support")
  ) {
    return followUpResponses.help
  }
  return followUpResponses.default
}

function renderMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={j}>{part}</span>
  })
}

export function AIHelpDrawer({
  open,
  onOpenChange,
  actionItem,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionItem: ActionItem | null
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load initial AI message when an action item is selected
  useEffect(() => {
    if (actionItem && open) {
      const initial = mockResponses[actionItem.task]
      if (initial) {
        setMessages([{ role: "assistant", content: initial }])
      } else {
        setMessages([
          {
            role: "assistant",
            content: `I can help you with **${actionItem.task}**. This is categorized under ${actionItem.category} and is currently due ${actionItem.dueDate}.\n\nThe main risk if unresolved: ${actionItem.risk}.\n\nWhat specific questions do you have about this item?`,
          },
        ])
      }
    }
    if (!open) {
      setMessages([])
      setInput("")
    }
  }, [actionItem, open])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  function handleSend() {
    if (!input.trim()) return
    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getFollowUpResponse(userMessage.content)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1200)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!actionItem) return null

  const hasMessages = messages.length > 0
  const showGreeting = !hasMessages && !isTyping

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden border-l border-border p-0 sm:max-w-[440px] [&>button]:hidden"
      >
        {/* Header -- Rippling style */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-foreground">New chat</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Assignee"
            >
              <User className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Split view"
            >
              <Columns2 className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {showGreeting && (
            <div className="flex flex-col items-start px-6 pt-16">
              <Sparkles className="mb-4 h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Hi there,
              </h2>
              <p className="mt-1 text-base text-muted-foreground">
                What do you need help with?
              </p>
            </div>
          )}

          {hasMessages && (
            <div className="flex flex-col gap-6 px-6 py-6">
              {messages.map((msg, i) =>
                msg.role === "assistant" ? (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Compliance AI
                      </span>
                    </div>
                    <div className="pl-8">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {renderMarkdown(msg.content)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-end gap-1">
                    <div className="max-w-[90%] rounded-2xl bg-primary px-4 py-2.5">
                      <p className="text-sm leading-relaxed text-primary-foreground">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )
              )}
              {isTyping && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Compliance AI
                    </span>
                  </div>
                  <div className="pl-8">
                    <div className="flex items-center gap-1.5 py-2">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area -- Rippling style */}
        <div className="shrink-0 border-t border-border px-4 pb-4 pt-3">
          <div className="rounded-xl border border-border bg-card focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              className="block w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <button
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Upload file"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-7 w-7 rounded-md text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] leading-none text-muted-foreground">
            Compliance AI can make mistakes. Check important info.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
