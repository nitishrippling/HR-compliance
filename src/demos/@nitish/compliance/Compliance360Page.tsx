import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Tabs from '@rippling/pebble/Tabs';
import Page from '@rippling/pebble/Page';
import Label from '@rippling/pebble/Label';
import Avatar from '@rippling/pebble/Avatar';
import { APPEARANCES as BADGE_APPEARANCES } from '@rippling/pebble/Atoms/Badge/Badge.constants';

/* ═══════════════════════════════════════════════════════
   DATA TYPES
   ═══════════════════════════════════════════════════════ */

type ModuleId = 'people' | 'company' | 'filing';
type ActionStatus = 'overdue' | 'due-soon' | 'upcoming';
type UpdateType = 'completed' | 'updated' | 'alert';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: ActionStatus;
  module: ModuleId;
  jurisdiction?: string;
  owner?: string;
}

interface RipplingUpdate {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: UpdateType;
}

interface AwarenessItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
}

interface AwarenessAlert {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning';
}

interface ModuleData {
  id: ModuleId;
  name: string;
  icon: string;
  actions: ActionItem[];
  updates: RipplingUpdate[];
  awarenessMetrics: AwarenessItem[];
  awarenessAlerts: AwarenessAlert[];
  awarenessSectionTitle: string;
}

/* ═══════════════════════════════════════════════════════
   MODULE DATA
   ═══════════════════════════════════════════════════════ */

