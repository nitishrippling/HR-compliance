import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
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
  TypeBadge,
  CreatedByBadge,
  StatusDot,
  StatusCell,
  StatusLabel,
  ActionButtonWrapper,
} from './shared-styles';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

type FilingType = 'federal' | 'state' | 'local';
type FilingStatus = 'filed' | 'in-progress' | 'upcoming' | 'action-needed';
type Creator = 'Rippling' | 'Client';

interface ComplianceFiling {
  id: string;
  type: FilingType;
  jurisdiction: string;
  filingName: string;
  dueDate: string;
  createdBy: Creator;
  status: FilingStatus;
  statusDetail?: string;
  dueDateIsUrgent?: boolean;
}

const FILINGS: ComplianceFiling[] = [
  { id: 'cf7', type: 'federal', jurisdiction: 'Federal', filingName: '941-X Amendment (Q3 2025)', dueDate: 'Mar 15, 2026', createdBy: 'Rippling', status: 'action-needed', statusDetail: 'Needs Legal approval', dueDateIsUrgent: true },
  { id: 'cf8', type: 'state', jurisdiction: 'CA', filingName: 'Q1 2026 CA Withholding Return (DE 9)', dueDate: 'Apr 30, 2026', createdBy: 'Rippling', status: 'action-needed', statusDetail: 'Pre-flight validation failed' },
  { id: 'cf1', type: 'state', jurisdiction: 'NY', filingName: 'NY Paid Family Leave Annual Statement', dueDate: 'Mar 1, 2026', createdBy: 'Rippling', status: 'in-progress', statusDetail: 'Preparing filing' },
  { id: 'cf9', type: 'federal', jurisdiction: 'Federal', filingName: 'Q1 2026 Form 941', dueDate: 'Apr 30, 2026', createdBy: 'Rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf10', type: 'state', jurisdiction: 'TX', filingName: 'TX Quarterly Wage Report (C-3)', dueDate: 'Apr 30, 2026', createdBy: 'Rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf2', type: 'federal', jurisdiction: 'Federal', filingName: 'VETS-4212 Report', dueDate: 'Sep 30, 2026', createdBy: 'Rippling', status: 'upcoming', statusDetail: 'Scheduled' },
  { id: 'cf3', type: 'federal', jurisdiction: 'Federal', filingName: 'EEO-1 Component 1 Report', dueDate: 'Mar 31, 2026', createdBy: 'Rippling', status: 'filed', statusDetail: 'Filed Feb 17, 2026' },
  { id: 'cf4', type: 'federal', jurisdiction: 'Federal', filingName: 'ACA 1094-C / 1095-C', dueDate: 'Feb 28, 2026', createdBy: 'Rippling', status: 'filed', statusDetail: 'Filed Feb 14, 2026' },
  { id: 'cf5', type: 'state', jurisdiction: 'CA', filingName: 'California Pay Data Report (SB 973)', dueDate: 'Mar 31, 2026', createdBy: 'Rippling', status: 'filed', statusDetail: 'Filed Feb 10, 2026' },
  { id: 'cf6', type: 'local', jurisdiction: 'San Francisco, CA', filingName: 'Healthy SF Expenditure Report', dueDate: 'Apr 30, 2026', createdBy: 'Client', status: 'filed', statusDetail: 'Filed Feb 8, 2026' },
  { id: 'cf11', type: 'federal', jurisdiction: 'Federal', filingName: 'Form 940 (Annual FUTA)', dueDate: 'Jan 31, 2026', createdBy: 'Rippling', status: 'filed', statusDetail: 'Filed Jan 28, 2026' },
  { id: 'cf12', type: 'federal', jurisdiction: 'Federal', filingName: 'W-2 / W-3 Distribution', dueDate: 'Jan 31, 2026', createdBy: 'Rippling', status: 'filed', statusDetail: 'Filed Jan 31, 2026' },
];

const STATUS_ORDER: Record<FilingStatus, number> = { 'action-needed': 0, 'in-progress': 1, upcoming: 2, filed: 3 };

