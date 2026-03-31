import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, GroupBlock, GroupHeader, GroupLeft, GroupName, GroupDesc,
  GroupCount, GroupViewAll, Divider, StatusDot, UrgencyBadge, CurationFooter, CurationLink, PenaltyText,
} from './shared';
import {
  groupByModule, sortedItems, MODULE_META, relativeTime, urgencyDotColor, urgencyLabel,
  type ActionItem,
} from './data';

/**
 * Option A: Compact Action Tables per Group
 *
 * Each module gets its own mini data table with columns tailored to what matters
 * for that module type. Workforce shows Employee + Dept, Registrations shows
 * Category + Penalty, Filings shows Jurisdiction + Penalty.
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
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const TdMuted = styled(Td)`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const StatusCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

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

const EmployeeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const EmployeeRole = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const UrgencyLabel = styled.span<{ level: 'overdue' | 'due-this-week' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ level, theme }) =>
    level === 'overdue' ? (theme as StyledTheme).colorError : 'rgb(245,124,0)'};
`;

function WorkforceTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>
            <Th theme={theme}>Date Detected</Th>
            <Th theme={theme}>Employee</Th>
            <Th theme={theme}>Resolution Deadline</Th>
            <Th theme={theme}>Urgency</Th>
            <Th theme={theme}>Issue Type</Th>
          </tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <TdMuted theme={theme}>{item.dateDetected}</TdMuted>
              <Td theme={theme}>
                <EmployeeCell theme={theme}>
                  <AvatarPlaceholder theme={theme}>
                    <Icon type={Icon.TYPES.USER_OUTLINE} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </AvatarPlaceholder>
                  <EmployeeInfo>
                    <EmployeeName theme={theme}>{item.employeeName}</EmployeeName>
                    <EmployeeRole theme={theme}>{item.employeeRole}</EmployeeRole>
                  </EmployeeInfo>
                </EmployeeCell>
              </Td>
              <TdMuted theme={theme}>{item.resolutionDeadline}</TdMuted>
              <Td theme={theme}>
                <StatusCell theme={theme}>
                  <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                  <UrgencyLabel theme={theme} level={item.urgency}>{urgencyLabel(item)}</UrgencyLabel>
                </StatusCell>
              </Td>
              <Td theme={theme}>{item.issueType}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function RegistrationsTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>
            <Th theme={theme}>Task</Th>
            <Th theme={theme}>Category</Th>
            <Th theme={theme}>Due Date</Th>
            <Th theme={theme}>Penalty Risk</Th>
          </tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <Td theme={theme}>{item.task}</Td>
              <TdMuted theme={theme}>{item.category}</TdMuted>
              <TdMuted theme={theme}>{relativeTime(item)}</TdMuted>
              <Td theme={theme}>
                {item.penalty
                  ? <PenaltyText theme={theme}>⚠ {item.penalty}</PenaltyText>
                  : <span style={{ color: (theme as StyledTheme).colorOnSurfaceVariant }}>—</span>}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function FilingsTable({ items }: { items: ActionItem[] }) {
  const { theme } = usePebbleTheme();
  return (
    <TableContainer theme={theme}>
      <Table>
        <THead theme={theme}>
          <tr>
            <Th theme={theme}>Filing</Th>
            <Th theme={theme}>Jurisdiction</Th>
            <Th theme={theme}>Due Date</Th>
            <Th theme={theme}>Penalty Risk</Th>
          </tr>
        </THead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i} theme={theme}>
              <Td theme={theme}>{item.task}</Td>
              <TdMuted theme={theme}>{item.entity}</TdMuted>
              <TdMuted theme={theme}>{relativeTime(item)}</TdMuted>
              <Td theme={theme}>
                {item.penalty
                  ? <PenaltyText theme={theme}>⚠ {item.penalty}</PenaltyText>
                  : <span style={{ color: (theme as StyledTheme).colorOnSurfaceVariant }}>—</span>}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

const TABLE_BY_MODULE: Record<string, React.FC<{ items: ActionItem[] }>> = {
  Workforce: WorkforceTable,
  Registrations: RegistrationsTable,
  Filings: FilingsTable,
};

export const OptionA: React.FC = () => {
  const { theme } = usePebbleTheme();
  const grouped = groupByModule(sortedItems);

  return (
    <TabContent theme={theme}>
      {grouped.map((group, idx) => {
        const meta = MODULE_META[group.module];
        const TableComponent = TABLE_BY_MODULE[group.module] ?? RegistrationsTable;
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
