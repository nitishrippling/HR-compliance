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
  type ActionItem,
} from './data';

/**
 * Option G: Rich Multi-Line Table
 *
 * A proper table where each cell can contain multiple lines — a bold primary value
 * and a muted secondary detail. Gives the alignment benefits of a table with the
 * richness of a card. Similar to patterns in Linear, Notion, or Airtable.
 */

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

const REGISTRATION_COLUMNS = ['Task', 'Category', 'Due Date', 'Consequence'];
const FILING_COLUMNS = ['Filing', 'Jurisdiction', 'Due Date', 'Consequence'];
const WORKFORCE_COLUMNS = ['Date Detected', 'Employee', 'Resolution Deadline', 'Urgency', 'Issue Type'];

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const AvatarPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const UrgencyText = styled.span<{ level: 'overdue' | 'due-this-week' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ level, theme }) =>
    level === 'overdue' ? (theme as StyledTheme).colorError : 'rgb(245,124,0)'};
`;

function WorkforceRichTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>{WORKFORCE_COLUMNS.map(c => <Th key={c} theme={theme}>{c}</Th>)}</tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <Td theme={theme}>
                <CellSecondary theme={theme} style={{ marginTop: 0 }}>{item.dateDetected}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <EmployeeCell theme={theme}>
                  <AvatarPlaceholder theme={theme}>
                    <Icon type={Icon.TYPES.USER_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </AvatarPlaceholder>
                  <EmployeeInfo>
                    <CellPrimary theme={theme}>{item.employeeName}</CellPrimary>
                    <CellSecondary theme={theme} style={{ marginTop: 0 }}>{item.employeeRole}</CellSecondary>
                  </EmployeeInfo>
                </EmployeeCell>
              </Td>
              <Td theme={theme}>
                <CellSecondary theme={theme} style={{ marginTop: 0 }}>{item.resolutionDeadline}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <StatusCell>
                  <StatusRow theme={theme}>
                    <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                    <UrgencyText theme={theme} level={item.urgency}>{urgencyLabel(item)}</UrgencyText>
                  </StatusRow>
                </StatusCell>
                </Td>
              <Td theme={theme}>
                <CellPrimary theme={theme} style={{ fontWeight: 400 }}>{item.issueType}</CellPrimary>
              </Td>
              </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function RegistrationRichTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>{REGISTRATION_COLUMNS.map(c => <Th key={c} theme={theme}>{c}</Th>)}</tr>
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

function FilingsRichTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>{FILING_COLUMNS.map(c => <Th key={c} theme={theme}>{c}</Th>)}</tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <Td theme={theme}>
                <CellPrimary theme={theme}>{item.task}</CellPrimary>
                <CellSecondary theme={theme}>{item.action}</CellSecondary>
              </Td>
              <Td theme={theme}>
                <CellPrimary theme={theme}>{item.entity}</CellPrimary>
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

const TABLE_BY_MODULE: Record<string, React.FC<{ items: ActionItem[] }>> = {
  Workforce: WorkforceRichTable,
  Registrations: RegistrationRichTable,
  Filings: FilingsRichTable,
};

export const OptionG: React.FC = () => {
  const { theme } = usePebbleTheme();
  const grouped = groupByModule(sortedItems);

  return (
    <TabContent theme={theme}>
      {grouped.map((group, idx) => {
        const meta = MODULE_META[group.module];
        const TableComponent = TABLE_BY_MODULE[group.module] ?? RegistrationRichTable;
        return (
          <React.Fragment key={group.module}>
            {idx > 0 && <Divider theme={theme} />}
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
              <TableComponent items={group.items} />
              {meta.curationNote && (
                <CurationFooter theme={theme}>
                  <span>{meta.curationNote}</span>
                  <CurationLink theme={theme}>
                    View all {meta.totalCount}
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                  </CurationLink>
                </CurationFooter>
              )}
            </GroupBlock>
          </React.Fragment>
        );
      })}
    </TabContent>
  );
};
