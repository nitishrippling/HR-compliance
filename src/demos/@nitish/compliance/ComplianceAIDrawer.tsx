import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Drawer from '@rippling/pebble/Drawer';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';

interface ActionItem {
  task: string;
  category: string;
  risk: string;
  dueDate: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const mockResponses: Record<string, string> = {
  'Texas Withholding Registration':
    "Here's what you need to do to resolve the **Texas Withholding Registration**:\n\n**Why this is blocked:**\nTexas requires employers to register with the Texas Workforce Commission (TWC) before processing payroll in the state. Without this registration, your payroll for Texas-based employees cannot be processed.\n\n**Steps to resolve:**\n1. Go to the TWC Employer Portal at twc.texas.gov\n2. File Form C-1 (Employer's Status Report) if you're a new employer in TX\n3. You'll receive your TWC Account Number within 5-7 business days\n4. Enter the account number back here so Rippling can configure withholding\n\n**What you'll need:**\n- Federal EIN\n- Date of first wages paid in Texas\n- Business entity type and formation date\n- Number of employees in Texas\n\nWould you like me to walk you through any of these steps in more detail?",

  'Upload Certificate of Incorporation':
    "Here's what's needed for the **Certificate of Incorporation upload**:\n\n**Why this is required:**\nForeign qualification in new states requires proof that your company is a legal entity. The Certificate of Incorporation (or Certificate of Formation) is the foundational document needed.\n\n**What to upload:**\n- Your original Certificate of Incorporation from your home state\n- It should be a certified copy (stamped by Secretary of State)\n- Accepted formats: PDF, JPG, PNG (max 10MB)\n\n**Where to find it:**\n- Check your company formation documents from your registered agent\n- You can request a certified copy from your home state's Secretary of State office (usually $10-25)\n- If you used a service like LegalZoom or Stripe Atlas, it should be in your account\n\n**Timeline impact:**\nUntil this is uploaded, foreign qualification filings for new states cannot proceed. Current estimated delay: 5-10 business days after upload.\n\nNeed help locating this document?",

  'Confirm ACA Headcount':
    "Here's what's needed for **ACA Headcount Confirmation**:\n\n**What is this?**\nUnder the Affordable Care Act (ACA), employers with 50+ full-time equivalent employees must provide health coverage. This annual confirmation verifies your employee count for reporting purposes.\n\n**What to review:**\n- Total full-time employees (30+ hours/week) as of Jan 1, 2026\n- Full-time equivalent count for variable-hour employees\n- Any employees excluded under the look-back measurement period\n\n**Rippling has pre-calculated your count:**\n- Full-time employees: 47\n- FTE from part-time: 6.2\n- Total ALE count: 53.2\n\n**What you need to do:**\n1. Review the pre-calculated headcount\n2. Confirm or adjust if any employees were misclassified\n3. Click 'Confirm' to lock in the count for 1095-C filing\n\n**Deadline:** March 31, 2026 (IRS Form 1095-C distribution deadline)\n\nWould you like me to explain how full-time equivalents are calculated?",

  'California SUI Rate Verification':
    "Here's what's needed for **California SUI Rate Verification**:\n\n**What happened:**\nCalifornia EDD issued your 2026 SUI (State Unemployment Insurance) rate notice. Rippling detected a potential mismatch between the rate on file (3.4%) and what may be on your DE 2088 notice.\n\n**Why it matters:**\nIf the rate in the system doesn't match your actual rate, your quarterly tax deposits will be incorrect, potentially resulting in penalties or underpayment.\n\n**Steps to resolve:**\n1. Locate your DE 2088 (Unemployment Insurance Rate Notice) -- mailed by CA EDD in December 2025\n2. Check the \"UI Rate\" line on the notice\n3. Compare it with the 3.4% currently configured\n4. If different, enter the correct rate and upload the DE 2088 as verification\n\n**Can't find your DE 2088?**\n- Log into your EDD employer account at edd.ca.gov\n- Navigate to Rate Inquiry\n- The current year rate is displayed on your account summary\n\nWant help interpreting the DE 2088 notice?",

  'Ohio Municipal Tax Setup':
    "Here's what's needed for **Ohio Municipal Tax Setup**:\n\n**Why this is critical:**\nOhio is one of the few states where cities/municipalities levy their own income tax. If you have employees working in Ohio municipalities, you're required to withhold municipal income tax in addition to state tax.\n\n**What's blocking:**\nRippling needs the specific municipal tax jurisdictions for your Ohio employees to configure correct withholding.\n\n**Steps to resolve:**\n1. Identify which Ohio municipalities your employees work and/or live in\n2. For each municipality, determine the local tax rate (typically 1-3%)\n3. Check if each municipality uses RITA or CCA for tax administration\n4. Provide the employer account numbers for each jurisdiction\n\n**Common Ohio municipal tax administrators:**\n- **RITA** (Regional Income Tax Agency) - handles 300+ municipalities\n- **CCA** (Central Collection Agency) - handles Cleveland-area cities\n- Some cities self-administer (Columbus, Cincinnati, Toledo)\n\n**Register here:**\n- RITA: ritaohio.com/Employers\n- CCA: ccatax.ci.cleveland.oh.us\n\nNeed help figuring out which municipalities apply to your employees?",
};

const followUpResponses: Record<string, string> = {
  default:
    "That's a great question. Based on the specific requirements for this task, I'd recommend reaching out to your state's regulatory agency directly for the most up-to-date guidance. However, I can tell you that most employers in similar situations typically resolve this within 3-5 business days once all documentation is submitted.\n\nIs there anything else specific about this task I can help clarify?",
  timeline:
    "Typical processing times vary by state, but here's what to expect:\n\n- **State registrations:** 5-10 business days\n- **Document reviews:** 2-3 business days after upload\n- **Rate verifications:** Immediate once confirmed\n- **Municipal setups:** 3-7 business days per jurisdiction\n\nRippling will automatically update the status once the agency processes your submission. You'll get a notification when it's complete.",
  help: "If you're stuck, here are your options:\n\n1. **Rippling Support** - Click the help icon in the top nav for live chat\n2. **Your HR Admin** - They may have handled similar registrations before\n3. **State Agency** - Direct contact info is usually on the registration form\n4. **Your CPA/Accountant** - They often handle state registrations for clients\n\nWould you like me to provide the specific contact info for the relevant agency?",
};

function getFollowUpResponse(input: string): string {
  const lower = input.toLowerCase();
  if (['how long', 'timeline', 'when', 'time'].some(k => lower.includes(k))) {
    return followUpResponses.timeline;
  }
  if (['help', 'stuck', 'contact', 'support'].some(k => lower.includes(k))) {
    return followUpResponses.help;
  }
  return followUpResponses.default;
}

function renderMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={j}>{part}</span>;
  });
}

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const AssistantMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AssistantLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AssistantContent = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space800};
  white-space: pre-wrap;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
