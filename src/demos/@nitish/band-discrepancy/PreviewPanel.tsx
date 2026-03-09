import React from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import {
  SAMPLE_EDI_CONTENT, DISCREPANCY_ROWS, CENSUS_JSON, ATTACHMENTS,
  PreviewState, ErrorReportRow, AllErrorRow,
} from './data';
import {
  PreviewHeader, PreviewTitleArea, PreviewTitle,
  PreviewMetaBanner, PreviewMetaLabel, PreviewMetaValue,
  PreviewDescription, BadgeRow, OutlineBadge,
  CodeViewer, CodeViewerInner, LineNumbers, LineNumber, CodeContent,
  EmailHeader, EmailFieldRow, EmailFieldLabel, EmailFieldValue, EmailFieldValueBold,
  EmailBody, EmailBodyText, AttachmentItem, AttachmentInfo, AttachmentName, AttachmentSize,
  SeverityContainer, SummaryChip, SummaryChipText,
  StyledTable, StyledTHead, StyledTh, StyledTr, StyledTd,
  CellText, CellMono, PreviewContent,
} from './shared-styles';

/* ─── local styled helpers ──────────────────────────────────── */

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const EmailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AttachmentsSection = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AttachmentsLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SummaryChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SeverityDot = styled.span<{ severity: 'critical' | 'warning' | 'match' }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;

  ${({ severity, theme }) => {
    const t = theme as StyledTheme;
    switch (severity) {
      case 'critical':
        return `background-color: ${t.colorError};`;
      case 'warning':
        return `background-color: ${t.colorWarning};`;
      case 'match':
        return `background-color: ${t.colorSuccess};`;
    }
  }}
