import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import RipplingLogo from '@/assets/rippling-logo-black.svg';
import Page from '@rippling/pebble/Page';
import Tabs from '@rippling/pebble/Tabs';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';
import Button from '@rippling/pebble/Button';
import { SubTabs } from './shared-styles';
import { WorkforceTab } from './WorkforceTab';
import { FilingsV3Tab } from './FilingsV3Tab';
import { OthersV3Tab } from './OthersV3Tab';
import {
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  TypeBadge,
  CreatedByBadge,
  StatusDot,
  StatusCell,
  StatusLabel,
  DueDate,
  CellText,
  CellTextBold,
  CellTextMono,
  CellTextMuted,
} from './shared-styles';

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════ */

type TxStatus = 'blocked' | 'in-progress';
type OhioStatus = 'pending' | 'in-progress';
type ActiveTask = 'texas' | 'ohio' | null;
type ChatStage = 'idle' | 'thinking' | 'intro' | 'location-question' | 'signer-question' | 'account-question' | 'submitting' | 'done';

const THINKING_STEPS_TEXAS = [
  'Scanning compliance dashboard for blocked tasks...',
  'Found: Texas Withholding Registration — Blocked on you',
  'Looking up TWC Form C-1 field requirements (13 fields)...',
  'Pulling entity data from Rippling Company Settings...',
  'EIN 47-2814593, entity type C Corp, Delaware — confirmed',
  'Fetching Texas payroll records — first wages paid Feb 1, 2026',
  'Employees in TX: 3, NAICS code 5415 matched',
  'Retrieving principal office and Texas business address...',
  'Checking registered agent and contact details...',
  '11 of 13 fields can be pre-filled from Rippling data',
  '2 fields require user input: authorized signer, prior account',
  'Preparing review summary...',
];

const THINKING_STEPS_OHIO = [
  'Scanning compliance dashboard for pending registrations...',
  'Found: Ohio Municipal Tax Setup — action required by Mar 1, 2026',
  'Fetching Ohio employee records from Rippling payroll...',
  'Found 4 employees with Ohio work locations',
  'Geocoding work addresses against Ohio municipal tax boundaries...',
  '5450 Dublin Rd → City of Dublin → RITA jurisdiction',
  '800 N High St, Columbus → City of Columbus → self-administered',
  'Checking for existing RITA or CCA employer accounts...',
  'No existing Ohio local tax accounts found',
  '2 registrations required: RITA (Dublin) + Columbus self-admin',
  'Pre-filling RITA Form 11 and Columbus employer registration...',
  'Company EIN, entity type, payroll data — all confirmed',
  'Ready — 1 confirmation needed before filing',
];

const OHIO_EMPLOYEES = [
  { name: 'Alex Johnson', address: '5450 Dublin Rd, Dublin OH 43017', municipality: 'Dublin', jurisdiction: 'RITA', rate: '2.0%' },
  { name: 'Maria Santos', address: '5450 Dublin Rd, Dublin OH 43017', municipality: 'Dublin', jurisdiction: 'RITA', rate: '2.0%' },
  { name: 'Daniel Park', address: '800 N High St, Columbus OH 43215', municipality: 'Columbus', jurisdiction: 'Self-admin', rate: '2.5%' },
  { name: 'Emma Wilson', address: '800 N High St, Columbus OH 43215', municipality: 'Columbus', jurisdiction: 'Self-admin', rate: '2.5%' },
];

type LeftView = 'home' | 'compliance-360';
type HomeStage = 'idle' | 'thinking' | 'results';

const HOME_THINKING_STEPS = [
  'Checking your compliance dashboard...',
  'Scanning state and local registration requirements...',
  'Found 3 items requiring your attention',
  'Calculating penalty exposure and due dates...',
  'Ranking by urgency and risk level...',
  'Preparing your compliance summary...',
];

const COMPLIANCE_RISKS = [
  { name: 'Texas Withholding Registration', type: 'State Tax', dueDate: 'Feb 28, 2026', risk: 'HIGH' as const, detail: '$250 fine already charged', task_id: 'texas' as ActiveTask },
  { name: 'Ohio Municipal Tax Setup', type: 'Local Tax', dueDate: 'Mar 1, 2026', risk: 'MEDIUM' as const, detail: '2 days before $250 fee', task_id: 'ohio' as ActiveTask },
  { name: 'Certificate of Incorporation', type: 'Foreign Qual.', dueDate: 'Mar 5, 2026', risk: 'MEDIUM' as const, detail: '6 days before $250 fee', task_id: null },
];

const HOME_TASKS = [
  { label: 'Overdue', count: 1, color: '#d32f2f' },
  { label: 'Due within 7 days', count: 1, color: '#f57c00' },
  { label: 'Due later', count: 6, color: '#388e3c' },
];

const OHIO_LOCAL_ACCOUNTS = [
  { municipality: 'Dublin', state: 'OH', agency: 'RITA (Regional Income Tax Agency)', accountNumber: 'Pending', status: 'in-progress' as const, detail: 'Submitted Feb 25, 2026', employees: 2 },
  { municipality: 'Columbus', state: 'OH', agency: 'City of Columbus Income Tax Division', accountNumber: 'Pending', status: 'in-progress' as const, detail: 'Submitted Feb 25, 2026', employees: 2 },
];

const OFFICERS = [
  { id: 'jennifer', name: 'Jennifer Walsh', title: 'Chief Executive Officer' },
  { id: 'marcus', name: 'Marcus Rivera', title: 'Chief Financial Officer' },
  { id: 'sarah', name: 'Sarah Chen', title: 'VP of Human Resources' },
];

const PRE_FILLED_FIELDS = [
  { label: 'Legal entity name', value: 'Acme Corporation' },
  { label: 'Federal EIN', value: '47-2814593' },
  { label: 'Entity type', value: 'C Corporation' },
  { label: 'State of formation', value: 'Delaware' },
  { label: 'Formation date', value: 'March 15, 2019' },
  { label: 'Texas business address', value: '1200 Congress Ave, Austin TX 78701' },
  { label: 'Principal office address', value: '555 Market St, San Francisco CA 94105' },
  { label: 'Date first TX wages paid', value: 'February 1, 2026' },
  { label: 'Employees in Texas', value: '3' },
  { label: 'Business type (NAICS)', value: '5415 – Computer Systems Design' },
  { label: 'Contact email', value: 'hr@acmecorp.com' },
];

/* ═══════════════════════════════════════════════════════
   OUTER SHELL LAYOUT
   ═══════════════════════════════════════════════════════ */

const Shell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

/* ═══════════════════════════════════════════════════════
   LEFT PANE — Rippling product UI
   ═══════════════════════════════════════════════════════ */

const LeftPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

const HeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const PageHeaderWrapper = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space1400};
  padding-right: ${({ theme }) => (theme as StyledTheme).space1400};
  & > div { margin-bottom: 0 !important; }
  & div[class*='Content'] {
    margin-top: ${({ theme }) => (theme as StyledTheme).space1000} !important;
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200} !important;
  }
`;

const TabsWrapper = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1400};
  & > div, & div[class*='StyledScroll'], & div[class*='StyledTabContainer'] {
    box-shadow: none !important;
  }
`;

const SubTabsBar = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space1400}`};
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1400}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

/* ═══════════════════════════════════════════════════════
   LEFT PANE — Overview tab
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  cursor: pointer;
  transition: background-color 120ms ease, box-shadow 120ms ease;
  &:hover {
    background-color: ${({ theme }) => getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CardNumber = styled.span<{ variant?: 'error' | 'success' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 600;
  color: ${({ variant, theme }) =>
    variant === 'error' ? (theme as StyledTheme).colorError :
    variant === 'success' ? (theme as StyledTheme).colorSuccess :
    (theme as StyledTheme).colorOnSurface};
`;

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const SectionName = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const ViewAllLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  &:hover { text-decoration: underline; }
`;

const OverviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const OverviewTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 120ms ease;
  &:last-child { border-bottom: none; }
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const OverviewTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const RiskText = styled.span<{ isCharged?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isCharged }) => isCharged ? 'rgb(183,28,28)' : 'rgb(100,100,100)'};
  font-weight: ${({ isCharged }) => isCharged ? 500 : 400};
`;

const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ImpactStatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space1600};
  flex-wrap: wrap;
`;

const ImpactStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ImpactValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 600;
`;

const ImpactLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════════════
   LEFT PANE — State Tax Accounts (live-updating)
   ═══════════════════════════════════════════════════════ */

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionTitleText = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const UpdatedBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccessContainer};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorSuccess};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 500;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const BannerDismiss = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

/* ═══════════════════════════════════════════════════════
   RIGHT PANE — Rippling AI Chat Panel
   ═══════════════════════════════════════════════════════ */

const RightPane = styled.div`
  width: 500px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

const PanelTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PanelTitleText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const PanelSubtitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PanelIcons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const IconBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space500};
`;

/* ─── AI message ─── */

const AIMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AIMessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AIIconCircle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AILabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AIMessageBody = styled.div`
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const AIText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  line-height: 1.6;
`;

/* ─── User message ─── */

const UserMessageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UserBubble = styled.div`
  max-width: 85%;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner3xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  line-height: 1.5;
`;

/* ─── Typing indicator ─── */

const TypingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TypingDots = styled.div`
  padding-left: 30px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Dot = styled.span<{ delay: number }>`
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

/* ─── Pre-filled fields widget ─── */

const WidgetCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const WidgetTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FieldListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  &:last-child { border-bottom: none; }
`;

const FieldListLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  flex-shrink: 0;
  width: 140px;
`;

const FieldListValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  text-align: right;
`;

/* ─── Signer picker widget ─── */

const SignerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SignerCard = styled.div<{ selected?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 1.5px solid ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  transition: border-color 120ms ease;
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  &:hover {
    border-color: ${({ selected, theme }) =>
      selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  }
`;