`;

const UserMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserBubble = styled.div`
  max-width: 90%;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner3xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  line-height: 1.5;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
  padding-left: ${({ theme }) => (theme as StyledTheme).space800};
`;

const TypingDot = styled.span<{ delay: number }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  animation: bounce 1.4s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay}ms;

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const InputArea = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
`;

const InputContainer = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;

  &:focus-within {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const StyledTextarea = styled.textarea`
  display: block;
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

const InputActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space200};
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: none;
  background: transparent;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

const Disclaimer = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: center;
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 0 0;
`;

const GreetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => (theme as StyledTheme).space1600} ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const GreetingTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: ${({ theme }) => (theme as StyledTheme).space400} 0 0 0;
`;

const GreetingSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space100} 0 0 0;
`;

interface ComplianceAIDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionItem: ActionItem | null;
}

export const ComplianceAIDrawer: React.FC<ComplianceAIDrawerProps> = ({
  open,
  onOpenChange,
  actionItem,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionItem && open) {
      const initial = mockResponses[actionItem.task];
      if (initial) {
        setMessages([{ role: 'assistant', content: initial }]);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: `I can help you with **${actionItem.task}**. This is categorized under ${actionItem.category} and is currently due ${actionItem.dueDate}.\n\nThe main risk if unresolved: ${actionItem.risk}.\n\nWhat specific questions do you have about this item?`,
          },
        ]);
      }
    }
    if (!open) {
      setMessages([]);
      setInput('');
    }
  }, [actionItem, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getFollowUpResponse(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!actionItem) return null;

  const hasMessages = messages.length > 0;
  const showGreeting = !hasMessages && !isTyping;

  return (
    <Drawer
      isVisible={open}
      onCancel={() => onOpenChange(false)}
      title="Compliance AI"
      width={440}
      isCompact
    >
      <DrawerBody>
        <ChatArea ref={scrollRef}>
          {showGreeting && (
            <GreetingContainer>
              <Icon type={Icon.TYPES.RIPPLING_AI} size={24} />
              <GreetingTitle>Hi there,</GreetingTitle>
              <GreetingSubtitle>What do you need help with?</GreetingSubtitle>
            </GreetingContainer>
          )}

          {hasMessages &&
            messages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <AssistantMessage key={i}>
                  <AssistantHeader>
                    <Icon type={Icon.TYPES.RIPPLING_AI} size={16} />
                    <AssistantLabel>Compliance AI</AssistantLabel>
                  </AssistantHeader>
                  <AssistantContent>{renderMarkdown(msg.content)}</AssistantContent>
                </AssistantMessage>
              ) : (
                <UserMessage key={i}>
                  <UserBubble>{msg.content}</UserBubble>
                </UserMessage>
              ),
            )}

          {isTyping && (
            <AssistantMessage>
              <AssistantHeader>
                <Icon type={Icon.TYPES.RIPPLING_AI} size={16} />
                <AssistantLabel>Compliance AI</AssistantLabel>
              </AssistantHeader>
              <TypingIndicator>
                <TypingDot delay={0} />
                <TypingDot delay={150} />
                <TypingDot delay={300} />
              </TypingIndicator>
            </AssistantMessage>
          )}
        </ChatArea>

        <InputArea>
          <InputContainer>
            <StyledTextarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
            />
            <InputActions>
              <UploadButton aria-label="Upload file">
                <Icon type={Icon.TYPES.UPLOAD} size={14} />
                Upload
              </UploadButton>
              <Button.Icon
                aria-label="Send message"
                icon={Icon.TYPES.ARROW_UP}
                size={Button.SIZES.XS}
                appearance={Button.APPEARANCES.GHOST}
                onClick={handleSend}
                isDisabled={!input.trim() || isTyping}
              />
            </InputActions>
          </InputContainer>
          <Disclaimer>Compliance AI can make mistakes. Check important info.</Disclaimer>
        </InputArea>
      </DrawerBody>
    </Drawer>
  );
};
