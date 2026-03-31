import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { StatusDot } from './shared-styles';

/* ═══════════════════════════════════════════════════════
   DATA — Items requiring action (curated per module)
   ═══════════════════════════════════════════════════════ */

type UrgencyLevel = 'overdue' | 'due-this-week';

interface ActionItem {
  task: string;
  action: string;
  entity: string;
  daysOverdue?: number;
  daysUntilDue?: number;
  urgency: UrgencyLevel;
  module: string;
  tabIndex: number;
  subTabIndex?: number;
}

const ACTION_ITEMS: ActionItem[] = [
  // Workforce (showing 3 most overdue of 24)
  { task: 'Expired I-9 verification', action: 'Re-verification needed', entity: 'John Smith · Engineering', daysOverdue: 18, urgency: 'overdue', module: 'Workforce', tabIndex: 1 },
  { task: 'Missing CA pay stub notice', action: 'Provide pay stub notice', entity: 'Sarah Lee · Marketing', daysOverdue: 13, urgency: 'overdue', module: 'Workforce', tabIndex: 1 },
  { task: 'Minimum wage violation', action: 'Wage adjustment required', entity: 'James Park · Operations', daysOverdue: 8, urgency: 'overdue', module: 'Workforce', tabIndex: 1 },
  // Registrations
  { task: 'TX Withholding registration', action: 'Provide EIN verification', entity: 'Texas Workforce Commission', daysOverdue: 5, urgency: 'overdue', module: 'Registrations', tabIndex: 2, subTabIndex: 0 },
  { task: 'Philadelphia local tax account', action: 'Sign employer authorization', entity: 'Philadelphia Revenue Dept', daysUntilDue: 2, urgency: 'due-this-week', module: 'Registrations', tabIndex: 2, subTabIndex: 1 },
  { task: 'WA foreign qualification', action: 'Upload Certificate of Good Standing', entity: 'WA Secretary of State', daysUntilDue: 0, urgency: 'due-this-week', module: 'Registrations', tabIndex: 2, subTabIndex: 2 },
  // Filings
  { task: '941-X Amendment (Q3 2025)', action: 'Approve amendment data', entity: 'Federal · 941-X', daysUntilDue: 3, urgency: 'due-this-week', module: 'Filings', tabIndex: 3 },
  { task: 'NY Paid Family Leave Annual Statement', action: 'Review employee data', entity: 'New York · PFL-120', daysUntilDue: 1, urgency: 'due-this-week', module: 'Filings', tabIndex: 3 },
];

const URGENCY_ORDER: Record<UrgencyLevel, number> = { overdue: 0, 'due-this-week': 1 };

const sortedItems = [...ACTION_ITEMS].sort(
  (a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency],
);

const MODULE_ORDER = ['Workforce', 'Registrations', 'Filings'];

interface ModuleInfo {
  description: string;
  countLabel: string;
  totalCount: number;
  shownCount?: number;
  curationNote?: string;
  tabIndex: number;
}

const MODULE_META: Record<string, ModuleInfo> = {
  Workforce: { description: 'Employee-level compliance issues', countLabel: '3 overdue', totalCount: 24, shownCount: 3, curationNote: 'Showing 3 most overdue of 24', tabIndex: 1 },
  Registrations: { description: 'State & local tax accounts, foreign qualifications', countLabel: '3 blocked on you', totalCount: 3, tabIndex: 2 },
  Filings: { description: 'EEO-1, ACA, quarterly returns & amendments', countLabel: '2 require filing', totalCount: 2, tabIndex: 3 },
};

function groupByModule(items: ActionItem[]) {
  const groups: Record<string, ActionItem[]> = {};
  for (const item of items) {
    if (!groups[item.module]) groups[item.module] = [];
    groups[item.module].push(item);
  }
  return MODULE_ORDER.filter(m => groups[m]).map(m => ({ module: m, items: groups[m] }));
}

/* ═══════════════════════════════════════════════════════
   DATA — Impact metrics
   ═══════════════════════════════════════════════════════ */

interface ImpactMetric {
  value: string;
  label: string;
}

