import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import Button from '@rippling/pebble/Button';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';

/* ─── Data ──────────────────────────────────────────────── */

interface ErrorReportRow {
  id: string;
  sfdc: string;
  company: string;
  carrier: string;
  assignee: string;
  status: string;
  sla: { label: string; status: 'green' | 'amber' | 'red' };
  detailedStatus: string;
  createdAt: string;
  issues: number;
  isParsing: boolean;
}

const tableData: ErrorReportRow[] = [
  { id: '1', sfdc: '24135', company: 'Acme', carrier: 'Aetna', assignee: 'Richard Satherland', status: 'New', sla: { label: '3 days, 12 hours left', status: 'green' }, detailedStatus: 'NA', createdAt: '5th Feb at 12:10 pm', issues: 5, isParsing: false },
  { id: '2', sfdc: '24136', company: 'Globex', carrier: 'Blue Cross', assignee: 'Richard Satherland', status: 'Pending', sla: { label: '3 days, 10 hours left', status: 'green' }, detailedStatus: 'Pending requirements gath...', createdAt: '6th Feb at 9:45 am', issues: 4, isParsing: false },
  { id: '3', sfdc: '24137', company: 'Initech', carrier: 'Kaiser', assignee: 'Richard Satherland', status: 'Pending', sla: { label: '3 days, 08 hours left', status: 'green' }, detailedStatus: 'Pending carrier testing', createdAt: '7th Feb at 3:22 pm', issues: 6, isParsing: false },
  { id: '4', sfdc: '24138', company: 'Umbrella', carrier: 'UnitedHealth', assignee: 'Richard Satherland', status: 'Pending', sla: { label: '1 days, 04 hours left', status: 'amber' }, detailedStatus: 'Pending carrier testing', createdAt: '8th Feb at 11:05 am', issues: 2, isParsing: false },
  { id: '5', sfdc: '24139', company: 'Wayne Enterprises', carrier: 'Humana', assignee: 'Richard Satherland', status: 'On hold', sla: { label: '1 days, 02 hours left', status: 'amber' }, detailedStatus: 'Waiting on carrier', createdAt: '9th Feb at 2:40 pm', issues: 0, isParsing: false },
  { id: '6', sfdc: '24140', company: 'Stark Industries', carrier: 'Cigna', assignee: 'Richard Satherland', status: 'On hold', sla: { label: '1 days, 01 hours left', status: 'red' }, detailedStatus: 'Waiting on carrier', createdAt: '10th Feb at 10:18 am', issues: 0, isParsing: true },
  { id: '7', sfdc: '24141', company: 'Soylent', carrier: 'Anthem', assignee: 'Richard Satherland', status: 'On hold', sla: { label: '12 hours left', status: 'red' }, detailedStatus: 'Waiting on carrier', createdAt: '11th Feb at 4:07 pm', issues: 4, isParsing: true },
  { id: '8', sfdc: '24142', company: 'Wonka', carrier: 'Oscar', assignee: 'Richard Satherland', status: 'Duplicate', sla: { label: '12 hours left', status: 'red' }, detailedStatus: 'Empty error report', createdAt: '12th Feb at 1:33 pm', issues: 8, isParsing: false },
  { id: '9', sfdc: '24143', company: 'Hooli', carrier: 'Bright Health', assignee: 'Richard Satherland', status: 'Duplicate', sla: { label: '12 hours left', status: 'red' }, detailedStatus: 'Empty error report', createdAt: '13th Feb at 9:12 am', issues: 4, isParsing: true },
  { id: '10', sfdc: '24144', company: 'Vandelay', carrier: 'Clover', assignee: 'Richard Satherland', status: 'Duplicate', sla: { label: '12 hours left', status: 'red' }, detailedStatus: 'Empty error report', createdAt: '14th Feb at 3:58 pm', issues: 6, isParsing: false },
];

/* ─── Animations ────────────────────────────────────────── */

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/* ─── Layout ────────────────────────────────────────────── */

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const TopNavContainer = styled.header`
  display: flex;
  height: 48px;
  align-items: center;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
`;

const NavLogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-shrink: 0;
`;

const NavLogoDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
`;

const NavLogoText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  font-weight: 600;
`;

const MainContent = styled.main`
  padding: ${({ theme }) => `${(theme as StyledTheme).space600} ${(theme as StyledTheme).space800}`};
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const PageSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

