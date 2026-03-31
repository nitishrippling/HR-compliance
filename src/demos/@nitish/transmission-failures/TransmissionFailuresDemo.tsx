import React, { useState, useCallback, useMemo } from 'react';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import Tip from '@rippling/pebble/Tip';
import Label from '@rippling/pebble/Label';
import Tabs from '@rippling/pebble/Tabs';
import Modal from '@rippling/pebble/Modal';
import { usePebbleTheme } from '@/utils/theme';
import {
  EdiError, ApiEmployeeError, TransmissionAttempt, PreviewState,
  SAMPLE_CENSUS_JSON,
  EDI_TRANSMISSIONS, ROOT_CAUSE_OPTIONS, STATUS_DETAIL_OPTIONS, ANALYST_LIST,
  ediErrorsData, apiGroupErrorsData,
} from './data';
import {
  PageContainer, TopNavContainer, NavLogoArea, NavLogoDivider, NavLogoText,
  NavSearchWrapper, NavSearchInput, NavSearchIconWrapper, NavIconsArea,
  NavIconButton, NavCompanyInfo, NavCompanyName,
  MainContent, PageTitle, TabsWrapper,
  TableCard, TableToolbar, ToolbarRow, GridTitle, ToolbarActions,
  ScrollableTableContainer, StyledTable, StyledTHead, StyledTh, StyledTr, StyledTd,
  StickyChevronCell, StickyChevronTh,
  CellText, CellTextMuted, CellMono, AssigneeCell, AssigneeName, JiraLink,
  Breadcrumb, BreadcrumbLink, BreadcrumbCurrent,
  TwoColumnLayout, LeftColumn, RightColumn,
  DetailTitle, DetailHeader, DetailActions, QuickActionRow,
  InfoCard, InfoRow, InfoItem, InfoLabel, InfoValue, CopyButton,
  ErrorSection, ErrorDetailText,
  FormRow, FormField, FormLabel, NativeSelect, NativeInput,
  SectionTitle, TransmissionCard, TransmissionMeta, TransmissionDivider, TransmissionBtns,
  ExpandButton, StatusDot,
  BottomTabBar, BottomTabButton, CommentArea, ActivityPlaceholder,
  PreviewBanner, PreviewBannerText, PreviewBannerHighlight,
  PreviewContent, PreviewHeader, PreviewTitle, PreviewActions,
  CodeViewer, CodeViewerInner, LineNumbers, LineNumber, CodeContent,
  OutlineBadge,
  RecurrenceDots, RecurrenceDot,
  WorkloadStrip,
} from './shared-styles';

type ViewState =
  | { view: 'list'; tab?: number }
  | { view: 'edi-detail'; id: string }
  | { view: 'api-group'; id: string }
  | { view: 'api-employee'; groupId: string; employeeId: string };

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */

function RipplingLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="white" />
      <path d="M6 7h12M6 12h12M6 17h12" stroke="#7A005D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TopNav() {
  return (
    <TopNavContainer>
      <NavLogoArea>
        <RipplingLogo />
        <NavLogoDivider />
        <NavLogoText>Benefits</NavLogoText>
        <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} color="rgba(255,255,255,0.7)" />
      </NavLogoArea>
      <NavSearchWrapper>
        <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <NavSearchIconWrapper>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color="rgba(255,255,255,0.55)" />
          </NavSearchIconWrapper>
          <NavSearchInput placeholder="Search..." />
        </div>
      </NavSearchWrapper>
      <NavIconsArea>
        <NavIconButton aria-label="Help">
          <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={16} color="rgba(255,255,255,0.85)" />
        </NavIconButton>
        <NavIconButton aria-label="Notifications">
          <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={16} color="rgba(255,255,255,0.85)" />
        </NavIconButton>
        <NavIconButton aria-label="Settings">
          <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={16} color="rgba(255,255,255,0.85)" />
        </NavIconButton>
        <NavCompanyInfo>
          <Avatar title="Acme Corp" type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
          <NavCompanyName>Acme Corp</NavCompanyName>
        </NavCompanyInfo>
      </NavIconsArea>
    </TopNavContainer>
  );
}

function StatusBadge({ status }: { status: 'Open' | 'In Progress' | 'Resolved' }) {
  const appearance =
    status === 'Open' ? Label.APPEARANCES.WARNING
    : status === 'In Progress' ? Label.APPEARANCES.PRIMARY
    : Label.APPEARANCES.SUCCESS;
  return <Label size={Label.SIZES.S} appearance={appearance}>{status}</Label>;
}

function useRecurrenceHelpers() {
  const { theme } = usePebbleTheme();
  const getColor = (r: number) => {
    if (r >= 3) return theme.colorError;
    if (r >= 2) return theme.colorWarning;
    return theme.colorOnSurfaceVariant;
  };
  const getLabel = (r: number) => {
    if (r === 1) return '1st occurrence';
    if (r === 2) return '2nd failure';
    return `${r}${r === 3 ? 'rd' : 'th'} failure`;
  };
  return { getColor, getLabel };
}

function RecurrenceDisplay({ recurrence }: { recurrence: number }) {
  const { getColor, getLabel } = useRecurrenceHelpers();
  const { theme } = usePebbleTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200, whiteSpace: 'nowrap' }}>
      <span style={{ color: getColor(recurrence) }}>{getLabel(recurrence)}</span>
      <RecurrenceDots>
        {Array.from({ length: Math.min(recurrence, 5) }).map((_, i) => (
          <RecurrenceDot key={i} active color={getColor(recurrence)} />
        ))}
      </RecurrenceDots>
    </div>
  );
}