const SUMMARY = {
  total: FILINGS.length,
  actionNeeded: FILINGS.filter(f => f.status === 'action-needed').length,
  inProgress: FILINGS.filter(f => f.status === 'in-progress').length,
  upcoming: FILINGS.filter(f => f.status === 'upcoming').length,
  filed: FILINGS.filter(f => f.status === 'filed').length,
};

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
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space1400};
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

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const TitleGroup = styled.div``;

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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SummaryPillRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-wrap: wrap;
`;

const SummaryPill = styled.div<{ variant: 'default' | 'action' | 'progress' | 'upcoming' | 'filed' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1px solid;
  cursor: pointer;
  ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    switch (variant) {
      case 'action': return `background-color: rgba(211,47,47,0.08); border-color: rgba(211,47,47,0.2); color: rgb(183,28,28);`;
      case 'progress': return `background-color: rgba(245,124,0,0.08); border-color: rgba(245,124,0,0.2); color: rgb(185,94,0);`;
      case 'upcoming': return `background-color: rgba(46,125,50,0.08); border-color: rgba(46,125,50,0.2); color: rgb(27,94,32);`;
      case 'filed': return `background-color: ${t.colorSurfaceContainerLow}; border-color: ${t.colorOutlineVariant}; color: ${t.colorOnSurfaceVariant};`;
      default: return `background-color: ${t.colorSurfaceContainerLow}; border-color: ${t.colorOutlineVariant}; color: ${t.colorOnSurface};`;
    }
  }}
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
`;

const PillDot = styled.span<{ variant: 'action' | 'progress' | 'upcoming' | 'filed' }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ variant }) => {
    switch (variant) {
      case 'action': return 'rgb(211,47,47)';
      case 'progress': return 'rgb(245,124,0)';
      case 'upcoming': return 'rgb(46,125,50)';
      default: return 'rgb(140,140,140)';
    }
  }};
`;

const BodyArea = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space1400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const TableTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const TableActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 6px ${({ theme }) => (theme as StyledTheme).space400};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  cursor: text;
  min-width: 220px;
`;

const SearchPlaceholder = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const JurisdictionText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const FilingActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ViewLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0;
  &:hover { text-decoration: underline; }