/* ─── Table chrome ──────────────────────────────────────── */

const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const TableToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const GridTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

/* ─── Table ─────────────────────────────────────────────── */

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 1100px;
`;

const StyledTHead = styled.thead`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  th {
    ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
    text-align: left;
    padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
  }
`;

const StyledTr = styled.tr<{ isParsing?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: ${({ isParsing }) => (isParsing ? 'default' : 'pointer')};
  transition: background-color 150ms ease;
  position: relative;

  ${({ isParsing }) =>
    isParsing
      ? `opacity: 0.55;`
      : `
    &:hover {
      background-color: var(--hover-bg);
    }
  `}
`;

const StyledTd = styled.td`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CheckboxCell = styled(StyledTd)`
  width: 40px;
  text-align: center;
  padding-left: ${({ theme }) => (theme as StyledTheme).space300};
  padding-right: 0;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CellTextPrimary = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: inherit;
`;

const CellTextMuted = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const CellTextBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const AssigneeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AssigneeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ChevronCell = styled(StyledTd)`
  width: 40px;
  text-align: center;
  padding-right: ${({ theme }) => (theme as StyledTheme).space300};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ─── SLA ───────────────────────────────────────────────── */

const SlaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SlaDot = styled.span<{ status: 'green' | 'amber' | 'red' }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;
  background-color: ${({ status }) =>
    status === 'green' ? '#1a8754' : status === 'amber' ? '#e07c00' : '#d32f2f'};
`;

const SlaText = styled.span<{ status: 'green' | 'amber' | 'red' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ status }) =>
    status === 'green' ? '#1a8754' : status === 'amber' ? '#e07c00' : '#d32f2f'};
`;

/* ─── Parsing indicator ─────────────────────────────────── */

const ParsingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ParsingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-top-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  animation: ${spin} 0.8s linear infinite;
`;

const ParsingText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ─── Legend ────────────────────────────────────────────── */

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LegendDot = styled.span<{ variant: 'ready' | 'parsing' }>`
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ variant, theme }) =>
    variant === 'ready'
      ? (theme as StyledTheme).colorSuccess
      : (theme as StyledTheme).colorOutlineVariant};
  ${({ variant }) =>
    variant === 'parsing' &&
    `animation: ${pulse} 2s ease-in-out infinite;`}
`;

const LegendLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TableOverflowWrap = styled.div`
  overflow-x: auto;
`;

const RowTooltip = styled.div`
  position: fixed;
  z-index: 100;
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  pointer-events: none;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: normal;
  line-height: 1.4;