const RadioDot = styled.div<{ selected: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  background-color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : 'transparent'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: white;
    opacity: ${({ selected }) => selected ? 1 : 0};
  }
`;

const SignerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const SignerName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const SignerTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
`;

/* ─── Yes / No widget ─── */

const YesNoRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const YesNoBtn = styled.button<{ active?: boolean; disabled?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border: 1.5px solid ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  font-weight: ${({ active }) => active ? 600 : 400};
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  transition: border-color 120ms ease, color 120ms ease;
  &:hover { border-color: ${({ active, theme }) => active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline}; }
`;

/* ─── Success card in chat ─── */

const SuccessCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-left: 3px solid ${({ theme }) => (theme as StyledTheme).colorSuccess};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SuccessTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SuccessText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
`;

const ViewInRippling = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-top: ${({ theme }) => (theme as StyledTheme).space100};
`;

/* ─── Chat input bar ─── */

const InputBar = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  flex-shrink: 0;
`;

const InputInner = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
`;

const InputText = styled.span`
  flex: 1;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const Disclaimer = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: center;
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 0;
`;

/* ─── Claude-style thinking block ─── */

const ThinkingBlock = styled.div`
  margin-left: 30px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  overflow: hidden;
`;

const ThinkingBlockHeader = styled.button<{ done?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ done, theme }) =>
    done ? (theme as StyledTheme).colorSurfaceContainerLow : (theme as StyledTheme).colorSurfaceContainerLow};
  border: none;
  cursor: pointer;
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
`;

const ThinkingHeaderLabel = styled.span`
  flex: 1;
`;

const ChevronIcon = styled.span<{ expanded: boolean }>`
  transition: transform 200ms ease;
  transform: ${({ expanded }) => expanded ? 'rotate(0deg)' : 'rotate(-90deg)'};
  display: flex;
  align-items: center;
`;

const ThinkingContent = styled.div`
  padding: 8px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  max-height: 220px;
  overflow-y: auto;
`;

const ThinkingStepLine = styled.div<{ isLatest?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ isLatest, theme }) =>
    isLatest ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
  line-height: 1.6;
  opacity: ${({ isLatest }) => isLatest ? 1 : 0.6};
  animation: fadeSlideIn 220ms ease forwards;
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ThinkingCursor = styled.span`
  display: inline-block;
  width: 6px;
  height: 11px;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 900ms step-end infinite;
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const SpinnerRing = styled.span`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-top-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  animation: spin 700ms linear infinite;
  flex-shrink: 0;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* ─── Ohio employee location widget ─── */

const EmpTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const EmpTh = styled.th`
  text-align: left;
  padding: 6px 10px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
`;

const EmpTd = styled.td`
  padding: 7px 10px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
`;

const JurisdictionBadge = styled.span<{ type: 'RITA' | 'Self-admin' }>`
  display: inline-block;
  padding: 1px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1.5px solid ${({ type, theme }) =>
    type === 'RITA' ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  color: ${({ type, theme }) =>
    type === 'RITA' ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const LocalAccountCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const LocalAccountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
`;

const LocalAccountMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LocalAccountName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const LocalAccountSub = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
`;

/* ═══════════════════════════════════════════════════════
   HOME PAGE — Left pane
   ═══════════════════════════════════════════════════════ */

/* ── Topbar — copied from NavigationShell ── */
const TopBar = styled.div`
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const TopBarLogoCol = styled.div`
  width: 266px;
  flex-shrink: 0;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TopBarDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  opacity: 0.2;
  flex-shrink: 0;
`;

const TopBarMain = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space400};
  flex-shrink: 0;
`;

/* ── Sidebar + content — copied from NavigationShell ── */
const HomeLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

const HomeSidebar = styled.div`
  width: 266px;
  flex-shrink: 0;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SidebarNavGroup = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space200} 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SidebarDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SidebarNavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorSurfaceContainerLow : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease-in-out;
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const SidebarIconWrap = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SidebarNavLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SidebarChevron = styled.div`
  margin-left: auto;
`;

const SidebarSectionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space100};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  height: 31px;
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
`;

const SidebarFooter = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SidebarCollapseBtn = styled.button`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const HomeMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const HomeSearchBar = styled.div`
  flex: 1;
  max-width: 480px;
  height: 36px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const HomeSearchText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const HomeContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space800};
`;

const HomeGreeting = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600};
`;

const HomeTasksCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const HomeTasksHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const HomeTasksTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const HomeTasksViewAll = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  font-weight: 500;
`;

const HomeTasksBody = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space1000};
  align-items: flex-start;
`;

const HomeTasksBigNumber = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HomeTasksCount = styled.span`
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const HomeTasksCountLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const HomeTasksBreakdown = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const HomeTasksBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const HomeTasksDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const HomeTasksBreakdownLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  flex: 1;
`;

const HomeTasksBreakdownCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const HomeTasksBar = styled.div`
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  gap: 2px;
  margin-top: ${({ theme }) => (theme as StyledTheme).space300};
`;

const HomeTasksBarSegment = styled.div<{ color: string; flex: number }>`
  flex: ${({ flex }) => flex};
  background-color: ${({ color }) => color};
  border-radius: 3px;
`;

const HomeDashboardCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const HomeDashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const HomeDashboardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const HomeDashboardPlaceholder = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space1600} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  text-align: center;
`;

const HomeDashboardPlaceholderText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const HomeTabsRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space600};
`;

const HomeTab = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: ${({ active }) => active ? 600 : 400};
  border-bottom: 2px solid ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorOnSurface : 'transparent'};
  margin-bottom: -1px;
`;

const HomeTabContent = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space600};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const HomeTabContentBanner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AppsSection = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space600};
`;

const AppsSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const AppsSectionTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const AppsGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  flex-wrap: wrap;
`;

const AppTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 64px;
  cursor: pointer;
`;

const AppTileIcon = styled.div<{ color: string }>`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppTileLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const AppTileAddNew = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1.5px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const ComplianceContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

/* ═══════════════════════════════════════════════════════
   HOME AI PANEL
   ═══════════════════════════════════════════════════════ */


const HomeInputSendBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

const PrefilledText = styled.span`
  flex: 1;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const RiskTableWidget = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const RiskTableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const RiskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
`;

const RiskRowInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RiskRowName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RiskRowMeta = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
`;

const RiskBadge = styled.span<{ level: 'HIGH' | 'MEDIUM' }>`
  flex-shrink: 0;
  padding: 1px 7px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 700;
  background-color: ${({ level, theme }) =>
    level === 'HIGH' ? (theme as StyledTheme).colorErrorContainer : (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ level, theme }) =>
    level === 'HIGH' ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TakeActionBtn = styled.button<{ disabled?: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1.5px solid ${({ disabled, theme }) =>
    disabled ? (theme as StyledTheme).colorOutlineVariant : (theme as StyledTheme).colorPrimary};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ disabled, theme }) =>
    disabled ? (theme as StyledTheme).colorOnSurfaceVariant : (theme as StyledTheme).colorPrimary};
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

/* ─── Ohio adjustment widget ─── */

const AdjustWidget = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const AdjustWidgetHeader = styled.div`
  padding: 9px 14px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const AdjustRow = styled.div<{ isRemote?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ isRemote, theme }) =>
    isRemote ? (theme as StyledTheme).colorSurfaceContainerLow : 'transparent'};
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  transition: background-color 150ms ease;
  &:last-of-type { border-bottom: none; }
`;

const AdjustEmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const AdjustEmpName = styled.span<{ isRemote?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ isRemote, theme }) =>
    isRemote ? (theme as StyledTheme).colorOnSurfaceVariant : (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  text-decoration: ${({ isRemote }) => isRemote ? 'line-through' : 'none'};
`;

const AdjustEmpSub = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
`;

const RemoteToggle = styled.button<{ active?: boolean }>`
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1.5px solid ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;
`;

const AdjustFooter = styled.div`
  padding: 10px 14px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const AdjustNote = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-size: 11px;
  flex: 1;
`;

const ConfirmAdjustBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: none;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`;

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

const TAB_NAMES = ['Overview', 'Registrations', 'Filings', 'Workforce', 'Posters & Mails'];

const SUB_TABS: Record<number, string[]> = {
  1: ['State tax accounts', 'Local tax accounts', 'Foreign qualification'],
  2: ['Current', 'Historical'],
  3: ['Current', 'Historical'],
};

const STATE_TAX_ACCOUNTS_BASE = [
  { type: 'Withholding', state: 'TX', agencyName: 'Texas Workforce Commission', accountNumber: 'Pending', createdBy: 'Rippling', suiRate: undefined, status: 'blocked' as const, statusDetail: 'EIN verification needed', dueDate: 'Due Feb 28, 2026' },
  { type: 'SUI', state: 'NJ', agencyName: 'NJ Department of Labor', accountNumber: 'Pending', createdBy: 'Rippling', suiRate: undefined, status: 'blocked' as const, statusDetail: 'Power of attorney signature needed', dueDate: undefined },
  { type: 'Withholding', state: 'OH', agencyName: 'Ohio Dept of Taxation', accountNumber: 'Pending', createdBy: 'Rippling', suiRate: undefined, status: 'in-progress' as const, statusDetail: 'Submitted Feb 12, 2026', dueDate: undefined },
  { type: 'Withholding', state: 'CA', agencyName: 'California EDD', accountNumber: 'CA-998877', createdBy: 'Rippling', suiRate: undefined, status: 'completed' as const, statusDetail: 'Account active', dueDate: undefined },
  { type: 'SUI', state: 'FL', agencyName: 'Florida Dept of Revenue', accountNumber: '1234567', createdBy: 'Rippling', suiRate: '2.7%', status: 'completed' as const, statusDetail: 'Account active', dueDate: undefined },
];

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'error'; label: string }> = {
  blocked: { dotStatus: 'error', label: 'Blocked on you' },
  'in-progress': { dotStatus: 'warning', label: 'In progress' },
  completed: { dotStatus: 'success', label: 'Active' },
};

const typeVariant: Record<string, 'primary' | 'amber'> = {
  Withholding: 'primary',
  SUI: 'amber',
};

export const ComplianceAgentSplitPage: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [subTabIndices, setSubTabIndices] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [txStatus, setTxStatus] = useState<TxStatus>('blocked');
  const [ohioStatus, setOhioStatus] = useState<OhioStatus>('pending');
  const [showOhioAccounts, setShowOhioAccounts] = useState(false);
  const [activeTask, setActiveTask] = useState<ActiveTask>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStage, setChatStage] = useState<ChatStage>('idle');
  const [selectedSigner, setSelectedSigner] = useState<string | null>(null);
  const [accountAnswer, setAccountAnswer] = useState<'yes' | 'no' | null>(null);
  const [ohioLocationConfirmed, setOhioLocationConfirmed] = useState<boolean | null>(null);
  const [showOhioAdjustWidget, setShowOhioAdjustWidget] = useState(false);
  const [ohioRemoteEmployees, setOhioRemoteEmployees] = useState<Set<string>>(new Set());
  const [ohioAdjustConfirmed, setOhioAdjustConfirmed] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showOhioBanner, setShowOhioBanner] = useState(false);
  const [showRowHighlight, setShowRowHighlight] = useState(false);
  const [showOhioRowHighlight, setShowOhioRowHighlight] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [thinkingDone, setThinkingDone] = useState(false);
  const [thinkingExpanded, setThinkingExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [leftView, setLeftView] = useState<LeftView>('home');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [homeStage, setHomeStage] = useState<HomeStage>('idle');
  const [homeThinkingStep, setHomeThinkingStep] = useState(0);
  const [homeThinkingDone, setHomeThinkingDone] = useState(false);
  const [homeThinkingExpanded, setHomeThinkingExpanded] = useState(true);
  const [highlightTxRow, setHighlightTxRow] = useState(false);
  const homeMessagesEndRef = useRef<HTMLDivElement>(null);

  const activeThinkingSteps = activeTask === 'ohio' ? THINKING_STEPS_OHIO : THINKING_STEPS_TEXAS;

  function openChat(task: ActiveTask) {
    setActiveTask(task);
    setChatOpen(true);
    setAiPanelOpen(true);
    setChatStage('idle');
    setThinkingStep(0);
    setThinkingDone(false);
    setThinkingExpanded(true);
    setSelectedSigner(null);
    setAccountAnswer(null);
    setOhioLocationConfirmed(null);
    setShowOhioAdjustWidget(false);
    setOhioRemoteEmployees(new Set());
    setOhioAdjustConfirmed(false);
    // Start thinking directly — can't rely on [chatOpen] effect because chatOpen
    // may already be true (switching from one task to another)
    setTimeout(() => setChatStage('thinking'), 400);
  }

  const currentSubTabs = SUB_TABS[activeTab];
  const activeSubTab = subTabIndices[activeTab] ?? 0;

  function handleSubTabChange(idx: number) {
    setSubTabIndices(prev => ({ ...prev, [activeTab]: idx }));
  }

  function navigateToModule(tabIndex: number, subTabIndex?: number) {
    setActiveTab(tabIndex);
    if (subTabIndex !== undefined) {
      setSubTabIndices(prev => ({ ...prev, [tabIndex]: subTabIndex }));
    }
  }

  // Drive thinking step animation
  useEffect(() => {
    if (chatStage !== 'thinking') return;
    if (thinkingStep >= activeThinkingSteps.length) {
      const doneTimer = setTimeout(() => {
        setThinkingDone(true);
        setTimeout(() => {
          setThinkingExpanded(false);
          setTimeout(() => setChatStage('intro'), 600);
        }, 800);
      }, 400);
      return () => clearTimeout(doneTimer);
    }
    const delay = thinkingStep === 0 ? 300 : 620 + Math.random() * 200;
    const t = setTimeout(() => setThinkingStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [chatStage, thinkingStep, activeThinkingSteps.length]);

  // intro → first question (Texas: account-question flow; Ohio: location-question first)
  useEffect(() => {
    if (chatStage === 'intro') {
      const t = setTimeout(() => {
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          setChatStage(activeTask === 'ohio' ? 'location-question' : 'signer-question');
        }, 1200);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [chatStage, activeTask]);

  // Home thinking animation
  useEffect(() => {
    if (homeStage !== 'thinking') return;
    if (homeThinkingStep >= HOME_THINKING_STEPS.length) {
      const t = setTimeout(() => {
        setHomeThinkingDone(true);
        setTimeout(() => {
          setHomeThinkingExpanded(false);
          setTimeout(() => setHomeStage('results'), 500);
        }, 700);
      }, 300);
      return () => clearTimeout(t);
    }
    const delay = homeThinkingStep === 0 ? 300 : 560 + Math.random() * 180;
    const t = setTimeout(() => setHomeThinkingStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [homeStage, homeThinkingStep]);

  // Scroll home messages to bottom
  useEffect(() => {
    homeMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [homeStage, homeThinkingStep]);

  function handleHomeSend() {
    setHomeStage('thinking');
  }

  function handleTakeAction(task_id: ActiveTask) {
    if (task_id !== 'texas') return; // only Texas for now
    setLeftView('compliance-360');
    setAiPanelOpen(true);
    navigateToModule(1, 0); // Registrations → State Tax
    setHighlightTxRow(true);
    setTimeout(() => {
      setHighlightTxRow(false);
      openChat('texas');
    }, 2200);
  }

  function goHome() {
    setLeftView('home');
    setChatOpen(false);
    setAiPanelOpen(false);
  }

  // Scroll to bottom on new messages or thinking steps
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStage, showTyping, selectedSigner, accountAnswer, thinkingStep]);

  function handleOhioLocationConfirm(confirmed: boolean) {
    if (chatStage !== 'location-question') return;
    if (!confirmed) {
      // Show inline adjustment widget without advancing stage
      setShowOhioAdjustWidget(true);
      return;
    }
    setOhioLocationConfirmed(true);
    setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setChatStage('signer-question');
      }, 1300);
    }, 400);
  }

  function handleOhioAdjustConfirm() {
    setOhioAdjustConfirmed(true);
    setOhioLocationConfirmed(false);
    setShowOhioAdjustWidget(false);
    setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setChatStage('signer-question');
      }, 1300);
    }, 400);
  }

  function toggleOhioRemote(name: string) {
    setOhioRemoteEmployees(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleSignerSelect(id: string) {
    if (chatStage !== 'signer-question') return;
    setSelectedSigner(id);
    setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        // Texas has a second question; Ohio goes straight to submitting
        if (activeTask === 'ohio') {
          setChatStage('submitting');
          setTimeout(() => {
            setOhioStatus('in-progress');
            setShowOhioAccounts(true);
            navigateToModule(1, 1);
            setShowOhioBanner(true);
            setShowOhioRowHighlight(true);
            setChatStage('done');
            setTimeout(() => setShowOhioRowHighlight(false), 3000);
          }, 2000);
        } else {
          setChatStage('account-question');
        }
      }, 1400);
    }, 400);
  }

  function handleAccountAnswer(answer: 'yes' | 'no') {
    if (chatStage !== 'account-question') return;
    setAccountAnswer(answer);
    // Show typing → submitting → navigate + done
    setTimeout(() => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setChatStage('submitting');
        setTimeout(() => {
          // Update left pane: navigate to Registrations → State Tax
          setTxStatus('in-progress');
          navigateToModule(1, 0);
          setShowBanner(true);
          setShowRowHighlight(true);
          setChatStage('done');
          // Flash the row highlight for 3s then remove it
          setTimeout(() => setShowRowHighlight(false), 3000);
        }, 1800);
      }, 1600);
    }, 400);
  }

  // Accounts with live TX status
  const accounts = STATE_TAX_ACCOUNTS_BASE.map(acc => {
    if (acc.state === 'TX' && acc.type === 'Withholding') {
      if (txStatus === 'in-progress') {
        return { ...acc, status: 'in-progress' as const, statusDetail: 'Submitted Feb 25, 2026', dueDate: undefined };
      }
    }
    return acc;
  });

  const sortOrder = { blocked: 0, 'in-progress': 1, completed: 2 };
  const sortedAccounts = [...accounts].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);

  const signerObj = OFFICERS.find(o => o.id === selectedSigner);

  return (
    <Shell theme={theme}>
      {/* ════════════════════════════════════════
          LEFT PANE — Home or Compliance 360
          ════════════════════════════════════════ */}
      <LeftPane>
        {/* ════ TOPBAR — matches NavigationShell ════ */}
        <TopBar theme={theme}>
          <TopBarLogoCol theme={theme} onClick={goHome}>
            <img src={RipplingLogo} alt="Rippling" style={{ width: 127, height: 'auto', padding: (theme as StyledTheme).space200, borderRadius: (theme as StyledTheme).shapeCornerLg }} />
          </TopBarLogoCol>
          <TopBarDivider theme={theme} />
          <TopBarMain theme={theme}>
            <HomeSearchBar theme={theme}>
              <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              <HomeSearchText theme={theme}>Search or jump to...</HomeSearchText>
            </HomeSearchBar>
          </TopBarMain>
          <TopBarRight theme={theme}>
            <IconBtn theme={theme} aria-label="Help">
              <Icon type={Icon.TYPES.HELP_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
            </IconBtn>
            <IconBtn theme={theme} aria-label="Create">
              <Icon type={Icon.TYPES.ADD_CIRCLE_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
            </IconBtn>
            <IconBtn theme={theme} aria-label="Notifications">
              <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
            </IconBtn>
            <IconBtn
              theme={theme}
              aria-label="Toggle AI assistant"
              onClick={() => setAiPanelOpen(o => !o)}
              style={{
                borderRadius: (theme as StyledTheme).shapeCornerLg,
                background: aiPanelOpen ? (theme as StyledTheme).colorSurfaceContainerLow : 'transparent',
              }}
            >
              <Icon type={Icon.TYPES.RIPPLING_AI} size={20} color={aiPanelOpen ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface} />
            </IconBtn>
            <TopBarDivider theme={theme} />
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: (theme as StyledTheme).colorPrimary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: (theme as StyledTheme).colorOnPrimary, fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}>A</div>
          </TopBarRight>
        </TopBar>

        {/* ════ SIDEBAR + CONTENT ════ */}
        <HomeLayout theme={theme}>
          <HomeSidebar theme={theme}>
            <SidebarScrollArea theme={theme}>
            {leftView === 'home' ? (
              <>
                {/* Primary nav — Org Chart (no chevron) */}
                <SidebarNavGroup theme={theme}>
                  <SidebarNavItem theme={theme}>
                    <SidebarIconWrap theme={theme}><Icon type={Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} /></SidebarIconWrap>
                    <SidebarNavLabel>Org Chart</SidebarNavLabel>
                  </SidebarNavItem>
                </SidebarNavGroup>

                {/* Apps section */}
                <SidebarNavGroup theme={theme}>
                  {([
                    { label: 'Favorites',   icon: Icon.TYPES.STAR_OUTLINE },
                    { label: 'Benefits',    icon: Icon.TYPES.HEART_OUTLINE },
                    { label: 'Payroll',     icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE },
                    { label: 'HR',          icon: Icon.TYPES.SHIELD_OUTLINE, onClick: () => { setLeftView('compliance-360'); } },
                    { label: 'Finance',     icon: Icon.TYPES.CREDIT_CARD_OUTLINE },
                    { label: 'Talent',      icon: Icon.TYPES.TALENT_OUTLINE },
                    { label: 'IT',          icon: Icon.TYPES.LAPTOP_OUTLINE },
                    { label: 'Data',        icon: Icon.TYPES.BAR_CHART_OUTLINE },
                    { label: 'Custom Apps', icon: Icon.TYPES.CUSTOM_APPS_OUTLINE },
                  ] as const).map(item => (
                    <SidebarNavItem
                      key={item.label}
                      theme={theme}
                      active={item.label === 'HR' && leftView === 'compliance-360'}
                      onClick={'onClick' in item ? item.onClick : undefined}
                    >
                      <SidebarIconWrap theme={theme}>
                        <Icon type={item.icon} size={20} color={(theme as StyledTheme).colorOnSurface} />
                      </SidebarIconWrap>
                      <SidebarNavLabel>{item.label}</SidebarNavLabel>
                      <SidebarChevron theme={theme}>
                        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurface} />
                      </SidebarChevron>
                    </SidebarNavItem>
                  ))}
                </SidebarNavGroup>

                {/* Platform section */}
                <SidebarNavGroup theme={theme}>
                  <SidebarSectionLabel theme={theme}>Platform</SidebarSectionLabel>
                  {([
                    { label: 'Tools',             icon: Icon.TYPES.WRENCH_OUTLINE, chevron: true },
                    { label: 'Company settings',  icon: Icon.TYPES.SETTINGS_OUTLINE, chevron: true },
                    { label: 'App Shop',          icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE, chevron: false },
                    { label: 'Help',              icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE, chevron: false },
                  ] as const).map(item => (
                    <SidebarNavItem key={`plat-${item.label}`} theme={theme}>
                      <SidebarIconWrap theme={theme}>
                        <Icon type={item.icon} size={20} color={(theme as StyledTheme).colorOnSurface} />
                      </SidebarIconWrap>
                      <SidebarNavLabel>{item.label}</SidebarNavLabel>
                      {item.chevron && (
                        <SidebarChevron theme={theme}>
                          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurface} />
                        </SidebarChevron>
                      )}
                    </SidebarNavItem>
                  ))}
                </SidebarNavGroup>
              </>
            ) : (
              <>
                {/* HR module sidebar */}
                <SidebarNavGroup theme={theme}>
                  <SidebarNavItem theme={theme}>
                    <SidebarIconWrap theme={theme}><Icon type={Icon.TYPES.USER_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} /></SidebarIconWrap>
                    <SidebarNavLabel>People Overview</SidebarNavLabel>
                  </SidebarNavItem>
                </SidebarNavGroup>
                <SidebarNavGroup theme={theme}>
                  {([
                    { label: 'Anniversaries',              icon: Icon.TYPES.CALENDAR_OUTLINE },
                    { label: 'Compliance 360',             icon: Icon.TYPES.APPROVE_REJECT_SHIELD_OUTLINE },
                    { label: 'Contractor Hub',             icon: Icon.TYPES.BRIEFCASE_OUTLINE },
                    { label: 'EEO Reporting',              icon: Icon.TYPES.BAR_CHART_OUTLINE },
                    { label: 'Employment Authorization',   icon: Icon.TYPES.FINGERPRINT },
                    { label: 'Employment Verifications',   icon: Icon.TYPES.FILE_USER_CHECK_OUTLINE },
                    { label: 'Org Chart',                  icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
                  ] as const).map(item => (
                    <SidebarNavItem
                      key={item.label}
                      theme={theme}
                      active={item.label === 'Compliance 360'}
                    >
                      <SidebarIconWrap theme={theme}>
                        <Icon type={item.icon} size={20} color={
                          item.label === 'Compliance 360'
                            ? (theme as StyledTheme).colorPrimary
                            : (theme as StyledTheme).colorOnSurface
                        } />
                      </SidebarIconWrap>
                      <SidebarNavLabel>{item.label}</SidebarNavLabel>
                    </SidebarNavItem>
                  ))}
                </SidebarNavGroup>

                {/* Platform section */}
                <SidebarNavGroup theme={theme}>
                  <SidebarSectionLabel theme={theme}>Platform</SidebarSectionLabel>
                  {([
                    { label: 'Tools',             icon: Icon.TYPES.WRENCH_OUTLINE, chevron: true },
                    { label: 'Company settings',  icon: Icon.TYPES.SETTINGS_OUTLINE, chevron: true },
                    { label: 'App Shop',          icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE, chevron: false },
                    { label: 'Help',              icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE, chevron: false },
                  ] as const).map(item => (
                    <SidebarNavItem key={`plat-${item.label}`} theme={theme}>
                      <SidebarIconWrap theme={theme}>
                        <Icon type={item.icon} size={20} color={(theme as StyledTheme).colorOnSurface} />
                      </SidebarIconWrap>
                      <SidebarNavLabel>{item.label}</SidebarNavLabel>
                      {item.chevron && (
                        <SidebarChevron theme={theme}>
                          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurface} />
                        </SidebarChevron>
                      )}
                    </SidebarNavItem>
                  ))}
                </SidebarNavGroup>
              </>
            )}
            </SidebarScrollArea>
            <SidebarFooter theme={theme}>
              <SidebarNavGroup theme={theme}>
                <SidebarCollapseBtn theme={theme}>
                  <SidebarIconWrap theme={theme}>
                    <Icon type={Icon.TYPES.COLLAPSE_PANEL_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </SidebarIconWrap>
                  Collapse
                </SidebarCollapseBtn>
              </SidebarNavGroup>
            </SidebarFooter>
          </HomeSidebar>

          {/* ── Content area ── */}
          <HomeMain theme={theme}>

            {/* ── HOME content ── */}
            {leftView === 'home' && (
              <HomeContent theme={theme}>
                {/* Quick access placeholder */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: (theme as StyledTheme).colorOnSurface, marginBottom: 12 }}>Quick access</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} style={{
                        width: 48, height: 48, borderRadius: 12,
                        backgroundColor: (theme as StyledTheme).colorSurfaceContainerLow,
                      }} />
                    ))}
                  </div>
                </div>

                <HomeGreeting theme={theme}>Hello, Sam</HomeGreeting>

                <HomeTasksCard theme={theme}>
                  <HomeTasksHeader theme={theme}>
                    <HomeTasksTitle theme={theme}>Your Tasks</HomeTasksTitle>
                    <HomeTasksViewAll theme={theme}>View Tasks</HomeTasksViewAll>
                  </HomeTasksHeader>
                  <HomeTasksBody theme={theme}>
                    {/* Left: big count */}
                    <HomeTasksBigNumber theme={theme} style={{ paddingRight: 24 }}>
                      <HomeTasksCount theme={theme}>8</HomeTasksCount>
                      <HomeTasksCountLabel theme={theme}>Pending to-dos</HomeTasksCountLabel>
                    </HomeTasksBigNumber>
                    {/* Middle: header row with dots + labels, then big numbers, then bar */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, borderLeft: `1px solid ${(theme as StyledTheme).colorOutlineVariant}`, padding: '0 24px' }}>
                      <div style={{ display: 'flex', gap: 24 }}>
                        {HOME_TASKS.map(t => (
                          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <HomeTasksDot color={t.color} />
                            <span style={{ fontSize: 13, color: (theme as StyledTheme).colorOnSurfaceVariant }}>{t.label}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 24 }}>
                        {HOME_TASKS.map(t => (
                          <span key={t.label} style={{ fontSize: 24, fontWeight: 700, color: (theme as StyledTheme).colorOnSurface, minWidth: 30 }}>{t.count}</span>
                        ))}
                      </div>
                      <HomeTasksBar theme={theme}>
                        <HomeTasksBarSegment color="#d32f2f" flex={1} />
                        <HomeTasksBarSegment color="#f57c00" flex={1} />
                        <HomeTasksBarSegment color="#388e3c" flex={6} />
                        <HomeTasksBarSegment color={(theme as StyledTheme).colorSurfaceContainerHigh} flex={8} />
                      </HomeTasksBar>
                    </div>
                    {/* Right: Not viewed / Viewed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderLeft: `1px solid ${(theme as StyledTheme).colorOutlineVariant}`, padding: '0 24px', minWidth: 130 }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <HomeTasksDot color="#388e3c" />
                          <span style={{ fontSize: 13, color: (theme as StyledTheme).colorOnSurfaceVariant }}>Not viewed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <HomeTasksDot color="#e91e63" />
                          <span style={{ fontSize: 13, color: (theme as StyledTheme).colorOnSurfaceVariant }}>Viewed</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: (theme as StyledTheme).colorOnSurface, minWidth: 30 }}>0</span>
                        <span style={{ fontSize: 24, fontWeight: 700, color: (theme as StyledTheme).colorOnSurface, minWidth: 30 }}>8</span>
                      </div>
                      <HomeTasksBar theme={theme}>
                        <HomeTasksBarSegment color="#388e3c" flex={0} />
                        <HomeTasksBarSegment color="#e91e63" flex={8} />
                        <HomeTasksBarSegment color={(theme as StyledTheme).colorSurfaceContainerHigh} flex={8} />
                      </HomeTasksBar>
                    </div>
                  </HomeTasksBody>
                </HomeTasksCard>

                {/* Analytics / Apps / Feed tabs */}
                <HomeTabsRow theme={theme}>
                  {['Analytics', 'Apps', 'Feed'].map((tab, i) => (
                    <HomeTab key={tab} theme={theme} active={i === 0}>{tab}</HomeTab>
                  ))}
                </HomeTabsRow>
                <HomeTabContent theme={theme}>
                  <HomeTabContentBanner theme={theme}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: (theme as StyledTheme).colorOnSurface, marginBottom: 4 }}>Welcome to Dashboards</div>
                      <div style={{ fontSize: 13, color: (theme as StyledTheme).colorOnSurfaceVariant, maxWidth: 480 }}>
                        Build dashboards to track key metrics and share them with your team. Your starter dashboard pulls data from across Rippling.
                      </div>
                    </div>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.PRIMARY}>Take a tour</Button>
                  </HomeTabContentBanner>
                  <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <HomeSearchBar theme={theme} style={{ maxWidth: 220, height: 30 }}>
                      <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={12} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                      <HomeSearchText theme={theme} style={{ fontSize: 12 }}>Find a dashboard</HomeSearchText>
                    </HomeSearchBar>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.PRIMARY}>+ New dashboard</Button>
                  </div>
                </HomeTabContent>

              </HomeContent>
            )}

            {/* ── COMPLIANCE 360 content ── */}
            {leftView === 'compliance-360' && (
              <ComplianceContentWrapper>
        <HeaderArea theme={theme}>
          <PageHeaderWrapper theme={theme}>
            <Page.Header
              title="Compliance 360"
              shouldBeUnderlined={false}
              size={Page.Header.SIZES.FLUID}
            />
          </PageHeaderWrapper>
          <TabsWrapper theme={theme}>
            <Tabs.LINK activeIndex={activeTab} onChange={idx => setActiveTab(Number(idx))}>
              {TAB_NAMES.map((name, i) => (
                <Tabs.Tab key={`split-tab-${i}`} title={name} />
              ))}
            </Tabs.LINK>
          </TabsWrapper>
        </HeaderArea>

        {currentSubTabs && (
          <SubTabsBar theme={theme}>
            <SubTabs
              tabs={currentSubTabs}
              activeIndex={activeSubTab}
              onChange={handleSubTabChange}
            />
          </SubTabsBar>
        )}

        <ContentArea theme={theme}>
          {/* ── Overview tab ── */}
          {activeTab === 0 && (
            <TabContent theme={theme}>
              <SummaryRow theme={theme}>
                {[
                  { label: 'Registrations', count: 3, variant: 'error', statusText: 'Action required' },
                  { label: 'Filings', count: 0, variant: 'success', statusText: 'All caught up' },
                  { label: 'Workforce', count: 24, variant: 'error', statusText: 'Outstanding issues' },
                ].map(card => (
                  <SummaryCard key={card.label} theme={theme} onClick={() => navigateToModule(card.label === 'Registrations' ? 1 : card.label === 'Filings' ? 2 : 3)}>
                    <CardTitle theme={theme}>{card.label}</CardTitle>
                    <CardNumber theme={theme} variant={card.count > 0 ? 'error' : 'success'}>
                      {card.count}
                    </CardNumber>
                    <Label size={Label.SIZES.M} appearance={card.count > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}>
                      {card.statusText}
                    </Label>
                  </SummaryCard>
                ))}
              </SummaryRow>

              <SectionCard theme={theme}>
                <SectionHeader theme={theme}>
                  <SectionName theme={theme}>Registrations</SectionName>
                  <ViewAllLink theme={theme} onClick={() => navigateToModule(1)}>
                    View all
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
                  </ViewAllLink>
                </SectionHeader>
                <OverviewTable>
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <tbody>
                    {[
                      { task: 'Texas Withholding Registration', category: 'State Tax', dueDate: 'Feb 28, 2026', risk: txStatus === 'in-progress' ? 'In progress' : '$250 fine already charged', isCharged: txStatus === 'blocked', task_id: 'texas' as ActiveTask },
                      { task: 'Ohio Municipal Tax Setup', category: 'Local Tax', dueDate: 'Mar 1, 2026', risk: ohioStatus === 'in-progress' ? 'In progress' : '2 days left before $250 fee', isCharged: false, task_id: 'ohio' as ActiveTask },
                      { task: 'Upload Certificate of Incorporation', category: 'Foreign Qual.', dueDate: 'Mar 5, 2026', risk: '6 days left before $250 fee', isCharged: false, task_id: null as ActiveTask },
                    ].map((item, i) => (
                      <OverviewTr
                        key={i}
                        theme={theme}
                        onClick={() => item.task_id ? openChat(item.task_id) : navigateToModule(1, 2)}
                      >
                        <OverviewTd theme={theme}>
                          <span style={{ fontWeight: 500 }}>{item.task}</span>
                        </OverviewTd>
                        <OverviewTd theme={theme}>{item.category}</OverviewTd>
                        <OverviewTd theme={theme}>Due {item.dueDate}</OverviewTd>
                        <OverviewTd theme={theme}>
                          <RiskText theme={theme} isCharged={item.isCharged}>{item.risk}</RiskText>
                        </OverviewTd>
                        <OverviewTd theme={theme} style={{ textAlign: 'right' }}>
                          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                        </OverviewTd>
                      </OverviewTr>
                    ))}
                  </tbody>
                </OverviewTable>
              </SectionCard>

              <ImpactCard theme={theme}>
                <ImpactTitle theme={theme}>Rippling's impact</ImpactTitle>
                <ImpactStatsRow theme={theme}>
                  {[
                    { value: '62+', label: 'Hours saved' },
                    { value: '18', label: 'State registrations done' },
                    { value: '5', label: 'Local registrations done' },
                    { value: '6', label: 'Foreign qualifications done' },
                  ].map(m => (
                    <ImpactStat key={m.label}>
                      <ImpactValue theme={theme}>{m.value}</ImpactValue>
                      <ImpactLabel theme={theme}>{m.label}</ImpactLabel>
                    </ImpactStat>
                  ))}
                </ImpactStatsRow>
              </ImpactCard>
            </TabContent>
          )}

          {/* ── Registrations → State Tax Accounts (live) ── */}
          {activeTab === 1 && activeSubTab === 0 && (
            <div>
              {showBanner && (
                <UpdatedBanner theme={theme}>
                  <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={16} color={(theme as StyledTheme).colorSuccess} />
                  Texas Withholding Registration submitted — status updated to In progress
                  <BannerDismiss
                    theme={theme}
                    aria-label="Dismiss"
                    onClick={() => setShowBanner(false)}
                  >
                    <Icon type={Icon.TYPES.CLOSE} size={14} color={(theme as StyledTheme).colorSuccess} />
                  </BannerDismiss>
                </UpdatedBanner>
              )}
              <SearchRow theme={theme}>
                <SectionTitleText theme={theme}>All state tax accounts</SectionTitleText>
              </SearchRow>
              <TableCard>
                <div style={{ overflowX: 'auto' }}>
                  <StyledTable>
                    <StyledTHead>
                      <tr>
                        <StyledTh>Type</StyledTh>
                        <StyledTh>State</StyledTh>
                        <StyledTh>Agency name</StyledTh>
                        <StyledTh>Account #</StyledTh>
                        <StyledTh>Created by</StyledTh>
                        <StyledTh>Status</StyledTh>
                        <StyledTh>Details</StyledTh>
                      </tr>
                    </StyledTHead>
                    <tbody>
                      {sortedAccounts.map((account, index) => {
                        const sc = statusMap[account.status];
                        const isUpdated = account.state === 'TX' && account.type === 'Withholding' && txStatus === 'in-progress';
                        const isTxHighlighted = account.state === 'TX' && account.type === 'Withholding' && highlightTxRow;
                        const isTxRow = account.state === 'TX' && account.type === 'Withholding' && account.status === 'blocked';
                        const isOhioRow = account.state === 'OH' && account.type === 'Withholding' && ohioStatus === 'pending';
                        const isClickable = isTxRow || isOhioRow;
                        return (
                          <StyledTr
                            key={index}
                            onClick={isClickable ? () => openChat(isTxRow ? 'texas' : 'ohio') : undefined}
                            style={{
                              cursor: isClickable ? 'pointer' : 'default',
                              backgroundColor: isUpdated && showRowHighlight
                                ? (theme as StyledTheme).colorSuccessContainer
                                : isTxHighlighted
                                  ? (theme as StyledTheme).colorSurfaceContainerLow
                                  : 'transparent',
                              boxShadow: isTxHighlighted ? `inset 0 0 0 1.5px ${(theme as StyledTheme).colorOutline}` : 'none',
                              transition: 'background-color 600ms ease, box-shadow 300ms ease',
                            }}
                          >
                            <StyledTd>
                              <TypeBadge variant={typeVariant[account.type]}>{account.type}</TypeBadge>
                            </StyledTd>
                            <StyledTd><CellTextBold>{account.state}</CellTextBold></StyledTd>
                            <StyledTd style={{ whiteSpace: 'nowrap' }}>
                              <CellText>
                                {account.agencyName}
                                {account.suiRate && <CellTextMuted> · SUI {account.suiRate}</CellTextMuted>}
                              </CellText>
                            </StyledTd>
                            <StyledTd><CellTextMono>{account.accountNumber}</CellTextMono></StyledTd>
                            <StyledTd>
                              <CreatedByBadge isRippling={account.createdBy === 'Rippling'}>
                                {account.createdBy}
                              </CreatedByBadge>
                            </StyledTd>
                            <StyledTd>
                              <StatusCell>
                                <StatusDot status={sc.dotStatus} />
                                <StatusLabel>{sc.label}</StatusLabel>
                              </StatusCell>
                            </StyledTd>
                            <StyledTd style={{ whiteSpace: 'nowrap' }}>
                              <CellTextMuted>{account.statusDetail}</CellTextMuted>
                              {account.dueDate && <> · <DueDate>{account.dueDate}</DueDate></>}
                            </StyledTd>
                          </StyledTr>
                        );
                      })}
                    </tbody>
                  </StyledTable>
                </div>
              </TableCard>
            </div>
          )}

          {activeTab === 1 && activeSubTab === 1 && (
            <div>
              {showOhioBanner && (
                <UpdatedBanner theme={theme}>
                  <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={16} color={(theme as StyledTheme).colorSuccess} />
                  2 Ohio municipal registrations submitted — Dublin (RITA) and Columbus
                  <BannerDismiss theme={theme} aria-label="Dismiss" onClick={() => setShowOhioBanner(false)}>
                    <Icon type={Icon.TYPES.CLOSE} size={14} color={(theme as StyledTheme).colorSuccess} />
                  </BannerDismiss>
                </UpdatedBanner>
              )}
              <SearchRow theme={theme}>
                <SectionTitleText theme={theme}>Local tax accounts</SectionTitleText>
              </SearchRow>
              {showOhioAccounts ? (
                <TableCard>
                  <div style={{ overflowX: 'auto' }}>
                    <StyledTable>
                      <StyledTHead>
                        <tr>
                          <StyledTh>Municipality</StyledTh>
                          <StyledTh>State</StyledTh>
                          <StyledTh>Agency</StyledTh>
                          <StyledTh>Account #</StyledTh>
                          <StyledTh>Employees</StyledTh>
                          <StyledTh>Status</StyledTh>
                          <StyledTh>Details</StyledTh>
                        </tr>
                      </StyledTHead>
                      <tbody>
                        {OHIO_LOCAL_ACCOUNTS.map((acc, i) => (
                          <StyledTr
                            key={i}
                            style={{
                              backgroundColor: showOhioRowHighlight
                                ? (theme as StyledTheme).colorSuccessContainer
                                : 'transparent',
                              transition: 'background-color 600ms ease',
                            }}
                          >
                            <StyledTd><CellTextBold>{acc.municipality}</CellTextBold></StyledTd>
                            <StyledTd><CellText>{acc.state}</CellText></StyledTd>
                            <StyledTd><CellText>{acc.agency}</CellText></StyledTd>
                            <StyledTd><CellTextMono>{acc.accountNumber}</CellTextMono></StyledTd>
                            <StyledTd><CellText>{acc.employees}</CellText></StyledTd>
                            <StyledTd>
                              <StatusCell>
                                <StatusDot status="warning" />
                                <StatusLabel>In progress</StatusLabel>
                              </StatusCell>
                            </StyledTd>
                            <StyledTd><CellTextMuted>{acc.detail}</CellTextMuted></StyledTd>
                          </StyledTr>
                        ))}
                      </tbody>
                    </StyledTable>
                  </div>
                </TableCard>
              ) : (
                <div style={{
                  padding: `${(theme as StyledTheme).space1200} ${(theme as StyledTheme).space600}`,
                  textAlign: 'center',
                  color: (theme as StyledTheme).colorOnSurfaceVariant,
                  ...((theme as StyledTheme).typestyleV2BodyMedium as object),
                }}>
                  No local tax accounts yet
                </div>
              )}
            </div>
          )}
          {activeTab === 1 && activeSubTab === 2 && (
            <div style={{ color: (theme as StyledTheme).colorOnSurfaceVariant, padding: '24px 0' }}>
              Foreign Qualification — (same as previous demo)
            </div>
          )}
          {activeTab === 2 && <FilingsV3Tab activeSubTab={activeSubTab} />}
          {activeTab === 3 && <WorkforceTab activeSubTab={activeSubTab} />}
          {activeTab === 4 && <OthersV3Tab />}
        </ContentArea>
              </ComplianceContentWrapper>
            )}
          </HomeMain>
        </HomeLayout>
      </LeftPane>

      {/* ════════════════════════════════════════
          RIGHT PANE — Rippling AI
          ════════════════════════════════════════ */}
      {aiPanelOpen && <RightPane theme={theme}>
        {/* Panel header */}
        <PanelHeader theme={theme}>
          <PanelTitle>
            {chatOpen && leftView === 'compliance-360' ? (
              <>
                <PanelTitleText theme={theme}>
                  {activeTask === 'ohio' ? 'Ohio Municipal Tax Setup' : 'Texas Withholding Registration'}
                </PanelTitleText>
                <PanelSubtitle theme={theme}>
                  {activeTask === 'ohio' ? 'Compliance Agent · Local Tax' : 'Compliance Agent · State Tax'}
                </PanelSubtitle>
              </>
            ) : leftView === 'compliance-360' ? (
              <>
                <PanelTitleText theme={theme}>Rippling AI</PanelTitleText>
                <PanelSubtitle theme={theme}>Compliance 360 assistant</PanelSubtitle>
              </>
            ) : (
              <>
                <PanelTitleText theme={theme}>Rippling AI</PanelTitleText>
                <PanelSubtitle theme={theme}>Your AI assistant</PanelSubtitle>
              </>
            )}
          </PanelTitle>
          <PanelIcons theme={theme}>
            <IconBtn theme={theme} aria-label="Share">
              <Icon type={Icon.TYPES.SHARE_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </IconBtn>
            <IconBtn theme={theme} aria-label="Copy">
              <Icon type={Icon.TYPES.COPY_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </IconBtn>
            <IconBtn theme={theme} aria-label="Close" onClick={() => setAiPanelOpen(false)}>
              <Icon type={Icon.TYPES.CLOSE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </IconBtn>
          </PanelIcons>
        </PanelHeader>

        {/* ── HOME CHAT PANEL ── */}
        {leftView === 'home' && (
          <>
          <MessagesArea theme={theme}>
            {/* Idle: no messages yet */}
            {homeStage === 'idle' && (
              <AIMessageWrapper theme={theme}>
                <AIMessageHeader theme={theme}>
                  <AIIconCircle theme={theme}>
                    <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                  </AIIconCircle>
                  <AILabel theme={theme}>Rippling AI</AILabel>
                </AIMessageHeader>
                <AIMessageBody theme={theme}>
                  <AIText theme={theme}>Hi Sam! I can help you with compliance, payroll, benefits, and more. What would you like to do today?</AIText>
                </AIMessageBody>
              </AIMessageWrapper>
            )}

            {/* After send: user bubble + thinking + results */}
            {homeStage !== 'idle' && (
              <>
                <UserMessageWrapper>
                  <UserBubble theme={theme}>Show me my compliance risks</UserBubble>
                </UserMessageWrapper>

                <AIMessageWrapper theme={theme}>
                  <AIMessageHeader theme={theme}>
                    <AIIconCircle theme={theme}>
                      <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                    </AIIconCircle>
                    <AILabel theme={theme}>Rippling AI</AILabel>
                  </AIMessageHeader>

                  {/* Thinking block */}
                  <ThinkingBlock theme={theme}>
                    <ThinkingBlockHeader
                      theme={theme}
                      done={homeThinkingDone}
                      onClick={() => setHomeThinkingExpanded(e => !e)}
                    >
                      {homeThinkingDone
                        ? <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                        : <SpinnerRing theme={theme} />}
                      <ThinkingHeaderLabel>
                        {homeThinkingDone ? 'Thought for a few seconds' : 'Thinking\u2026'}
                      </ThinkingHeaderLabel>
                      <ChevronIcon expanded={homeThinkingExpanded}>
                        <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                      </ChevronIcon>
                    </ThinkingBlockHeader>
                    {homeThinkingExpanded && (
                      <ThinkingContent theme={theme}>
                        {HOME_THINKING_STEPS.slice(0, homeThinkingStep).map((step, i) => (
                          <ThinkingStepLine key={i} isLatest={i === homeThinkingStep - 1}>
                            {step}
                            {i === homeThinkingStep - 1 && !homeThinkingDone && <ThinkingCursor />}
                          </ThinkingStepLine>
                        ))}
                      </ThinkingContent>
                    )}
                  </ThinkingBlock>

                  {/* Results */}
                  {homeStage === 'results' && (
                    <AIMessageBody theme={theme}>
                      <AIText theme={theme}>
                        I found <strong>3 compliance items</strong> that need your attention — 1 high risk with a fine already charged.
                      </AIText>
                      <RiskTableWidget theme={theme}>
                        <RiskTableHeader theme={theme}>
                          <span>Action required · Registrations</span>
                          <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.ERROR}>3 items</Label>
                        </RiskTableHeader>
                        {COMPLIANCE_RISKS.map((risk, i) => (
                          <RiskRow key={i} theme={theme}>
                            <RiskRowInfo>
                              <RiskRowName theme={theme}>{risk.name}</RiskRowName>
                              <RiskRowMeta theme={theme}>{risk.type} · Due {risk.dueDate} · {risk.detail}</RiskRowMeta>
                            </RiskRowInfo>
                            <RiskBadge theme={theme} level={risk.risk}>{risk.risk}</RiskBadge>
                            <TakeActionBtn
                              theme={theme}
                              disabled={risk.task_id !== 'texas'}
                              onClick={() => risk.task_id === 'texas' && handleTakeAction(risk.task_id)}
                            >
                              Take action
                              {risk.task_id === 'texas' && <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={11} color={(theme as StyledTheme).colorPrimary} />}
                            </TakeActionBtn>
                          </RiskRow>
                        ))}
                      </RiskTableWidget>
                      <AIText theme={theme} style={{ fontSize: 12, color: (theme as StyledTheme).colorOnSurfaceVariant }}>
                        Click <strong>Take action</strong> on any item and I'll open it directly and guide you through the fix.
                      </AIText>
                    </AIMessageBody>
                  )}
                </AIMessageWrapper>
              </>
            )}
            <div ref={homeMessagesEndRef} />
          </MessagesArea>

          {/* Input bar */}
          <InputBar theme={theme}>
            <InputInner theme={theme}>
              <IconBtn theme={theme} aria-label="Add">
                <Icon type={Icon.TYPES.ADD_CIRCLE_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              </IconBtn>
              {homeStage === 'idle' ? (
                <>
                  <PrefilledText theme={theme}>Show me my compliance risks</PrefilledText>
                  <HomeInputSendBtn theme={theme} aria-label="Send" onClick={handleHomeSend}>
                    <Icon type={Icon.TYPES.ARROW_UP} size={13} color="white" />
                  </HomeInputSendBtn>
                </>
              ) : (
                <>
                  <InputText theme={theme}>Ask anything</InputText>
                  <Button.Icon
                    aria-label="Send"
                    icon={Icon.TYPES.ARROW_UP}
                    size={Button.SIZES.XS}
                    appearance={Button.APPEARANCES.GHOST}
                    isDisabled
                  />
                </>
              )}
            </InputInner>
            <Disclaimer theme={theme}>Rippling AI can make mistakes. Check important info.</Disclaimer>
          </InputBar>
          </>
        )}

        {/* ── COMPLIANCE AGENT PANEL ── */}
        {leftView === 'compliance-360' && (
        <><MessagesArea theme={theme}>
          {/* ── Compliance idle: arrived via HR nav, no task started ── */}
          {!chatOpen && chatStage === 'idle' && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  Hi Sam! I can help you register new states, set up local tax accounts, resolve compliance issues, and more.
                </AIText>
                <AIText theme={theme}>
                  Click on any row in the <strong>Overview</strong> or <strong>Registrations</strong> tabs and I'll guide you through the fix.
                </AIText>
              </AIMessageBody>
            </AIMessageWrapper>
          )}

          {/* ── STAGE: thinking + intro (same message bubble) ── */}
          {chatStage !== 'idle' && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>

              {/* Claude-style thinking block */}
              <ThinkingBlock theme={theme}>
                <ThinkingBlockHeader
                  theme={theme}
                  done={thinkingDone}
                  onClick={() => setThinkingExpanded(e => !e)}
                >
                  {thinkingDone
                    ? <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                    : <SpinnerRing theme={theme} />
                  }
                  <ThinkingHeaderLabel>
                    {thinkingDone ? 'Thought for a few seconds' : 'Thinking\u2026'}
                  </ThinkingHeaderLabel>
                  <ChevronIcon expanded={thinkingExpanded}>
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronIcon>
                </ThinkingBlockHeader>
                {thinkingExpanded && (
                  <ThinkingContent theme={theme}>
                    {activeThinkingSteps.slice(0, thinkingStep).map((step, i) => (
                      <ThinkingStepLine key={i} isLatest={i === thinkingStep - 1}>
                        {step}
                        {i === thinkingStep - 1 && !thinkingDone && <ThinkingCursor />}
                      </ThinkingStepLine>
                    ))}
                  </ThinkingContent>
                )}
              </ThinkingBlock>

              {/* Main response — only after thinking is done */}
              {chatStage !== 'thinking' && activeTask === 'texas' && (
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  I noticed <strong>Texas Withholding Registration</strong> is blocked. I've already pulled your company profile and can pre-fill <strong>11 of 13 required fields</strong> on Form C-1 — turning a 30-minute task into a 2-minute review.
                </AIText>
                <WidgetCard theme={theme}>
                  <WidgetHeader theme={theme}>
                    <WidgetTitle theme={theme}>
                      <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={13} color="rgb(46,125,50)" />
                      Pre-filled from Rippling · 11 fields
                    </WidgetTitle>
                    <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.SUCCESS}>Ready</Label>
                  </WidgetHeader>
                  {PRE_FILLED_FIELDS.map((f, i) => (
                    <FieldListItem key={i} theme={theme}>
                      <FieldListLabel theme={theme}>{f.label}</FieldListLabel>
                      <FieldListValue theme={theme}>{f.value}</FieldListValue>
                    </FieldListItem>
                  ))}
                </WidgetCard>
                <AIText theme={theme}>
                  I just need <strong>2 quick things</strong> from you to proceed.
                </AIText>
              </AIMessageBody>
              )}

              {chatStage !== 'thinking' && activeTask === 'ohio' && (
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  I found <strong>4 Ohio employees</strong> across <strong>2 municipalities</strong>. I can register with both tax authorities — RITA for Dublin and the City of Columbus directly — using your Rippling data.
                </AIText>
                <WidgetCard theme={theme}>
                  <WidgetHeader theme={theme}>
                    <WidgetTitle theme={theme}>
                      <Icon type={Icon.TYPES.LOCATION_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                      Employee work locations · Ohio
                    </WidgetTitle>
                    <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.PRIMARY}>4 employees</Label>
                  </WidgetHeader>
                  <div style={{ overflowX: 'auto' }}>
                    <EmpTable>
                      <thead>
                        <tr>
                          <EmpTh theme={theme}>Employee</EmpTh>
                          <EmpTh theme={theme}>Municipality</EmpTh>
                          <EmpTh theme={theme}>Jurisdiction</EmpTh>
                          <EmpTh theme={theme}>Rate</EmpTh>
                        </tr>
                      </thead>
                      <tbody>
                        {OHIO_EMPLOYEES.map((emp, i) => (
                          <tr key={i}>
                            <EmpTd theme={theme}>{emp.name}</EmpTd>
                            <EmpTd theme={theme}>{emp.municipality}</EmpTd>
                            <EmpTd theme={theme}>
                              <JurisdictionBadge theme={theme} type={emp.jurisdiction as 'RITA' | 'Self-admin'}>
                                {emp.jurisdiction}
                              </JurisdictionBadge>
                            </EmpTd>
                            <EmpTd theme={theme}>{emp.rate}</EmpTd>
                          </tr>
                        ))}
                      </tbody>
                    </EmpTable>
                  </div>
                </WidgetCard>
                <AIText theme={theme}>
                  I just need <strong>2 quick confirmations</strong> before I file.
                </AIText>
              </AIMessageBody>
              )}
            </AIMessageWrapper>
          )}

          {/* ── STAGE: Ohio location-question ── */}
          {activeTask === 'ohio' && (chatStage === 'location-question' || chatStage === 'signer-question' || chatStage === 'submitting' || chatStage === 'done') && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  <strong>1 of 2 —</strong> Do these work locations look right? If any employee is fully remote or works from a different address, let me know before I register — filing for the wrong municipality is hard to undo.
                </AIText>

                {/* Inline adjustment widget — appears when "Some need adjustment" is clicked */}
                {showOhioAdjustWidget && !ohioAdjustConfirmed && (
                  <AdjustWidget theme={theme}>
                    <AdjustWidgetHeader theme={theme}>
                      Mark any employees who are remote or work from a different location
                    </AdjustWidgetHeader>
                    {OHIO_EMPLOYEES.map((emp) => {
                      const isRemote = ohioRemoteEmployees.has(emp.name);
                      return (
                        <AdjustRow key={emp.name} theme={theme} isRemote={isRemote}>
                          <AdjustEmployeeInfo>
                            <AdjustEmpName theme={theme} isRemote={isRemote}>{emp.name}</AdjustEmpName>
                            <AdjustEmpSub theme={theme}>
                              {isRemote ? 'Remote — no municipal tax will apply' : `${emp.municipality} · ${emp.jurisdiction} · ${emp.rate}`}
                            </AdjustEmpSub>
                          </AdjustEmployeeInfo>
                          <RemoteToggle
                            theme={theme}
                            active={isRemote}
                            onClick={() => toggleOhioRemote(emp.name)}
                          >
                            {isRemote ? '✕ Remote' : 'Remote'}
                          </RemoteToggle>
                        </AdjustRow>
                      );
                    })}
                    <AdjustFooter theme={theme}>
                      <AdjustNote theme={theme}>
                        {ohioRemoteEmployees.size > 0
                          ? `${ohioRemoteEmployees.size} employee${ohioRemoteEmployees.size > 1 ? 's' : ''} marked remote — I'll skip their municipalities`
                          : 'Toggle remote for any employee who works from home'}
                      </AdjustNote>
                      <ConfirmAdjustBtn theme={theme} onClick={handleOhioAdjustConfirm}>
                        Save & continue
                      </ConfirmAdjustBtn>
                    </AdjustFooter>
                  </AdjustWidget>
                )}

                {/* Show yes/no only when widget isn't open */}
                {!showOhioAdjustWidget && !ohioAdjustConfirmed && (
                  <YesNoRow theme={theme}>
                    <YesNoBtn
                      theme={theme}
                      active={ohioLocationConfirmed === true}
                      disabled={chatStage !== 'location-question'}
                      onClick={() => handleOhioLocationConfirm(true)}
                    >
                      Yes, these are correct
                    </YesNoBtn>
                    <YesNoBtn
                      theme={theme}
                      active={false}
                      disabled={chatStage !== 'location-question'}
                      onClick={() => handleOhioLocationConfirm(false)}
                    >
                      Some need adjustment
                    </YesNoBtn>
                  </YesNoRow>
                )}

                {/* Locked state after confirmed */}
                {(ohioLocationConfirmed === true || ohioAdjustConfirmed) && chatStage !== 'location-question' && (
                  <YesNoRow theme={theme}>
                    <YesNoBtn theme={theme} active={ohioLocationConfirmed === true} disabled>
                      {ohioLocationConfirmed ? 'Yes, these are correct' : 'Adjustments saved'}
                    </YesNoBtn>
                    <YesNoBtn theme={theme} active={ohioAdjustConfirmed} disabled>
                      Some need adjustment
                    </YesNoBtn>
                  </YesNoRow>
                )}
              </AIMessageBody>
            </AIMessageWrapper>
          )}

          {/* User reply: Ohio adjustments confirmed */}
          {activeTask === 'ohio' && ohioAdjustConfirmed && (chatStage === 'signer-question' || chatStage === 'submitting' || chatStage === 'done') && (
            <UserMessageWrapper>
              <UserBubble theme={theme}>
                {ohioRemoteEmployees.size > 0
                  ? `${Array.from(ohioRemoteEmployees).join(' and ')} ${ohioRemoteEmployees.size > 1 ? 'are' : 'is'} fully remote`
                  : 'All locations look correct'}
              </UserBubble>
            </UserMessageWrapper>
          )}
          {/* User reply: Ohio location confirmed (yes path) */}
          {activeTask === 'ohio' && ohioLocationConfirmed === true && !ohioAdjustConfirmed && (chatStage === 'signer-question' || chatStage === 'submitting' || chatStage === 'done') && (
            <UserMessageWrapper>
              <UserBubble theme={theme}>Yes, these locations are correct</UserBubble>
            </UserMessageWrapper>
          )}

          {/* ── STAGE: signer question ── */}
          {(chatStage === 'signer-question' || chatStage === 'account-question' || chatStage === 'submitting' || chatStage === 'done') && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  {activeTask === 'ohio'
                    ? <><strong>2 of 2 —</strong> Who should be the authorized contact for Ohio tax correspondence? They'll receive account confirmations from RITA and Columbus.</>
                    : <><strong>1 of 2 —</strong> Who should authorize this filing? The authorized signer certifies all information is accurate under penalty of perjury.</>
                  }
                </AIText>
                <SignerOptions theme={theme}>
                  {OFFICERS.map(officer => (
                    <SignerCard
                      key={officer.id}
                      theme={theme}
                      selected={selectedSigner === officer.id}
                      disabled={chatStage !== 'signer-question'}
                      onClick={() => handleSignerSelect(officer.id)}
                    >
                      <RadioDot theme={theme} selected={selectedSigner === officer.id} />
                      <SignerInfo>
                        <SignerName theme={theme}>{officer.name}</SignerName>
                        <SignerTitle theme={theme}>{officer.title}</SignerTitle>
                      </SignerInfo>
                    </SignerCard>
                  ))}
                </SignerOptions>
              </AIMessageBody>
            </AIMessageWrapper>
          )}

          {/* User reply: signer selected */}
          {selectedSigner && (chatStage === 'account-question' || chatStage === 'submitting' || chatStage === 'done') && activeTask === 'texas' && (
            <UserMessageWrapper>
              <UserBubble theme={theme}>
                {signerObj?.name} — {signerObj?.title}
              </UserBubble>
            </UserMessageWrapper>
          )}

          {/* ── STAGE: account question (Texas only) ── */}
          {activeTask === 'texas' && (chatStage === 'account-question' || chatStage === 'submitting' || chatStage === 'done') && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <AIMessageBody theme={theme}>
                <AIText theme={theme}>
                  <strong>2 of 2 —</strong> Has Acme Corporation previously registered as a Texas employer?
                </AIText>
                <YesNoRow theme={theme}>
                  <YesNoBtn
                    theme={theme}
                    active={accountAnswer === 'yes'}
                    disabled={chatStage !== 'account-question'}
                    onClick={() => handleAccountAnswer('yes')}
                  >
                    Yes, we have a prior account
                  </YesNoBtn>
                  <YesNoBtn
                    theme={theme}
                    active={accountAnswer === 'no'}
                    disabled={chatStage !== 'account-question'}
                    onClick={() => handleAccountAnswer('no')}
                  >
                    No, first time
                  </YesNoBtn>
                </YesNoRow>
              </AIMessageBody>
            </AIMessageWrapper>
          )}

          {/* User reply: Ohio signer selected */}
          {activeTask === 'ohio' && selectedSigner && (chatStage === 'submitting' || chatStage === 'done') && (
            <UserMessageWrapper>
              <UserBubble theme={theme}>
                {OFFICERS.find(o => o.id === selectedSigner)?.name} — {OFFICERS.find(o => o.id === selectedSigner)?.title}
              </UserBubble>
            </UserMessageWrapper>
          )}

          {/* User reply: account answer (Texas only) */}
          {activeTask === 'texas' && accountAnswer && (chatStage === 'submitting' || chatStage === 'done') && (
            <UserMessageWrapper>
              <UserBubble theme={theme}>
                {accountAnswer === 'no' ? 'No — this is our first Texas registration' : 'Yes, we have a prior account'}
              </UserBubble>
            </UserMessageWrapper>
          )}

          {/* ── STAGE: submitting ── */}
          {chatStage === 'submitting' && (
            <TypingWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <TypingDots theme={theme}>
                <Dot theme={theme} delay={0} />
                <Dot theme={theme} delay={150} />
                <Dot theme={theme} delay={300} />
              </TypingDots>
            </TypingWrapper>
          )}

          {/* ── STAGE: done ── */}
          {chatStage === 'done' && (
            <AIMessageWrapper theme={theme}>
              <AIMessageHeader theme={theme}>
                <AIIconCircle theme={theme}>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={13} color={(theme as StyledTheme).colorPrimary} />
                </AIIconCircle>
                <AILabel theme={theme}>Rippling AI</AILabel>
              </AIMessageHeader>
              <AIMessageBody theme={theme}>
                {activeTask === 'ohio' ? (
                  <>
                    <SuccessCard theme={theme}>
                      <SuccessTitle theme={theme}>
                        <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={15} color={(theme as StyledTheme).colorSuccess} />
                        2 registrations submitted
                      </SuccessTitle>
                      <SuccessText theme={theme}>
                        RITA Form 11 (Dublin) and Columbus employer registration filed on Feb 25, 2026. Account numbers typically arrive within 3–5 business days.
                      </SuccessText>
                      <SuccessText theme={theme} style={{ fontFamily: 'monospace', fontSize: 11 }}>
                        RITA ref: RITA-2026-02-7714 · Columbus ref: COL-2026-02-3302
                      </SuccessText>
                    </SuccessCard>
                    <AIText theme={theme}>
                      I've created 2 local tax accounts in Rippling. Once RITA and Columbus issue your account numbers, I'll update them automatically.
                    </AIText>
                    <ViewInRippling
                      theme={theme}
                      onClick={() => { navigateToModule(1, 1); }}
                    >
                      View in Local Tax Accounts
                      <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorPrimary} />
                    </ViewInRippling>
                  </>
                ) : (
                  <>
                <SuccessCard theme={theme}>
                  <SuccessTitle theme={theme}>
                    <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={15} color={(theme as StyledTheme).colorSuccess} />
                    Submitted to Texas Workforce Commission
                  </SuccessTitle>
                  <SuccessText theme={theme}>
                    Form C-1 submitted on Feb 25, 2026. TWC typically issues account numbers within 5–7 business days. I'll update your Rippling configuration automatically once received.
                  </SuccessText>
                  <SuccessText theme={theme} style={{ fontFamily: 'monospace', fontSize: 11 }}>
                    Confirmation: TWC-2026-02-AC9877
                  </SuccessText>
                </SuccessCard>
                <AIText theme={theme}>
                  I've updated the status in your Registrations tab. You can track progress there directly — it will move from <strong>In progress</strong> to <strong>Active</strong> once TWC issues your account number.
                </AIText>
                <ViewInRippling
                  theme={theme}
                  onClick={() => { navigateToModule(1, 0); }}
                >
                  View in State Tax Accounts
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorPrimary} />
                </ViewInRippling>
                  </>
                )}
              </AIMessageBody>
            </AIMessageWrapper>
          )}

          <div ref={messagesEndRef} />
        </MessagesArea>

        {/* Input bar */}
        <InputBar theme={theme}>
          <InputInner theme={theme}>
            <IconBtn theme={theme} aria-label="Add">
              <Icon type={Icon.TYPES.ADD_CIRCLE_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </IconBtn>
            <InputText theme={theme}>Ask anything</InputText>
            <Button.Icon
              aria-label="Send"
              icon={Icon.TYPES.ARROW_UP}
              size={Button.SIZES.XS}
              appearance={Button.APPEARANCES.GHOST}
              isDisabled
            />
          </InputInner>
          <Disclaimer theme={theme}>Rippling AI can make mistakes. Check important info.</Disclaimer>
        </InputBar>
        </>)}
      </RightPane>}
    </Shell>
  );
};
