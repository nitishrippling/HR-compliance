import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';

/* ═══════════════════════════════════════════════════════
   DATA — Module rows
   ═══════════════════════════════════════════════════════ */

interface ModuleRow {
  module: string;
  description: string;
  actionNeeded: number;
  dueSoon: number;
  onTrack: number;
  completed: number;
  total: number;
}

const MODULE_ROWS: ModuleRow[] = [
  {
    module: 'Workforce',
    description: 'Employee-level compliance — wage, leave & labor law violations detected across your workforce.',
    actionNeeded: 242, dueSoon: 0, onTrack: 0, completed: 0, total: 242,
  },
  {
    module: 'Entity',
    description: 'Corporate registrations — state & local tax accounts, foreign qualifications, and annual filings for your entities.',
    actionNeeded: 2, dueSoon: 1, onTrack: 2, completed: 18, total: 5,
  },
  {
    module: 'Filings',
    description: 'Government filings — EEO-1, ACA, quarterly tax returns, amendments, and other regulatory submissions.',
    actionNeeded: 3, dueSoon: 1, onTrack: 4, completed: 4, total: 12,
  },
  {
    module: 'Posters & mails',
    description: 'Workplace poster distribution and compliance mail processing — garnishments, levies, and agency correspondence.',
    actionNeeded: 0, dueSoon: 1, onTrack: 3, completed: 12, total: 4,
  },
];

/* ═══════════════════════════════════════════════════════
   DATA — Rippling's Impact (Entity + Filings only)
   ═══════════════════════════════════════════════════════ */

interface ImpactMetric {
  icon: string;
  value: string;
  label: string;
  module: string;
}

const IMPACT_METRICS: ImpactMetric[] = [
  { icon: Icon.TYPES.TIME_OUTLINE,     value: '62+',  label: 'Hours saved on registrations',     module: 'Entity' },
  { icon: Icon.TYPES.OFFICE_OUTLINE,   value: '18',   label: 'State registrations completed',     module: 'Entity' },
  { icon: Icon.TYPES.LOCATION_OUTLINE, value: '5',    label: 'Local registrations completed',     module: 'Entity' },
  { icon: Icon.TYPES.BANK_OUTLINE,     value: '6',    label: 'Foreign qualifications completed',  module: 'Entity' },
  { icon: Icon.TYPES.DOCUMENT_OUTLINE, value: '4',    label: 'Filings submitted by Rippling',     module: 'Filings' },
  { icon: Icon.TYPES.CHECK_OUTLINE,    value: '100%', label: 'On-time filing rate (YTD)',         module: 'Filings' },
];

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

const SectionLabel = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const SectionSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const SectionHeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

/* ── Full-width module rows ── */

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ModuleCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: box-shadow 150ms ease, border-color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const ModuleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex: 1;
  min-width: 0;
`;

const ModuleName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ModuleDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.4;
`;

const ModuleStats = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  flex-shrink: 0;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatKey = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const StatValue = styled.span<{ variant?: 'error' | 'warning' | 'success' | 'neutral' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  font-weight: 600;
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'error':   return (theme as StyledTheme).colorError;
      case 'warning': return 'rgb(245,124,0)';
      case 'success': return (theme as StyledTheme).colorSuccess;
      default:        return (theme as StyledTheme).colorOnSurface;
    }
  }};
`;

const ChevronWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.5;
`;

/* ── Impact section ── */

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ImpactIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ImpactLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ImpactValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
`;

const ImpactModuleTag = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  opacity: 0.7;
`;

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

const MODULE_TAB_INDEX: Record<string, number> = {
  'Workforce': 1,
  'Entity': 2,
  'Filings': 3,
  'Posters & mails': 4,
};

interface OverviewTabProps {
  onNavigateToModule?: (tabIndex: number) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToModule }) => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* ── Section 1: Module rows ── */}
      <SectionHeaderBlock theme={theme}>
        <SectionLabel theme={theme}>Your compliance posture</SectionLabel>
        <SectionSubtitle theme={theme}>
          Task summary across all compliance modules — click any row to view details
        </SectionSubtitle>
      </SectionHeaderBlock>

      <ModuleList theme={theme}>
        {MODULE_ROWS.map(m => {
          const pendingTotal = m.actionNeeded + m.dueSoon + m.onTrack;
          return (
            <ModuleCard
              key={m.module}
              theme={theme}
              onClick={() => onNavigateToModule?.(MODULE_TAB_INDEX[m.module] ?? 0)}
            >
              <ModuleInfo theme={theme}>
                <ModuleName theme={theme}>{m.module}</ModuleName>
                <ModuleDesc theme={theme}>{m.description}</ModuleDesc>
              </ModuleInfo>

              <ModuleStats theme={theme}>
                {m.actionNeeded > 0 && (
                  <StatBlock>
                    <StatKey theme={theme}>Action needed</StatKey>
                    <StatValue theme={theme} variant="error">{m.actionNeeded}</StatValue>
                  </StatBlock>
                )}
                {m.dueSoon > 0 && (
                  <StatBlock>
                    <StatKey theme={theme}>Due soon</StatKey>
                    <StatValue theme={theme} variant="warning">{m.dueSoon}</StatValue>
                  </StatBlock>
                )}
                {m.onTrack > 0 && (
                  <StatBlock>
                    <StatKey theme={theme}>On track</StatKey>
                    <StatValue theme={theme} variant="success">{m.onTrack}</StatValue>
                  </StatBlock>
                )}
                <StatBlock>
                  <StatKey theme={theme}>Total pending</StatKey>
                  <StatValue theme={theme}>{pendingTotal}</StatValue>
                </StatBlock>
              </ModuleStats>

              <ChevronWrap>
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={20} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              </ChevronWrap>
            </ModuleCard>
          );
        })}
      </ModuleList>

      {/* ── Section 2: Rippling's Impact ── */}
      <SectionHeaderBlock theme={theme}>
        <SectionLabel theme={theme}>Rippling's impact</SectionLabel>
        <SectionSubtitle theme={theme}>
          What Rippling has done for you across entity and filings compliance
        </SectionSubtitle>
      </SectionHeaderBlock>

      <ImpactGrid theme={theme}>
        {IMPACT_METRICS.map(m => (
          <ImpactCard key={m.label} theme={theme}>
            <ImpactIconRow theme={theme}>
              <Icon type={m.icon} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              <ImpactLabel theme={theme}>{m.label}</ImpactLabel>
            </ImpactIconRow>
            <ImpactValue theme={theme}>{m.value}</ImpactValue>
            <ImpactModuleTag theme={theme}>{m.module}</ImpactModuleTag>
          </ImpactCard>
        ))}
      </ImpactGrid>
    </TabContent>
  );
};
