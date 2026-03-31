import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import {
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellText,
  CellTextBold,
  StatusDot,
  StatusCell,
} from './shared-styles';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

interface PosterItem {
  id: string;
  posterName: string;
  jurisdiction: string;
  status: 'created' | 'missing' | 'expiring';
  lastDistributed: string;
}

interface MailItem {
  id: string;
  mailType: string;
  entityEmployee: string;
  receivedDate: string;
  status: 'pending' | 'action-required' | 'processed';
  requiredAction: string;
}

const POSTERS: PosterItem[] = [
  { id: 'p1', posterName: 'Federal FLSA Minimum Wage', jurisdiction: 'Federal', status: 'created', lastDistributed: 'Jan 15, 2026' },
  { id: 'p2', posterName: 'California Paid Sick Leave', jurisdiction: 'California', status: 'expiring', lastDistributed: 'Sep 10, 2025' },
  { id: 'p3', posterName: 'New York Anti-Discrimination', jurisdiction: 'New York', status: 'created', lastDistributed: 'Feb 1, 2026' },
  { id: 'p4', posterName: 'Texas Workers Comp Notice', jurisdiction: 'Texas', status: 'missing', lastDistributed: '—' },
  { id: 'p5', posterName: 'OSHA Job Safety & Health', jurisdiction: 'Federal', status: 'created', lastDistributed: 'Jan 15, 2026' },
];

const MAILS: MailItem[] = [
  { id: 'm1', mailType: 'Wage Garnishment', entityEmployee: 'James Miller', receivedDate: 'Mar 5, 2026', status: 'action-required', requiredAction: 'Set up withholding within 5 days' },
  { id: 'm2', mailType: 'Tax Levy', entityEmployee: 'Rippling Inc.', receivedDate: 'Mar 3, 2026', status: 'pending', requiredAction: 'Route to Payroll Ops' },
  { id: 'm3', mailType: 'Employment Verification', entityEmployee: 'Sarah Chen', receivedDate: 'Mar 1, 2026', status: 'processed', requiredAction: 'Completed' },
  { id: 'm4', mailType: 'Child Support Order', entityEmployee: 'Robert Johnson', receivedDate: 'Feb 28, 2026', status: 'processed', requiredAction: 'Completed' },
  { id: 'm5', mailType: 'State Tax Notice', entityEmployee: 'Rippling Inc.', receivedDate: 'Feb 25, 2026', status: 'action-required', requiredAction: 'Respond within 30 days' },
];


/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const SectionCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PosterStatusBadge = styled.span<{ posterStatus: PosterItem['status'] }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ posterStatus }) => {
    switch (posterStatus) {
      case 'created': return 'rgb(46,125,50)';
      case 'expiring': return 'rgb(245,124,0)';
      default: return 'rgb(183,28,28)';
    }
  }};
`;

const MailStatusBadge = styled.span<{ mailStatus: MailItem['status'] }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  font-weight: 500;
  color: ${({ mailStatus }) => {
    switch (mailStatus) {
      case 'processed': return 'rgb(46,125,50)';
      case 'pending': return 'rgb(245,124,0)';
      default: return 'rgb(183,28,28)';
    }
  }};
`;

function posterStatusLabel(s: PosterItem['status']) {
  switch (s) { case 'created': return 'Created'; case 'expiring': return 'Expiring'; default: return 'Missing'; }
}

function posterDotVariant(s: PosterItem['status']): 'success' | 'warning' | 'error' {
  switch (s) { case 'created': return 'success'; case 'expiring': return 'warning'; default: return 'error'; }
}

function mailStatusLabel(s: MailItem['status']) {
  switch (s) { case 'processed': return 'Processed'; case 'pending': return 'Pending'; default: return 'Action required'; }
}

function mailDotVariant(s: MailItem['status']): 'success' | 'warning' | 'error' {
  switch (s) { case 'processed': return 'success'; case 'pending': return 'warning'; default: return 'error'; }
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export const OthersV3Tab: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* ── Workplace Posters ── */}
      <SectionBlock theme={theme}>
        <SectionHeaderRow theme={theme}>
          <SectionLeft theme={theme}>
            <SectionTitle theme={theme}>Workplace posters</SectionTitle>
            <SectionCount theme={theme}>· {POSTERS.length}</SectionCount>
          </SectionLeft>
        </SectionHeaderRow>

        <TableCard theme={theme}>
          <StyledTable>
            <StyledTHead theme={theme}>
              <tr>
                <StyledTh theme={theme}>Poster name</StyledTh>
                <StyledTh theme={theme}>Jurisdiction</StyledTh>
                <StyledTh theme={theme}>Status</StyledTh>
                <StyledTh theme={theme}>Last distributed</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {POSTERS.map(p => (
                <StyledTr key={p.id} theme={theme}>
                  <StyledTd theme={theme}><CellTextBold theme={theme}>{p.posterName}</CellTextBold></StyledTd>
                  <StyledTd theme={theme}><CellText theme={theme}>{p.jurisdiction}</CellText></StyledTd>
                  <StyledTd theme={theme}>
                    <StatusCell>
                      <StatusDot theme={theme} status={posterDotVariant(p.status)} />
                      <PosterStatusBadge theme={theme} posterStatus={p.status}>{posterStatusLabel(p.status)}</PosterStatusBadge>
                    </StatusCell>
                  </StyledTd>
                  <StyledTd theme={theme}><CellText theme={theme}>{p.lastDistributed}</CellText></StyledTd>
                </StyledTr>
              ))}
            </tbody>
          </StyledTable>
        </TableCard>
      </SectionBlock>

      {/* ── Mail Processing ── */}
      <SectionBlock theme={theme}>
        <SectionHeaderRow theme={theme}>
          <SectionLeft theme={theme}>
            <SectionTitle theme={theme}>Mail processing</SectionTitle>
            <SectionCount theme={theme}>· {MAILS.length}</SectionCount>
          </SectionLeft>
        </SectionHeaderRow>

        <TableCard theme={theme}>
          <StyledTable>
            <StyledTHead theme={theme}>
              <tr>
                <StyledTh theme={theme}>Mail type</StyledTh>
                <StyledTh theme={theme}>Entity / employee</StyledTh>
                <StyledTh theme={theme}>Received date</StyledTh>
                <StyledTh theme={theme}>Status</StyledTh>
                <StyledTh theme={theme}>Required action</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {MAILS.map(m => (
                <StyledTr key={m.id} theme={theme}>
                  <StyledTd theme={theme}><CellTextBold theme={theme}>{m.mailType}</CellTextBold></StyledTd>
                  <StyledTd theme={theme}><CellText theme={theme}>{m.entityEmployee}</CellText></StyledTd>
                  <StyledTd theme={theme}><CellText theme={theme}>{m.receivedDate}</CellText></StyledTd>
                  <StyledTd theme={theme}>
                    <StatusCell>
                      <StatusDot theme={theme} status={mailDotVariant(m.status)} />
                      <MailStatusBadge theme={theme} mailStatus={m.status}>{mailStatusLabel(m.status)}</MailStatusBadge>
                    </StatusCell>
                  </StyledTd>
                  <StyledTd theme={theme}><CellText theme={theme}>{m.requiredAction}</CellText></StyledTd>
                </StyledTr>
              ))}
            </tbody>
          </StyledTable>
        </TableCard>
      </SectionBlock>
    </TabContent>
  );
};
