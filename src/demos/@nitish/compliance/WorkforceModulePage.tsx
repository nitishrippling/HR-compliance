import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Avatar from '@rippling/pebble/Avatar';
import {
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellTextBold,
  CellTextMuted,
  ActionButtonWrapper,
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

const PEOPLE_METRICS = [
  { label: 'Total outstanding', value: '24', sub: 'compliance tasks' },
  { label: 'New in past 30 days', value: '8', sub: 'new issues' },
  { label: 'Avg resolve time', value: '4.2 days', sub: 'this quarter' },
];

const PEOPLE_PRIORITY = [
  { label: 'Very High', count: 2, color: 'rgb(183,28,28)' },
  { label: 'High', count: 5, color: 'rgb(230,81,0)' },
  { label: 'Medium', count: 11, color: 'rgb(245,124,0)' },
  { label: 'Low', count: 6, color: 'rgb(46,125,50)' },
];

const EMPLOYEE_ISSUES: EmployeeIssue[] = [
  { id: 'ei1', dateDetected: '02/28/2026', employeeName: 'James Miller', employeeRole: 'Software Engineer', resolutionDeadline: '03/03/2026', urgency: 'very-high', issueType: 'Final pay not scheduled' },
  { id: 'ei2', dateDetected: '02/20/2026', employeeName: 'Sarah Chen', employeeRole: 'Product Manager', resolutionDeadline: '03/08/2026', urgency: 'high', issueType: 'Missing SSN — new hire' },
  { id: 'ei3', dateDetected: '02/15/2026', employeeName: 'Robert Johnson', employeeRole: 'Finance Manager', resolutionDeadline: '03/12/2026', urgency: 'high', issueType: 'FMLA eligibility pending' },
  { id: 'ei4', dateDetected: '02/10/2026', employeeName: 'Emily Thompson', employeeRole: 'Marketing Manager', resolutionDeadline: '03/15/2026', urgency: 'high', issueType: 'Contractor classification review' },
  { id: 'ei5', dateDetected: '01/28/2026', employeeName: 'Michael Brown', employeeRole: 'Operations Lead', resolutionDeadline: '03/20/2026', urgency: 'medium', issueType: 'I-9 re-verification required' },
  { id: 'ei6', dateDetected: '01/20/2026', employeeName: 'Maria Garcia', employeeRole: 'HR Generalist', resolutionDeadline: '03/22/2026', urgency: 'medium', issueType: 'Benefits enrollment missing' },
  { id: 'ei7', dateDetected: '01/15/2026', employeeName: 'David Lee', employeeRole: 'Sales Manager', resolutionDeadline: '03/25/2026', urgency: 'medium', issueType: 'FMLA eligibility pending' },
  { id: 'ei8', dateDetected: '12/05/2025', employeeName: 'Emily Thompson', employeeRole: 'Marketing Manager', resolutionDeadline: '02/05/2026', urgency: 'medium', issueType: 'Background check expired' },
  { id: 'ei9', dateDetected: '01/05/2026', employeeName: 'Lisa Park', employeeRole: 'Finance Analyst', resolutionDeadline: '01/06/2026', urgency: 'very-high', issueType: 'Final pay not scheduled' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const HeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space1400} ${({ theme }) => (theme as StyledTheme).space600};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  &:hover { text-decoration: underline; }
`;

const BreadcrumbSep = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const BreadcrumbCurrent = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const BodyArea = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space1400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

/* ── Metrics strip ── */

const MetricsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const MetricCard = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const MetricLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const MetricValue = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 700;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 2px 0;
`;

const MetricSub = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

/* ── Priority row ── */

const PriorityRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  flex-wrap: wrap;
`;

const PriorityLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  white-space: nowrap;
`;

const PriorityPill = styled.span<{ pillColor: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 3px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
  background-color: ${({ pillColor }) => pillColor}18;
  color: ${({ pillColor }) => pillColor};
  border: 1px solid ${({ pillColor }) => pillColor}30;
`;

const PriorityDot = styled.span<{ pillColor: string }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ pillColor }) => pillColor};
`;

/* ── Issues table ── */

const IssuesCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const IssuesTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const IssuesToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 5px ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-width: 200px;
`;

const SearchPlaceholder = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
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

const UrgencyDot = styled.span<{ urgency: Urgency }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${({ urgency }) => {
    switch (urgency) {
      case 'very-high': return 'rgb(183,28,28)';
      case 'high': return 'rgb(230,81,0)';
      case 'medium': return 'rgb(245,124,0)';
      default: return 'rgb(46,125,50)';
    }
  }};
`;

const UrgencyLabel = styled.span<{ urgency: Urgency }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
  color: ${({ urgency }) => {
    switch (urgency) {
      case 'very-high': return 'rgb(183,28,28)';
      case 'high': return 'rgb(230,81,0)';
      case 'medium': return 'rgb(185,94,0)';
      default: return 'rgb(27,94,32)';
    }
  }};
`;

const UrgencyCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

function urgencyText(u: Urgency) {
  switch (u) {
    case 'very-high': return 'Very High';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    default: return 'Low';
  }
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface WorkforceModulePageProps {
  onBack: () => void;
}

export const WorkforceModulePage: React.FC<WorkforceModulePageProps> = ({ onBack }) => {
  const { theme } = usePebbleTheme();

  return (
    <PageWrapper theme={theme}>
      {/* ── Header ── */}
      <HeaderArea theme={theme}>
        <Breadcrumb theme={theme}>
          <BreadcrumbLink theme={theme} onClick={onBack}>Compliance 360</BreadcrumbLink>
          <BreadcrumbSep theme={theme}>/</BreadcrumbSep>
          <BreadcrumbCurrent theme={theme}>People / Workforce</BreadcrumbCurrent>
        </Breadcrumb>
        <PageTitle theme={theme}>People / Workforce</PageTitle>
      </HeaderArea>

      {/* ── Body ── */}
      <BodyArea theme={theme}>

        {/* Metrics strip */}
        <MetricsStrip theme={theme}>
          {PEOPLE_METRICS.map(m => (
            <MetricCard key={m.label} theme={theme}>
              <MetricLabel theme={theme}>{m.label}</MetricLabel>
              <MetricValue theme={theme}>{m.value}</MetricValue>
              <MetricSub theme={theme}>{m.sub}</MetricSub>
            </MetricCard>
          ))}
        </MetricsStrip>

        {/* Priority breakdown */}
        <PriorityRow theme={theme}>
          <PriorityLabel theme={theme}>Priority breakdown:</PriorityLabel>
          {PEOPLE_PRIORITY.map(p => (
            <PriorityPill key={p.label} theme={theme} pillColor={p.color}>
              <PriorityDot pillColor={p.color} />
              {p.label} · {p.count}
            </PriorityPill>
          ))}
        </PriorityRow>

        {/* Open issues table */}
        <TableCard theme={theme}>
          <IssuesCardTop theme={theme}>
            <IssuesTitle theme={theme}>Open Issues</IssuesTitle>
            <IssuesToolbar theme={theme}>
              <SearchBox theme={theme}>
                <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                <SearchPlaceholder theme={theme}>Search employees or issues…</SearchPlaceholder>
              </SearchBox>
              <FilterBtn theme={theme} aria-label="Filter">
                <Icon type={Icon.TYPES.FILTER} size={14} color={(theme as StyledTheme).colorOnSurface} />
              </FilterBtn>
            </IssuesToolbar>
          </IssuesCardTop>

          <StyledTable>
            <StyledTHead theme={theme}>
              <tr>
                <StyledTh theme={theme}>Date Detected</StyledTh>
                <StyledTh theme={theme}>Employee</StyledTh>
                <StyledTh theme={theme}>Resolution Deadline</StyledTh>
                <StyledTh theme={theme}>Urgency</StyledTh>
                <StyledTh theme={theme}>Issue Type</StyledTh>
                <StyledTh theme={theme} style={{ width: 110 }}></StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {EMPLOYEE_ISSUES.map(issue => (
                <StyledTr key={issue.id} theme={theme}>
                  <StyledTd theme={theme}>
                    <CellTextMuted theme={theme}>{issue.dateDetected}</CellTextMuted>
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
                    <CellTextBold theme={theme}>{issue.resolutionDeadline}</CellTextBold>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <UrgencyCell theme={theme}>
                      <UrgencyDot urgency={issue.urgency} />
                      <UrgencyLabel theme={theme} urgency={issue.urgency}>
                        {urgencyText(issue.urgency)}
                      </UrgencyLabel>
                    </UrgencyCell>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <CellTextBold theme={theme}>{issue.issueType}</CellTextBold>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <ActionButtonWrapper>
                      <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                        Take action
                      </Button>
                    </ActionButtonWrapper>
                  </StyledTd>
                </StyledTr>
              ))}
            </tbody>
          </StyledTable>
        </TableCard>
      </BodyArea>
    </PageWrapper>
  );
};
