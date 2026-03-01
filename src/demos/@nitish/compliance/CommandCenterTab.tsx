import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import { ComplianceAIDrawer } from './ComplianceAIDrawer';
import {
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellText,
  StatusDot,
  ActionButtonWrapper,
} from './shared-styles';

export type TabId = 'command-center' | 'state-tax' | 'local-tax' | 'foreign-qual' | 'additional-filings' | 'workplace-posters';

// --- YourImpact KPI Data ---

const kpis = [
  { icon: Icon.TYPES.TIME_OUTLINE, value: '62+', label: 'Estimated Hours Saved' },
  { icon: Icon.TYPES.OFFICE_OUTLINE, value: '18', label: 'State Registrations Completed' },
  { icon: Icon.TYPES.LOCATION_OUTLINE, value: '5', label: 'Local Registrations Completed' },
  { icon: Icon.TYPES.BANK_OUTLINE, value: '6', label: 'Foreign Qualifications Completed' },
  { icon: Icon.TYPES.DOCUMENT_OUTLINE, value: '14', label: 'Additional Filings Done' },
];

// --- YourActions Data ---

const tasks = [
  {
    task: 'Texas Withholding Registration',
    category: 'State Tax',
    dueDate: 'Feb 28, 2026',
    daysLeft: -2,
    risk: 'Payroll blocked if unresolved',
  },
  {
    task: 'Ohio Municipal Tax Setup',
    category: 'Local Tax',
    dueDate: 'Mar 1, 2026',
    daysLeft: 2,
    risk: 'Withholding non-compliant',
  },
  {
    task: 'Upload Certificate of Incorporation',
    category: 'Foreign Qualification',
    dueDate: 'Mar 5, 2026',
    daysLeft: 6,
    risk: 'Registration delayed',
  },
  {
    task: 'California SUI Rate Verification',
    category: 'State Tax',
    dueDate: 'Mar 10, 2026',
    daysLeft: 11,
    risk: 'Rate mismatch possible',
  },
  {
    task: 'Confirm ACA Headcount',
    category: 'Federal Filing',
    dueDate: 'Mar 31, 2026',
    daysLeft: 32,
    risk: 'Annual compliance confirmation',
  },
];

function getPenaltyInfo(daysLeft: number) {
  if (daysLeft < 0) {
    return { text: '$250 fine already charged', isOverdue: true };
  }
  return { text: `${daysLeft} days left before $250 fee`, isOverdue: false };
}

// --- ServiceSummaryCards Data ---

interface ServiceSummary {
  tabId: TabId;
  icon: string;
  title: string;
  description: string;
  counts: { label: string; count: number; status: 'success' | 'warning' | 'error' | 'neutral' }[];
}

const services: ServiceSummary[] = [
  {
    tabId: 'state-tax',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
    title: 'State Tax Accounts',
    description: 'Withholding & SUI account registrations across all states.',
    counts: [
      { label: 'Completed', count: 5, status: 'success' },
      { label: 'In Progress', count: 1, status: 'warning' },
      { label: 'Blocked', count: 2, status: 'error' },
    ],
  },
  {
    tabId: 'local-tax',
    icon: Icon.TYPES.OFFICE_OUTLINE,
    title: 'Local Tax Accounts',
    description: 'Municipal, county, and school district tax accounts.',
    counts: [
      { label: 'Completed', count: 3, status: 'success' },
      { label: 'In Progress', count: 1, status: 'warning' },
      { label: 'Blocked', count: 1, status: 'error' },
    ],
  },
  {
    tabId: 'foreign-qual',
    icon: Icon.TYPES.BANK_OUTLINE,
    title: 'Foreign Qualification',
    description: 'Entity qualification & registered agent management.',
    counts: [
      { label: 'Qualified', count: 4, status: 'success' },
      { label: 'Pending', count: 1, status: 'warning' },
      { label: 'Action Required', count: 1, status: 'error' },
    ],
  },
  {
    tabId: 'additional-filings',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
    title: 'Additional Filings',
    description: 'Federal, state, and local compliance filings.',
    counts: [
      { label: 'Filed', count: 4, status: 'success' },
      { label: 'In Progress', count: 1, status: 'warning' },
      { label: 'Upcoming', count: 1, status: 'neutral' },
    ],
  },
  {
    tabId: 'workplace-posters',
    icon: Icon.TYPES.CHECKLIST,
    title: 'Workplace Posters',
    description: 'Labor law poster distribution & compliance tracking.',
    counts: [
      { label: 'Current', count: 6, status: 'success' },
      { label: 'Update Available', count: 2, status: 'warning' },
    ],
  },
];

// --- Styled Components ---

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const KpiCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  text-align: center;
`;

const KpiIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const KpiValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const KpiLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
  line-height: 1.4;
`;

const TaskName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const TaskText = styled.span`
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

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.button`
  display: flex;
  flex-direction: column;
  text-align: left;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }
`;

const ServiceCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ServiceIconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ServiceTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: ${({ theme }) => (theme as StyledTheme).space300} 0 0 0;
`;

const ServiceDesc = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space100} 0 0 0;
  line-height: 1.5;
`;

const CountsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CountDot = styled.span<{ status: 'success' | 'warning' | 'error' | 'neutral' }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ status, theme }) => {
    const t = theme as StyledTheme;
    switch (status) {
      case 'success': return `background-color: ${t.colorSuccess};`;
      case 'warning': return `background-color: ${t.colorWarning};`;
      case 'error': return `background-color: ${t.colorError};`;
      default: return `background-color: ${t.colorOnSurfaceVariant};`;
    }
  }}
`;

const CountLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const CountValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const HelpIconButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  cursor: pointer;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

interface CommandCenterTabProps {
  onNavigate: (tabId: TabId) => void;
}

export const CommandCenterTab: React.FC<CommandCenterTabProps> = ({ onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(null);

  const sorted = [...tasks].sort((a, b) => a.daysLeft - b.daysLeft);

  function openHelp(task: (typeof tasks)[0]) {
    setSelectedTask(task);
    setDrawerOpen(true);
  }

  return (
    <SectionContainer>
      {/* Your Impact KPIs */}
      <section>
        <KpiGrid>
          {kpis.map(kpi => (
            <KpiCard key={kpi.label}>
              <KpiIconBox>
                <Icon type={kpi.icon} size={20} />
              </KpiIconBox>
              <KpiValue>{kpi.value}</KpiValue>
              <KpiLabel>{kpi.label}</KpiLabel>
            </KpiCard>
          ))}
        </KpiGrid>
      </section>

      {/* Your Actions */}
      <section>
        <SectionHeader>
          <SectionTitle>Your Actions</SectionTitle>
          <SectionDescription>Items requiring your input to keep compliance on track.</SectionDescription>
        </SectionHeader>

        <TableCard>
          <StyledTable>
            <StyledTHead>
              <tr>
                <StyledTh>Task</StyledTh>
                <StyledTh>Category</StyledTh>
                <StyledTh>Due Date</StyledTh>
                <StyledTh>Penalty Status</StyledTh>
                <StyledTh style={{ width: 80 }}>&nbsp;</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {sorted.map((task, index) => {
                const penalty = getPenaltyInfo(task.daysLeft);
                return (
                  <StyledTr key={index} onClick={() => openHelp(task)}>
                    <StyledTd>
                      <TaskName>
                        <StatusDot status={penalty.isOverdue ? 'error' : 'warning'} style={{ width: 8, height: 8 }} />
                        <div>
                          <TaskText>{task.task}</TaskText>
                          {penalty.isOverdue && <OverdueTag>Overdue</OverdueTag>}
                        </div>
                      </TaskName>
                    </StyledTd>
                    <StyledTd>
                      <CellText style={{ color: 'inherit' }}>{task.category}</CellText>
                    </StyledTd>
                    <StyledTd>
                      <CellText>{task.dueDate}</CellText>
                    </StyledTd>
                    <StyledTd>
                      <PenaltyText isOverdue={penalty.isOverdue}>{penalty.text}</PenaltyText>
                    </StyledTd>
                    <StyledTd>
                      <ActionButtonWrapper>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Button
                            size={Button.SIZES.XS}
                            appearance={Button.APPEARANCES.GHOST}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                            }}
                          >
                            Take Action
                          </Button>
                          <HelpIconButton
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              openHelp(task);
                            }}
                          >
                            <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={16} />
                          </HelpIconButton>
                        </div>
                      </ActionButtonWrapper>
                    </StyledTd>
                  </StyledTr>
                );
              })}
            </tbody>
          </StyledTable>
        </TableCard>
      </section>

      {/* Service Overview */}
      <section>
        <SectionHeader>
          <SectionTitle>Service Overview</SectionTitle>
          <SectionDescription>Click any card to view full details and manage items.</SectionDescription>
        </SectionHeader>

        <ServiceGrid>
          {services.map(service => (
            <ServiceCard key={service.tabId} onClick={() => onNavigate(service.tabId)}>
              <ServiceCardHeader>
                <ServiceIconBox>
                  <Icon type={service.icon} size={20} />
                </ServiceIconBox>
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} />
              </ServiceCardHeader>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDesc>{service.description}</ServiceDesc>
              <CountsRow>
                {service.counts.map(c => (
                  <CountItem key={c.label}>
                    <CountDot status={c.status} />
                    <CountLabel>
                      <CountValue>{c.count}</CountValue> {c.label}
                    </CountLabel>
                  </CountItem>
                ))}
              </CountsRow>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </section>

      <ComplianceAIDrawer open={drawerOpen} onOpenChange={setDrawerOpen} actionItem={selectedTask} />
    </SectionContainer>
  );
};