`;

const TableFooter = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

/* ─── severity badge ────────────────────────────────────────── */

function SeverityBadge({ severity }: { severity: 'critical' | 'warning' | 'match' }) {
  const { theme } = usePebbleTheme();
  const label = severity === 'critical' ? 'Mismatch' : severity === 'warning' ? 'Warning' : 'Match';

  let iconEl: React.ReactNode;
  if (severity === 'critical') {
    iconEl = <Icon type={Icon.TYPES.CLEAR} size={12} color={theme.colorError} />;
  } else if (severity === 'warning') {
    iconEl = <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={12} color={theme.colorWarning} />;
  } else {
    iconEl = <Icon type={Icon.TYPES.CHECK} size={12} color={theme.colorSuccess} />;
  }

  return (
    <SeverityContainer severity={severity}>
      {iconEl}
      {label}
    </SeverityContainer>
  );
}

/* ─── helper: render line-numbered code viewer ──────────────── */

function renderCodeViewer(content: string) {
  const lines = content.split('\n');
  return (
    <CodeViewer>
      <CodeViewerInner>
        <LineNumbers>
          {lines.map((_, i) => (
            <LineNumber key={i}>{i + 1}</LineNumber>
          ))}
        </LineNumbers>
        <CodeContent>{content}</CodeContent>
      </CodeViewerInner>
    </CodeViewer>
  );
}

/* ─── helper: render email attachments list ─────────────────── */

function renderAttachments() {
  return (
    <AttachmentsSection>
      <AttachmentsLabel>Attachments ({ATTACHMENTS.length})</AttachmentsLabel>
      {ATTACHMENTS.map((att) => (
        <AttachmentItem key={att.name}>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={16} />
          <AttachmentInfo>
            <AttachmentName>{att.name}</AttachmentName>
            <AttachmentSize>{att.size}</AttachmentSize>
          </AttachmentInfo>
        </AttachmentItem>
      ))}
    </AttachmentsSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EDI Preview
   ═══════════════════════════════════════════════════════════════ */

interface EdiPreviewProps {
  company: string;
  carrier: string;
  transmissionId: string;
  transmissionDate: string;
  onCopy: () => void;
}

export function EdiPreview({ company, carrier, transmissionId, transmissionDate, onCopy }: EdiPreviewProps) {
  return (
    <PreviewContent>
      <PreviewHeader>
        <PreviewTitleArea>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={16} />
          <PreviewTitle>EDI 834 File Preview</PreviewTitle>
        </PreviewTitleArea>
        <ButtonGroup>
          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={onCopy}>
            <Icon type={Icon.TYPES.COPY_OUTLINE} size={12} /> Copy
          </Button>
          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
            <Icon type={Icon.TYPES.DOWNLOAD} size={12} /> Download
          </Button>
        </ButtonGroup>
      </PreviewHeader>

      <PreviewMetaBanner>
        <PreviewMetaLabel>Transmission ID:</PreviewMetaLabel>
        <PreviewMetaValue>{transmissionId}</PreviewMetaValue>
        <PreviewMetaLabel style={{ marginLeft: 'auto' }}>Date:</PreviewMetaLabel>
        <PreviewMetaValue>{transmissionDate}</PreviewMetaValue>
      </PreviewMetaBanner>

      <PreviewDescription>
        Benefit Enrollment and Maintenance (834) transaction for {company} / {carrier}
      </PreviewDescription>

      <BadgeRow>
        <OutlineBadge>Version: 005010X220A1</OutlineBadge>
        <OutlineBadge>Type: 834</OutlineBadge>
        <OutlineBadge>Segments: 26</OutlineBadge>
      </BadgeRow>

      {renderCodeViewer(SAMPLE_EDI_CONTENT)}
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Census Preview
   ═══════════════════════════════════════════════════════════════ */

interface CensusPreviewProps {
  transmissionId: string;
  transmissionDate: string;
}

export function CensusPreview({ transmissionId, transmissionDate }: CensusPreviewProps) {
  const jsonContent = JSON.stringify(CENSUS_JSON, null, 2);

  return (
    <PreviewContent>
      <PreviewHeader>
        <PreviewTitleArea>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={16} />
          <PreviewTitle>Census JSON Preview</PreviewTitle>
        </PreviewTitleArea>
        <ButtonGroup>
          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
            <Icon type={Icon.TYPES.COPY_OUTLINE} size={12} /> Copy
          </Button>
          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
            <Icon type={Icon.TYPES.DOWNLOAD} size={12} /> Download
          </Button>
        </ButtonGroup>
      </PreviewHeader>

      <PreviewMetaBanner>
        <PreviewMetaLabel>Transmission ID:</PreviewMetaLabel>
        <PreviewMetaValue>{transmissionId}</PreviewMetaValue>
        <PreviewMetaLabel style={{ marginLeft: 'auto' }}>Date:</PreviewMetaLabel>
        <PreviewMetaValue>{transmissionDate}</PreviewMetaValue>
      </PreviewMetaBanner>

      <PreviewDescription>
        Census enrollment data snapshot for carrier reconciliation
      </PreviewDescription>

      <BadgeRow>
        <OutlineBadge>Format: JSON</OutlineBadge>
        <OutlineBadge>Plans: 3</OutlineBadge>
        <OutlineBadge>Subscribers: 304</OutlineBadge>
      </BadgeRow>

      {renderCodeViewer(jsonContent)}
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Attachment Preview (Discrepancy Report)
   ═══════════════════════════════════════════════════════════════ */

interface AttachmentPreviewProps {
  filename: string;
}

export function AttachmentPreview({ filename }: AttachmentPreviewProps) {
  const criticalCount = DISCREPANCY_ROWS.filter((r) => r.severity === 'critical').length;
  const warningCount = DISCREPANCY_ROWS.filter((r) => r.severity === 'warning').length;
  const matchCount = DISCREPANCY_ROWS.filter((r) => r.severity === 'match').length;

  return (
    <PreviewContent>
      <PreviewHeader>
        <PreviewTitleArea>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={16} />
          <PreviewTitle>Cigna Eligibility Discrepancy Report</PreviewTitle>
        </PreviewTitleArea>
        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
          <Icon type={Icon.TYPES.DOWNLOAD} size={12} /> Export CSV
        </Button>
      </PreviewHeader>

      <PreviewDescription>
        834 enrollment comparison for Group 00654277 &middot; {filename}
      </PreviewDescription>

      <SummaryChipsRow>
        <SummaryChip>
          <SeverityDot severity="critical" />
          <SummaryChipText>{criticalCount} Mismatches</SummaryChipText>
        </SummaryChip>
        <SummaryChip>
          <SeverityDot severity="warning" />
          <SummaryChipText>{warningCount} Warnings</SummaryChipText>
        </SummaryChip>
        <SummaryChip>
          <SeverityDot severity="match" />
          <SummaryChipText>{matchCount} Matches</SummaryChipText>
        </SummaryChip>
      </SummaryChipsRow>

      <TableWrapper>
        <StyledTable>
          <StyledTHead>
            <tr>
              <StyledTh>Field</StyledTh>
              <StyledTh>Source Value</StyledTh>
              <StyledTh>Cigna Value</StyledTh>
              <StyledTh>Result</StyledTh>
            </tr>
          </StyledTHead>
          <tbody>
            {DISCREPANCY_ROWS.map((row) => (
              <StyledTr key={row.id}>
                <StyledTd><CellText>{row.field}</CellText></StyledTd>
                <StyledTd><CellMono>{row.sourceValue}</CellMono></StyledTd>
                <StyledTd><CellMono>{row.carrierValue}</CellMono></StyledTd>
                <StyledTd><SeverityBadge severity={row.severity} /></StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
        <TableFooter>
          {DISCREPANCY_ROWS.length} fields compared &middot; Cigna feed 02/10/2025 12:05 PM EST
        </TableFooter>
      </TableWrapper>
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Email Preview – ErrorReportRow variant
   ═══════════════════════════════════════════════════════════════ */

interface EmailPreviewERProps {
  row: ErrorReportRow;
}

export function EmailPreviewER({ row }: EmailPreviewERProps) {
  return (
    <PreviewContent>
      <PreviewHeader>
        <PreviewTitleArea>
          <Icon type={Icon.TYPES.EMAIL_OUTLINE} size={16} />
          <PreviewTitle>Email Preview</PreviewTitle>
        </PreviewTitleArea>
      </PreviewHeader>

      <EmailContainer>
        <EmailHeader>
          <EmailFieldRow>
            <EmailFieldLabel>From</EmailFieldLabel>
            <EmailFieldValue>{row.senderEmail}</EmailFieldValue>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>To</EmailFieldLabel>
            <EmailFieldValue>benefits-team@acme.com</EmailFieldValue>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>Subject</EmailFieldLabel>
            <EmailFieldValueBold>Eligibility Discrepancy &ndash; {row.company} / {row.carrier}</EmailFieldValueBold>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>Date</EmailFieldLabel>
            <EmailFieldValue>{row.createdAt}</EmailFieldValue>
          </EmailFieldRow>
        </EmailHeader>

        <EmailBody>
          <EmailBodyText>{row.emailBody}</EmailBodyText>
        </EmailBody>

        {renderAttachments()}
      </EmailContainer>
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Email Preview – AllErrorRow variant
   ═══════════════════════════════════════════════════════════════ */

interface EmailPreviewAEProps {
  row: AllErrorRow;
}

export function EmailPreviewAE({ row }: EmailPreviewAEProps) {
  return (
    <PreviewContent>
      <PreviewHeader>
        <PreviewTitleArea>
          <Icon type={Icon.TYPES.EMAIL_OUTLINE} size={16} />
          <PreviewTitle>Email Preview</PreviewTitle>
        </PreviewTitleArea>
      </PreviewHeader>

      <EmailContainer>
        <EmailHeader>
          <EmailFieldRow>
            <EmailFieldLabel>From</EmailFieldLabel>
            <EmailFieldValue>{row.senderEmail}</EmailFieldValue>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>To</EmailFieldLabel>
            <EmailFieldValue>benefits-team@acme.com</EmailFieldValue>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>Subject</EmailFieldLabel>
            <EmailFieldValueBold>Eligibility Discrepancy &ndash; {row.company} / {row.carrier}</EmailFieldValueBold>
          </EmailFieldRow>
          <EmailFieldRow>
            <EmailFieldLabel>Date</EmailFieldLabel>
            <EmailFieldValue>{row.createdAt}</EmailFieldValue>
          </EmailFieldRow>
        </EmailHeader>

        <EmailBody>
          <EmailBodyText>{row.emailBody}</EmailBodyText>
        </EmailBody>

        {renderAttachments()}
      </EmailContainer>
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   getPreviewLabel
   ═══════════════════════════════════════════════════════════════ */

export function getPreviewLabel(preview: PreviewState): string {
  switch (preview.type) {
    case 'edi':
      return `EDI 834 File -- ${preview.transmissionDate}`;
    case 'census':
      return `Census Data -- ${preview.transmissionDate}`;
    case 'attachment':
      return preview.filename;
    case 'email':
      return 'Email';
  }
}
