import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellText,
  CellTextBold,
} from './shared-styles';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

type FilingStatus = 'not-started' | 'due-soon' | 'action-needed' | 'in-progress' | 'not-yet-filed' | 'filed';

interface ComplianceFiling {
  id: string;
  jurisdiction: string;
  fileName: string;
  filingName: string;
  filingOpens: string;
  dueDate: string;
  responsibleForFiling: string;
  status: FilingStatus;
}

const STATUS_SORT_ORDER: Record<FilingStatus, number> = {
  'action-needed': 0,
  'due-soon':      1,
  'not-started':   2,
  'not-yet-filed': 3,
  'in-progress':   4,
  'filed':         5,
};

const FILINGS: ComplianceFiling[] = ([
  { id: 'f1',  jurisdiction: 'Federal',           fileName: 'EEO-1',           filingName: 'EEO-1 Component 1 Report',            filingOpens: 'Jan 1, 2026',  dueDate: 'Mar 31, 2026', responsibleForFiling: 'COMPANY', status: 'action-needed' },
  { id: 'f9',  jurisdiction: 'California',         fileName: 'DE 9',            filingName: 'Q1 CA Withholding Return',             filingOpens: 'Apr 1, 2026',  dueDate: 'Apr 30, 2026', responsibleForFiling: 'COMPANY', status: 'action-needed' },
  { id: 'f11', jurisdiction: 'Federal',            fileName: '941-X',           filingName: '941-X Amendment (Q3 2025)',            filingOpens: '—',            dueDate: 'Mar 15, 2026', responsibleForFiling: 'COMPANY', status: 'action-needed' },
  { id: 'f5',  jurisdiction: 'New York',           fileName: 'PFL-120',         filingName: 'NY Paid Family Leave Annual Statement', filingOpens: 'Jan 1, 2026',  dueDate: 'Mar 1, 2026',  responsibleForFiling: 'COMPANY', status: 'due-soon' },
  { id: 'f4',  jurisdiction: 'Federal',            fileName: 'VETS-4212',       filingName: 'VETS-4212 Report',                    filingOpens: 'Aug 1, 2026',  dueDate: 'Sep 30, 2026', responsibleForFiling: 'COMPANY', status: 'not-started' },
  { id: 'f12', jurisdiction: 'San Francisco, CA',  fileName: 'HSF-1',           filingName: 'Healthy SF Expenditure Report',        filingOpens: 'Mar 1, 2026',  dueDate: 'Apr 30, 2026', responsibleForFiling: 'COMPANY', status: 'not-started' },
  { id: 'f8',  jurisdiction: 'Federal',            fileName: 'Form 941',        filingName: 'Q1 2026 Federal Tax Return',           filingOpens: 'Apr 1, 2026',  dueDate: 'Apr 30, 2026', responsibleForFiling: 'COMPANY', status: 'not-yet-filed' },
  { id: 'f10', jurisdiction: 'Texas',              fileName: 'C-3',             filingName: 'TX Quarterly Wage Report',             filingOpens: 'Apr 1, 2026',  dueDate: 'Apr 30, 2026', responsibleForFiling: 'COMPANY', status: 'not-yet-filed' },
  { id: 'f2',  jurisdiction: 'California',         fileName: 'SB 973',          filingName: 'California Pay Data Report',           filingOpens: 'Jan 1, 2026',  dueDate: 'Mar 31, 2026', responsibleForFiling: 'COMPANY', status: 'in-progress' },
  { id: 'f3',  jurisdiction: 'Federal',            fileName: '1094-C / 1095-C', filingName: 'ACA Annual Filing',                   filingOpens: 'Jan 1, 2026',  dueDate: 'Feb 28, 2026', responsibleForFiling: 'COMPANY', status: 'filed' },
  { id: 'f6',  jurisdiction: 'Federal',            fileName: 'Form 940',        filingName: 'Annual FUTA Tax Return',               filingOpens: 'Jan 1, 2026',  dueDate: 'Jan 31, 2026', responsibleForFiling: 'COMPANY', status: 'filed' },
  { id: 'f7',  jurisdiction: 'Federal',            fileName: 'W-2 / W-3',       filingName: 'Wage & Tax Statement Distribution',    filingOpens: 'Jan 1, 2026',  dueDate: 'Jan 31, 2026', responsibleForFiling: 'COMPANY', status: 'filed' },
] as ComplianceFiling[]).sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]);

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const CountBadge = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ToolbarRight = styled.div`
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
  min-width: 180px;
`;

