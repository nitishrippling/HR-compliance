import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

export type HubModuleId = 'workforce' | 'entity' | 'filing' | 'posters' | 'email';

interface ModuleSummary {
  id: HubModuleId;
  icon: string;
  name: string;
  description: string;
  totalTasks: number;
  overdue: number;
  dueSoon: number;
  upcoming: number;
  clickable: boolean;
}

/* ═══════════════════════════════════════════════════════
   MODULE DATA
   ═══════════════════════════════════════════════════════ */

const MODULES: ModuleSummary[] = [
  {
    id: 'workforce',
    icon: Icon.TYPES.USERS_OUTLINE,
    name: 'Workforce',
    description: 'Employee-level compliance — I-9, FMLA, classification, final pay',
    totalTasks: 6,
    overdue: 2,
    dueSoon: 3,
    upcoming: 1,
    clickable: true,
  },
  {
    id: 'entity',
    icon: Icon.TYPES.OFFICE_OUTLINE,
    name: 'Entity',
    description: 'State & local registrations, foreign qualifications, tax accounts',
    totalTasks: 8,
    overdue: 2,
    dueSoon: 3,
    upcoming: 3,
    clickable: true,
  },
  {
    id: 'filing',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
    name: 'Filings',
    description: 'Federal, state, and local compliance filings and returns',
    totalTasks: 4,
    overdue: 0,
    dueSoon: 4,
    upcoming: 0,
    clickable: true,
  },
  {
    id: 'posters',
    icon: Icon.TYPES.CHECKLIST,
    name: 'Workplace Posters',
    description: 'Labor law poster creation, distribution, and renewal tracking',
    totalTasks: 3,
    overdue: 0,
    dueSoon: 1,
    upcoming: 2,
    clickable: false,
  },
  {
    id: 'email',
    icon: Icon.TYPES.EMAIL_OUTLINE,
    name: 'Mail Processing',
    description: 'Garnishments, levies, verifications, and inbound mail triage',
    totalTasks: 5,
    overdue: 1,
    dueSoon: 2,
    upcoming: 2,
    clickable: false,
  },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const HubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const HeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space1000} ${({ theme }) => (theme as StyledTheme).space1400} ${({ theme }) => (theme as StyledTheme).space800};
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const PageSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const BodyArea = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space1400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

/* ── Module row ── */

const ModuleRow = styled.div<{ isClickable: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  padding: ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space600};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  min-height: 88px;
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};
  transition: box-shadow 150ms ease, border-color 150ms ease;

  ${({ isClickable, theme }) =>
    isClickable &&
    `
    &:hover {
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      border-color: ${(theme as StyledTheme).colorOutline};
    }
  `}
`;

const ModuleIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ModuleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const ModuleName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ModuleDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ── Count + pills ── */

const CountArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  flex-shrink: 0;
`;

const TaskCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  min-width: 48px;
`;

const TaskCountNumber = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 700;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1;
`;

const TaskCountLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const PillsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const StatusPill = styled.span<{ pillVariant: 'overdue' | 'due-soon' | 'upcoming' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
  white-space: nowrap;

  ${({ pillVariant }) => {
    switch (pillVariant) {
      case 'overdue':
        return 'background-color: rgba(211,47,47,0.10); color: rgb(183,28,28);';
      case 'due-soon':
        return 'background-color: rgba(245,124,0,0.10); color: rgb(185,94,0);';
      default:
        return 'background-color: rgba(46,125,50,0.10); color: rgb(27,94,32);';
    }
  }}
`;

const PillDot = styled.span<{ pillVariant: 'overdue' | 'due-soon' | 'upcoming' }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ pillVariant }) => {
    switch (pillVariant) {
      case 'overdue': return 'rgb(211,47,47)';
      case 'due-soon': return 'rgb(245,124,0)';
      default: return 'rgb(46,125,50)';
    }
  }};
`;

const ChevronArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
`;

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface ComplianceHubProps {
  onNavigate: (module: HubModuleId) => void;
}

export const ComplianceHub: React.FC<ComplianceHubProps> = ({ onNavigate }) => {
  const { theme } = usePebbleTheme();

  function handleClick(m: ModuleSummary) {
    if (m.clickable) onNavigate(m.id);
  }

  return (
    <HubWrapper theme={theme}>
      <HeaderArea theme={theme}>
        <PageTitle theme={theme}>Compliance 360</PageTitle>
        <PageSubtitle theme={theme}>
          All compliance tasks, registrations, and filings in one place.
        </PageSubtitle>
      </HeaderArea>

      <BodyArea theme={theme}>
        {MODULES.map(m => (
          <ModuleRow
            key={m.id}
            theme={theme}
            isClickable={m.clickable}
            onClick={() => handleClick(m)}
            role={m.clickable ? 'button' : undefined}
            tabIndex={m.clickable ? 0 : undefined}
            onKeyDown={e => {
              if (m.clickable && (e.key === 'Enter' || e.key === ' ')) handleClick(m);
            }}
            aria-label={m.clickable ? `Open ${m.name}` : m.name}
          >
            {/* Icon */}
            <ModuleIconBox theme={theme}>
              <Icon type={m.icon} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </ModuleIconBox>

            {/* Name + description */}
            <ModuleInfo>
              <ModuleName theme={theme}>{m.name}</ModuleName>
              <ModuleDescription theme={theme}>{m.description}</ModuleDescription>
            </ModuleInfo>

            {/* Status pills */}
            <PillsRow theme={theme}>
              {m.overdue > 0 && (
                <StatusPill theme={theme} pillVariant="overdue">
                  <PillDot pillVariant="overdue" />
                  {m.overdue} Overdue
                </StatusPill>
              )}
              {m.dueSoon > 0 && (
                <StatusPill theme={theme} pillVariant="due-soon">
                  <PillDot pillVariant="due-soon" />
                  {m.dueSoon} Due Soon
                </StatusPill>
              )}
              {m.upcoming > 0 && (
                <StatusPill theme={theme} pillVariant="upcoming">
                  <PillDot pillVariant="upcoming" />
                  {m.upcoming} Upcoming
                </StatusPill>
              )}
            </PillsRow>

            {/* Task count */}
            <CountArea theme={theme}>
              <TaskCount>
                <TaskCountNumber theme={theme}>{m.totalTasks}</TaskCountNumber>
                <TaskCountLabel theme={theme}>tasks</TaskCountLabel>
              </TaskCount>
            </CountArea>

            {/* Chevron for clickable */}
            <ChevronArea>
              {m.clickable ? (
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              ) : (
                <span style={{ width: 20 }} />
              )}
            </ChevronArea>
          </ModuleRow>
        ))}
      </BodyArea>
    </HubWrapper>
  );
};