`;

function typeVariant(t: FilingType): 'amber' | 'primary' | 'sky' {
  switch (t) {
    case 'federal': return 'amber';
    case 'local': return 'sky';
    default: return 'primary';
  }
}

function typeLabel(t: FilingType) {
  switch (t) {
    case 'federal': return 'Federal';
    case 'local': return 'Local';
    default: return 'State';
  }
}

function statusDotVariant(s: FilingStatus): 'error' | 'success' | 'warning' | 'neutral' {
  switch (s) {
    case 'action-needed': return 'error';
    case 'filed': return 'success';
    case 'in-progress': return 'warning';
    default: return 'neutral';
  }
}

function statusLabelText(s: FilingStatus) {
  switch (s) {
    case 'action-needed': return 'Action needed';
    case 'filed': return 'Filed';
    case 'in-progress': return 'In progress';
    default: return 'Upcoming';
  }
}

type FilterState = 'all' | FilingStatus;

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface FilingsModulePageProps {
  onBack: () => void;
}

export const FilingsModulePage: React.FC<FilingsModulePageProps> = ({ onBack }) => {
  const { theme } = usePebbleTheme();
  const [filter, setFilter] = useState<FilterState>('all');

  const sorted = [...FILINGS]
    .filter(f => filter === 'all' || f.status === filter)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <PageWrapper theme={theme}>
      {/* ── Header ── */}
      <HeaderArea theme={theme}>
        <Breadcrumb theme={theme}>
          <BreadcrumbLink theme={theme} onClick={onBack}>Compliance 360</BreadcrumbLink>
          <BreadcrumbSep theme={theme}>/</BreadcrumbSep>
          <BreadcrumbCurrent theme={theme}>Filings</BreadcrumbCurrent>
        </Breadcrumb>

        <HeaderRow theme={theme}>
          <TitleGroup>
            <PageTitle theme={theme}>Filings</PageTitle>
            <PageSubtitle theme={theme}>
              Federal, state, and local compliance filings — managed by Rippling and your team.
            </PageSubtitle>
          </TitleGroup>
          <HeaderActions theme={theme}>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST}>
              <Icon type={Icon.TYPES.FILTER} size={14} />
              Filter
            </Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST}>
              <Icon type={Icon.TYPES.UPLOAD} size={14} />
              Export
            </Button>
          </HeaderActions>
        </HeaderRow>

        <SummaryPillRow theme={theme}>
          <SummaryPill theme={theme} variant="default" onClick={() => setFilter('all')}>
            {SUMMARY.total} Total
          </SummaryPill>
          <SummaryPill theme={theme} variant="action" onClick={() => setFilter('action-needed')}>
            <PillDot variant="action" />
            {SUMMARY.actionNeeded} Action needed
          </SummaryPill>
          <SummaryPill theme={theme} variant="progress" onClick={() => setFilter('in-progress')}>
            <PillDot variant="progress" />
            {SUMMARY.inProgress} In progress
          </SummaryPill>
          <SummaryPill theme={theme} variant="upcoming" onClick={() => setFilter('upcoming')}>
            <PillDot variant="upcoming" />
            {SUMMARY.upcoming} Upcoming
          </SummaryPill>
          <SummaryPill theme={theme} variant="filed" onClick={() => setFilter('filed')}>
            <PillDot variant="filed" />
            {SUMMARY.filed} Filed
          </SummaryPill>
        </SummaryPillRow>
      </HeaderArea>

      {/* ── Body ── */}
      <BodyArea theme={theme}>
        <TableCard theme={theme}>
          <TableToolbar theme={theme}>
            <TableTitle theme={theme}>All compliance filings — 2026</TableTitle>
            <TableActionsRow theme={theme}>
              <SearchBox theme={theme}>
                <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                <SearchPlaceholder theme={theme}>Search filings…</SearchPlaceholder>
              </SearchBox>
            </TableActionsRow>
          </TableToolbar>

          <StyledTable>
            <StyledTHead theme={theme}>
              <tr>
                <StyledTh theme={theme}>Type</StyledTh>
                <StyledTh theme={theme}>Jurisdiction</StyledTh>
                <StyledTh theme={theme}>Filing name</StyledTh>
                <StyledTh theme={theme}>Due date</StyledTh>
                <StyledTh theme={theme}>Created by</StyledTh>
                <StyledTh theme={theme}>Status</StyledTh>
                <StyledTh theme={theme}>Details</StyledTh>
                <StyledTh theme={theme} style={{ width: 100 }}>Actions</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {sorted.map(f => (
                <StyledTr key={f.id} theme={theme}>
                  <StyledTd theme={theme}>
                    <TypeBadge theme={theme} variant={typeVariant(f.type)}>
                      {typeLabel(f.type)}
                    </TypeBadge>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <JurisdictionText theme={theme}>{f.jurisdiction}</JurisdictionText>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <CellTextBold theme={theme}>{f.filingName}</CellTextBold>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <CellText theme={theme}>{f.dueDate}</CellText>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <CreatedByBadge theme={theme} isRippling={f.createdBy === 'Rippling'}>
                      {f.createdBy}
                    </CreatedByBadge>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    <StatusCell>
                      <StatusDot theme={theme} status={statusDotVariant(f.status)} />
                      <StatusLabel theme={theme}>{statusLabelText(f.status)}</StatusLabel>
                    </StatusCell>
                  </StyledTd>
                  <StyledTd theme={theme}>
                    {f.statusDetail && <CellTextMuted theme={theme}>{f.statusDetail}</CellTextMuted>}
                  </StyledTd>
                  <StyledTd theme={theme}>
                    {f.status === 'filed' ? (
                      <FilingActionsCell theme={theme}>
                        <ActionButtonWrapper>
                          <ViewLink theme={theme}>View</ViewLink>
                        </ActionButtonWrapper>
                      </FilingActionsCell>
                    ) : f.status === 'action-needed' ? (
                      <ActionButtonWrapper>
                        <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.PRIMARY}>
                          Resolve
                        </Button>
                      </ActionButtonWrapper>
                    ) : null}
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