function AnalystWorkloadStrip({
  data,
  selectedAnalyst,
  onToggleAnalyst,
}: {
  data: { name: string; count: number }[];
  selectedAnalyst: string | null;
  onToggleAnalyst: (name: string) => void;
}) {
  return (
    <WorkloadStrip>
      {data.map((d) => (
        <Button
          key={d.name}
          size={Button.SIZES.S}
          appearance={selectedAnalyst === d.name ? Button.APPEARANCES.PRIMARY : Button.APPEARANCES.OUTLINE}
          onClick={() => onToggleAnalyst(d.name)}
        >
          {d.name.split(' ')[0]} ({d.count})
        </Button>
      ))}
    </WorkloadStrip>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Resolve Modal (Pebble Modal)
   ═══════════════════════════════════════════════════════════════ */

function ResolveModal({
  isVisible,
  onClose,
  onResolve,
  currentRootCause,
}: {
  isVisible: boolean;
  onClose: () => void;
  onResolve: (rootCause: string, comment: string) => void;
  currentRootCause: string;
}) {
  const [rc, setRc] = useState(currentRootCause);
  const [comment, setComment] = useState('');
  const canSubmit = rc && comment.trim().length > 0;

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Mark as Resolved"
    >
      <div style={{ padding: 4 }}>
        <FormField style={{ marginBottom: 16 }}>
          <FormLabel>Root Cause (required)</FormLabel>
          <NativeSelect value={rc} onChange={(e) => setRc(e.target.value)}>
            <option value="">Select root cause...</option>
            {ROOT_CAUSE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField>
          <FormLabel>Resolution Comment (required)</FormLabel>
          <CommentArea
            placeholder="Describe how this was resolved..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormField>
      </div>
      <Modal.Footer>
        <Button
          size={Button.SIZES.S}
          appearance={Button.APPEARANCES.OUTLINE}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size={Button.SIZES.S}
          appearance={Button.APPEARANCES.PRIMARY}
          onClick={() => canSubmit && onResolve(rc, comment)}
          isDisabled={!canSubmit}
        >
          Confirm Resolution
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Census Preview Panel
   ═══════════════════════════════════════════════════════════════ */

function CensusPreviewPanel({ preview }: { preview: PreviewState }) {
  const lines = JSON.stringify(SAMPLE_CENSUS_JSON, null, 2).split('\n');
  return (
    <PreviewContent>
      <PreviewBanner>
        <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={14} />
        <PreviewBannerText>
          Currently viewing: <PreviewBannerHighlight>Census JSON</PreviewBannerHighlight>
        </PreviewBannerText>
      </PreviewBanner>
      <PreviewHeader>
        <PreviewTitle>Census &middot; {preview.transmissionId}</PreviewTitle>
        <PreviewActions>
          <Tip content="Copy to clipboard">
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
              <Icon type={Icon.TYPES.COPY_OUTLINE} size={12} /> Copy
            </Button>
          </Tip>
          <Tip content="Download file">
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
              <Icon type={Icon.TYPES.DOWNLOAD} size={12} /> Download
            </Button>
          </Tip>
        </PreviewActions>
      </PreviewHeader>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <OutlineBadge>{preview.transmissionDate}</OutlineBadge>
        <OutlineBadge>{preview.transmissionId}</OutlineBadge>
        <OutlineBadge>Census JSON</OutlineBadge>
      </div>
      <CodeViewer>
        <CodeViewerInner>
          <LineNumbers>
            {lines.map((_, i) => <LineNumber key={i}>{i + 1}</LineNumber>)}
          </LineNumbers>
          <CodeContent>{lines.join('\n')}</CodeContent>
        </CodeViewerInner>
      </CodeViewer>
    </PreviewContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Transmission History
   ═══════════════════════════════════════════════════════════════ */

function TransmissionHistory({
  transmissions,
  onViewCensus,
}: {
  transmissions: TransmissionAttempt[];
  onViewCensus?: (t: TransmissionAttempt) => void;
}) {
  const { theme } = usePebbleTheme();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? transmissions : transmissions.slice(0, 2);

  return (
    <div style={{ marginBottom: theme.space600 }}>
      <SectionTitle style={{ marginBottom: theme.space300 }}>Transmission History</SectionTitle>
      {visible.map((t) => (
        <TransmissionCard key={t.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.space300, flex: 1, minWidth: 0 }}>
            <StatusDot color={t.status === 'Success' ? theme.colorSuccess : theme.colorError} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
                <span style={{ fontWeight: 500 }}>{t.id}</span>
                {t.status === 'Failed' && t.assignedTo && (
                  <>
                    <TransmissionDivider />
                    <TransmissionMeta>{t.assignedTo}</TransmissionMeta>
                  </>
                )}
              </div>
              <TransmissionMeta>
                {t.date} &middot; {t.time}
                {t.eventType && <> &middot; {t.eventType}</>}
              </TransmissionMeta>
              {t.error && (
                <div>
                  <TransmissionMeta style={{ color: theme.colorError }}>{t.error}</TransmissionMeta>
                </div>
              )}
            </div>
          </div>
          <TransmissionBtns>
            {onViewCensus && (
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => onViewCensus(t)}>
                View Census
              </Button>
            )}
          </TransmissionBtns>
        </TransmissionCard>
      ))}
      {transmissions.length > 2 && (
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          <Icon type={expanded ? Icon.TYPES.CHEVRON_UP : Icon.TYPES.CHEVRON_DOWN} size={12} />
          {expanded ? 'Hide' : `Show ${transmissions.length - 2} older`}
        </ExpandButton>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main List View
   ═══════════════════════════════════════════════════════════════ */

function ListView({ onNavigate, initialTab = 0 }: { onNavigate: (vs: ViewState) => void; initialTab?: number }) {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ediAnalystFilter, setEdiAnalystFilter] = useState<string | null>(null);
  const [apiAnalystFilter, setApiAnalystFilter] = useState<string | null>(null);

  const allEdiData = useMemo(() =>
    [...ediErrorsData]
      .filter((e) => e.status === 'Open' || e.status === 'In Progress')
      .sort((a, b) => b.recurrence - a.recurrence),
  []);

  const filteredEdiData = useMemo(() =>
    ediAnalystFilter ? allEdiData.filter((e) => e.assignedTo === ediAnalystFilter) : allEdiData,
  [allEdiData, ediAnalystFilter]);

  const filteredApiData = useMemo(() =>
    apiAnalystFilter ? apiGroupErrorsData.filter((g) => g.assignedTo === apiAnalystFilter) : apiGroupErrorsData,
  [apiAnalystFilter]);

  const flattenedApiData = useMemo(() => {
    if (!apiAnalystFilter) return [];
    const flat: { groupId: string; client: string; carrier: string; emp: ApiEmployeeError }[] = [];
    apiGroupErrorsData.forEach((g) => {
      g.employees
        .filter((e) => e.assignedTo === apiAnalystFilter)
        .forEach((e) => flat.push({ groupId: g.id, client: g.client, carrier: g.carrier, emp: e }));
    });
    return flat;
  }, [apiAnalystFilter]);

  const ediWorkload = useMemo(() => {
    const map = new Map<string, number>();
    allEdiData.forEach((e) => { map.set(e.assignedTo, (map.get(e.assignedTo) || 0) + 1); });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [allEdiData]);

  const apiWorkload = useMemo(() => {
    const map = new Map<string, number>();
    apiGroupErrorsData.forEach((g) => { map.set(g.assignedTo, (map.get(g.assignedTo) || 0) + g.activeErrors); });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, []);

  return (
    <MainContent>
      <PageTitle>Transmission Failures</PageTitle>
      <TabsWrapper>
        <Tabs.SWITCH activeIndex={activeTab} onChange={(i) => setActiveTab(Number(i))}>
          <Tabs.Tab title="EDI" />
          <Tabs.Tab title="API" />
        </Tabs.SWITCH>
      </TabsWrapper>

      {activeTab === 0 && (
        <>
          <AnalystWorkloadStrip
            data={ediWorkload}
            selectedAnalyst={ediAnalystFilter}
            onToggleAnalyst={(name) => setEdiAnalystFilter((prev) => prev === name ? null : name)}
          />
          <TableCard>
            <TableToolbar>
              <ToolbarRow>
                <GridTitle>EDI Failures ({filteredEdiData.length})</GridTitle>
                <ToolbarActions>
                  <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                    <Icon type={Icon.TYPES.DOWNLOAD} size={14} /> Export
                  </Button>
                </ToolbarActions>
              </ToolbarRow>
            </TableToolbar>
            <ScrollableTableContainer>
              <StyledTable>
                <StyledTHead>
                  <tr>
                    <StyledTh style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </StyledTh>
                    <StyledTh>Client</StyledTh>
                    <StyledTh>Carrier</StyledTh>
                    <StyledTh>Group ID</StyledTh>
                    <StyledTh>Group CID</StyledTh>
                    <StyledTh>Employees Affected</StyledTh>
                    <StyledTh>Date</StyledTh>
                    <StyledTh>Error</StyledTh>
                    <StyledTh>Recurrence</StyledTh>
                    <StyledTh>Root Cause</StyledTh>
                    <StyledTh>Status</StyledTh>
                    <StyledTh>Status Detail</StyledTh>
                    <StyledTh>Assigned To</StyledTh>
                    <StyledTh>Jira</StyledTh>
                    <StyledTh>Latest Comment</StyledTh>
                    <StyledTh>Skip</StyledTh>
                    <StyledTh>Env</StyledTh>
                    <StickyChevronTh />
                  </tr>
                </StyledTHead>
                <tbody>
                  {filteredEdiData.map((row) => (
                    <StyledTr key={row.id} onClick={() => onNavigate({ view: 'edi-detail', id: row.id })}>
                      <StyledTd style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </StyledTd>
                      <StyledTd><CellText>{row.client}</CellText></StyledTd>
                      <StyledTd><CellText>{row.carrier}</CellText></StyledTd>
                      <StyledTd><CellMono>{row.groupId}</CellMono></StyledTd>
                      <StyledTd><CellMono>{row.groupCid.substring(0, 12)}...</CellMono></StyledTd>
                      <StyledTd><CellText>{row.employeeCount}</CellText></StyledTd>
                      <StyledTd><CellTextMuted>{row.transmissionDate}</CellTextMuted></StyledTd>
                      <StyledTd>
                        <Tip content={row.error}><CellText>{row.error}</CellText></Tip>
                      </StyledTd>
                      <StyledTd><RecurrenceDisplay recurrence={row.recurrence} /></StyledTd>
                      <StyledTd><CellText>{row.rootCause}</CellText></StyledTd>
                      <StyledTd><CellText>{row.status}</CellText></StyledTd>
                      <StyledTd>
                        <Tip content={row.statusDetail}><CellTextMuted>{row.statusDetail}</CellTextMuted></Tip>
                      </StyledTd>
                      <StyledTd>
                        <AssigneeCell>
                          <Avatar title={row.assignedTo} size={Avatar.SIZES.XS} isCompact />
                          <AssigneeName>{row.assignedTo}</AssigneeName>
                        </AssigneeCell>
                      </StyledTd>
                      <StyledTd>
                        {row.jiraCaseId ? (
                          <JiraLink onClick={(e) => { e.stopPropagation(); window.open(`https://rippling.atlassian.net/browse/${row.jiraCaseId}`, '_blank'); }}>
                            {row.jiraCaseId} <Icon type={Icon.TYPES.LINK_OUTLET} size={10} />
                          </JiraLink>
                        ) : (
                          <JiraLink onClick={(e) => { e.stopPropagation(); }}>
                            + Create <Icon type={Icon.TYPES.PLUS} size={10} />
                          </JiraLink>
                        )}
                      </StyledTd>
                      <StyledTd>
                        <Tip content={row.latestComment}><CellTextMuted>{row.latestComment || '—'}</CellTextMuted></Tip>
                      </StyledTd>
                      <StyledTd><CellText>{row.skipTransmission ? 'Yes' : 'No'}</CellText></StyledTd>
                      <StyledTd><CellText>{row.environment === 'Production' ? 'Prod' : 'Test'}</CellText></StyledTd>
                      <StickyChevronCell>
                        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} />
                      </StickyChevronCell>
                    </StyledTr>
                  ))}
                </tbody>
              </StyledTable>
            </ScrollableTableContainer>
          </TableCard>
        </>
      )}

      {activeTab === 1 && (
        <>
          <AnalystWorkloadStrip
            data={apiWorkload}
            selectedAnalyst={apiAnalystFilter}
            onToggleAnalyst={(name) => setApiAnalystFilter((prev) => prev === name ? null : name)}
          />

          {apiAnalystFilter ? (
            <TableCard>
              <TableToolbar>
                <ToolbarRow>
                  <GridTitle>Errors assigned to {apiAnalystFilter.split(' ')[0]} ({flattenedApiData.length})</GridTitle>
                  <ToolbarActions>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      <Icon type={Icon.TYPES.DOWNLOAD} size={14} /> Export
                    </Button>
                  </ToolbarActions>
                </ToolbarRow>
              </TableToolbar>
              <ScrollableTableContainer>
                <StyledTable>
                  <StyledTHead>
                    <tr>
                      <StyledTh style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </StyledTh>
                      <StyledTh>Client</StyledTh>
                      <StyledTh>Carrier</StyledTh>
                      <StyledTh>Employee Name</StyledTh>
                      <StyledTh>Role ID</StyledTh>
                      <StyledTh>Event Type</StyledTh>
                      <StyledTh>Error</StyledTh>
                      <StyledTh>Recurrence</StyledTh>
                      <StyledTh>Status</StyledTh>
                      <StyledTh>Status Detail</StyledTh>
                      <StyledTh>Assigned To</StyledTh>
                      <StickyChevronTh />
                    </tr>
                  </StyledTHead>
                  <tbody>
                    {flattenedApiData.map((row) => (
                      <StyledTr key={row.emp.id} onClick={() => onNavigate({ view: 'api-employee', groupId: row.groupId, employeeId: row.emp.id })}>
                        <StyledTd style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                          <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                        </StyledTd>
                        <StyledTd><CellText>{row.client}</CellText></StyledTd>
                        <StyledTd><CellText>{row.carrier}</CellText></StyledTd>
                        <StyledTd>
                          <AssigneeCell>
                            <Avatar title={row.emp.employeeName} size={Avatar.SIZES.XS} isCompact />
                            <CellText>{row.emp.employeeName}</CellText>
                          </AssigneeCell>
                        </StyledTd>
                        <StyledTd><CellMono>{row.emp.roleId}</CellMono></StyledTd>
                        <StyledTd><CellText>{row.emp.eventType}</CellText></StyledTd>
                        <StyledTd>
                          <Tip content={row.emp.error}><CellTextMuted>{row.emp.error}</CellTextMuted></Tip>
                        </StyledTd>
                        <StyledTd><RecurrenceDisplay recurrence={row.emp.recurrence} /></StyledTd>
                        <StyledTd><CellText>{row.emp.status}</CellText></StyledTd>
                        <StyledTd>
                          <Tip content={row.emp.statusDetail}><CellTextMuted>{row.emp.statusDetail}</CellTextMuted></Tip>
                        </StyledTd>
                        <StyledTd>
                          <AssigneeCell>
                            <Avatar title={row.emp.assignedTo} size={Avatar.SIZES.XS} isCompact />
                            <AssigneeName>{row.emp.assignedTo}</AssigneeName>
                          </AssigneeCell>
                        </StyledTd>
                        <StickyChevronCell>
                          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} />
                        </StickyChevronCell>
                      </StyledTr>
                    ))}
                  </tbody>
                </StyledTable>
              </ScrollableTableContainer>
            </TableCard>
          ) : (
            <TableCard>
              <TableToolbar>
                <ToolbarRow>
                  <GridTitle>API Failures ({filteredApiData.length} groups)</GridTitle>
                  <ToolbarActions>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      <Icon type={Icon.TYPES.DOWNLOAD} size={14} /> Export
                    </Button>
                  </ToolbarActions>
                </ToolbarRow>
              </TableToolbar>
              <ScrollableTableContainer>
                <StyledTable>
                  <StyledTHead>
                    <tr>
                      <StyledTh style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </StyledTh>
                      <StyledTh>Client</StyledTh>
                      <StyledTh>Carrier</StyledTh>
                      <StyledTh>Group ID</StyledTh>
                      <StyledTh>Group CID</StyledTh>
                      <StyledTh>Active Errors</StyledTh>
                      <StyledTh>Oldest Error</StyledTh>
                      <StyledTh>Root Cause</StyledTh>
                      <StyledTh>Status</StyledTh>
                      <StyledTh>Status Detail</StyledTh>
                      <StyledTh>Assigned To</StyledTh>
                      <StyledTh>Jira</StyledTh>
                      <StyledTh>Latest Comment</StyledTh>
                      <StyledTh>Skip</StyledTh>
                      <StyledTh>Env</StyledTh>
                      <StickyChevronTh />
                    </tr>
                  </StyledTHead>
                  <tbody>
                    {filteredApiData.map((row) => (
                      <StyledTr key={row.id} onClick={() => onNavigate({ view: 'api-group', id: row.id })}>
                        <StyledTd style={{ width: 36, minWidth: 36, textAlign: 'center' }}>
                          <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                        </StyledTd>
                        <StyledTd><CellText>{row.client}</CellText></StyledTd>
                        <StyledTd><CellText>{row.carrier}</CellText></StyledTd>
                        <StyledTd><CellMono>{row.groupId}</CellMono></StyledTd>
                        <StyledTd><CellMono>{row.groupCid}</CellMono></StyledTd>
                        <StyledTd>
                          <Label size={Label.SIZES.S} appearance={row.activeErrors >= 3 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.WARNING}>
                            {String(row.activeErrors)}
                          </Label>
                        </StyledTd>
                        <StyledTd><CellTextMuted>{row.oldestError}</CellTextMuted></StyledTd>
                        <StyledTd><CellText>{row.rootCause}</CellText></StyledTd>
                        <StyledTd><CellText>{row.status}</CellText></StyledTd>
                        <StyledTd>
                          <Tip content={row.statusDetail}><CellTextMuted>{row.statusDetail}</CellTextMuted></Tip>
                        </StyledTd>
                        <StyledTd>
                          <AssigneeCell>
                            <Avatar title={row.assignedTo} size={Avatar.SIZES.XS} isCompact />
                            <AssigneeName>{row.assignedTo}</AssigneeName>
                          </AssigneeCell>
                        </StyledTd>
                        <StyledTd>
                          {row.jiraCaseId ? (
                            <JiraLink onClick={(e) => { e.stopPropagation(); window.open(`https://rippling.atlassian.net/browse/${row.jiraCaseId}`, '_blank'); }}>
                              {row.jiraCaseId} <Icon type={Icon.TYPES.LINK_OUTLET} size={10} />
                            </JiraLink>
                          ) : (
                            <JiraLink onClick={(e) => { e.stopPropagation(); }}>
                              + Create <Icon type={Icon.TYPES.PLUS} size={10} />
                            </JiraLink>
                          )}
                        </StyledTd>
                        <StyledTd>
                          <Tip content={row.latestComment}><CellTextMuted>{row.latestComment || '—'}</CellTextMuted></Tip>
                        </StyledTd>
                        <StyledTd><CellText>{row.skipTransmission ? 'Yes' : 'No'}</CellText></StyledTd>
                        <StyledTd><CellText>{row.environment === 'Production' ? 'Prod' : 'Test'}</CellText></StyledTd>
                        <StickyChevronCell>
                          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} />
                        </StickyChevronCell>
                      </StyledTr>
                    ))}
                  </tbody>
                </StyledTable>
              </ScrollableTableContainer>
            </TableCard>
          )}
        </>
      )}
    </MainContent>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EDI Detail View
   ═══════════════════════════════════════════════════════════════ */

function EdiDetailView({ id, onNavigate }: { id: string; onNavigate: (vs: ViewState) => void }) {
  const { theme } = usePebbleTheme();
  const edi = ediErrorsData.find((e) => e.id === id) || ediErrorsData[0];

  const [status, setStatus] = useState(edi.status);
  const [statusDetail, setStatusDetail] = useState(edi.statusDetail);
  const [rootCause, setRootCause] = useState(edi.rootCause);
  const [assignee, setAssignee] = useState(edi.assignedTo);
  const [jiraId, setJiraId] = useState(edi.jiraCaseId);
  const [bottomTab, setBottomTab] = useState<'comments' | 'activities'>('comments');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({
    type: 'census',
    transmissionId: EDI_TRANSMISSIONS[0].id,
    transmissionDate: EDI_TRANSMISSIONS[0].date,
  });

  const handleViewCensus = useCallback((t: TransmissionAttempt) => {
    setPreview({ type: 'census', transmissionId: t.id, transmissionDate: t.date });
  }, []);

  const handleResolve = useCallback((rc: string, _comment: string) => {
    setRootCause(rc);
    setStatus('Resolved');
    setStatusDetail('File resent manually');
    setShowResolveModal(false);
  }, []);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => onNavigate({ view: 'list', tab: 0 })}>
          <Icon type={Icon.TYPES.ARROW_LEFT} size={14} /> Transmission Failures
        </BreadcrumbLink>
        <span>/</span>
        <BreadcrumbLink onClick={() => onNavigate({ view: 'list', tab: 0 })}>EDI</BreadcrumbLink>
        <span>/</span>
        <BreadcrumbCurrent>{edi.client} &ndash; {edi.carrier}</BreadcrumbCurrent>
      </Breadcrumb>

      <TwoColumnLayout>
        <LeftColumn>
          <DetailHeader>
            <DetailTitle style={{ display: 'flex', alignItems: 'center', gap: theme.space300 }}>
              Transmission Details
              <StatusBadge status={status} />
            </DetailTitle>
            <DetailActions>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY}>
                Reinitiate Transmission
              </Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
                onClick={() => setShowResolveModal(true)}>
                Mark as Resolved
              </Button>
            </DetailActions>
          </DetailHeader>

          <QuickActionRow>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Group Debugger</Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Company Proxy</Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => window.open('#', '_blank')}>
              Flow ID <Icon type={Icon.TYPES.LINK_OUTLET} size={12} />
            </Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => handleViewCensus(EDI_TRANSMISSIONS[0])}>
              View Census
            </Button>
          </QuickActionRow>

          <InfoCard>
            <InfoRow hasBorder>
              <InfoItem>
                <InfoLabel>Client</InfoLabel>
                <InfoValue>{edi.client}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Carrier</InfoLabel>
                <InfoValue>{edi.carrier}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group ID</InfoLabel>
                <InfoValue>
                  <CellMono>{edi.groupId}</CellMono>
                  <CopyButton aria-label="Copy Group ID">
                    <Icon type={Icon.TYPES.COPY_OUTLINE} size={12} />
                  </CopyButton>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group CID</InfoLabel>
                <InfoValue><CellMono>{edi.groupCid}</CellMono></InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow hasBorder>
              <InfoItem>
                <InfoLabel>Employee Affected</InfoLabel>
                <InfoValue>{edi.employeeCount} employees</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Scheduled Cadence</InfoLabel>
                <InfoValue>{edi.cadence}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Date of Failure</InfoLabel>
                <InfoValue>{edi.transmissionDate}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Environment</InfoLabel>
                <InfoValue>
                  <Label size={Label.SIZES.S} appearance={edi.environment === 'Production' ? Label.APPEARANCES.SUCCESS : Label.APPEARANCES.NEUTRAL}>
                    {edi.environment}
                  </Label>
                </InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow>
              <InfoItem>
                <InfoLabel>Skip Transmission</InfoLabel>
                <InfoValue>{edi.skipTransmission ? 'Yes' : 'No'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Recurrence</InfoLabel>
                <InfoValue><RecurrenceDisplay recurrence={edi.recurrence} /></InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Date Assigned</InfoLabel>
                <InfoValue>{edi.dateAssigned}</InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoCard>

          <ErrorSection>
            <SectionTitle style={{ marginBottom: theme.space300 }}>Error Message</SectionTitle>
            {edi.errors.map((err, idx) => (
              <div key={idx} style={{ marginBottom: idx < edi.errors.length - 1 ? theme.space300 : 0 }}>
                <div style={{ display: 'flex', gap: theme.space300, marginBottom: theme.space200, alignItems: 'center' }}>
                  <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.ERROR}>{err.errorCode}</Label>
                  {err.roleId && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: theme.space100 }}>
                      <InfoLabel style={{ margin: 0 }}>Role ID:</InfoLabel>
                      <CellMono>{err.roleId}</CellMono>
                    </span>
                  )}
                </div>
                <ErrorDetailText>{err.message}</ErrorDetailText>
              </div>
            ))}
          </ErrorSection>

          <FormRow>
            <FormField>
              <FormLabel>Status</FormLabel>
              <NativeSelect value={status} onChange={(e) => setStatus(e.target.value as EdiError['status'])}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Status Detail</FormLabel>
              <NativeSelect value={statusDetail} onChange={(e) => setStatusDetail(e.target.value)}>
                <option value="">Select...</option>
                {STATUS_DETAIL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Root Cause</FormLabel>
              <NativeSelect value={rootCause} onChange={(e) => setRootCause(e.target.value)}>
                {ROOT_CAUSE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Assigned Analyst</FormLabel>
              <NativeSelect value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                {ANALYST_LIST.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Jira Case ID</FormLabel>
              <NativeInput value={jiraId} onChange={(e) => setJiraId(e.target.value)} placeholder="e.g. BENINTEG-1234" />
            </FormField>
            <FormField>
              <FormLabel>SF Case Link</FormLabel>
              <NativeInput placeholder="Paste Salesforce URL..." defaultValue={edi.sfCaseLink} />
            </FormField>
          </FormRow>

          <TransmissionHistory transmissions={EDI_TRANSMISSIONS} onViewCensus={handleViewCensus} />

          <BottomTabBar>
            <BottomTabButton active={bottomTab === 'comments'} onClick={() => setBottomTab('comments')}>Comments</BottomTabButton>
            <BottomTabButton active={bottomTab === 'activities'} onClick={() => setBottomTab('activities')}>Activities</BottomTabButton>
          </BottomTabBar>

          {bottomTab === 'comments' && (
            <div>
              <CommentArea placeholder="Add a comment..." />
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY}>Comment</Button>
            </div>
          )}
          {bottomTab === 'activities' && <ActivityPlaceholder>No recent activity</ActivityPlaceholder>}
        </LeftColumn>

        <RightColumn>
          <CensusPreviewPanel preview={preview} />
        </RightColumn>
      </TwoColumnLayout>

      <ResolveModal
        isVisible={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onResolve={handleResolve}
        currentRootCause={rootCause}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   API Group View (L2)
   ═══════════════════════════════════════════════════════════════ */

function ApiGroupView({ id, onNavigate }: { id: string; onNavigate: (vs: ViewState) => void }) {
  const { theme } = usePebbleTheme();
  const group = apiGroupErrorsData.find((g) => g.id === id) || apiGroupErrorsData[0];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => onNavigate({ view: 'list', tab: 1 })}>
          <Icon type={Icon.TYPES.ARROW_LEFT} size={14} /> Transmission Failures
        </BreadcrumbLink>
        <span>/</span>
        <BreadcrumbLink onClick={() => onNavigate({ view: 'list', tab: 1 })}>API</BreadcrumbLink>
        <span>/</span>
        <BreadcrumbCurrent>{group.client} &ndash; {group.carrier}</BreadcrumbCurrent>
      </Breadcrumb>

      <MainContent>
        <PageTitle>{group.client} &ndash; {group.carrier}</PageTitle>

        <TableCard>
          <TableToolbar>
            <ToolbarRow>
              <GridTitle>Transmission Errors ({group.employees.length})</GridTitle>
              <ToolbarActions>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY}>Reinitiate All</Button>
              </ToolbarActions>
            </ToolbarRow>
          </TableToolbar>
          <ScrollableTableContainer>
            <StyledTable>
              <StyledTHead>
                <tr>
                  <StyledTh>Employee Name</StyledTh>
                  <StyledTh>Employee SSN</StyledTh>
                  <StyledTh>Role ID</StyledTh>
                  <StyledTh>Event Type</StyledTh>
                  <StyledTh>Failed At</StyledTh>
                  <StyledTh>Error</StyledTh>
                  <StyledTh>Recurrence</StyledTh>
                  <StyledTh>Status</StyledTh>
                  <StyledTh>Status Detail</StyledTh>
                  <StyledTh>Assigned To</StyledTh>
                  <StickyChevronTh />
                </tr>
              </StyledTHead>
              <tbody>
                {group.employees.map((emp) => (
                  <StyledTr key={emp.id} onClick={() => onNavigate({ view: 'api-employee', groupId: group.id, employeeId: emp.id })}>
                    <StyledTd>
                      <AssigneeCell>
                        <Avatar title={emp.employeeName} size={Avatar.SIZES.XS} isCompact />
                        <AssigneeName>{emp.employeeName}</AssigneeName>
                      </AssigneeCell>
                    </StyledTd>
                    <StyledTd><CellMono>{emp.employeeSsn}</CellMono></StyledTd>
                    <StyledTd><CellMono>{emp.roleId.substring(0, 12)}...</CellMono></StyledTd>
                    <StyledTd><CellText>{emp.eventType}</CellText></StyledTd>
                    <StyledTd><CellTextMuted>{emp.failedAt}</CellTextMuted></StyledTd>
                    <StyledTd>
                      <Tip content={emp.error}><CellText>{emp.error}</CellText></Tip>
                    </StyledTd>
                    <StyledTd><RecurrenceDisplay recurrence={emp.recurrence} /></StyledTd>
                    <StyledTd><CellText>{emp.status}</CellText></StyledTd>
                    <StyledTd>
                      <Tip content={emp.statusDetail}><CellTextMuted>{emp.statusDetail}</CellTextMuted></Tip>
                    </StyledTd>
                    <StyledTd>
                      <AssigneeCell>
                        <Avatar title={emp.assignedTo} size={Avatar.SIZES.XS} isCompact />
                        <AssigneeName>{emp.assignedTo}</AssigneeName>
                      </AssigneeCell>
                    </StyledTd>
                    <StickyChevronCell>
                      <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} />
                    </StickyChevronCell>
                  </StyledTr>
                ))}
              </tbody>
            </StyledTable>
          </ScrollableTableContainer>
        </TableCard>
      </MainContent>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   API Employee Detail View (L3)
   ═══════════════════════════════════════════════════════════════ */

function ApiEmployeeDetailView({ groupId, employeeId, onNavigate }: {
  groupId: string;
  employeeId: string;
  onNavigate: (vs: ViewState) => void;
}) {
  const { theme } = usePebbleTheme();
  const group = apiGroupErrorsData.find((g) => g.id === groupId) || apiGroupErrorsData[0];
  const emp = group.employees.find((e) => e.id === employeeId) || group.employees[0];

  const [status, setStatus] = useState(emp.status);
  const [statusDetail, setStatusDetail] = useState(emp.statusDetail);
  const [rootCause, setRootCause] = useState(emp.rootCause);
  const [assignee, setAssignee] = useState(emp.assignedTo);
  const [bottomTab, setBottomTab] = useState<'comments' | 'activities'>('comments');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({
    type: 'census',
    transmissionId: emp.transmissionHistory[0]?.id || 'N/A',
    transmissionDate: emp.transmissionHistory[0]?.date || 'N/A',
  });

  const handleViewCensus = useCallback((t: TransmissionAttempt) => {
    setPreview({ type: 'census', transmissionId: t.id, transmissionDate: t.date });
  }, []);

  const handleResolve = useCallback((rc: string, _comment: string) => {
    setRootCause(rc);
    setStatus('Resolved');
    setStatusDetail('File resent manually');
    setShowResolveModal(false);
  }, []);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => onNavigate({ view: 'api-group', id: groupId })}>
          <Icon type={Icon.TYPES.ARROW_LEFT} size={14} /> {group.client} &ndash; {group.carrier}
        </BreadcrumbLink>
        <span>/</span>
        <BreadcrumbCurrent>{emp.employeeName}</BreadcrumbCurrent>
      </Breadcrumb>

      <TwoColumnLayout>
        <LeftColumn>
          <DetailHeader>
            <DetailTitle style={{ display: 'flex', alignItems: 'center', gap: theme.space300 }}>
              {emp.employeeName}
              <StatusBadge status={status} />
            </DetailTitle>
            <DetailActions>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY}>
                Reinitiate Transmission
              </Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
                onClick={() => setShowResolveModal(true)}>
                Mark as Resolved
              </Button>
            </DetailActions>
          </DetailHeader>

          <QuickActionRow>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Employee Debugger</Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Group Debugger</Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Company Proxy</Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => window.open('#', '_blank')}>
              Flow ID <Icon type={Icon.TYPES.LINK_OUTLET} size={12} />
            </Button>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => handleViewCensus(emp.transmissionHistory[0])}>
              View Census
            </Button>
          </QuickActionRow>

          <InfoCard>
            <InfoRow hasBorder>
              <InfoItem>
                <InfoLabel>Employee Name</InfoLabel>
                <InfoValue>{emp.employeeName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Role ID</InfoLabel>
                <InfoValue>
                  <CellMono>{emp.roleId}</CellMono>
                  <CopyButton aria-label="Copy Role ID">
                    <Icon type={Icon.TYPES.COPY_OUTLINE} size={12} />
                  </CopyButton>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Employee SSN</InfoLabel>
                <InfoValue>{emp.employeeSsn}</InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow hasBorder>
              <InfoItem>
                <InfoLabel>Client</InfoLabel>
                <InfoValue>{emp.client}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Carrier</InfoLabel>
                <InfoValue>{emp.carrier}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group ID</InfoLabel>
                <InfoValue><CellMono>{emp.groupId}</CellMono></InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group CID</InfoLabel>
                <InfoValue><CellMono>{emp.groupCid}</CellMono></InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow>
              <InfoItem>
                <InfoLabel>Event Type</InfoLabel>
                <InfoValue>{emp.eventType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Failed At</InfoLabel>
                <InfoValue>{emp.failedAt}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Recurrence</InfoLabel>
                <InfoValue><RecurrenceDisplay recurrence={emp.recurrence} /></InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoCard>

          <ErrorSection>
            <SectionTitle style={{ marginBottom: theme.space300 }}>Error Message</SectionTitle>
            {emp.errors.map((err, idx) => (
              <div key={idx} style={{ marginBottom: idx < emp.errors.length - 1 ? theme.space300 : 0 }}>
                <div style={{ display: 'flex', gap: theme.space300, marginBottom: theme.space200, alignItems: 'center' }}>
                  <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.ERROR}>{err.errorCode}</Label>
                  {err.roleId && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: theme.space100 }}>
                      <InfoLabel style={{ margin: 0 }}>Role ID:</InfoLabel>
                      <CellMono>{err.roleId}</CellMono>
                    </span>
                  )}
                </div>
                <ErrorDetailText>{err.message}</ErrorDetailText>
              </div>
            ))}
          </ErrorSection>

          <FormRow>
            <FormField>
              <FormLabel>Status</FormLabel>
              <NativeSelect value={status} onChange={(e) => setStatus(e.target.value as ApiEmployeeError['status'])}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Status Detail</FormLabel>
              <NativeSelect value={statusDetail} onChange={(e) => setStatusDetail(e.target.value)}>
                <option value="">Select...</option>
                {STATUS_DETAIL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Root Cause</FormLabel>
              <NativeSelect value={rootCause} onChange={(e) => setRootCause(e.target.value)}>
                {ROOT_CAUSE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Assigned Analyst</FormLabel>
              <NativeSelect value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                {ANALYST_LIST.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField>
              <FormLabel>Jira Case ID</FormLabel>
              <NativeInput placeholder="e.g. BENINTEG-1234" defaultValue={group.jiraCaseId} />
            </FormField>
            <FormField>
              <FormLabel>SF Case Link</FormLabel>
              <NativeInput placeholder="Paste Salesforce URL..." />
            </FormField>
          </FormRow>

          <TransmissionHistory transmissions={emp.transmissionHistory} onViewCensus={handleViewCensus} />

          <BottomTabBar>
            <BottomTabButton active={bottomTab === 'comments'} onClick={() => setBottomTab('comments')}>Comments</BottomTabButton>
            <BottomTabButton active={bottomTab === 'activities'} onClick={() => setBottomTab('activities')}>Activities</BottomTabButton>
          </BottomTabBar>

          {bottomTab === 'comments' && (
            <div>
              <CommentArea placeholder="Add a comment..." />
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY}>Comment</Button>
            </div>
          )}
          {bottomTab === 'activities' && <ActivityPlaceholder>No recent activity</ActivityPlaceholder>}
        </LeftColumn>

        <RightColumn>
          <CensusPreviewPanel preview={preview} />
        </RightColumn>
      </TwoColumnLayout>

      <ResolveModal
        isVisible={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onResolve={handleResolve}
        currentRootCause={rootCause}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

const TransmissionFailuresDemo: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'list' });
  const handleNavigate = useCallback((vs: ViewState) => { setViewState(vs); }, []);

  return (
    <PageContainer>
      <TopNav />
      {viewState.view === 'list' && <ListView onNavigate={handleNavigate} initialTab={viewState.tab} />}
      {viewState.view === 'edi-detail' && <EdiDetailView id={viewState.id} onNavigate={handleNavigate} />}
      {viewState.view === 'api-group' && <ApiGroupView id={viewState.id} onNavigate={handleNavigate} />}
      {viewState.view === 'api-employee' && (
        <ApiEmployeeDetailView groupId={viewState.groupId} employeeId={viewState.employeeId} onNavigate={handleNavigate} />
      )}
    </PageContainer>
  );
};

export default TransmissionFailuresDemo;