const MODULES: ModuleData[] = [
  {
    id: 'people',
    name: 'People / Workforce',
    icon: Icon.TYPES.USERS_OUTLINE,
    awarenessSectionTitle: 'Regulatory & Workforce Insights',
    actions: [
      {
        id: 'p1',
        title: 'Final pay not scheduled — terminated employee',
        description: 'Colorado requires final pay within 24 hours of involuntary termination.',
        dueDate: 'Mar 3, 2026',
        status: 'overdue',
        module: 'people',
        jurisdiction: 'CO',
        owner: 'HR Ops',
      },
      {
        id: 'p2',
        title: 'Missing SSN for 2 new hires',
        description: 'Social Security Numbers required before next payroll run.',
        dueDate: 'Mar 8, 2026',
        status: 'due-soon',
        module: 'people',
        owner: 'HR Ops',
      },
      {
        id: 'p3',
        title: '3 pending FMLA eligibility determinations',
        description: 'Employee leave requests pending eligibility verification under FMLA.',
        dueDate: 'Mar 12, 2026',
        status: 'due-soon',
        module: 'people',
        owner: 'Leave Admin',
      },
      {
        id: 'p4',
        title: '2 contractor classifications pending Legal review',
        description: 'Role changes flagged for FLSA classification review.',
        dueDate: 'Mar 15, 2026',
        status: 'due-soon',
        module: 'people',
        owner: 'Legal',
      },
      {
        id: 'p5',
        title: '5 employees need I-9 reverification',
        description: 'Employment authorization documents expiring — reverification required.',
        dueDate: 'Mar 20, 2026',
        status: 'upcoming',
        module: 'people',
        jurisdiction: 'Federal',
        owner: 'HR Ops',
      },
      {
        id: 'p6',
        title: 'EEO-1 report ready for review',
        description: 'Annual Equal Employment Opportunity report generated, awaiting admin approval.',
        dueDate: 'Mar 31, 2026',
        status: 'upcoming',
        module: 'people',
        jurisdiction: 'Federal',
        owner: 'Compliance',
      },
    ],
    updates: [
      {
        id: 'pu1',
        title: 'I-9 audit completed — 142 employees verified',
        description: '5 reverifications flagged for upcoming expiration.',
        timestamp: 'Feb 28, 2026',
        type: 'completed',
      },
      {
        id: 'pu2',
        title: 'CA pay stub templates updated per SB 1162',
        description: 'California pay stub requirements automatically updated.',
        timestamp: 'Jan 10, 2026',
        type: 'updated',
      },
      {
        id: 'pu3',
        title: 'Overtime rules synced for 8 states',
        description: 'State-specific overtime thresholds updated in payroll system.',
        timestamp: 'Feb 1, 2026',
        type: 'completed',
      },
      {
        id: 'pu4',
        title: 'NY Paid Family Leave rate updated to 0.373%',
        description: '2026 PFML contribution rate applied per NY regulation.',
        timestamp: 'Jan 1, 2026',
        type: 'updated',
      },
    ],
    awarenessMetrics: [
      { id: 'pm1', icon: Icon.TYPES.CHECK_CIRCLE_OUTLINE, label: 'I-9 Completeness', value: '97%', variant: 'success' },
      { id: 'pm2', icon: Icon.TYPES.SHIELD_OUTLINE, label: 'Classification Risk', value: 'Low', variant: 'success' },
      { id: 'pm3', icon: Icon.TYPES.DOCUMENT_OUTLINE, label: 'Document Retention', value: '98% compliant', variant: 'success' },
      { id: 'pm4', icon: Icon.TYPES.USERS_OUTLINE, label: 'Active Employees', value: '847', variant: 'neutral' },
    ],
    awarenessAlerts: [
      { id: 'pa1', title: 'NY minimum wage increases to $16.50', description: 'Effective Jan 1, 2027 — no action needed now, Rippling will auto-update.', type: 'info' },
      { id: 'pa2', title: 'ACA measurement period ends Dec 31', description: 'Ensure all variable-hour employees are tracked before period close.', type: 'warning' },
    ],
  },
  {
    id: 'company',
    name: 'Company & Entity',
    icon: Icon.TYPES.OFFICE_OUTLINE,
    awarenessSectionTitle: 'Entity Health & Calendar',
    actions: [
      {
        id: 'c1',
        title: 'Texas Withholding Registration',
        description: 'Payroll blocked if unresolved',
        dueDate: 'Feb 28, 2026',
        status: 'overdue',
        module: 'company',
        jurisdiction: 'TX',
        owner: 'Tax Ops',
      },
      {
        id: 'c2',
        title: 'Ohio Municipal Tax Setup',
        description: 'Withholding non-compliant',
        dueDate: 'Mar 1, 2026',
        status: 'due-soon',
        module: 'company',
        jurisdiction: 'OH',
        owner: 'Tax Ops',
      },
      {
        id: 'c3',
        title: 'Upload Certificate of Incorporation',
        description: 'Registration delayed',
        dueDate: 'Mar 5, 2026',
        status: 'due-soon',
        module: 'company',
        jurisdiction: 'WA',
        owner: 'Entity Services',
      },
      {
        id: 'c4',
        title: 'California SUI Rate Verification',
        description: 'Rate mismatch possible',
        dueDate: 'Mar 10, 2026',
        status: 'due-soon',
        module: 'company',
        jurisdiction: 'CA',
        owner: 'Tax Ops',
      },
      {
        id: 'c5',
        title: 'New York Local Tax Registration',
        description: 'Local withholding required for NYC employees',
        dueDate: 'Mar 15, 2026',
        status: 'due-soon',
        module: 'company',
        jurisdiction: 'NY',
        owner: 'Tax Ops',
      },
      {
        id: 'c6',
        title: 'Foreign Qualification — Colorado',
        description: 'Entity must qualify before hiring in CO',
        dueDate: 'Mar 20, 2026',
        status: 'upcoming',
        module: 'company',
        jurisdiction: 'CO',
        owner: 'Entity Services',
      },
      {
        id: 'c7',
        title: 'Pennsylvania SUI Account Setup',
        description: 'SUI contributions pending account creation',
        dueDate: 'Mar 25, 2026',
        status: 'upcoming',
        module: 'company',
        jurisdiction: 'PA',
        owner: 'Tax Ops',
      },
      {
        id: 'c8',
        title: 'Annual Report — Delaware LLC',
        description: 'Annual compliance confirmation',
        dueDate: 'Jun 1, 2026',
        status: 'upcoming',
        module: 'company',
        jurisdiction: 'DE',
        owner: 'Entity Services',
      },
    ],
    updates: [
      {
        id: 'cu1',
        title: 'BOI filing submitted to FinCEN for all entities',
        description: 'Beneficial Ownership Information reports filed before deadline.',
        timestamp: 'Jan 1, 2026',
        type: 'completed',
      },
      {
        id: 'cu2',
        title: 'CA Statement of Information filed',
        description: 'Biennial statement submitted to CA Secretary of State.',
        timestamp: 'Feb 15, 2026',
        type: 'completed',
      },
      {
        id: 'cu3',
        title: 'Registered agent renewed for TX',
        description: 'Texas registered agent service auto-renewed for 2026.',
        timestamp: 'Feb 1, 2026',
        type: 'completed',
      },
    ],
    awarenessMetrics: [
      { id: 'cm1', icon: Icon.TYPES.CHECK_CIRCLE_OUTLINE, label: 'Good Standing', value: '12 / 12 entities', variant: 'success' },
      { id: 'cm2', icon: Icon.TYPES.LOCATION_OUTLINE, label: 'Jurisdictions', value: '8 states', variant: 'neutral' },
      { id: 'cm3', icon: Icon.TYPES.CALENDAR_OUTLINE, label: 'Next Filing Due', value: 'Jun 1, 2026', variant: 'neutral' },
      { id: 'cm4', icon: Icon.TYPES.BANK_OUTLINE, label: 'Active Entities', value: '12', variant: 'neutral' },
    ],
    awarenessAlerts: [
      { id: 'ca1', title: 'Colorado adopted new beneficial ownership rules', description: 'Effective Jul 1, 2026 — Rippling will auto-update filing requirements.', type: 'info' },
      { id: 'ca2', title: 'DE franchise tax payment window opens', description: 'Tax due by Jun 1. Rippling will prepare the filing 30 days in advance.', type: 'info' },
    ],
  },
  {
    id: 'filing',
    name: 'Filing',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
    awarenessSectionTitle: 'Filing Pipeline & Insights',
    actions: [
      {
        id: 'f1',
        title: 'Pre-flight validation failed — Q1 CA return',
        description: '3 errors detected: missing EIN, address mismatch, rate discrepancy.',
        dueDate: 'Mar 10, 2026',
        status: 'due-soon',
        module: 'filing',
        jurisdiction: 'CA',
        owner: 'Tax Ops',
      },
      {
        id: 'f2',
        title: 'Confirm Q1 federal deposit schedule',
        description: 'Verify semi-weekly vs. monthly deposit schedule based on lookback period.',
        dueDate: 'Mar 10, 2026',
        status: 'due-soon',
        module: 'filing',
        jurisdiction: 'Federal',
        owner: 'Payroll Ops',
      },
      {
        id: 'f3',
        title: '941-X amendment needs Legal approval',
        description: 'Correction to Q3 2025 federal tax return requires sign-off.',
        dueDate: 'Mar 15, 2026',
        status: 'due-soon',
        module: 'filing',
        jurisdiction: 'Federal',
        owner: 'Legal',
      },
      {
        id: 'f4',
        title: 'Review 1095-C forms before distribution',
        description: '847 forms generated. Admin review required before employee distribution.',
        dueDate: 'Mar 15, 2026',
        status: 'due-soon',
        module: 'filing',
        jurisdiction: 'Federal',
        owner: 'Benefits Compliance',
      },
    ],
    updates: [
      {
        id: 'fu1',
        title: 'Q4 2025 state returns filed across 18 states',
        description: 'All quarterly withholding returns submitted and confirmed.',
        timestamp: 'Jan 31, 2026',
        type: 'completed',
      },
      {
        id: 'fu2',
        title: 'W-2s distributed to 847 employees',
        description: 'Annual wage and tax statements delivered electronically and by mail.',
        timestamp: 'Jan 31, 2026',
        type: 'completed',
      },
      {
        id: 'fu3',
        title: 'E-file confirmations archived — 14 filings',
        description: 'Federal and state filing confirmations stored with timestamps.',
        timestamp: 'Feb 15, 2026',
        type: 'completed',
      },
      {
        id: 'fu4',
        title: 'IRS AIR submission acknowledged',
        description: '2025 1094-C/1095-C e-filed to IRS. Acknowledgement received.',
        timestamp: 'Feb 28, 2026',
        type: 'completed',
      },
    ],
    awarenessMetrics: [
      { id: 'fm1', icon: Icon.TYPES.CHECK_CIRCLE_OUTLINE, label: 'Filings YTD', value: '142', variant: 'success' },
      { id: 'fm2', icon: Icon.TYPES.WARNING_CIRCLE_OUTLINE, label: 'Rejections YTD', value: '0', variant: 'success' },
      { id: 'fm3', icon: Icon.TYPES.TIME_OUTLINE, label: 'SLA Performance', value: '98.5%', variant: 'success' },
      { id: 'fm4', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, label: 'GL Reconciliation', value: 'Current (Feb)', variant: 'success' },
    ],
    awarenessAlerts: [
      { id: 'fa1', title: '8 state quarterly returns due Apr 30', description: 'Rippling will begin pre-flight validation 30 days before deadline.', type: 'info' },
      { id: 'fa2', title: 'IRS updated e-file schema for 1094-C', description: 'No action needed — Rippling updated automatically.', type: 'info' },
    ],
  },
];

const ALL_ACTIONS: ActionItem[] = MODULES.flatMap(m => m.actions);

const MODULE_LABELS: Record<ModuleId, string> = {
  people: 'People',
  company: 'Entity',
  filing: 'Filing',
};

/* ─── People / Workforce: employee-level open issues ─── */

type Urgency = 'very-high' | 'high' | 'medium' | 'low';

