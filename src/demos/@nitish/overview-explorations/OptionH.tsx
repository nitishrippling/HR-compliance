import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, GroupBlock, GroupHeader, GroupLeft, GroupName, GroupDesc,
  GroupCount, GroupViewAll, Divider, StatusDot, UrgencyBadge,
  CurationFooter, CurationLink, PenaltyText,
} from './shared';
import {
  groupByModule, sortedItems, MODULE_META, relativeTime, urgencyDotColor, urgencyLabel,
  type ActionItem, type ModuleGroup,
} from './data';

/**
 * Option H: Workforce Summary + Detailed Registrations/Filings
 *
 * Workforce is collapsed into a single clickable summary card showing aggregate
 * stats (3 overdue, 5 due this week, etc.) — no individual items listed.
 * Registrations and Filings still show full detail tables since each item
 * carries real financial/regulatory consequences.
 */

/* ── Workforce summary card ── */

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SummaryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorErrorContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SummaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SummaryTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const SummarySubtitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const SummaryStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const StatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  font-weight: 700;
`;

const StatValueError = styled(StatValue)`
  color: ${({ theme }) => (theme as StyledTheme).colorError};
`;

const StatValueWarning = styled(StatValue)`
  color: ${({ theme }) => (theme as StyledTheme).colorWarning};
`;

const StatValueNeutral = styled(StatValue)`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const StatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => (theme as StyledTheme).space400};
`;

/* ── Detail table (for Registrations & Filings) ── */

const TableContainer = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const Table = styled.table`
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
  cursor: pointer;
  transition: background-color 150ms ease;
  &:last-child { border-bottom: none; }
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const Td = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: top;
`;

const CellPrimary = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CellSecondary = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

const StatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

function DetailTable({ items, columns }: { items: ActionItem[]; columns: string[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>{columns.map(c => <Th key={c} theme={theme}>{c}</Th>)}</tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <Td theme={theme}>
                <CellPrimary theme={theme}>{item.task}</CellPrimary>
                <CellSecondary theme={theme}>{item.action}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <CellPrimary theme={theme}>{item.category}</CellPrimary>
                <CellSecondary theme={theme}>{item.entity}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <CellPrimary theme={theme}>{item.dueDate}</CellPrimary>
                <CellSecondary theme={theme}>{relativeTime(item)}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <StatusCell>
                  <StatusRow theme={theme}>
                    <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                    <UrgencyBadge theme={theme} urgency={item.urgency}>{urgencyLabel(item)}</UrgencyBadge>
                  </StatusRow>
                  {item.penalty && <PenaltyText theme={theme}>⚠ {item.penalty}</PenaltyText>}
                </StatusCell>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function WorkforceSummary() {
  const { theme } = usePebbleTheme();
  return (
    <GroupBlock theme={theme}>
      <GroupHeader theme={theme}>
        <GroupLeft theme={theme}>
          <GroupName theme={theme}>Workforce</GroupName>
          <GroupDesc theme={theme}>Employee-level compliance issues</GroupDesc>
          <GroupCount theme={theme}>3 overdue</GroupCount>
        </GroupLeft>
      </GroupHeader>
      <SummaryCard theme={theme}>
        <SummaryRow>
          <SummaryLeft theme={theme}>
            <SummaryIcon theme={theme}>
              <Icon type={Icon.TYPES.USERS_OUTLINE} size={20} color={(theme as StyledTheme).colorError} />
            </SummaryIcon>
            <SummaryInfo>
              <SummaryTitle theme={theme}>24 employee issues need attention</SummaryTitle>
              <SummarySubtitle theme={theme}>I-9 verifications, pay stub notices, wage compliance, and more</SummarySubtitle>
            </SummaryInfo>
          </SummaryLeft>
          <SummaryStats theme={theme}>
            <StatItem theme={theme}>
              <StatusDot theme={theme} status="error" />
              <StatValueError theme={theme}>3</StatValueError>
              <StatLabel theme={theme}>overdue</StatLabel>
            </StatItem>
            <StatItem theme={theme}>
              <StatusDot theme={theme} status="warning" />
              <StatValueWarning theme={theme}>5</StatValueWarning>
              <StatLabel theme={theme}>due this week</StatLabel>
            </StatItem>
            <StatItem theme={theme}>
              <StatValueNeutral theme={theme}>16</StatValueNeutral>
              <StatLabel theme={theme}>upcoming</StatLabel>
            </StatItem>
            <ChevronWrapper theme={theme}>
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </ChevronWrapper>
          </SummaryStats>
        </SummaryRow>
      </SummaryCard>
    </GroupBlock>
  );
}

function DetailGroup({ group }: { group: ModuleGroup }) {
  const { theme } = usePebbleTheme();
  const meta = MODULE_META[group.module];
  const columns = group.module === 'Filings'
    ? ['Filing', 'Jurisdiction', 'Due Date', 'Consequence']
    : ['Task', 'Category', 'Due Date', 'Consequence'];

  return (
    <GroupBlock theme={theme}>
      <GroupHeader theme={theme}>
        <GroupLeft theme={theme}>
          <GroupName theme={theme}>{group.module}</GroupName>
          <GroupDesc theme={theme}>{meta.description}</GroupDesc>
          <GroupCount theme={theme}>{meta.countLabel}</GroupCount>
        </GroupLeft>
        <GroupViewAll theme={theme}>
          View all
          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
        </GroupViewAll>
      </GroupHeader>
      <DetailTable items={group.items} columns={columns} />
    </GroupBlock>
  );
}

export const OptionH: React.FC = () => {
  const { theme } = usePebbleTheme();
  const grouped = groupByModule(sortedItems);

  return (
    <TabContent theme={theme}>
      <WorkforceSummary />

      {grouped
        .filter(g => g.module !== 'Workforce')
        .map((group, idx) => (
          <React.Fragment key={group.module}>
            {idx >= 0 && <Divider theme={theme} />}
            <DetailGroup group={group} />
          </React.Fragment>
        ))}
    </TabContent>
  );
};
