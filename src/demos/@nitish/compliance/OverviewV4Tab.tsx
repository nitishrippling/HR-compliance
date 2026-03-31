import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';

/* ═══════════════════════════════════════════════════════
   DATA — Registrations (flattened across State Tax,
   Local Tax, Foreign Qualification)
   ═══════════════════════════════════════════════════════ */

type RegistrationUrgency = 'overdue' | 'upcoming';
type RegistrationCategory = 'State Tax' | 'Local Tax' | 'Foreign Qualification';

interface RegistrationAction {
  task: string;
  category: RegistrationCategory;
  dueDate: string;
  penaltyStatus: string;
  urgency: RegistrationUrgency;
  isPenaltyCharged?: boolean;
  tabIndex: number;
  subTabIndex?: number;
}

const REGISTRATION_ACTIONS: RegistrationAction[] = [
  {
    task: 'Texas Withholding Registration',
    category: 'State Tax',
    dueDate: 'Feb 28, 2026',
    penaltyStatus: '$250 fine already charged',
    urgency: 'overdue',
    isPenaltyCharged: true,
    tabIndex: 2,
    subTabIndex: 0,
  },
  {
    task: 'Ohio Municipal Tax Setup',
    category: 'Local Tax',
    dueDate: 'Mar 1, 2026',
    penaltyStatus: '2 days left before $250 fee',
    urgency: 'upcoming',
    tabIndex: 2,
    subTabIndex: 1,
  },
  {
    task: 'Upload Certificate of Incorporation',
    category: 'Foreign Qualification',
    dueDate: 'Mar 5, 2026',
    penaltyStatus: '6 days left before $250 fee',
    urgency: 'upcoming',
    tabIndex: 2,
    subTabIndex: 2,
  },
];

const REGISTRATION_SUMMARY = {
  actionRequired: 3,
  inProgress: 4,
  completed: 18,
};

/* ═══════════════════════════════════════════════════════
   DATA — Filings (simplified)
   ═══════════════════════════════════════════════════════ */

type FilingCategory = 'Federal' | 'State' | 'Local';

interface FilingAction {
  subject: string;
  category: FilingCategory;
  dueDate: string;
  riskStatus: string;
  urgency: RegistrationUrgency;
  tabIndex: number;
}

const FILING_ACTIONS: FilingAction[] = [
  {
    subject: '941-X Amendment (Q3 2025)',
    category: 'Federal',
    dueDate: 'Mar 15, 2026',
    riskStatus: '0.5%/mo failure-to-pay penalty',
    urgency: 'upcoming',
    tabIndex: 3,
  },
  {
    subject: 'EEO-1 Component 1 Report',
    category: 'Federal',
    dueDate: 'Mar 31, 2026',
    riskStatus: 'EEOC enforcement action risk',
    urgency: 'upcoming',
    tabIndex: 3,
  },
  {
    subject: 'Q1 CA Withholding Return',
    category: 'State',
    dueDate: 'Apr 30, 2026',
    riskStatus: '15% late penalty (CA EDD)',
    urgency: 'upcoming',
    tabIndex: 3,
  },
];

const FILING_SUMMARY = {
  actionRequired: 3,
  inProgress: 1,
  completed: 7,
};

/* ═══════════════════════════════════════════════════════
   DATA — Impact
   ═══════════════════════════════════════════════════════ */

interface ImpactMetric {
  value: string;
  label: string;
}

