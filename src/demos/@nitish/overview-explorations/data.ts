export type UrgencyLevel = 'overdue' | 'due-this-week';
export type ModuleName = 'Workforce' | 'Registrations' | 'Filings';

export interface ActionItem {
  task: string;
  action: string;
  entity: string;
  module: ModuleName;
  category: string;
  urgency: UrgencyLevel;
  daysOverdue?: number;
  daysUntilDue?: number;
  penalty?: string;
  dueDate?: string;
  // Workforce-specific fields (matching product table)
  dateDetected?: string;
  employeeName?: string;
  employeeRole?: string;
  resolutionDeadline?: string;
  issueType?: string;
}

export interface ModuleInfo {
  description: string;
  countLabel: string;
  totalCount: number;
  shownCount?: number;
  curationNote?: string;
}

export const ACTION_ITEMS: ActionItem[] = [
  // Workforce (showing 3 most overdue of 24)
  { task: 'Expired I-9 verification', action: 'Re-verification needed', entity: 'John Smith · Engineering', module: 'Workforce', category: 'I-9', urgency: 'overdue', daysOverdue: 18, dueDate: 'Mar 6, 2026', dateDetected: '02/18/2026', employeeName: 'John Smith', employeeRole: 'Senior Engineer', resolutionDeadline: '03/06/2026', issueType: 'I-9 verification' },
  { task: 'Missing CA pay stub notice', action: 'Provide pay stub notice', entity: 'Sarah Lee · Marketing', module: 'Workforce', category: 'Pay stub', urgency: 'overdue', daysOverdue: 13, dueDate: 'Mar 11, 2026', dateDetected: '02/25/2026', employeeName: 'Sarah Lee', employeeRole: 'Marketing Manager', resolutionDeadline: '03/11/2026', issueType: 'Pay stub violation' },
  { task: 'Minimum wage violation', action: 'Wage adjustment required', entity: 'James Park · Operations', module: 'Workforce', category: 'Wage', urgency: 'overdue', daysOverdue: 8, dueDate: 'Mar 16, 2026', dateDetected: '03/04/2026', employeeName: 'James Park', employeeRole: 'Operations Coord...', resolutionDeadline: '03/16/2026', issueType: 'Minimum wage violation' },

  // Registrations
  { task: 'TX Withholding Registration', action: 'Provide EIN verification', entity: 'Texas Workforce Commission', module: 'Registrations', category: 'State tax', urgency: 'overdue', daysOverdue: 5, dueDate: 'Feb 28, 2026', penalty: '$250 fine already charged' },
  { task: 'Philadelphia local tax account', action: 'Sign employer authorization', entity: 'Philadelphia Revenue Dept', module: 'Registrations', category: 'Local tax', urgency: 'due-this-week', daysUntilDue: 2, dueDate: 'Mar 26, 2026', penalty: '$250 fee if missed' },
  { task: 'WA foreign qualification', action: 'Upload Certificate of Good Standing', entity: 'WA Secretary of State', module: 'Registrations', category: 'Foreign qual', urgency: 'due-this-week', daysUntilDue: 0, dueDate: 'Mar 24, 2026' },

  // Filings
  { task: '941-X Amendment (Q3 2025)', action: 'Approve amendment data', entity: 'Federal · 941-X', module: 'Filings', category: 'Federal', urgency: 'due-this-week', daysUntilDue: 3, dueDate: 'Mar 27, 2026', penalty: 'Late filing penalty' },
  { task: 'NY Paid Family Leave Annual Statement', action: 'Review employee data', entity: 'New York · PFL-120', module: 'Filings', category: 'NY State', urgency: 'due-this-week', daysUntilDue: 1, dueDate: 'Mar 25, 2026' },
];

export const MODULE_META: Record<ModuleName, ModuleInfo> = {
  Workforce: { description: 'Employee-level compliance issues', countLabel: '3 overdue', totalCount: 24, shownCount: 3, curationNote: 'Showing 3 most overdue of 24' },
  Registrations: { description: 'State & local tax accounts, foreign qualifications', countLabel: '3 blocked on you', totalCount: 3 },
  Filings: { description: 'EEO-1, ACA, quarterly returns & amendments', countLabel: '2 require filing', totalCount: 2 },
};

