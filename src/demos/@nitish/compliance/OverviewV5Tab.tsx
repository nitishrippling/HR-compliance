import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

interface ActionRow {
  task: string;
  category: string;
  dueDate: string;
  risk: string;
  isCharged?: boolean;
  tabIndex: number;
  subTabIndex?: number;
}

const REGISTRATION_ACTIONS: ActionRow[] = [
  { task: 'Texas Withholding Registration', category: 'State Tax', dueDate: 'Feb 28, 2026', risk: '$250 fine already charged', isCharged: true, tabIndex: 1, subTabIndex: 0 },
  { task: 'Ohio Municipal Tax Setup', category: 'Local Tax', dueDate: 'Mar 1, 2026', risk: '2 days left before $250 fee', tabIndex: 1, subTabIndex: 1 },
  { task: 'Upload Certificate of Incorporation', category: 'Foreign Qualification', dueDate: 'Mar 5, 2026', risk: '6 days left before $250 fee', tabIndex: 1, subTabIndex: 2 },
];

const FILING_ACTIONS: ActionRow[] = [];

interface WorkforceRow {
  issue: string;
  employee: string;
  deadline: string;
  issueType: string;
  tabIndex: number;
}

const WORKFORCE_OVERDUE: WorkforceRow[] = [
  { issue: 'Sick leave violation', employee: 'Deann Aaron', deadline: 'Jun 11, 2022', issueType: 'Leave Law', tabIndex: 3 },
  { issue: 'Sick leave violation', employee: 'Eric Abernathy', deadline: 'Jun 8, 2022', issueType: 'Leave Law', tabIndex: 3 },
  { issue: 'I-9 re-verification', employee: 'Sarah Chen', deadline: 'Jun 1, 2022', issueType: 'I-9 Compliance', tabIndex: 3 },
];

const IMPACT_METRICS = [
  { value: '62+', label: 'Hours saved' },
  { value: '18', label: 'State registrations done' },
  { value: '5', label: 'Local registrations done' },
  { value: '6', label: 'Foreign qualifications done' },
  { value: '4', label: 'Filings submitted' },
];

/* ═══════════════════════════════════════════════════════
   STYLED — Tier 1: Summary Cards
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
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'pressed')};
  }
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CardNumber = styled.span<{ variant?: 'error' | 'success' | 'default' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 600;
  color: ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    if (variant === 'error') return t.colorError;
    if (variant === 'success') return t.colorSuccess;
    return t.colorOnSurface;
  }};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;


/* ═══════════════════════════════════════════════════════
   STYLED — Tier 2: Detail Sections
   ═══════════════════════════════════════════════════════ */

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
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`;

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
  &:last-child { border-bottom: none; }
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const ActionTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CellTextBold = styled(CellText)`
  font-weight: 500;
`;

const RiskText = styled.span<{ isCharged?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isCharged }) => (isCharged ? 'rgb(183,28,28)' : 'rgb(100,100,100)')};
  font-weight: ${({ isCharged }) => (isCharged ? 500 : 400)};
`;

const ChevronCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  width: 32px;
`;

const WfColGroup = () => (
  <colgroup>
    <col style={{ width: COL_WIDTHS.subject }} />
    <col style={{ width: COL_WIDTHS.category }} />
    <col style={{ width: COL_WIDTHS.dueDate }} />
    <col style={{ width: COL_WIDTHS.risk }} />
    <col style={{ width: COL_WIDTHS.chevron }} />
  </colgroup>
);

/* ═══════════════════════════════════════════════════════
   STYLED — Impact
   ═══════════════════════════════════════════════════════ */

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
  gap: ${({ theme }) => (theme as StyledTheme).space1600};
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

interface OverviewV5TabProps {
  onNavigateToModule?: (tabIndex: number, subTabIndex?: number) => void;
}

export const OverviewV5Tab: React.FC<OverviewV5TabProps> = ({ onNavigateToModule }) => {
  const { theme } = usePebbleTheme();

  const regCount = REGISTRATION_ACTIONS.length;
  const filCount = FILING_ACTIONS.length;
  const wfCount = 24;

  return (
    <TabContent theme={theme}>
      {/* ── Tier 1: Summary Cards ── */}
      <SummaryRow theme={theme}>
        <SummaryCard theme={theme} onClick={() => onNavigateToModule?.(1)}>
          <CardTitle theme={theme}>Registrations</CardTitle>
          <CardNumber theme={theme} variant={regCount > 0 ? 'error' : 'success'}>{regCount}</CardNumber>
          <CardFooter theme={theme}>
            <Label
              size={Label.SIZES.M}
              appearance={regCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
            >
              {regCount > 0 ? 'Action required' : 'All caught up'}
            </Label>
          </CardFooter>
        </SummaryCard>

        <SummaryCard theme={theme} onClick={() => onNavigateToModule?.(2)}>
          <CardTitle theme={theme}>Filings</CardTitle>
          <CardNumber theme={theme} variant={filCount > 0 ? 'error' : 'success'}>{filCount}</CardNumber>
          <CardFooter theme={theme}>
            <Label
              size={Label.SIZES.M}
              appearance={filCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
            >
              {filCount > 0 ? 'Action required' : 'All caught up'}
            </Label>
          </CardFooter>
        </SummaryCard>

        <SummaryCard theme={theme} onClick={() => onNavigateToModule?.(3)}>
          <CardTitle theme={theme}>Workforce</CardTitle>
          <CardNumber theme={theme} variant={wfCount > 0 ? 'error' : 'success'}>{wfCount}</CardNumber>
          <CardFooter theme={theme}>
            <Label
              size={Label.SIZES.M}
              appearance={wfCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
            >
              {wfCount > 0 ? 'Outstanding issues' : 'All caught up'}
            </Label>
          </CardFooter>
        </SummaryCard>
      </SummaryRow>

      {/* ── Tier 2: Registrations detail (only if items exist) ── */}
      {regCount > 0 && (
        <SectionCard theme={theme}>
          <SectionHeader theme={theme}>
            <SectionName theme={theme}>Registrations</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(1)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeader>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {REGISTRATION_ACTIONS.map((item, i) => (
                <ActionTr key={i} theme={theme} onClick={() => onNavigateToModule?.(item.tabIndex, item.subTabIndex)}>
                  <ActionTd theme={theme}><CellTextBold theme={theme}>{item.task}</CellTextBold></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>{item.category}</CellText></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>Due {item.dueDate}</CellText></ActionTd>
                  <ActionTd theme={theme}><RiskText theme={theme} isCharged={item.isCharged}>{item.risk}</RiskText></ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </SectionCard>
      )}

      {/* ── Tier 2: Filings detail (only if items exist) ── */}
      {filCount > 0 && (
        <SectionCard theme={theme}>
          <SectionHeader theme={theme}>
            <SectionName theme={theme}>Filings</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(2)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeader>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {FILING_ACTIONS.map((item, i) => (
                <ActionTr key={i} theme={theme} onClick={() => onNavigateToModule?.(item.tabIndex)}>
                  <ActionTd theme={theme}><CellTextBold theme={theme}>{item.task}</CellTextBold></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>{item.category}</CellText></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>Due {item.dueDate}</CellText></ActionTd>
                  <ActionTd theme={theme}><RiskText theme={theme}>{item.risk}</RiskText></ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </SectionCard>
      )}

      {/* ── Tier 2: Workforce detail (top 3 overdue, only if items exist) ── */}
      {WORKFORCE_OVERDUE.length > 0 && (
        <SectionCard theme={theme}>
          <SectionHeader theme={theme}>
            <SectionName theme={theme}>Workforce</SectionName>
            <ViewAllLink theme={theme} onClick={() => onNavigateToModule?.(3)}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeader>
          <ActionTable>
            <WfColGroup />
            <tbody>
              {WORKFORCE_OVERDUE.map((item, i) => (
                <ActionTr key={i} theme={theme} onClick={() => onNavigateToModule?.(item.tabIndex)}>
                  <ActionTd theme={theme}><CellTextBold theme={theme}>{item.issue}</CellTextBold></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>{item.employee}</CellText></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>Due {item.deadline}</CellText></ActionTd>
                  <ActionTd theme={theme}><CellText theme={theme}>{item.issueType}</CellText></ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </SectionCard>
      )}

      {/* ── Tier 3: Rippling's Impact ── */}
      <ImpactCard theme={theme}>
        <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
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