interface EmployeeIssue {
  id: string;
  dateDetected: string;
  employeeName: string;
  employeeRole: string;
  employeeInitials: string;
  resolutionDeadline: string;
  urgency: Urgency;
  issueType: string;
}

const PEOPLE_METRICS = {
  totalOutstanding: 70,
  newInPast30Days: 10,
  avgResolveTime: '0.1 days',
};

const PEOPLE_PRIORITY: { label: string; count: number; urgency: Urgency }[] = [
  { label: 'Very High', count: 0, urgency: 'very-high' },
  { label: 'High', count: 50, urgency: 'high' },
  { label: 'Medium', count: 20, urgency: 'medium' },
  { label: 'Low', count: 0, urgency: 'low' },
];

const EMPLOYEE_ISSUES: EmployeeIssue[] = [
  {
    id: 'ei1',
    dateDetected: '10/05/2024',
    employeeName: 'Hugo Brooks',
    employeeRole: 'Account Manager',
    employeeInitials: 'HB',
    resolutionDeadline: '11/05/2024',
    urgency: 'high',
    issueType: 'Sick leave violation',
  },
  {
    id: 'ei2',
    dateDetected: '10/15/2024',
    employeeName: 'Alex Ross',
    employeeRole: 'Customer Support Manager',
    employeeInitials: 'AR',
    resolutionDeadline: '11/15/2024',
    urgency: 'high',
    issueType: 'Sick leave violation',
  },
  {
    id: 'ei3',
    dateDetected: '09/30/2024',
    employeeName: 'Amanda Hall',
    employeeRole: 'Customer Support Manager',
    employeeInitials: 'AH',
    resolutionDeadline: '10/30/2024',
    urgency: 'high',
    issueType: 'Sick leave violation',
  },
  {
    id: 'ei4',
    dateDetected: '11/02/2024',
    employeeName: 'Sarah Chen',
    employeeRole: 'Software Engineer',
    employeeInitials: 'SC',
    resolutionDeadline: '12/02/2024',
    urgency: 'high',
    issueType: 'I-9 reverification needed',
  },
  {
    id: 'ei5',
    dateDetected: '11/10/2024',
    employeeName: 'James Wilson',
    employeeRole: 'Data Analyst',
    employeeInitials: 'JW',
    resolutionDeadline: '12/10/2024',
    urgency: 'high',
    issueType: 'Missing SSN',
  },
  {
    id: 'ei6',
    dateDetected: '11/15/2024',
    employeeName: 'Maria Garcia',
    employeeRole: 'Product Designer',
    employeeInitials: 'MG',
    resolutionDeadline: '01/15/2025',
    urgency: 'medium',
    issueType: 'Overtime violation',
  },
  {
    id: 'ei7',
    dateDetected: '12/01/2024',
    employeeName: 'David Kim',
    employeeRole: 'Sales Representative',
    employeeInitials: 'DK',
    resolutionDeadline: '01/31/2025',
    urgency: 'medium',
    issueType: 'FMLA eligibility pending',
  },
  {
    id: 'ei8',
    dateDetected: '12/05/2024',
    employeeName: 'Emily Thompson',
    employeeRole: 'Marketing Manager',
    employeeInitials: 'ET',
    resolutionDeadline: '02/05/2025',
    urgency: 'medium',
    issueType: 'Background check expired',
  },
  {
    id: 'ei9',
    dateDetected: '12/10/2024',
    employeeName: 'Robert Martinez',
    employeeRole: 'Operations Lead',
    employeeInitials: 'RM',
    resolutionDeadline: '01/10/2025',
    urgency: 'high',
    issueType: 'Worker classification review',
  },
  {
    id: 'ei10',
    dateDetected: '01/05/2025',
    employeeName: 'Lisa Park',
    employeeRole: 'Finance Analyst',
    employeeInitials: 'LP',
    resolutionDeadline: '01/06/2025',
    urgency: 'high',
    issueType: 'Final pay not scheduled',
  },
];

/* ─── Company & Entity: task-level open actions with category + penalty ─── */

interface EntityTask {
  id: string;
  task: string;
  category: string;
  dueDate: string;
  daysLeft: number;
  risk: string;
}

const ENTITY_TASKS: EntityTask[] = [
  { id: 'et1', task: 'Texas Withholding Registration', category: 'State Tax', dueDate: 'Feb 28, 2026', daysLeft: -5, risk: 'Payroll blocked if unresolved' },
  { id: 'et2', task: 'Ohio Municipal Tax Setup', category: 'Local Tax', dueDate: 'Mar 1, 2026', daysLeft: -4, risk: 'Withholding non-compliant' },
  { id: 'et3', task: 'Upload Certificate of Incorporation', category: 'Foreign Qualification', dueDate: 'Mar 5, 2026', daysLeft: 0, risk: 'Registration delayed' },
  { id: 'et4', task: 'California SUI Rate Verification', category: 'State Tax', dueDate: 'Mar 10, 2026', daysLeft: 5, risk: 'Rate mismatch possible' },
  { id: 'et5', task: 'New York Local Tax Registration', category: 'Local Tax', dueDate: 'Mar 15, 2026', daysLeft: 10, risk: 'Local withholding required for NYC employees' },
  { id: 'et6', task: 'Foreign Qualification — Colorado', category: 'Foreign Qualification', dueDate: 'Mar 20, 2026', daysLeft: 15, risk: 'Entity must qualify before hiring in CO' },
  { id: 'et7', task: 'Pennsylvania SUI Account Setup', category: 'State Tax', dueDate: 'Mar 25, 2026', daysLeft: 20, risk: 'SUI contributions pending account creation' },
  { id: 'et8', task: 'Annual Report — Delaware LLC', category: 'Annual Report', dueDate: 'Jun 1, 2026', daysLeft: 88, risk: 'Annual compliance confirmation' },
];

function penaltyStatus(daysLeft: number): { text: string; isOverdue: boolean } {
  if (daysLeft < 0) return { text: '$250 fine already charged', isOverdue: true };
  if (daysLeft === 0) return { text: 'Due today — $250 fee imminent', isOverdue: false };
  return { text: `${daysLeft} days left before $250 fee`, isOverdue: false };
}

/* ─── Entity KPI strip data ─── */

const ENTITY_KPIS = [
  { icon: Icon.TYPES.TIME_OUTLINE, value: '62+', label: 'Estimated Hours Saved' },
  { icon: Icon.TYPES.OFFICE_OUTLINE, value: '18', label: 'State Registrations Completed' },
  { icon: Icon.TYPES.LOCATION_OUTLINE, value: '5', label: 'Local Registrations Completed' },
  { icon: Icon.TYPES.BANK_OUTLINE, value: '6', label: 'Foreign Qualifications Completed' },
];

/* ─── Filing module: compliance filings table ─── */

type FilingType = 'federal' | 'state' | 'local';
type FilingStatus = 'filed' | 'in-progress' | 'upcoming' | 'action-needed';
type FilingCreator = 'rippling' | 'client';