export const MODULE_ORDER: ModuleName[] = ['Workforce', 'Registrations', 'Filings'];

export interface ModuleGroup {
  module: ModuleName;
  items: ActionItem[];
}

export function groupByModule(items: ActionItem[]): ModuleGroup[] {
  const groups: Record<string, ActionItem[]> = {};
  for (const item of items) {
    if (!groups[item.module]) groups[item.module] = [];
    groups[item.module].push(item);
  }
  return MODULE_ORDER.filter(m => groups[m]).map(m => ({ module: m, items: groups[m] }));
}

export function relativeTime(item: ActionItem): string {
  if (item.urgency === 'overdue' && item.daysOverdue != null) {
    return `${item.daysOverdue} day${item.daysOverdue === 1 ? '' : 's'} overdue`;
  }
  if (item.daysUntilDue != null) {
    if (item.daysUntilDue === 0) return 'Due today';
    if (item.daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${item.daysUntilDue} days`;
  }
  return '';
}

export function urgencyDotColor(urgency: UrgencyLevel): 'error' | 'warning' {
  return urgency === 'overdue' ? 'error' : 'warning';
}

export function urgencyLabel(item: ActionItem): string {
  if (item.urgency === 'overdue') return 'Overdue';
  if (item.daysUntilDue != null && item.daysUntilDue <= 1) return 'Urgent';
  return 'This week';
}

const URGENCY_ORDER: Record<UrgencyLevel, number> = { overdue: 0, 'due-this-week': 1 };

export const sortedItems = [...ACTION_ITEMS].sort(
  (a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency],
);

/* ── Impact metrics ── */

export interface ImpactMetric {
  value: string;
  label: string;
  icon: string;
}

export const IMPACT_METRICS: ImpactMetric[] = [
  { value: '62+', label: 'Estimated hours saved', icon: 'CLOCK_OUTLINE' },
  { value: '18', label: 'State registrations completed', icon: 'DOCUMENT_OUTLINE' },
  { value: '5', label: 'Local registrations completed', icon: 'DOCUMENT_OUTLINE' },
  { value: '6', label: 'Foreign qualifications completed', icon: 'DOCUMENT_OUTLINE' },
  { value: '14', label: 'Additional filings done', icon: 'DOCUMENT_OUTLINE' },
];

/* ── Module summary stats (for simplified views) ── */

export interface ModuleSummary {
  module: ModuleName;
  title: string;
  description: string;
  totalCount: number;
  totalLabel: string;
  actionCount: number;
  actionLabel: string;
  actionStatus: 'error' | 'warning';
  onTrackCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const MODULE_SUMMARIES: ModuleSummary[] = [
  {
    module: 'Workforce',
    title: 'Workforce',
    description: 'Employee-level compliance issues',
    totalCount: 24,
    totalLabel: '24 open issues',
    actionCount: 3,
    actionLabel: '3 overdue',
    actionStatus: 'error',
    onTrackCount: 16,
    inProgressCount: 5,
    completedCount: 0,
  },
  {
    module: 'Registrations',
    title: 'Registrations',
    description: 'State & local tax accounts, foreign qualifications',
    totalCount: 8,
    totalLabel: '8 total',
    actionCount: 3,
    actionLabel: '3 blocked on you',
    actionStatus: 'error',
    onTrackCount: 3,
    inProgressCount: 2,
    completedCount: 5,
  },
  {
    module: 'Filings',
    title: 'Filings',
    description: 'EEO-1, ACA, quarterly returns & amendments',
    totalCount: 6,
    totalLabel: '6 total',
    actionCount: 2,
    actionLabel: '2 require filing',
    actionStatus: 'warning',
    onTrackCount: 2,
    inProgressCount: 2,
    completedCount: 4,
  },
];
