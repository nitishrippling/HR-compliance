import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import {
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellText,
  CellTextBold,
  CellTextMuted,
  StatusDot,
} from './shared-styles';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

type Urgency = 'very-high' | 'high' | 'medium' | 'low';

interface EmployeeIssue {
  id: string;
  dateDetected: string;
  employeeName: string;
  employeeRole: string;
  resolutionDeadline: string;
  urgency: Urgency;
  issueType: string;
}

const METRICS = [
  { label: 'Total outstanding issues', value: '242' },
  { label: 'New issues in past 30 days', value: '244' },
  { label: 'Average time to resolve', value: '0.1 days' },
];

const PRIORITY = [
  { label: 'Very high', count: 0, color: 'rgb(183,28,28)' },
  { label: 'High', count: 242, color: 'rgb(230,81,0)' },
  { label: 'Medium', count: 0, color: 'rgb(3,105,161)' },
  { label: 'Low', count: 0, color: 'rgb(140,140,140)' },
];

const ISSUES: EmployeeIssue[] = [
  { id: 'ei1', dateDetected: '06/04/2022', employeeName: 'Deann Aaron', employeeRole: 'Manager Account M...', resolutionDeadline: '06/11/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei2', dateDetected: '06/01/2022', employeeName: 'Eric Abernathy', employeeRole: 'Customer Support ...', resolutionDeadline: '06/08/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei3', dateDetected: '06/01/2022', employeeName: 'Silver Adams', employeeRole: 'Customer Support ...', resolutionDeadline: '06/08/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei4', dateDetected: '06/01/2022', employeeName: 'Cathryn Altenwerth', employeeRole: 'Account Executive, ...', resolutionDeadline: '06/08/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei5', dateDetected: '06/01/2022', employeeName: 'Ford Altenwerth', employeeRole: 'Implementation Man...', resolutionDeadline: '06/08/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei6', dateDetected: '05/28/2022', employeeName: 'James Miller', employeeRole: 'Software Engineer', resolutionDeadline: '06/04/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'ei7', dateDetected: '05/25/2022', employeeName: 'Sarah Chen', employeeRole: 'Product Manager', resolutionDeadline: '06/01/2022', urgency: 'high', issueType: 'I-9 re-verification' },
  { id: 'ei8', dateDetected: '05/20/2022', employeeName: 'Robert Johnson', employeeRole: 'Finance Manager', resolutionDeadline: '05/27/2022', urgency: 'high', issueType: 'Sick leave violation' },
];

const HISTORICAL: EmployeeIssue[] = [
  { id: 'hi1', dateDetected: '03/15/2022', employeeName: 'Maria Garcia', employeeRole: 'HR Generalist', resolutionDeadline: '03/22/2022', urgency: 'high', issueType: 'Sick leave violation' },
  { id: 'hi2', dateDetected: '02/10/2022', employeeName: 'David Lee', employeeRole: 'Sales Manager', resolutionDeadline: '02/17/2022', urgency: 'medium', issueType: 'I-9 re-verification' },
  { id: 'hi3', dateDetected: '01/05/2022', employeeName: 'Lisa Park', employeeRole: 'Finance Analyst', resolutionDeadline: '01/12/2022', urgency: 'low', issueType: 'Background check renewal' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;


/* ── Summary card: metrics + priority in one card ── */

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const MetricsRow = styled.div`
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const MetricCell = styled.div`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
`;

const MetricLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const MetricValue = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  font-weight: 700;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const PrioritySection = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const PriorityTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const PriorityRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space1200};
`;

const PriorityItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PriorityDotLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PriorityDot = styled.span<{ dotColor: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ dotColor }) => dotColor};
`;

const PriorityLabelText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PriorityCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
  padding-left: ${({ theme }) => (theme as StyledTheme).space300};
`;

/* ── Issues table ── */

const IssuesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const IssuesTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const IssuesCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 5px ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-width: 180px;
  margin-left: auto;
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
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  &:hover { background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const UrgencyCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const UrgencyLabel = styled.span<{ urgency: Urgency }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ urgency }) => {
    switch (urgency) {
      case 'very-high': return 'rgb(183,28,28)';
      case 'high': return 'rgb(230,81,0)';
      case 'medium': return 'rgb(3,105,161)';
      default: return 'rgb(140,140,140)';
    }
  }};
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: transparent;
  cursor: pointer;
  &:hover { background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

function urgencyDotStatus(u: Urgency): 'error' | 'warning' | 'neutral' | 'success' {
  switch (u) {
    case 'very-high': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'neutral';
    default: return 'success';
  }
}

function urgencyText(u: Urgency) {
  switch (u) {
    case 'very-high': return 'Very high';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    default: return 'Low';
  }
}

/* ═══════════════════════════════════════════════════════
   ISSUES TABLE
   ═══════════════════════════════════════════════════════ */

const IssuesTable: React.FC<{ issues: EmployeeIssue[]; totalCount: string }> = ({ issues, totalCount }) => {
  const { theme } = usePebbleTheme();

  return (
    <TableCard theme={theme}>
      <IssuesHeader theme={theme}>
        <IssuesTitle theme={theme}>Open issues</IssuesTitle>
        <IssuesCount theme={theme}>· Showing {issues.length} of {totalCount}</IssuesCount>
        <SearchBox theme={theme}>
          <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
          <SearchPlaceholder theme={theme}>Search...</SearchPlaceholder>
        </SearchBox>
        <FilterBtn theme={theme} aria-label="Filter">
          <Icon type={Icon.TYPES.FILTER} size={14} color={(theme as StyledTheme).colorOnSurface} />
        </FilterBtn>
      </IssuesHeader>

      <StyledTable>
        <StyledTHead theme={theme}>
          <tr>
            <StyledTh theme={theme}>Date detected</StyledTh>
            <StyledTh theme={theme}>Employee</StyledTh>
            <StyledTh theme={theme}>Resolution deadline</StyledTh>
            <StyledTh theme={theme}>Urgency</StyledTh>
            <StyledTh theme={theme}>Issue type</StyledTh>
            <StyledTh theme={theme} style={{ width: 64 }}></StyledTh>
          </tr>
        </StyledTHead>
        <tbody>
          {issues.map(issue => (
            <StyledTr key={issue.id} theme={theme}>
              <StyledTd theme={theme}>
                <CellText theme={theme}>{issue.dateDetected}</CellText>
              </StyledTd>
              <StyledTd theme={theme}>
                <EmployeeCell theme={theme}>
                  <Avatar
                    title={issue.employeeName}
                    type={Avatar.TYPES?.USER || 'USER'}
                    size={Avatar.SIZES.XS}
                    isCompact
                  />
                  <EmployeeInfo>
                    <CellTextBold theme={theme}>{issue.employeeName}</CellTextBold>
                    <CellTextMuted theme={theme}>{issue.employeeRole}</CellTextMuted>
                  </EmployeeInfo>
                </EmployeeCell>
              </StyledTd>
              <StyledTd theme={theme}>
                <CellText theme={theme}>{issue.resolutionDeadline}</CellText>
              </StyledTd>
              <StyledTd theme={theme}>
                <UrgencyCell theme={theme}>
                  <StatusDot theme={theme} status={urgencyDotStatus(issue.urgency)} />
                  <UrgencyLabel theme={theme} urgency={issue.urgency}>
                    {urgencyText(issue.urgency)}
                  </UrgencyLabel>
                </UrgencyCell>
              </StyledTd>
              <StyledTd theme={theme}>
                <CellText theme={theme}>{issue.issueType}</CellText>
              </StyledTd>
              <StyledTd theme={theme}>
                <RowActions theme={theme}>
                  <IconBtn theme={theme} aria-label="More actions">
                    <Icon type={Icon.TYPES.MORE_VERTICAL} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </IconBtn>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </RowActions>
              </StyledTd>
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </TableCard>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export const WorkforceTab: React.FC<{ activeSubTab: number }> = ({ activeSubTab }) => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>

      {activeSubTab === 0 && (
        <>
          {/* Single summary card: metrics + priority */}
          <SummaryCard theme={theme}>
            <MetricsRow theme={theme}>
              {METRICS.map(m => (
                <MetricCell key={m.label} theme={theme}>
                  <MetricLabel theme={theme}>{m.label}</MetricLabel>
                  <MetricValue theme={theme}>{m.value}</MetricValue>
                </MetricCell>
              ))}
            </MetricsRow>

            <PrioritySection theme={theme}>
              <PriorityTitle theme={theme}>Outstanding issues by priority</PriorityTitle>
              <PriorityRow theme={theme}>
                {PRIORITY.map(p => (
                  <PriorityItem key={p.label} theme={theme}>
                    <PriorityDotLabel theme={theme}>
                      <PriorityDot dotColor={p.color} />
                      <PriorityLabelText theme={theme}>{p.label}</PriorityLabelText>
                    </PriorityDotLabel>
                    <PriorityCount theme={theme}>{p.count}</PriorityCount>
                  </PriorityItem>
                ))}
              </PriorityRow>
            </PrioritySection>
          </SummaryCard>

          {/* Open issues table */}
          <IssuesTable issues={ISSUES} totalCount="242" />
        </>
      )}

      {activeSubTab === 1 && (
        <IssuesTable issues={HISTORICAL} totalCount="156" />
      )}
    </TabContent>
  );
};