interface ComplianceFiling {
  id: string;
  type: FilingType;
  jurisdiction: string;
  filingName: string;
  dueDate: string;
  createdBy: FilingCreator;
  status: FilingStatus;
  statusDetail?: string;
}

const COMPLIANCE_FILINGS: ComplianceFiling[] = [
  { id: 'cf1', type: 'state', jurisdiction: 'NY', filingName: 'NY Paid Family Leave Annual Statement', dueDate: 'Mar 1, 2026', createdBy: 'rippling', status: 'in-progress', statusDetail: 'Preparing filing' },
  { id: 'cf2', type: 'federal', jurisdiction: 'Federal', filingName: 'VETS-4212 Report', dueDate: 'Sep 30, 2026', createdBy: 'rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf3', type: 'federal', jurisdiction: 'Federal', filingName: 'EEO-1 Component 1 Report', dueDate: 'Mar 31, 2026', createdBy: 'rippling', status: 'filed', statusDetail: 'Filed Feb 17, 2026' },
  { id: 'cf4', type: 'federal', jurisdiction: 'Federal', filingName: 'ACA 1094-C / 1095-C', dueDate: 'Feb 28, 2026', createdBy: 'rippling', status: 'filed', statusDetail: 'Filed Feb 14, 2026' },
  { id: 'cf5', type: 'state', jurisdiction: 'CA', filingName: 'California Pay Data Report (SB 973)', dueDate: 'Mar 31, 2026', createdBy: 'rippling', status: 'filed', statusDetail: 'Filed Feb 10, 2026' },
  { id: 'cf6', type: 'local', jurisdiction: 'San Francisco, CA', filingName: 'Healthy SF Expenditure Report', dueDate: 'Apr 30, 2026', createdBy: 'client', status: 'filed', statusDetail: 'Filed Feb 8, 2026' },
  { id: 'cf7', type: 'federal', jurisdiction: 'Federal', filingName: '941-X Amendment (Q3 2025)', dueDate: 'Mar 15, 2026', createdBy: 'rippling', status: 'action-needed', statusDetail: 'Needs Legal approval' },
  { id: 'cf8', type: 'state', jurisdiction: 'CA', filingName: 'Q1 2026 CA Withholding Return (DE 9)', dueDate: 'Apr 30, 2026', createdBy: 'rippling', status: 'action-needed', statusDetail: 'Pre-flight validation failed' },
  { id: 'cf9', type: 'federal', jurisdiction: 'Federal', filingName: 'Q1 2026 Form 941', dueDate: 'Apr 30, 2026', createdBy: 'rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf10', type: 'state', jurisdiction: 'TX', filingName: 'TX Quarterly Wage Report (C-3)', dueDate: 'Apr 30, 2026', createdBy: 'rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf11', type: 'federal', jurisdiction: 'Federal', filingName: 'Form 940 (Annual FUTA)', dueDate: 'Jan 31, 2026', createdBy: 'rippling', status: 'filed', statusDetail: 'Filed Jan 28, 2026' },
  { id: 'cf12', type: 'federal', jurisdiction: 'Federal', filingName: 'W-2 / W-3 Distribution', dueDate: 'Jan 31, 2026', createdBy: 'rippling', status: 'filed', statusDetail: 'Filed Jan 31, 2026' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const PageWrapper = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageHeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
`;

const PageHeaderWrapper = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space1200};
  padding-right: ${({ theme }) => (theme as StyledTheme).space1200};
  & > div { margin-bottom: 0 !important; }
  & div[class*='Content'] {
    margin-top: ${({ theme }) => (theme as StyledTheme).space1000} !important;
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200} !important;
  }
`;

const TabsWrapper = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1200};
  & > div, & div[class*='StyledScroll'], & div[class*='StyledTabContainer'] {
    box-shadow: none !important;
  }
`;

const PageContent = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1200}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space1000};
  flex: 1;
`;

/* ─── KPI cards ─── */

const KpiRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const KpiCard = styled.div<{ accent?: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

const KpiIconBox = styled.div<{ bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const KpiText = styled.div`
  display: flex;
  flex-direction: column;
`;

const KpiValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const KpiLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ─── Section ─── */

const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionHeader = styled.div``;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SectionSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space100} 0 0 0;
`;

/* ─── Table card ─── */

const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const Th = styled.th`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  transition: background-color 150ms ease;
  &:last-child { border-bottom: none; }
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const Td = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
`;

const ActionTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const ActionDesc = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const StatusDot = styled.span<{ status: ActionStatus }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;
  ${({ status, theme }) => {
    const t = theme as StyledTheme;
    switch (status) {
      case 'overdue': return `background-color: ${t.colorError};`;
      case 'due-soon': return `background-color: ${t.colorWarning};`;
      default: return `background-color: ${t.colorSuccess};`;
    }
  }}
`;

const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

/* ─── Updates timeline ─── */

const UpdatesCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const UpdateRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
`;

const UpdateIconBox = styled.div<{ type: UpdateType }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  ${({ type, theme }) => {
    const t = theme as StyledTheme;
    switch (type) {
      case 'completed': return `background-color: ${t.colorSuccessContainer};`;
      case 'alert': return `background-color: ${t.colorErrorContainer};`;
      default: return `background-color: ${t.colorSurfaceContainerHigh};`;
    }
  }}
`;

const UpdateContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const UpdateTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const UpdateDesc = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

const UpdateTimestamp = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  flex-shrink: 0;
`;

/* ─── Awareness section ─── */

const AwarenessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
`;

const AwarenessMetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

const AwarenessIconBox = styled.div<{ variant: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    switch (variant) {
      case 'success': return `background-color: ${t.colorSuccessContainer};`;
      case 'warning': return `background-color: rgba(255, 152, 0, 0.12);`;
      case 'error': return `background-color: ${t.colorErrorContainer};`;
      case 'info': return `background-color: ${t.colorPrimaryContainer};`;
      default: return `background-color: ${t.colorSurfaceContainerHigh};`;
    }
  }}
`;

const AwarenessMetricLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AwarenessMetricValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const AlertCard = styled.div<{ alertType: 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ alertType, theme }) => {
    const t = theme as StyledTheme;
    if (alertType === 'warning') {
      return `background-color: rgba(255, 152, 0, 0.06); border: 1px solid rgba(255, 152, 0, 0.2);`;
    }
    return `background-color: ${t.colorSurfaceContainerLow}; border: 1px solid ${t.colorOutlineVariant};`;
  }}
`;

const AlertText = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const AlertDesc = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

/* ─── People module: metrics + priority + issues table ─── */

const PeopleOverviewCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const PeopleMetricsRow = styled.div`
  display: flex;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
`;

const PeopleMetricItem = styled.div`
  flex: 1;
  padding-right: ${({ theme }) => (theme as StyledTheme).space600};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-right: ${({ theme }) => (theme as StyledTheme).space600};
  &:last-child { border-right: none; padding-right: 0; margin-right: 0; }
`;

const PeopleMetricLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PeopleMetricValue = styled.div<{ bold?: boolean }>`
  ${({ theme, bold }) => bold
    ? (theme as StyledTheme).typestyleV2TitleMedium
    : (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const PeopleCardDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0 ${({ theme }) => (theme as StyledTheme).space600};
`;

const PeoplePrioritySection = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
`;

const PeoplePriorityTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const PeoplePriorityGrid = styled.div`
  display: flex;
`;

const PeoplePriorityItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const PeoplePriorityItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const PriorityDot = styled.div<{ urgency: Urgency }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  ${({ urgency }) => {
    switch (urgency) {
      case 'very-high': return 'background-color: #D32F2F;';
      case 'high': return 'background-color: #F57C00;';
      case 'medium': return 'background-color: #1565C0;';
      default: return 'background-color: #9E9E9E;';
    }
  }}
`;

const PeoplePriorityLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PeoplePriorityCount = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
  padding-left: ${({ theme }) => (theme as StyledTheme).space300};
`;

const IssuesCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const IssuesCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const IssuesTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const IssuesToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  height: 32px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  width: 180px;
`;

const SearchPlaceholder = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmployeeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const EmployeeRole = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const UrgencyCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const UrgencyLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const IconBtn = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

/* ─── Module badge for overview table ─── */

const ModuleBadge = styled.span<{ module: ModuleId }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  border: 1px solid;
  ${({ module, theme }) => {
    const t = theme as StyledTheme;
    switch (module) {
      case 'people':
        return `background-color: rgba(3, 169, 244, 0.08); color: rgb(2, 119, 172); border-color: rgba(3, 169, 244, 0.2);`;
      case 'company':
        return `background-color: rgba(255, 152, 0, 0.08); color: rgb(180, 120, 0); border-color: rgba(255, 152, 0, 0.2);`;
      default:
        return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorPrimary}; border-color: ${t.colorOutlineVariant};`;
    }
  }}
`;

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function statusLabel(s: ActionStatus) {
  return s === 'overdue' ? 'Overdue' : s === 'due-soon' ? 'Due Soon' : 'Upcoming';
}

function statusAppearance(s: ActionStatus) {
  return s === 'overdue' ? Label.APPEARANCES.DANGER : s === 'due-soon' ? Label.APPEARANCES.WARNING : Label.APPEARANCES.NEUTRAL;
}

function updateIcon(t: UpdateType) {
  return t === 'completed' ? Icon.TYPES.CHECK : t === 'alert' ? Icon.TYPES.WARNING_TRIANGLE_OUTLINE : Icon.TYPES.REFRESH;
}

function updateColor(t: UpdateType, theme: StyledTheme) {
  return t === 'completed' ? theme.colorSuccess : t === 'alert' ? theme.colorError : theme.colorOnSurface;
}

function iconColor(v: string, theme: StyledTheme) {
  switch (v) {
    case 'success': return theme.colorSuccess;
    case 'warning': return theme.colorWarning;
    case 'error': return theme.colorError;
    case 'info': return theme.colorPrimary;
    default: return theme.colorOnSurface;
  }
}

function sortActions(items: ActionItem[]): ActionItem[] {
  const order: Record<ActionStatus, number> = { overdue: 0, 'due-soon': 1, upcoming: 2 };
  return [...items].sort((a, b) => order[a.status] - order[b.status]);
}

/* ═══════════════════════════════════════════════════════
   ACTIONS TABLE (shared between Overview and Module tabs)
   ═══════════════════════════════════════════════════════ */

const ActionsTable: React.FC<{ items: ActionItem[]; showModule?: boolean }> = ({
  items,
  showModule = false,
}) => {
  const { theme } = usePebbleTheme();
  const sorted = sortActions(items);

  return (
    <TableCard theme={theme}>
      <StyledTable>
        <THead theme={theme}>
          <tr>
            {showModule && <Th theme={theme}>Module</Th>}
            <Th theme={theme}>Action Item</Th>
            <Th theme={theme}>Due Date</Th>
            <Th theme={theme}>Owner</Th>
            <Th theme={theme}>Status</Th>
            <Th theme={theme} style={{ width: 100 }} />
          </tr>
        </THead>
        <tbody>
          {sorted.map(item => (
            <Tr key={item.id} theme={theme}>
              {showModule && (
                <Td theme={theme}>
                  <ModuleBadge theme={theme} module={item.module}>
                    {MODULE_LABELS[item.module]}
                  </ModuleBadge>
                </Td>
              )}
              <Td theme={theme}>
                <ActionTitle theme={theme}>{item.title}</ActionTitle>
                <ActionDesc theme={theme}>{item.description}</ActionDesc>
              </Td>
              <Td theme={theme}>
                <CellText theme={theme}>{item.dueDate}</CellText>
              </Td>
              <Td theme={theme}>
                <CellText theme={theme}>{item.owner || '—'}</CellText>
              </Td>
              <Td theme={theme}>
                <StatusCell theme={theme}>
                  <StatusDot theme={theme} status={item.status} />
                  <Label size={Label.SIZES.S} appearance={statusAppearance(item.status)}>
                    {statusLabel(item.status)}
                  </Label>
                </StatusCell>
              </Td>
              <Td theme={theme}>
                <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                  Take Action
                </Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </TableCard>
  );
};

/* ═══════════════════════════════════════════════════════
   UPDATES LIST (shared)
   ═══════════════════════════════════════════════════════ */

const UpdatesList: React.FC<{ updates: RipplingUpdate[] }> = ({ updates }) => {
  const { theme } = usePebbleTheme();
  return (
    <UpdatesCard theme={theme}>
      {updates.map(u => (
        <UpdateRow key={u.id} theme={theme}>
          <UpdateIconBox theme={theme} type={u.type}>
            <Icon type={updateIcon(u.type)} size={16} color={updateColor(u.type, theme as StyledTheme)} />
          </UpdateIconBox>
          <UpdateContent>
            <UpdateTitle theme={theme}>{u.title}</UpdateTitle>
            <UpdateDesc theme={theme}>{u.description}</UpdateDesc>
          </UpdateContent>
          <UpdateTimestamp theme={theme}>{u.timestamp}</UpdateTimestamp>
        </UpdateRow>
      ))}
    </UpdatesCard>
  );
};

/* ═══════════════════════════════════════════════════════
   AWARENESS SECTION (shared)
   ═══════════════════════════════════════════════════════ */

const AwarenessSection: React.FC<{
  metrics: AwarenessItem[];
  alerts: AwarenessAlert[];
}> = ({ metrics, alerts }) => {
  const { theme } = usePebbleTheme();
  return (
    <>
      <AwarenessGrid theme={theme}>
        {metrics.map(m => (
          <AwarenessMetricCard key={m.id} theme={theme}>
            <AwarenessIconBox theme={theme} variant={m.variant || 'neutral'}>
              <Icon type={m.icon} size={18} color={iconColor(m.variant || 'neutral', theme as StyledTheme)} />
            </AwarenessIconBox>
            <div>
              <AwarenessMetricLabel theme={theme}>{m.label}</AwarenessMetricLabel>
              <br />
              <AwarenessMetricValue theme={theme}>{m.value}</AwarenessMetricValue>
            </div>
          </AwarenessMetricCard>
        ))}
      </AwarenessGrid>

      {alerts.length > 0 && (
        <AlertsContainer theme={theme}>
          {alerts.map(a => (
            <AlertCard key={a.id} theme={theme} alertType={a.type}>
              <Icon
                type={a.type === 'warning' ? Icon.TYPES.WARNING_TRIANGLE_OUTLINE : Icon.TYPES.INFO_OUTLINE}
                size={18}
                color={a.type === 'warning' ? (theme as StyledTheme).colorWarning : (theme as StyledTheme).colorPrimary}
              />
              <AlertText>
                <AlertTitle theme={theme}>{a.title}</AlertTitle>
                <AlertDesc theme={theme}>{a.description}</AlertDesc>
              </AlertText>
            </AlertCard>
          ))}
        </AlertsContainer>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════ */

const OverviewTab: React.FC = () => {
  const { theme } = usePebbleTheme();

  const totalActions = ALL_ACTIONS.length;
  const overdueCount = ALL_ACTIONS.filter(a => a.status === 'overdue').length;
  const dueSoonCount = ALL_ACTIONS.filter(a => a.status === 'due-soon').length;
  const upcomingCount = ALL_ACTIONS.filter(a => a.status === 'upcoming').length;

  return (
    <>
      {/* KPI bar */}
      <KpiRow theme={theme}>
        <KpiCard theme={theme}>
          <KpiIconBox theme={theme} bg={(theme as StyledTheme).colorSurfaceContainerHigh}>
            <Icon type={Icon.TYPES.LIST_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
          </KpiIconBox>
          <KpiText>
            <KpiValue theme={theme}>{totalActions}</KpiValue>
            <KpiLabel theme={theme}>Total Tasks</KpiLabel>
          </KpiText>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIconBox theme={theme} bg={(theme as StyledTheme).colorErrorContainer}>
            <Icon type={Icon.TYPES.WARNING_CIRCLE_OUTLINE} size={20} color={(theme as StyledTheme).colorError} />
          </KpiIconBox>
          <KpiText>
            <KpiValue theme={theme}>{overdueCount}</KpiValue>
            <KpiLabel theme={theme}>Overdue</KpiLabel>
          </KpiText>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIconBox theme={theme} bg="rgba(255, 152, 0, 0.12)">
            <Icon type={Icon.TYPES.TIME_OUTLINE} size={20} color={(theme as StyledTheme).colorWarning} />
          </KpiIconBox>
          <KpiText>
            <KpiValue theme={theme}>{dueSoonCount}</KpiValue>
            <KpiLabel theme={theme}>Due Soon</KpiLabel>
          </KpiText>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIconBox theme={theme} bg={(theme as StyledTheme).colorSuccessContainer}>
            <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={20} color={(theme as StyledTheme).colorSuccess} />
          </KpiIconBox>
          <KpiText>
            <KpiValue theme={theme}>{upcomingCount}</KpiValue>
            <KpiLabel theme={theme}>Upcoming</KpiLabel>
          </KpiText>
        </KpiCard>
      </KpiRow>

      {/* Unified task table */}
      <SectionBlock theme={theme}>
        <SectionHeader>
          <SectionTitle theme={theme}>
            <Icon type={Icon.TYPES.LIST_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
            All Compliance Tasks
          </SectionTitle>
          <SectionSubtitle theme={theme}>
            Aggregated from People, Company & Entity, and Filing modules — sorted by urgency.
          </SectionSubtitle>
        </SectionHeader>
        <ActionsTable items={ALL_ACTIONS} showModule />
      </SectionBlock>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   PEOPLE ACTIONS SECTION (employee-level open issues)
   ═══════════════════════════════════════════════════════ */

function urgencyText(u: Urgency) {
  switch (u) {
    case 'very-high': return 'Very High';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    default: return 'Low';
  }
}

const PeopleActionsSection: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <>
      {/* Metrics + Priority card */}
      <PeopleOverviewCard theme={theme}>
        <PeopleMetricsRow theme={theme}>
          <PeopleMetricItem theme={theme}>
            <PeopleMetricLabel theme={theme}>Total outstanding issues</PeopleMetricLabel>
            <PeopleMetricValue theme={theme}>{PEOPLE_METRICS.totalOutstanding}</PeopleMetricValue>
          </PeopleMetricItem>
          <PeopleMetricItem theme={theme}>
            <PeopleMetricLabel theme={theme}>New issues in past 30 days</PeopleMetricLabel>
            <PeopleMetricValue theme={theme}>{PEOPLE_METRICS.newInPast30Days}</PeopleMetricValue>
          </PeopleMetricItem>
          <PeopleMetricItem theme={theme}>
            <PeopleMetricLabel theme={theme}>Average time to resolve</PeopleMetricLabel>
            <PeopleMetricValue theme={theme} bold>{PEOPLE_METRICS.avgResolveTime}</PeopleMetricValue>
          </PeopleMetricItem>
        </PeopleMetricsRow>

        <PeopleCardDivider theme={theme} />

        <PeoplePrioritySection theme={theme}>
          <PeoplePriorityTitle theme={theme}>Outstanding issues by priority</PeoplePriorityTitle>
          <PeoplePriorityGrid>
            {PEOPLE_PRIORITY.map(p => (
              <PeoplePriorityItem key={p.label} theme={theme}>
                <PeoplePriorityItemHeader>
                  <PriorityDot urgency={p.urgency} />
                  <PeoplePriorityLabel theme={theme}>{p.label}</PeoplePriorityLabel>
                </PeoplePriorityItemHeader>
                <PeoplePriorityCount theme={theme}>{p.count}</PeoplePriorityCount>
              </PeoplePriorityItem>
            ))}
          </PeoplePriorityGrid>
        </PeoplePrioritySection>
      </PeopleOverviewCard>

      {/* Open issues table */}
      <IssuesCard theme={theme}>
        <IssuesCardTop theme={theme}>
          <IssuesTitle theme={theme}>Open issues</IssuesTitle>
          <IssuesToolbar theme={theme}>
            <SearchBox theme={theme}>
              <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              <SearchPlaceholder theme={theme}>Search</SearchPlaceholder>
            </SearchBox>
            <FilterBtn theme={theme} aria-label="Filter">
              <Icon type={Icon.TYPES.FILTER} size={14} color={(theme as StyledTheme).colorOnSurface} />
            </FilterBtn>
          </IssuesToolbar>
        </IssuesCardTop>

        <StyledTable>
          <THead theme={theme}>
            <tr>
              <Th theme={theme}>Date detected</Th>
              <Th theme={theme}>Employee</Th>
              <Th theme={theme}>Resolution deadline</Th>
              <Th theme={theme}>Urgency</Th>
              <Th theme={theme}>Issue type</Th>
              <Th theme={theme} style={{ width: 70 }} />
            </tr>
          </THead>
          <tbody>
            {EMPLOYEE_ISSUES.map(issue => (
              <Tr key={issue.id} theme={theme}>
                <Td theme={theme}>
                  <CellText theme={theme}>{issue.dateDetected}</CellText>
                </Td>
                <Td theme={theme}>
                  <EmployeeCell theme={theme}>
                    <Avatar size={Avatar.SIZES.S} name={issue.employeeName} />
                    <EmployeeInfo>
                      <EmployeeName theme={theme}>{issue.employeeName}</EmployeeName>
                      <EmployeeRole theme={theme}>{issue.employeeRole}</EmployeeRole>
                    </EmployeeInfo>
                  </EmployeeCell>
                </Td>
                <Td theme={theme}>
                  <CellText theme={theme}>{issue.resolutionDeadline}</CellText>
                </Td>
                <Td theme={theme}>
                  <UrgencyCell theme={theme}>
                    <PriorityDot urgency={issue.urgency} />
                    <UrgencyLabel theme={theme}>{urgencyText(issue.urgency)}</UrgencyLabel>
                  </UrgencyCell>
                </Td>
                <Td theme={theme}>
                  <CellText theme={theme}>{issue.issueType}</CellText>
                </Td>
                <Td theme={theme}>
                  <RowActions theme={theme}>
                    <IconBtn theme={theme} aria-label="More actions">
                      <Icon type={Icon.TYPES.MORE_VERTICAL} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                    </IconBtn>
                    <IconBtn theme={theme} aria-label="View details">
                      <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                    </IconBtn>
                  </RowActions>
                </Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </IssuesCard>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   ENTITY ACTIONS SECTION (task + category + penalty table)
   ═══════════════════════════════════════════════════════ */

const TaskNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const TaskNameText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const OverdueTag = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 500;
  margin-left: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PenaltyText = styled.span<{ isOverdue: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ isOverdue, theme }) =>
    isOverdue ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
`;

const EntityKpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
`;

const EntityKpiCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  text-align: center;
`;

const EntityKpiIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const EntityKpiValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const EntityKpiLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
  line-height: 1.4;
`;

const EntityActionsSection: React.FC = () => {
  const { theme } = usePebbleTheme();
  const sorted = [...ENTITY_TASKS].sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <>
      {/* KPI strip */}
      <EntityKpiGrid theme={theme}>
        {ENTITY_KPIS.map(kpi => (
          <EntityKpiCard key={kpi.label} theme={theme}>
            <EntityKpiIconBox theme={theme}>
              <Icon type={kpi.icon} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </EntityKpiIconBox>
            <EntityKpiValue theme={theme}>{kpi.value}</EntityKpiValue>
            <EntityKpiLabel theme={theme}>{kpi.label}</EntityKpiLabel>
          </EntityKpiCard>
        ))}
      </EntityKpiGrid>

      {/* Task table */}
      <SectionBlock theme={theme}>
        <SectionHeader>
          <SectionTitle theme={theme}>
            <Icon type={Icon.TYPES.CHECKLIST} size={20} color={(theme as StyledTheme).colorOnSurface} />
            Your Actions
          </SectionTitle>
          <SectionSubtitle theme={theme}>
            Items requiring your input to keep compliance on track.
          </SectionSubtitle>
        </SectionHeader>

        <TableCard theme={theme}>
          <StyledTable>
          <THead theme={theme}>
            <tr>
              <Th theme={theme}>Task</Th>
              <Th theme={theme}>Category</Th>
              <Th theme={theme}>Due Date</Th>
              <Th theme={theme}>Penalty Status</Th>
            </tr>
          </THead>
          <tbody>
            {sorted.map(task => {
              const penalty = penaltyStatus(task.daysLeft);
              const isOverdue = task.daysLeft < 0;
              return (
                <Tr key={task.id} theme={theme}>
                  <Td theme={theme}>
                    <TaskNameCell theme={theme}>
                      <StatusDot
                        theme={theme}
                        status={isOverdue ? 'overdue' : task.daysLeft <= 10 ? 'due-soon' : 'upcoming'}
                      />
                      <div>
                        <TaskNameText theme={theme}>{task.task}</TaskNameText>
                        {isOverdue && <OverdueTag theme={theme}>Overdue</OverdueTag>}
                      </div>
                    </TaskNameCell>
                  </Td>
                  <Td theme={theme}>
                    <CellText theme={theme}>{task.category}</CellText>
                  </Td>
                  <Td theme={theme}>
                    <CellText theme={theme}>{task.dueDate}</CellText>
                  </Td>
                  <Td theme={theme}>
                    <PenaltyText theme={theme} isOverdue={penalty.isOverdue}>
                      {penalty.text}
                    </PenaltyText>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </StyledTable>
      </TableCard>
    </SectionBlock>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   FILING ACTIONS SECTION (compliance filings table)
   ═══════════════════════════════════════════════════════ */

const FilingTypeBadge = styled.span<{ filingType: FilingType }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  border: 1px solid;
  ${({ filingType }) => {
    switch (filingType) {
      case 'federal':
        return 'background-color: rgba(255, 152, 0, 0.08); color: rgb(180, 120, 0); border-color: rgba(255, 152, 0, 0.2);';
      case 'state':
        return 'background-color: rgba(76, 175, 80, 0.08); color: rgb(46, 125, 50); border-color: rgba(76, 175, 80, 0.2);';
      default:
        return 'background-color: rgba(3, 169, 244, 0.08); color: rgb(2, 119, 172); border-color: rgba(3, 169, 244, 0.2);';
    }
  }}
`;

const CreatorBadge = styled.span<{ creator: FilingCreator }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  border: 1px solid;
  ${({ creator, theme }) => {
    const t = theme as StyledTheme;
    if (creator === 'rippling') {
      return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorPrimary}; border-color: ${t.colorOutlineVariant};`;
    }
    return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorOnSurfaceVariant}; border-color: ${t.colorOutlineVariant};`;
  }}
`;

const FilingStatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FilingStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const FilingStatusDot = styled.span<{ filingStatus: FilingStatus }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;
  ${({ filingStatus, theme }) => {
    const t = theme as StyledTheme;
    switch (filingStatus) {
      case 'filed': return `background-color: ${t.colorSuccess};`;
      case 'in-progress': return 'background-color: #F57C00;';
      case 'action-needed': return `background-color: ${t.colorError};`;
      default: return `background-color: ${t.colorOnSurfaceVariant};`;
    }
  }}
`;

const FilingStatusLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const FilingStatusDetail = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding-left: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FilingActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ViewLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const JurisdictionText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

function filingStatusLabel(s: FilingStatus) {
  switch (s) {
    case 'filed': return 'Filed';
    case 'in-progress': return 'In Progress';
    case 'action-needed': return 'Action Needed';
    default: return 'Upcoming';
  }
}

const FilingActionsSection: React.FC = () => {
  const { theme } = usePebbleTheme();
  const statusOrder: Record<FilingStatus, number> = { 'action-needed': 0, 'in-progress': 1, upcoming: 2, filed: 3 };
  const sorted = [...COMPLIANCE_FILINGS].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <SectionBlock theme={theme}>
      <SectionHeader>
        <SectionTitle theme={theme}>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={20} color={(theme as StyledTheme).colorOnSurface} />
          All Compliance Filings
        </SectionTitle>
        <SectionSubtitle theme={theme}>
          Federal, state, and local filings managed by Rippling and your team.
        </SectionSubtitle>
      </SectionHeader>

      <TableCard theme={theme}>
        <IssuesCardTop theme={theme}>
          <IssuesTitle theme={theme}>2026</IssuesTitle>
          <IssuesToolbar theme={theme}>
            <SearchBox theme={theme}>
              <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              <SearchPlaceholder theme={theme}>Search filings...</SearchPlaceholder>
            </SearchBox>
            <FilterBtn theme={theme} aria-label="Filter">
              <Icon type={Icon.TYPES.FILTER} size={14} color={(theme as StyledTheme).colorOnSurface} />
            </FilterBtn>
          </IssuesToolbar>
        </IssuesCardTop>

        <StyledTable>
          <THead theme={theme}>
            <tr>
              <Th theme={theme}>Type</Th>
              <Th theme={theme}>Jurisdiction</Th>
              <Th theme={theme}>Filing Name</Th>
              <Th theme={theme}>Due Date</Th>
              <Th theme={theme}>Created By</Th>
              <Th theme={theme}>Status</Th>
              <Th theme={theme} style={{ width: 90 }}>Actions</Th>
            </tr>
          </THead>
          <tbody>
            {sorted.map(f => (
              <Tr key={f.id} theme={theme}>
                <Td theme={theme}>
                  <FilingTypeBadge theme={theme} filingType={f.type}>
                    {f.type === 'federal' ? 'Federal' : f.type === 'state' ? 'State' : 'Local'}
                  </FilingTypeBadge>
                </Td>
                <Td theme={theme}>
                  <JurisdictionText theme={theme}>{f.jurisdiction}</JurisdictionText>
                </Td>
                <Td theme={theme}>
                  <CellText theme={theme}>{f.filingName}</CellText>
                </Td>
                <Td theme={theme}>
                  <CellText theme={theme}>{f.dueDate}</CellText>
                </Td>
                <Td theme={theme}>
                  <CreatorBadge theme={theme} creator={f.createdBy}>
                    {f.createdBy === 'rippling' ? 'Rippling' : 'Client'}
                  </CreatorBadge>
                </Td>
                <Td theme={theme}>
                  <FilingStatusCell>
                    <FilingStatusRow theme={theme}>
                      <FilingStatusDot theme={theme} filingStatus={f.status} />
                      <FilingStatusLabel theme={theme}>{filingStatusLabel(f.status)}</FilingStatusLabel>
                    </FilingStatusRow>
                    {f.statusDetail && (
                      <FilingStatusDetail theme={theme}>{f.statusDetail}</FilingStatusDetail>
                    )}
                  </FilingStatusCell>
                </Td>
                <Td theme={theme}>
                  {(f.status === 'filed') && (
                    <FilingActionsCell theme={theme}>
                      <ViewLink theme={theme}>View</ViewLink>
                      <IconBtn theme={theme} aria-label="Download">
                        <Icon type={Icon.TYPES.DOWNLOAD} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                      </IconBtn>
                    </FilingActionsCell>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableCard>
    </SectionBlock>
  );
};

/* ═══════════════════════════════════════════════════════
   MODULE TAB (shared layout for People / Company / Filing)
   ═══════════════════════════════════════════════════════ */

const ModuleTab: React.FC<{ module: ModuleData }> = ({ module }) => {
  const { theme } = usePebbleTheme();
  const isPeople = module.id === 'people';
  const isCompany = module.id === 'company';
  const isFiling = module.id === 'filing';

  return (
    <>
      {/* Section 1 — Your Actions (specialized per module) */}
      {isPeople ? (
        <PeopleActionsSection />
      ) : isCompany ? (
        <EntityActionsSection />
      ) : isFiling ? (
        <FilingActionsSection />
      ) : (
        <SectionBlock theme={theme}>
          <SectionHeader>
            <SectionTitle theme={theme}>
              <Icon type={Icon.TYPES.CHECKLIST} size={20} color={(theme as StyledTheme).colorOnSurface} />
              Your Actions
            </SectionTitle>
            <SectionSubtitle theme={theme}>
              Items requiring your attention to maintain compliance.
            </SectionSubtitle>
          </SectionHeader>
          <ActionsTable items={module.actions} />
        </SectionBlock>
      )}

      {/* Section 2 — Rippling Updates */}
      <SectionBlock theme={theme}>
        <SectionHeader>
          <SectionTitle theme={theme}>
            <Icon type={Icon.TYPES.REFRESH} size={20} color={(theme as StyledTheme).colorOnSurface} />
            Rippling Updates
          </SectionTitle>
          <SectionSubtitle theme={theme}>
            Actions Rippling has completed or changes applied automatically.
          </SectionSubtitle>
        </SectionHeader>
        <UpdatesList updates={module.updates} />
      </SectionBlock>

    </>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

const TAB_NAMES = ['Overview', ...MODULES.map(m => m.name)];

export const Compliance360Page: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);

  const tabBadges = [
    ALL_ACTIONS.length,
    ...MODULES.map(m => m.actions.length),
  ];

  return (
    <PageWrapper theme={theme}>
      <PageHeaderArea theme={theme}>
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
              <Tabs.Tab
                key={`c360-${i}`}
                title={name}
                badge={{
                  text: String(tabBadges[i]),
                  appearance: i === activeTab ? BADGE_APPEARANCES.PRIMARY_LIGHT : BADGE_APPEARANCES.NEUTRAL,
                }}
              />
            ))}
          </Tabs.LINK>
        </TabsWrapper>
      </PageHeaderArea>

      <PageContent theme={theme}>
        {activeTab === 0 && <OverviewTab />}
        {activeTab >= 1 && <ModuleTab module={MODULES[activeTab - 1]} />}
      </PageContent>
    </PageWrapper>
  );
};