const IMPACT_METRICS: ImpactMetric[] = [
  { value: '62+', label: 'Hours saved on registrations' },
  { value: '18',  label: 'State registrations completed' },
  { value: '5',   label: 'Local registrations completed' },
  { value: '6',   label: 'Foreign qualifications completed' },
  { value: '4',   label: 'Filings submitted by Rippling' },
  { value: '100%', label: 'On-time filing rate (YTD)' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

/* ── Group header ── */

const GroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover span[data-role='link'] {
    text-decoration: underline;
  }
`;

const GroupLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const GroupName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const GroupDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const GroupCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 600;
`;

const GroupViewAll = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

/* ── Action rows ── */

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0;
`;

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const ActionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`;

const ActionTask = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const ActionHint = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const ActionEntity = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ActionDue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  flex-shrink: 0;
`;

const UrgencyBadge = styled.span<{ urgency: UrgencyLevel }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  white-space: nowrap;
  flex-shrink: 0;

  background-color: ${({ urgency }) =>
    urgency === 'overdue' ? 'rgba(183,28,28,0.08)' : 'rgba(245,124,0,0.08)'};
  color: ${({ urgency }) =>
    urgency === 'overdue' ? 'rgb(183,28,28)' : 'rgb(245,124,0)'};
`;

const CurationNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const CurationLink = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};

  &:hover {
    text-decoration: underline;
  }
`;

/* ── Impact ── */

const ImpactBanner = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ImpactTitleText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ImpactSubtitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ImpactStatsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  flex-wrap: wrap;
`;

const ImpactStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ImpactStatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
`;

const ImpactStatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function urgencyDot(u: UrgencyLevel): 'error' | 'warning' {
  return u === 'overdue' ? 'error' : 'warning';
}

function relativeTime(item: ActionItem): string {
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

function urgencyBadgeLabel(item: ActionItem): string {
  if (item.urgency === 'overdue') return 'Overdue';
  if (item.daysUntilDue != null && item.daysUntilDue <= 1) return 'Urgent';
  return 'This week';
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface OverviewV3TabProps {
  onNavigateToModule?: (tabIndex: number, subTabIndex?: number) => void;
}

export const OverviewV3Tab: React.FC<OverviewV3TabProps> = ({ onNavigateToModule }) => {
  const { theme } = usePebbleTheme();
  const grouped = groupByModule(sortedItems);

  return (
    <TabContent theme={theme}>
      {grouped.map((group, idx) => {
        const meta = MODULE_META[group.module];
        return (
          <React.Fragment key={group.module}>
            {idx > 0 && <Divider theme={theme} />}
            <GroupBlock theme={theme}>
              <GroupHeader onClick={() => onNavigateToModule?.(meta.tabIndex)}>
                <GroupLeft theme={theme}>
                  <GroupName theme={theme}>{group.module}</GroupName>
                  <GroupDesc theme={theme}>{meta.description}</GroupDesc>
                  <GroupCount theme={theme}>
                    {meta.countLabel}
                  </GroupCount>
                </GroupLeft>
                <GroupViewAll theme={theme} data-role="link">
                  View all
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                </GroupViewAll>
              </GroupHeader>

              <ActionsList theme={theme}>
                {group.items.map((item, i) => (
                  <ActionRow
                    key={i}
                    theme={theme}
                    onClick={() => onNavigateToModule?.(item.tabIndex, item.subTabIndex)}
                  >
                    <StatusDot theme={theme} status={urgencyDot(item.urgency)} />
                    <ActionInfo theme={theme}>
                      <ActionTask theme={theme}>{item.task}</ActionTask>
                      <span>
                        <ActionHint theme={theme}>{item.action}</ActionHint>
                        <ActionEntity theme={theme}> · {item.entity}</ActionEntity>
                      </span>
                    </ActionInfo>
                    <ActionDue theme={theme}>{relativeTime(item)}</ActionDue>
                    <UrgencyBadge theme={theme} urgency={item.urgency}>
                      {urgencyBadgeLabel(item)}
                    </UrgencyBadge>
                  </ActionRow>
                ))}
                {meta.curationNote && (
                  <CurationNote theme={theme}>
                    <span>{meta.curationNote}</span>
                    <CurationLink
                      theme={theme}
                      onClick={(e) => { e.stopPropagation(); onNavigateToModule?.(meta.tabIndex); }}
                    >
                      View all {meta.totalCount}
                      <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                    </CurationLink>
                  </CurationNote>
                )}
              </ActionsList>
            </GroupBlock>
          </React.Fragment>
        );
      })}

      <Divider theme={theme} />

      {/* ── Rippling's impact ── */}
      <ImpactBanner theme={theme}>
        <ImpactTitle theme={theme}>
          <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
          <ImpactSubtitle theme={theme}>· Registrations & filings managed by Rippling</ImpactSubtitle>
        </ImpactTitle>
        <ImpactStatsRow theme={theme}>
          {IMPACT_METRICS.map(m => (
            <ImpactStat key={m.label}>
              <ImpactStatValue theme={theme}>{m.value}</ImpactStatValue>
              <ImpactStatLabel theme={theme}>{m.label}</ImpactStatLabel>
            </ImpactStat>
          ))}
        </ImpactStatsRow>
      </ImpactBanner>
    </TabContent>
  );
};