const SearchPlaceholder = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const JurisdictionText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const DueDateText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const FilingStatusBadge = styled.span<{ filingStatus: FilingStatus }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ filingStatus }) => {
    switch (filingStatus) {
      case 'filed':         return 'rgb(46,125,50)';
      case 'in-progress':   return 'rgb(245,124,0)';
      case 'due-soon':      return 'rgb(245,124,0)';
      case 'action-needed': return 'rgb(183,28,28)';
      case 'not-started':
      case 'not-yet-filed':
      default:              return 'rgb(100,100,100)';
    }
  }};
`;

const ArrowBtn = styled.button`
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

function statusLabel(s: FilingStatus) {
  switch (s) {
    case 'not-started':   return 'Not started';
    case 'due-soon':      return 'Due soon';
    case 'action-needed': return 'Action needed';
    case 'in-progress':   return 'In progress';
    case 'not-yet-filed': return 'Not yet filed';
    case 'filed':         return 'Filed';
  }
}


/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export const FilingsTab: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      <TableCard theme={theme}>
        <ToolbarRow theme={theme}>
          <ToolbarLeft theme={theme}>
            <SectionTitle theme={theme}>Report filings</SectionTitle>
            <CountBadge theme={theme}>· {FILINGS.length}</CountBadge>
          </ToolbarLeft>
          <ToolbarRight theme={theme}>
            <SearchBox theme={theme}>
              <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={13} color={(theme as StyledTheme).colorOnSurfaceVariant} />
              <SearchPlaceholder theme={theme}>Search filings...</SearchPlaceholder>
            </SearchBox>
          </ToolbarRight>
        </ToolbarRow>

        <StyledTable>
          <StyledTHead theme={theme}>
            <tr>
              <StyledTh theme={theme}>Filing name</StyledTh>
              <StyledTh theme={theme}>File name</StyledTh>
              <StyledTh theme={theme}>Jurisdiction</StyledTh>
              <StyledTh theme={theme}>Filing opens</StyledTh>
              <StyledTh theme={theme}>Due date</StyledTh>
              <StyledTh theme={theme}>Filing status</StyledTh>
              <StyledTh theme={theme}>Responsible for filing</StyledTh>
              <StyledTh theme={theme} style={{ width: 50 }}></StyledTh>
            </tr>
          </StyledTHead>
          <tbody>
            {FILINGS.map(f => (
              <StyledTr key={f.id} theme={theme}>
                <StyledTd theme={theme}>
                  <CellTextBold theme={theme}>{f.filingName}</CellTextBold>
                </StyledTd>
                <StyledTd theme={theme}>
                  <CellText theme={theme}>{f.fileName}</CellText>
                </StyledTd>
                <StyledTd theme={theme}>
                  <JurisdictionText theme={theme}>{f.jurisdiction}</JurisdictionText>
                </StyledTd>
                <StyledTd theme={theme}>
                  <CellText theme={theme}>{f.filingOpens}</CellText>
                </StyledTd>
                <StyledTd theme={theme}>
                  <DueDateText theme={theme}>{f.dueDate}</DueDateText>
                </StyledTd>
                <StyledTd theme={theme}>
                  <FilingStatusBadge theme={theme} filingStatus={f.status}>
                    {statusLabel(f.status)}
                  </FilingStatusBadge>
                </StyledTd>
                <StyledTd theme={theme}>
                  <CellText theme={theme}>{f.responsibleForFiling}</CellText>
                </StyledTd>
                <StyledTd theme={theme}>
                  <ArrowBtn theme={theme} aria-label="Open filing">
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ArrowBtn>
                </StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      </TableCard>
    </TabContent>
  );
};