const IMPACT_METRICS: ImpactMetric[] = [
  { value: '62+', label: 'Hours saved on registrations' },
  { value: '18', label: 'State registrations completed' },
  { value: '5', label: 'Local registrations completed' },
  { value: '6', label: 'Foreign qualifications completed' },
  { value: '4', label: 'Filings submitted by Rippling' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

/* ── Section card ── */

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const SectionHeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionHeaderStatsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space1000};
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
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
`;

/* ── Stat pair (label + value side by side, matching Object Stat atom) ── */

const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const StatValue = styled.span<{ variant?: 'error' | 'success' | 'info' | 'default' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  white-space: nowrap;
  color: ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    switch (variant) {
      case 'error': return t.colorError;
      case 'success': return t.colorSuccess;
      case 'info': return t.colorOnSurface;
      default: return t.colorOnSurface;
    }
  }};
`;

/* ── Action table ── */

const COL_WIDTHS = { subject: '30%', category: '18%', dueDate: '18%', risk: '28%', chevron: '32px' };

const TableColGroup = () => (
  <colgroup>
    <col style={{ width: COL_WIDTHS.subject }} />
    <col style={{ width: COL_WIDTHS.category }} />
    <col style={{ width: COL_WIDTHS.dueDate }} />
    <col style={{ width: COL_WIDTHS.risk }} />
    <col style={{ width: COL_WIDTHS.chevron }} />
  </colgroup>
);

const ActionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const ActionTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const ActionTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
`;

const TaskName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const CategoryText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const DueDateText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PenaltyText = styled.span<{ isCharged?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isCharged }) => (isCharged ? 'rgb(183,28,28)' : 'rgb(100,100,100)')};
  font-weight: ${({ isCharged }) => (isCharged ? 500 : 400)};
`;

const ChevronCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  width: 32px;
`;

/* ── Impact banner ── */

const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactTitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 600;
`;

const ImpactStatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface OverviewV4TabProps {
  onNavigateToModule?: (tabIndex: number, subTabIndex?: number) => void;
}

export const OverviewV4Tab: React.FC<OverviewV4TabProps> = ({ onNavigateToModule }) => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* ── 1. Workforce Overview ── */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Workforce</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(1)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Open issues</StatLabel>
              <StatValue theme={theme}>24</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Overdue</StatLabel>
              <StatValue theme={theme} variant="error">6</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Resolved</StatLabel>
              <StatValue theme={theme} variant="success">18</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Avg. resolution</StatLabel>
              <StatValue theme={theme}>4.2</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
      </SectionCard>

      {/* ── 2. Registrations ── */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(2)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Action required</StatLabel>
              <StatValue theme={theme} variant="error">{REGISTRATION_SUMMARY.actionRequired}</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>{REGISTRATION_SUMMARY.inProgress}</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">{REGISTRATION_SUMMARY.completed}</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {REGISTRATION_ACTIONS.map((item, i) => (
                <ActionTr
                  key={i}
                  theme={theme}
                  onClick={() => onNavigateToModule?.(item.tabIndex, item.subTabIndex)}
                >
                  <ActionTd theme={theme}>
                    <TaskName theme={theme}>{item.task}</TaskName>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <CategoryText theme={theme}>{item.category}</CategoryText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <DueDateText theme={theme}>Due {item.dueDate}</DueDateText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <PenaltyText theme={theme} isCharged={item.isPenaltyCharged}>
                      {item.penaltyStatus}
                    </PenaltyText>
                  </ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon
                      type={Icon.TYPES.CHEVRON_RIGHT}
                      size={16}
                      color={(theme as StyledTheme).colorOnSurfaceVariant}
                    />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* ── 3. Filings ── */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Filings</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(3)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Action required</StatLabel>
              <StatValue theme={theme} variant="error">{FILING_SUMMARY.actionRequired}</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>{FILING_SUMMARY.inProgress}</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">{FILING_SUMMARY.completed}</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {FILING_ACTIONS.map((item, i) => (
                <ActionTr
                  key={i}
                  theme={theme}
                  onClick={() => onNavigateToModule?.(item.tabIndex)}
                >
                  <ActionTd theme={theme}>
                    <TaskName theme={theme}>{item.subject}</TaskName>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <CategoryText theme={theme}>{item.category}</CategoryText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <DueDateText theme={theme}>Due {item.dueDate}</DueDateText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <PenaltyText theme={theme}>
                      {item.riskStatus}
                    </PenaltyText>
                  </ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon
                      type={Icon.TYPES.CHEVRON_RIGHT}
                      size={16}
                      color={(theme as StyledTheme).colorOnSurfaceVariant}
                    />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* ── 4. Rippling's Impact ── */}
      <ImpactCard theme={theme}>
        <ImpactTitleRow theme={theme}>
          <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
          <ImpactSubtitle theme={theme}>
            Registrations &amp; filings managed by Rippling
          </ImpactSubtitle>
        </ImpactTitleRow>
        <ImpactStatsRow theme={theme}>
          {IMPACT_METRICS.map(m => (
            <ImpactStat key={m.label}>
              <ImpactStatValue theme={theme}>{m.value}</ImpactStatValue>
              <ImpactStatLabel theme={theme}>{m.label}</ImpactStatLabel>
            </ImpactStat>
          ))}
        </ImpactStatsRow>
      </ImpactCard>
    </TabContent>
  );
};