`;

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

const ParsingRowDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const handleParsingRowMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip({ x: e.clientX + 12, y: e.clientY - 40 });
  }, []);

  const handleParsingRowMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <PageContainer
      style={{ '--hover-bg': theme.colorSurfaceContainerLow } as React.CSSProperties}
    >
      {/* Top nav */}
      <TopNavContainer>
        <NavLogoArea>
          <svg width="26" height="19" viewBox="0 0 151 114" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18.1272 31.6091C18.1272 19.0691 11.8086 8.70545 0 0H27.4498C37.0831 7.46182 42.9874 18.8618 42.9874 31.6091C42.9874 44.3564 37.0831 55.7564 27.4498 63.2182C36.358 66.9491 41.4336 76.0691 41.4336 89.1273V114H16.5735V89.1273C16.5735 76.6909 10.6692 67.9855 0 63.2182C11.8086 54.5127 18.1272 44.1491 18.1272 31.6091ZM71.991 31.6091C71.991 19.0691 65.6723 8.70545 53.8637 0H81.3135C90.9468 7.46182 96.8511 18.8618 96.8511 31.6091C96.8511 44.3564 90.9468 55.7564 81.3135 63.2182C90.2218 66.9491 95.2974 76.0691 95.2974 89.1273V114H70.4372V89.1273C70.4372 76.6909 64.5329 67.9855 53.8637 63.2182C65.6723 54.5127 71.991 44.1491 71.991 31.6091ZM125.855 31.6091C125.855 19.0691 119.536 8.70545 107.727 0H135.177C144.811 7.46182 150.715 18.8618 150.715 31.6091C150.715 44.3564 144.811 55.7564 135.177 63.2182C144.085 66.9491 149.161 76.0691 149.161 89.1273V114H124.301V89.1273C124.301 76.6909 118.397 67.9855 107.727 63.2182C119.536 54.5127 125.855 44.1491 125.855 31.6091Z"
              fill="white"
            />
          </svg>
          <NavLogoDivider />
          <NavLogoText>Benefits</NavLogoText>
          <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} color={theme.colorOnPrimary} />
        </NavLogoArea>
      </TopNavContainer>

      <MainContent>
        <PageTitle>Parsing Row — UI Exploration</PageTitle>
        <PageSubtitle>
          Rows that are still being parsed from Salesforce show all column values except Issue count.
          They appear muted, are non-clickable, and display a tooltip on hover.
        </PageSubtitle>

        <LegendContainer>
          <LegendItem>
            <LegendDot variant="ready" />
            <LegendLabel>Ready — fully parsed, clickable</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendDot variant="parsing" />
            <LegendLabel>Parsing — syncing from Salesforce, not clickable</LegendLabel>
          </LegendItem>
        </LegendContainer>

        <TableCard>
          <TableToolbar>
            <ToolbarRow>
              <GridTitle>Error Reports</GridTitle>
              <div style={{ display: 'flex', gap: theme.space300 }}>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                  Assigned to me
                </Button>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                  <Icon type={Icon.TYPES.TABLE_COLUMN_OUTLINE} size={16} />
                </Button>
              </div>
            </ToolbarRow>
          </TableToolbar>

          <TableOverflowWrap>
            <StyledTable>
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 190 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 190 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 40 }} />
              </colgroup>
              <StyledTHead>
                <tr>
                  <th style={{ textAlign: 'center', paddingLeft: theme.space300, paddingRight: 0, width: 40 }}>
                    <input type="checkbox" disabled />
                  </th>
                  <th>SFDC</th>
                  <th>Company</th>
                  <th>Carrier</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>SLA</th>
                  <th>SLA</th>
                  <th>Created at</th>
                  <th>Issues</th>
                  <th />
                </tr>
              </StyledTHead>
              <tbody>
                {tableData.map((row) => (
                  <StyledTr
                    key={row.id}
                    isParsing={row.isParsing}
                    onMouseMove={row.isParsing ? handleParsingRowMouseMove : undefined}
                    onMouseLeave={row.isParsing ? handleParsingRowMouseLeave : undefined}
                  >
                    <CheckboxCell as="td" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <input type="checkbox" disabled={row.isParsing} />
                    </CheckboxCell>
                    <StyledTd><CellTextPrimary>{row.sfdc}</CellTextPrimary></StyledTd>
                    <StyledTd><CellText>{row.company}</CellText></StyledTd>
                    <StyledTd><CellText>{row.carrier}</CellText></StyledTd>
                    <StyledTd>
                      <AssigneeCell>
                        <Avatar title={row.assignee} type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
                        <AssigneeName>{row.assignee}</AssigneeName>
                      </AssigneeCell>
                    </StyledTd>
                    <StyledTd><CellText>{row.status}</CellText></StyledTd>
                    <StyledTd><CellTextMuted>{row.detailedStatus}</CellTextMuted></StyledTd>
                    <StyledTd>
                      <SlaContainer>
                        <SlaDot status={row.sla.status} />
                        <SlaText status={row.sla.status}>{row.sla.label}</SlaText>
                      </SlaContainer>
                    </StyledTd>
                    <StyledTd><CellTextMuted>{row.createdAt}</CellTextMuted></StyledTd>
                    <StyledTd>
                      {row.isParsing ? (
                        <ParsingBadge>
                          <ParsingSpinner />
                          <ParsingText>Parsing</ParsingText>
                        </ParsingBadge>
                      ) : (
                        <CellTextBold>{row.issues}</CellTextBold>
                      )}
                    </StyledTd>
                    <ChevronCell as="td">
                      {!row.isParsing && (
                        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurfaceVariant} />
                      )}
                    </ChevronCell>
                  </StyledTr>
                ))}
              </tbody>
            </StyledTable>
          </TableOverflowWrap>
        </TableCard>
      </MainContent>

      {tooltip && (
        <RowTooltip style={{ left: tooltip.x, top: tooltip.y }}>
          This error report is still being parsed from Salesforce. Issue details will be available within 60 minutes.
        </RowTooltip>
      )}
    </PageContainer>
  );
};

export default ParsingRowDemo;
