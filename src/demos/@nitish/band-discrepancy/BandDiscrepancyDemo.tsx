import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import Modal from '@rippling/pebble/Modal';
import Tip from '@rippling/pebble/Tip';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import {
  ErrorReportRow, AllErrorRow, IssueRow, PreviewState,
  errorReportData, allErrorsData,
  TRANSMISSIONS, ATTACHMENTS, SAMPLE_EDI_CONTENT,
} from './data';
import {
  EdiPreview, CensusPreview, AttachmentPreview, EmailPreviewER, EmailPreviewAE, getPreviewLabel,
} from './PreviewPanel';
import {
  PageContainer, TopNavContainer, NavLogoArea, NavLogoDivider, NavLogoText, NavSearchWrapper, NavSearchInput,
  NavSearchIconWrapper, NavIconsArea, NavIconButton, NavCompanyInfo, NavCompanyName,
  MainContent, PageTitle, TabBar, TabButton, TableCard, TableToolbar, ToolbarRow, GridTitle,
  ToolbarActions, SearchInputWrapper, SearchIconAbsolute, StyledTable, StyledTHead, StyledTh,
  ThContent, StyledTr, StyledTd, CellText, CellTextMuted, CellTextPrimary, CellTextBold, CellMono,
  SlaContainer, SlaDot, SlaText, AssigneeCell, AssigneeName, ChevronCell, CheckboxCell,
  StickyChevronCell, StickyChevronTh,
  EmployeeInfo, CoverageBadge, FilterChip, FilterChipX, ClearAllButton, FilterChipsRow,
  Breadcrumb, BreadcrumbLink, BreadcrumbCurrent, TwoColumnLayout, LeftColumn, RightColumn,
  DetailTitle, InfoCard, InfoCardBordered, InfoRow, InfoItem, InfoLabel, InfoValue, InfoBadge,
  InfoTooltipIcon, SectionTitle, SectionTitleSmall, TransmissionCard, TransmissionTitle,
  TransmissionMeta, ExpandButton, PreviewBanner, PreviewBannerText, PreviewBannerHighlight,
  FormRow, FormField, FormLabel, DismissReasonButton, DismissTextArea,
  AcceptedBanner, AcceptedBannerText, AcceptedBannerBold, EmptyState, EmptyStateTitle,
  EmptyStateText, IssueCountBadge, StickyActionCell, StickyActionTh, SaveApproveRow, DatePickerFaux,
  IssueDetailSection, IssueDetailLabel, IssueTitle, ErrorRawText, ScrollableTableContainer,
  IssuesTable, TruncatedCell, ButtonsRow, CommentArea, ActivityPlaceholder, ToastContainer, NativeSelect,
} from './shared-styles';

/* ─── types ──────────────────────────────────────────────── */

type ViewState =
  | { view: 'main' }
  | { view: 'error-report-detail'; id: string }
  | { view: 'all-errors-detail'; id: string };

type SortDir = 'asc' | 'desc' | null;
type SortState = { col: string; dir: SortDir };

/* ─── local styled components ────────────────────────────── */

const SavedViewsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const PopoverDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  margin-top: 4px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 200px;
  overflow: hidden;
`;

const PopoverItem = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const TableOverflowWrap = styled.div`
  overflow-x: auto;
`;

const ErrorReportStyledTable = styled(StyledTable)`
  min-width: 900px;
  table-layout: fixed;
`;

const AllErrorsStyledTable = styled(StyledTable)`
  min-width: 1960px;
  table-layout: fixed;
`;

const FauxSearchInput = styled.input`
  width: 100%;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  padding-left: 36px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }

  &:focus {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const EmailSenderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const EmailBodyTruncated = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DismissReasonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

const ViewFileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

/* ─── helpers ────────────────────────────────────────────── */

function toggleSort(current: SortState, col: string): SortState {
  if (current.col !== col) return { col, dir: 'asc' };
  if (current.dir === 'asc') return { col, dir: 'desc' };
  if (current.dir === 'desc') return { col: '', dir: null };
  return { col, dir: 'asc' };
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || !dir) return null;
  return (
    <Icon
      type={dir === 'asc' ? Icon.TYPES.ARROW_UP : Icon.TYPES.ARROW_DOWN}
      size={12}
    />
  );
}

function dependentLabel(relation: 'SELF' | 'SP' | 'CH' | 'DP'): string {
  switch (relation) {
    case 'SELF': return 'Self';
    case 'SP': return 'Spouse';
    case 'CH': return 'Child';
    case 'DP': return 'Domestic Partner';
  }
}

const DISMISS_REASONS = ['Duplicate error', 'Ignorable error', 'Already resolved', 'Not actionable'];

const RCA_OPTIONS = [
  'Plan code mismatch',
  'Coverage effective date discrepancy',
  'Invalid member SSN / ID',
  'Carrier file rejection',
  'Duplicate submission',
  'Missing enrollment data',
  'System processing error',
  'Other',
];

const ASSIGNEES = ['Richard Satherland', 'Priya Mehta', 'David Kim', 'Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez'];

/* ═══════════════════════════════════════════════════════════════
   TopNav
   ═══════════════════════════════════════════════════════════════ */

function TopNav() {
  const { theme } = usePebbleTheme();

  return (
    <TopNavContainer>
      <NavLogoArea>
        {/* Rippling logo mark — three stylised R shapes */}
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

      <NavSearchWrapper>
        <RelativeWrapper style={{ width: '100%', maxWidth: 480 }}>
          <NavSearchIconWrapper>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={theme.colorOnPrimary} />
          </NavSearchIconWrapper>
          <NavSearchInput placeholder="Search or jump to…" />
        </RelativeWrapper>
      </NavSearchWrapper>

      <NavIconsArea>
        <NavIconButton aria-label="Help">
          <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={18} color={theme.colorOnPrimary} />
        </NavIconButton>
        <NavIconButton aria-label="Accessibility">
          <Icon type={Icon.TYPES.ACCESSIBILITY_OUTLINE} size={18} color={theme.colorOnPrimary} />
        </NavIconButton>
        <NavIconButton aria-label="Messages">
          <Icon type={Icon.TYPES.MESSAGE_OUTLINE} size={18} color={theme.colorOnPrimary} />
        </NavIconButton>
        <NavIconButton aria-label="Notifications">
          <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={18} color={theme.colorOnPrimary} />
        </NavIconButton>
        <NavIconButton aria-label="Settings">
          <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={18} color={theme.colorOnPrimary} />
        </NavIconButton>
        <NavCompanyInfo>
          <NavCompanyName>Acme, Inc.</NavCompanyName>
          <Avatar title="Acme" type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
        </NavCompanyInfo>
      </NavIconsArea>
    </TopNavContainer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TransmissionsSection (shared between detail views)
   ═══════════════════════════════════════════════════════════════ */

function TransmissionsSection({
  onViewEdi,
  onViewCensus,
}: {
  onViewEdi: (id: string, date: string) => void;
  onViewCensus: (id: string, date: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const latest = TRANSMISSIONS[0];
  const older = TRANSMISSIONS.slice(1);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionTitle>Transmissions</SectionTitle>
      </div>
      <TransmissionCard>
        <div>
          <TransmissionTitle>{latest.id}</TransmissionTitle>
          <TransmissionMeta>
            {latest.date} · {latest.time} · {latest.segments} segments · {latest.members} members · {latest.status}
          </TransmissionMeta>
        </div>
        <ToolbarActions>
          <Button
            size={Button.SIZES.S}
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={() => onViewEdi(latest.id, latest.date)}
          >
            View EDI
          </Button>
          <Button
            size={Button.SIZES.S}
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={() => onViewCensus(latest.id, latest.date)}
          >
            View Census
          </Button>
        </ToolbarActions>
      </TransmissionCard>

      {expanded && older.map((t) => (
        <TransmissionCard key={t.id} style={{ marginTop: 8 }}>
          <div>
            <TransmissionTitle>{t.id}</TransmissionTitle>
            <TransmissionMeta>
              {t.date} · {t.time} · {t.segments} segments · {t.members} members · {t.status}
            </TransmissionMeta>
          </div>
          <ToolbarActions>
            <Button
              size={Button.SIZES.S}
              appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => onViewEdi(t.id, t.date)}
            >
              View EDI
            </Button>
            <Button
              size={Button.SIZES.S}
              appearance={Button.APPEARANCES.OUTLINE}
              onClick={() => onViewCensus(t.id, t.date)}
            >
              View Census
            </Button>
          </ToolbarActions>
        </TransmissionCard>
      ))}

      {older.length > 0 && (
        <ExpandButton onClick={() => setExpanded(!expanded)}>
          <Icon type={expanded ? Icon.TYPES.CHEVRON_UP : Icon.TYPES.CHEVRON_DOWN} size={14} />
          {expanded ? 'Hide' : `Show ${older.length} older`}
        </ExpandButton>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const BandDiscrepancyDemo: React.FC = () => {
  const { theme } = usePebbleTheme();

  /* ── navigation ─────────────────────────────────────── */
  const [viewState, setViewState] = useState<ViewState>({ view: 'main' });
  const [activeMainTab, setActiveMainTab] = useState<number>(0);
  const [highlightRowId, setHighlightRowId] = useState<string | null>(null);

  /* ── toast ──────────────────────────────────────────── */
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  /* ── clear highlight after animation ────────────────── */
  useEffect(() => {
    if (highlightRowId) {
      const t = setTimeout(() => setHighlightRowId(null), 2600);
      return () => clearTimeout(t);
    }
  }, [highlightRowId]);

  /* ══════════════════════════════════════════════════════
     Error Report Detail – state
     ══════════════════════════════════════════════════════ */
  const [erRow, setErRow] = useState<ErrorReportRow | null>(null);
  const [activeIssueTab, setActiveIssueTab] = useState(0);
  const [erBottomTab, setErBottomTab] = useState<'comments' | 'activities'>('comments');
  const [erPreview, setErPreview] = useState<PreviewState | null>(null);
  const [erCommentText, setErCommentText] = useState('');

  const [dismissModalVisible, setDismissModalVisible] = useState(false);
  const [dismissingIssue, setDismissingIssue] = useState<IssueRow | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [dismissCustom, setDismissCustom] = useState('');

  const [acceptedApproved, setAcceptedApproved] = useState(false);
  const [dismissedApproved, setDismissedApproved] = useState(false);

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveRca, setResolveRca] = useState('');
  const [resolveComment, setResolveComment] = useState('');

  /* ── error report handlers ─────────────────────────── */
  const openErrorReportDetail = useCallback((id: string) => {
    const source = errorReportData.find((r) => r.id === id);
    if (!source) return;
    setErRow({ ...source, toReview: [...source.toReview], accepted: [...source.accepted], dismissed: [...source.dismissed] });
    setActiveIssueTab(0);
    setErBottomTab('comments');
    setErPreview({ type: 'email' });
    setErCommentText('');
    setAcceptedApproved(false);
    setDismissedApproved(false);
    setViewState({ view: 'error-report-detail', id });
  }, []);

  const handleAccept = useCallback((issue: IssueRow) => {
    setErRow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        toReview: prev.toReview.filter((i) => i.id !== issue.id),
        accepted: [...prev.accepted, issue],
      };
    });
    showToast('Issue accepted');
  }, [showToast]);

  const handleDismissClick = useCallback((issue: IssueRow) => {
    setDismissingIssue(issue);
    setDismissReason('');
    setDismissCustom('');
    setDismissModalVisible(true);
  }, []);

  const handleDismissConfirm = useCallback(() => {
    if (!dismissingIssue) return;
    setErRow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        toReview: prev.toReview.filter((i) => i.id !== dismissingIssue.id),
        dismissed: [...prev.dismissed, dismissingIssue],
      };
    });
    setDismissModalVisible(false);
    setDismissingIssue(null);
    showToast('Issue dismissed');
  }, [dismissingIssue, showToast]);

  const handleDismissSkip = useCallback(() => {
    if (!dismissingIssue) return;
    setErRow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        toReview: prev.toReview.filter((i) => i.id !== dismissingIssue.id),
        dismissed: [...prev.dismissed, dismissingIssue],
      };
    });
    setDismissModalVisible(false);
    setDismissingIssue(null);
    showToast('Issue dismissed (no reason)');
  }, [dismissingIssue, showToast]);

  const handleMoveToDismissed = useCallback((issue: IssueRow) => {
    setErRow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        accepted: prev.accepted.filter((i) => i.id !== issue.id),
        dismissed: [...prev.dismissed, issue],
      };
    });
    showToast('Moved to Dismissed');
  }, [showToast]);

  const handleMoveToAccepted = useCallback((issue: IssueRow) => {
    setErRow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        dismissed: prev.dismissed.filter((i) => i.id !== issue.id),
        accepted: [...prev.accepted, issue],
      };
    });
    showToast('Moved to Accepted');
  }, [showToast]);

  const handleSaveApproveAccepted = useCallback(() => {
    setAcceptedApproved(true);
    showToast('Accepted issues saved & approved');
  }, [showToast]);

  const handleSaveApproveDismissed = useCallback(() => {
    setDismissedApproved(true);
    showToast('Dismissed issues saved & approved');
  }, [showToast]);

  const handleGoToError = useCallback(() => {
    setViewState({ view: 'main' });
    setActiveMainTab(1);
    const matchRow = allErrorsData.find(
      (ae) => erRow && ae.company === erRow.company && ae.carrier === erRow.carrier
    );
    if (matchRow) {
      setHighlightRowId(matchRow.id);
    }
  }, [erRow]);

  const handleCopyEdi = useCallback(() => {
    navigator.clipboard.writeText(SAMPLE_EDI_CONTENT).catch(() => {});
    showToast('EDI content copied');
  }, [showToast]);

  const handleErComment = useCallback(() => {
    if (!erCommentText.trim()) return;
    setErCommentText('');
    showToast('Comment added');
  }, [erCommentText, showToast]);

  /* ══════════════════════════════════════════════════════
     All Errors Detail – state
     ══════════════════════════════════════════════════════ */
  const [aeRow, setAeRow] = useState<AllErrorRow | null>(null);
  const [aeStatusValue, setAeStatusValue] = useState('');
  const [aeStageValue, setAeStageValue] = useState('');
  const [aeAssigneeValue, setAeAssigneeValue] = useState('');
  const [aeRcaValue, setAeRcaValue] = useState('');
  const [aeBottomTab, setAeBottomTab] = useState<'comments' | 'activities'>('comments');
  const [aePreview, setAePreview] = useState<PreviewState | null>(null);
  const [aeCommentText, setAeCommentText] = useState('');
  const [aeRcaError, setAeRcaError] = useState(false);

  const openAllErrorsDetail = useCallback((id: string) => {
    const source = allErrorsData.find((r) => r.id === id);
    if (!source) return;
    setAeRow({ ...source });
    setAeStatusValue(source.status);
    setAeStageValue(source.stage);
    setAeAssigneeValue(source.assignee);
    setAeRcaValue('');
    setAeBottomTab('comments');
    setAePreview({ type: 'edi', transmissionId: TRANSMISSIONS[0].id, transmissionDate: TRANSMISSIONS[0].date });
    setAeCommentText('');
    setAeRcaError(false);
    setViewState({ view: 'all-errors-detail', id });
  }, []);

  const handleAeComment = useCallback(() => {
    if (!aeCommentText.trim()) return;
    setAeCommentText('');
    showToast('Comment added');
  }, [aeCommentText, showToast]);

  /* ══════════════════════════════════════════════════════
     Error Report Table state
     ══════════════════════════════════════════════════════ */
  const [erSort, setErSort] = useState<SortState>({ col: '', dir: null });
  const [erSelectedIds, setErSelectedIds] = useState<Set<string>>(new Set());

  const sortedErrorReportData = React.useMemo(() => {
    const data = [...errorReportData];
    if (!erSort.dir) return data;
    data.sort((a, b) => {
      let cmp = 0;
      if (erSort.col === 'sla') {
        const order = { green: 0, amber: 1, red: 2 };
        cmp = order[a.sla.status] - order[b.sla.status];
      } else if (erSort.col === 'createdAt') {
        cmp = a.createdAt.localeCompare(b.createdAt);
      } else if (erSort.col === 'issues') {
        cmp = a.issues - b.issues;
      }
      return erSort.dir === 'desc' ? -cmp : cmp;
    });
    return data;
  }, [erSort]);

  const toggleErSelect = useCallback((id: string) => {
    setErSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleErSelectAll = useCallback(() => {
    setErSelectedIds((prev) =>
      prev.size === errorReportData.length ? new Set() : new Set(errorReportData.map((r) => r.id))
    );
  }, []);

  /* ══════════════════════════════════════════════════════
     All Errors Table state
     ══════════════════════════════════════════════════════ */
  const [aeSort, setAeSort] = useState<SortState>({ col: '', dir: null });
  const [aeSelectedIds, setAeSelectedIds] = useState<Set<string>>(new Set());
  const [aeFilterActive, setAeFilterActive] = useState(false);
  const [aeSavedViewOpen, setAeSavedViewOpen] = useState(false);
  const [aeSaveViewDialogOpen, setAeSaveViewDialogOpen] = useState(false);
  const [aeSaveViewName, setAeSaveViewName] = useState('');
  const [aeFilterCoverage, setAeFilterCoverage] = useState(true);
  const [aeFilterStage, setAeFilterStage] = useState(true);
  const [aeAssigneeDropdown, setAeAssigneeDropdown] = useState<string | null>(null);
  const [assigneeOverrides, setAssigneeOverrides] = useState<Record<string, string>>({});

  const filteredAllErrorsData = React.useMemo(() => {
    let data = [...allErrorsData];
    if (aeFilterActive) {
      if (aeFilterCoverage) {
        data = data.filter((r) => r.coverage === 'Medical');
      }
      if (aeFilterStage) {
        data = data.filter((r) => r.stageCategory === 'Coverage issue' || r.stage === 'Triage');
      }
    }
    if (aeSort.dir) {
      data.sort((a, b) => {
        let cmp = 0;
        if (aeSort.col === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
        else if (aeSort.col === 'sla') {
          const order = { green: 0, amber: 1, red: 2 };
          cmp = order[a.sla.status] - order[b.sla.status];
        } else if (aeSort.col === 'followUp') cmp = a.followUp.localeCompare(b.followUp);
        return aeSort.dir === 'desc' ? -cmp : cmp;
      });
    }
    return data;
  }, [aeSort, aeFilterActive, aeFilterCoverage, aeFilterStage]);

  const toggleAeSelect = useCallback((id: string) => {
    setAeSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAeSelectAll = useCallback(() => {
    const ids = filteredAllErrorsData.map((r) => r.id);
    setAeSelectedIds((prev) =>
      prev.size === ids.length ? new Set() : new Set(ids)
    );
  }, [filteredAllErrorsData]);

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */

  return (
    <PageContainer>
      <TopNav />

      {viewState.view === 'main' && (
        <MainContent>
          <PageTitle>Benefit Tasks</PageTitle>
          <TabBar>
            <TabButton active={activeMainTab === 0} onClick={() => setActiveMainTab(0)}>
              Error report
            </TabButton>
            <TabButton active={activeMainTab === 1} onClick={() => setActiveMainTab(1)}>
              All errors
            </TabButton>
          </TabBar>

          {activeMainTab === 0 && (
            /* ═══ Error Report Table ═══ */
            <TableCard>
              <TableToolbar>
                <ToolbarRow>
                  <GridTitle>Grid title</GridTitle>
                  <ToolbarActions>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      Assigned to me
                    </Button>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      <Icon type={Icon.TYPES.TABLE_COLUMN_OUTLINE} size={16} />
                    </Button>
                  </ToolbarActions>
                </ToolbarRow>
                <ToolbarRow>
                  <SearchInputWrapper>
                    <SearchIconAbsolute>
                      <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                    </SearchIconAbsolute>
                    <FauxSearchInput placeholder="Search…" />
                  </SearchInputWrapper>
                  <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST}>
                    <Icon type={Icon.TYPES.FILTER} size={16} /> Filter
                  </Button>
                </ToolbarRow>
              </TableToolbar>

              <ErrorReportStyledTable>
                <colgroup>
                  <col style={{ width: 40 }} />   {/* checkbox */}
                  <col style={{ width: 95 }} />   {/* SFDC */}
                  <col style={{ width: 150 }} />  {/* COMPANY */}
                  <col style={{ width: 140 }} />  {/* CARRIER */}
                  <col style={{ width: 200 }} />  {/* ASSIGNEE */}
                  <col style={{ width: 110 }} />  {/* STATUS */}
                  <col style={{ width: 160 }} />  {/* SLA */}
                  <col style={{ width: 150 }} />  {/* CREATED AT */}
                  <col style={{ width: 80 }} />   {/* ISSUES */}
                  <col style={{ width: 40 }} />   {/* chevron */}
                </colgroup>
                <StyledTHead>
                  <tr>
                    <CheckboxCell as="th">
                      <input
                        type="checkbox"
                        checked={erSelectedIds.size === errorReportData.length && errorReportData.length > 0}
                        onChange={toggleErSelectAll}
                      />
                    </CheckboxCell>
                    <StyledTh>SFDC</StyledTh>
                    <StyledTh>COMPANY</StyledTh>
                    <StyledTh>CARRIER</StyledTh>
                    <StyledTh>ASSIGNEE</StyledTh>
                    <StyledTh>STATUS</StyledTh>
                    <StyledTh sortable onClick={() => setErSort(toggleSort(erSort, 'sla'))}>
                      <ThContent>
                        SLA <SortArrow active={erSort.col === 'sla'} dir={erSort.dir} />
                      </ThContent>
                    </StyledTh>
                    <StyledTh sortable onClick={() => setErSort(toggleSort(erSort, 'createdAt'))}>
                      <ThContent>
                        CREATED AT <SortArrow active={erSort.col === 'createdAt'} dir={erSort.dir} />
                      </ThContent>
                    </StyledTh>
                    <StyledTh sortable onClick={() => setErSort(toggleSort(erSort, 'issues'))}>
                      <ThContent>
                        ISSUES <SortArrow active={erSort.col === 'issues'} dir={erSort.dir} />
                      </ThContent>
                    </StyledTh>
                    <StyledTh />
                  </tr>
                </StyledTHead>
                <tbody>
                  {sortedErrorReportData.map((row) => (
                    <StyledTr key={row.id} onClick={() => openErrorReportDetail(row.id)}>
                      <CheckboxCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={erSelectedIds.has(row.id)}
                          onChange={() => toggleErSelect(row.id)}
                        />
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
                      <StyledTd>
                        <SlaContainer>
                          <SlaDot status={row.sla.status} />
                          <SlaText status={row.sla.status}>{row.sla.label}</SlaText>
                        </SlaContainer>
                      </StyledTd>
                      <StyledTd><CellTextMuted>{row.createdAt}</CellTextMuted></StyledTd>
                      <StyledTd><CellTextBold>{row.issues}</CellTextBold></StyledTd>
                      <ChevronCell>
                        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} />
                      </ChevronCell>
                    </StyledTr>
                  ))}
                </tbody>
              </ErrorReportStyledTable>
            </TableCard>
          )}

          {activeMainTab === 1 && (
            /* ═══ All Errors Table ═══ */
            <TableCard>
              <TableToolbar>
                <ToolbarRow>
                  <GridTitle>Grid title</GridTitle>
                  <ToolbarActions>
                    <RelativeWrapper>
                      <Button
                        size={Button.SIZES.S}
                        appearance={Button.APPEARANCES.OUTLINE}
                        onClick={() => setAeSavedViewOpen(!aeSavedViewOpen)}
                      >
                        Saved Views <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} />
                      </Button>
                      {aeSavedViewOpen && (
                        <PopoverDropdown>
                          <PopoverItem onClick={() => { setAeSavedViewOpen(false); }}>
                            All errors (default)
                          </PopoverItem>
                          <PopoverItem onClick={() => {
                            setAeFilterActive(true);
                            setAeFilterCoverage(true);
                            setAeFilterStage(true);
                            setAeSavedViewOpen(false);
                          }}>
                            Medical + Triage
                          </PopoverItem>
                        </PopoverDropdown>
                      )}
                    </RelativeWrapper>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      Assigned to me
                    </Button>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                      <Icon type={Icon.TYPES.TABLE_COLUMN_OUTLINE} size={16} />
                    </Button>
                  </ToolbarActions>
                </ToolbarRow>
                <ToolbarRow>
                  <SearchInputWrapper>
                    <SearchIconAbsolute>
                      <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                    </SearchIconAbsolute>
                    <FauxSearchInput placeholder="Search…" />
                  </SearchInputWrapper>
                  <Button
                    size={Button.SIZES.S}
                    appearance={Button.APPEARANCES.GHOST}
                    onClick={() => setAeFilterActive(!aeFilterActive)}
                  >
                    <Icon type={Icon.TYPES.FILTER} size={16} /> Filter
                  </Button>
                </ToolbarRow>

                {aeFilterActive && (
                  <FilterChipsRow>
                    {aeFilterCoverage && (
                      <FilterChip>
                        Coverage: Medical
                        <FilterChipX onClick={() => setAeFilterCoverage(false)}>
                          <Icon type={Icon.TYPES.CLEAR} size={12} />
                        </FilterChipX>
                      </FilterChip>
                    )}
                    {aeFilterStage && (
                      <FilterChip>
                        Stage: Triage
                        <FilterChipX onClick={() => setAeFilterStage(false)}>
                          <Icon type={Icon.TYPES.CLEAR} size={12} />
                        </FilterChipX>
                      </FilterChip>
                    )}
                    <ClearAllButton onClick={() => {
                      setAeFilterCoverage(false);
                      setAeFilterStage(false);
                      setAeFilterActive(false);
                    }}>
                      Clear all
                    </ClearAllButton>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.GHOST}
                      onClick={() => {
                        setAeSaveViewName('');
                        setAeSaveViewDialogOpen(true);
                      }}
                    >
                      Save this view
                    </Button>
                  </FilterChipsRow>
                )}
              </TableToolbar>

              <TableOverflowWrap>
                <AllErrorsStyledTable>
                  <colgroup>
                    <col style={{ width: 40 }} />   {/* checkbox */}
                    <col style={{ width: 95 }} />   {/* SFDC */}
                    <col style={{ width: 190 }} />  {/* EMPLOYEE */}
                    <col style={{ width: 190 }} />  {/* MEMBER */}
                    <col style={{ width: 160 }} />  {/* COMPANY */}
                    <col style={{ width: 160 }} />  {/* CARRIER */}
                    <col style={{ width: 220 }} />  {/* ASSIGNEE: avatar+gap+160px text+chevron */}
                    <col style={{ width: 110 }} />  {/* STATUS */}
                    <col style={{ width: 160 }} />  {/* STAGE */}
                    <col style={{ width: 150 }} />  {/* CREATED AT */}
                    <col style={{ width: 160 }} />  {/* SLA */}
                    <col style={{ width: 90 }} />   {/* COVERAGE */}
                    <col style={{ width: 160 }} />  {/* ROOT CAUSE */}
                    <col style={{ width: 110 }} />  {/* FOLLOW UP */}
                    <col style={{ width: 40 }} />   {/* chevron */}
                  </colgroup>
                  <StyledTHead>
                    <tr>
                      <CheckboxCell as="th">
                        <input
                          type="checkbox"
                          checked={aeSelectedIds.size === filteredAllErrorsData.length && filteredAllErrorsData.length > 0}
                          onChange={toggleAeSelectAll}
                        />
                      </CheckboxCell>
                      <StyledTh>SFDC</StyledTh>
                      <StyledTh>EMPLOYEE</StyledTh>
                      <StyledTh>MEMBER</StyledTh>
                      <StyledTh>COMPANY</StyledTh>
                      <StyledTh>CARRIER</StyledTh>
                      <StyledTh>ASSIGNEE</StyledTh>
                      <StyledTh>STATUS</StyledTh>
                      <StyledTh>STAGE</StyledTh>
                      <StyledTh sortable onClick={() => setAeSort(toggleSort(aeSort, 'createdAt'))}>
                        <ThContent>
                          CREATED AT <SortArrow active={aeSort.col === 'createdAt'} dir={aeSort.dir} />
                        </ThContent>
                      </StyledTh>
                      <StyledTh sortable onClick={() => setAeSort(toggleSort(aeSort, 'sla'))}>
                        <ThContent>
                          SLA <SortArrow active={aeSort.col === 'sla'} dir={aeSort.dir} />
                        </ThContent>
                      </StyledTh>
                      <StyledTh>COVERAGE</StyledTh>
                      <StyledTh>ROOT CAUSE</StyledTh>
                      <StyledTh sortable onClick={() => setAeSort(toggleSort(aeSort, 'followUp'))}>
                        <ThContent>
                          FOLLOW UP <SortArrow active={aeSort.col === 'followUp'} dir={aeSort.dir} />
                        </ThContent>
                      </StyledTh>
                      <StickyChevronTh />
                    </tr>
                  </StyledTHead>
                  <tbody>
                    {filteredAllErrorsData.map((row) => {
                      const effectiveAssignee = assigneeOverrides[row.id] ?? row.assignee;
                      return (
                        <StyledTr
                          key={row.id}
                          isFlashing={highlightRowId === row.id}
                          onClick={() => {
                            if (aeAssigneeDropdown) { setAeAssigneeDropdown(null); return; }
                            openAllErrorsDetail(row.id);
                          }}
                        >
                          <CheckboxCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={aeSelectedIds.has(row.id)}
                              onChange={() => toggleAeSelect(row.id)}
                            />
                          </CheckboxCell>
                          <StyledTd><CellTextPrimary>{row.sfdc}</CellTextPrimary></StyledTd>
                          <StyledTd>
                            <EmployeeInfo>
                              <CellText>{row.employeeName}</CellText>
                              <CellMono>({row.employeeSsn})</CellMono>
                            </EmployeeInfo>
                          </StyledTd>
                          <StyledTd>
                            <EmployeeInfo>
                              <CellText>{row.memberName} <span style={{ color: 'inherit', opacity: 0.6, fontWeight: 400 }}>({dependentLabel(row.relation)})</span></CellText>
                              <CellMono>({row.memberSsn})</CellMono>
                            </EmployeeInfo>
                          </StyledTd>
                          <StyledTd><CellText>{row.company}</CellText></StyledTd>
                          <StyledTd><CellText>{row.carrier}</CellText></StyledTd>
                          <StyledTd
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setAeAssigneeDropdown(aeAssigneeDropdown === row.id ? null : row.id);
                            }}
                            style={{ cursor: 'pointer', position: 'relative', overflow: 'visible' }}
                          >
                            <AssigneeCell>
                              <Avatar title={effectiveAssignee} type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
                              <AssigneeName>{effectiveAssignee}</AssigneeName>
                              <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} color={theme.colorOnSurfaceVariant} />
                            </AssigneeCell>
                            {aeAssigneeDropdown === row.id && (
                              <PopoverDropdown>
                                {ASSIGNEES.map((name) => (
                                  <PopoverItem
                                    key={name}
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      setAssigneeOverrides((prev) => ({ ...prev, [row.id]: name }));
                                      setAeAssigneeDropdown(null);
                                    }}
                                    style={name === effectiveAssignee ? { fontWeight: 600 } : {}}
                                  >
                                    {name}
                                  </PopoverItem>
                                ))}
                              </PopoverDropdown>
                            )}
                          </StyledTd>
                          <StyledTd><CellText>{row.status}</CellText></StyledTd>
                          <StyledTd><CellText>{row.stage}</CellText></StyledTd>
                          <StyledTd><CellTextMuted>{row.createdAt}</CellTextMuted></StyledTd>
                          <StyledTd>
                            <SlaContainer>
                              <SlaDot status={row.sla.status} />
                              <SlaText status={row.sla.status}>{row.sla.label}</SlaText>
                            </SlaContainer>
                          </StyledTd>
                          <StyledTd><CoverageBadge>{row.coverage}</CoverageBadge></StyledTd>
                          <StyledTd><CellTextMuted>—</CellTextMuted></StyledTd>
                          <StyledTd><CellTextMuted>{row.followUp}</CellTextMuted></StyledTd>
                          <StickyChevronCell>
                            <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurfaceVariant} />
                          </StickyChevronCell>
                        </StyledTr>
                      );
                    })}
                  </tbody>
                </AllErrorsStyledTable>
              </TableOverflowWrap>
            </TableCard>
          )}

          {/* Save View Modal */}
          <Modal
            isVisible={aeSaveViewDialogOpen}
            onCancel={() => setAeSaveViewDialogOpen(false)}
            title="Save view"
          >
            <div style={{ padding: theme.space400 }}>
              <FormLabel>View name</FormLabel>
              <FauxSearchInput
                placeholder="Enter view name…"
                value={aeSaveViewName}
                onChange={(e) => setAeSaveViewName(e.target.value)}
                style={{ paddingLeft: theme.space300 }}
              />
              <ModalFooter>
                <Button size={Button.SIZES.M} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setAeSaveViewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size={Button.SIZES.M}
                  appearance={Button.APPEARANCES.PRIMARY}
                  onClick={() => {
                    setAeSaveViewDialogOpen(false);
                    showToast(`View "${aeSaveViewName || 'Untitled'}" saved`);
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </div>
          </Modal>
        </MainContent>
      )}

      {/* ══════════════════════════════════════════════════════
          Error Report Detail View
          ══════════════════════════════════════════════════════ */}
      {viewState.view === 'error-report-detail' && erRow && (
        <>
          <Breadcrumb>
            <BreadcrumbLink onClick={() => setViewState({ view: 'main' })}>
              <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
              Benefit Tasks
            </BreadcrumbLink>
            <span style={{ color: theme.colorOnSurfaceVariant }}>{'>'}</span>
            <BreadcrumbLink onClick={() => setViewState({ view: 'main' })}>
              Error report
            </BreadcrumbLink>
            <span style={{ color: theme.colorOnSurfaceVariant }}>{'>'}</span>
            <BreadcrumbCurrent>SFDC {erRow.sfdc}</BreadcrumbCurrent>
          </Breadcrumb>

          <TwoColumnLayout>
            {/* ── LEFT ─────────────────────────────────────── */}
            <LeftColumn>
              <DetailTitle>Error details</DetailTitle>

              <ButtonsRow>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                  Employee Debugger
                </Button>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                  Proxy Link
                </Button>
              </ButtonsRow>

              {/* Geneva card */}
              <InfoCardBordered>
                <InfoRow hasBorder>
                  <InfoItem>
                    <InfoLabel>Carrier</InfoLabel>
                    <InfoValue>{erRow.carrier}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Company</InfoLabel>
                    <InfoValue>{erRow.company}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Group ID</InfoLabel>
                    <InfoValue><CellMono>{erRow.groupId}</CellMono></InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Group CID</InfoLabel>
                    <InfoValue><CellMono>{erRow.groupId}</CellMono></InfoValue>
                  </InfoItem>
                </InfoRow>
                <InfoRow>
                  <InfoItem>
                    <InfoLabel>Assignee</InfoLabel>
                    <InfoValue>
                      <AssigneeCell>
                        <Avatar title={erRow.assignee} type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
                        <span>{erRow.assignee}</span>
                      </AssigneeCell>
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue>{erRow.status}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Line of Coverage</InfoLabel>
                    <InfoValue><InfoBadge>{erRow.lineOfCoverage}</InfoBadge></InfoValue>
                  </InfoItem>
                </InfoRow>
              </InfoCardBordered>

              {/* Email Details */}
              <InfoCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <SectionTitleSmall>Email Details</SectionTitleSmall>
                  <ToolbarActions>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.OUTLINE}
                      onClick={() => setErPreview({ type: 'attachment', filename: ATTACHMENTS[0].name })}
                    >
                      View Attachments
                    </Button>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.OUTLINE}
                      onClick={() => setErPreview({ type: 'email' })}
                    >
                      View Email
                    </Button>
                  </ToolbarActions>
                </div>
                <EmailSenderRow>
                  <CellTextMuted>From:</CellTextMuted>
                  <CellText>{erRow.senderEmail}</CellText>
                </EmailSenderRow>
                <EmailBodyTruncated>{erRow.emailBody}</EmailBodyTruncated>
              </InfoCard>

              {/* Transmissions */}
              <TransmissionsSection
                onViewEdi={(id, date) => setErPreview({ type: 'edi', transmissionId: id, transmissionDate: date })}
                onViewCensus={(id, date) => setErPreview({ type: 'census', transmissionId: id, transmissionDate: date })}
              />

              {/* Issues tabs */}
              <TabBar>
                <TabButton active={activeIssueTab === 0} onClick={() => setActiveIssueTab(0)}>
                  Issues to review
                  <IssueCountBadge accent>{erRow.toReview.length}</IssueCountBadge>
                </TabButton>
                <TabButton active={activeIssueTab === 1} onClick={() => setActiveIssueTab(1)}>
                  Accepted
                  <IssueCountBadge>{erRow.accepted.length}</IssueCountBadge>
                </TabButton>
                <TabButton active={activeIssueTab === 2} onClick={() => setActiveIssueTab(2)}>
                  Dismissed
                  <IssueCountBadge>{erRow.dismissed.length}</IssueCountBadge>
                </TabButton>
              </TabBar>

              {/* Issues to review */}
              {activeIssueTab === 0 && erRow.toReview.length > 0 && (
                <ScrollableTableContainer>
                  <IssuesTable>
                    <colgroup>
                      <col style={{ width: 160 }} />
                      <col style={{ width: 160 }} />
                      <col style={{ width: 80 }} />
                      <col style={{ width: 110 }} />
                      <col style={{ width: 220 }} />
                      <col style={{ width: 130 }} />
                      <col style={{ width: 160 }} />
                      <col style={{ width: 180 }} />
                    </colgroup>
                    <StyledTHead>
                      <tr>
                        <StyledTh>MEMBER</StyledTh>
                        <StyledTh>EMPLOYEE</StyledTh>
                        <StyledTh>RELATION</StyledTh>
                        <StyledTh>ROLE ID</StyledTh>
                        <StyledTh>ISSUE</StyledTh>
                        <StyledTh>BLOCK NAME</StyledTh>
                        <StyledTh>CONTENT</StyledTh>
                        <StickyActionTh>ACTIONS</StickyActionTh>
                      </tr>
                    </StyledTHead>
                    <tbody>
                      {erRow.toReview.map((issue) => (
                        <StyledTr key={issue.id} style={{ cursor: 'default' }}>
                          <StyledTd>
                            <EmployeeInfo>
                              <CellText>{issue.memberName}</CellText>
                              <CellMono>{issue.memberSsn}</CellMono>
                            </EmployeeInfo>
                          </StyledTd>
                          <StyledTd>
                            <EmployeeInfo>
                              <CellText>{issue.employeeName}</CellText>
                              <CellMono>{issue.employeeSsn}</CellMono>
                            </EmployeeInfo>
                          </StyledTd>
                          <StyledTd><CellText>{issue.relation}</CellText></StyledTd>
                          <StyledTd><CellMono>{issue.roleId}</CellMono></StyledTd>
                          <StyledTd>
                            <Tip content={issue.issue} placement="top">
                              <TruncatedCell>{issue.issue}</TruncatedCell>
                            </Tip>
                          </StyledTd>
                          <StyledTd>
                            <Tip content={issue.blockName} placement="top">
                              <TruncatedCell>{issue.blockName}</TruncatedCell>
                            </Tip>
                          </StyledTd>
                          <StyledTd>
                            <Tip content={issue.content} placement="top">
                              <TruncatedCell style={{ fontFamily: 'monospace', fontSize: 12 }}>{issue.content}</TruncatedCell>
                            </Tip>
                          </StyledTd>
                          <StickyActionCell>
                            <ToolbarActions>
                              <Button
                                size={Button.SIZES.S}
                                appearance={Button.APPEARANCES.PRIMARY}
                                onClick={() => handleAccept(issue)}
                              >
                                Accept
                              </Button>
                              <Button
                                size={Button.SIZES.S}
                                appearance={Button.APPEARANCES.OUTLINE}
                                onClick={() => handleDismissClick(issue)}
                              >
                                Dismiss
                              </Button>
                            </ToolbarActions>
                          </StickyActionCell>
                        </StyledTr>
                      ))}
                    </tbody>
                  </IssuesTable>
                </ScrollableTableContainer>
              )}

              {activeIssueTab === 0 && erRow.toReview.length === 0 && (
                <EmptyState>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" fill={theme.colorSurfaceContainerLow} stroke={theme.colorOutlineVariant} strokeWidth="2" />
                    <path d="M28 40l8 8 16-16" stroke={theme.colorSuccess} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <EmptyStateTitle style={{ marginTop: 16 }}>All errors are reviewed</EmptyStateTitle>
                  <EmptyStateText>Great job! All issues have been accepted or dismissed.</EmptyStateText>
                </EmptyState>
              )}

              {/* Accepted tab */}
              {activeIssueTab === 1 && (
                <>
                  <AcceptedBanner>
                    <AcceptedBannerText>
                      <AcceptedBannerBold>{erRow.accepted.length}</AcceptedBannerBold> accepted issue{erRow.accepted.length !== 1 ? 's' : ''} ready for approval
                    </AcceptedBannerText>
                  </AcceptedBanner>
                  {erRow.accepted.length > 0 && (
                    <ScrollableTableContainer>
                      <IssuesTable>
                        <colgroup>
                          <col style={{ width: 160 }} />
                          <col style={{ width: 160 }} />
                          <col style={{ width: 80 }} />
                          <col style={{ width: 110 }} />
                          <col style={{ width: 220 }} />
                          <col style={{ width: 130 }} />
                          <col style={{ width: 160 }} />
                          <col style={{ width: 180 }} />
                        </colgroup>
                        <StyledTHead>
                          <tr>
                            <StyledTh>MEMBER</StyledTh>
                            <StyledTh>EMPLOYEE</StyledTh>
                            <StyledTh>RELATION</StyledTh>
                            <StyledTh>ROLE ID</StyledTh>
                            <StyledTh>ISSUE</StyledTh>
                            <StyledTh>BLOCK NAME</StyledTh>
                            <StyledTh>CONTENT</StyledTh>
                            <StickyActionTh>ACTIONS</StickyActionTh>
                          </tr>
                        </StyledTHead>
                        <tbody>
                          {erRow.accepted.map((issue) => (
                            <StyledTr key={issue.id} style={{ cursor: 'default' }}>
                              <StyledTd>
                                <EmployeeInfo>
                                  <CellText>{issue.memberName}</CellText>
                                  <CellMono>{issue.memberSsn}</CellMono>
                                </EmployeeInfo>
                              </StyledTd>
                              <StyledTd>
                                <EmployeeInfo>
                                  <CellText>{issue.employeeName}</CellText>
                                  <CellMono>{issue.employeeSsn}</CellMono>
                                </EmployeeInfo>
                              </StyledTd>
                              <StyledTd><CellText>{issue.relation}</CellText></StyledTd>
                              <StyledTd><CellMono>{issue.roleId}</CellMono></StyledTd>
                              <StyledTd>
                                <Tip content={issue.issue} placement="top">
                                  <TruncatedCell>{issue.issue}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              <StyledTd>
                                <Tip content={issue.blockName} placement="top">
                                  <TruncatedCell>{issue.blockName}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              <StyledTd>
                                <Tip content={issue.content} placement="top">
                                  <TruncatedCell style={{ fontFamily: 'monospace', fontSize: 12 }}>{issue.content}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              <StickyActionCell>
                                {!acceptedApproved ? (
                                  <Button
                                    size={Button.SIZES.S}
                                    appearance={Button.APPEARANCES.OUTLINE}
                                    onClick={() => handleMoveToDismissed(issue)}
                                  >
                                    Move to Dismissed
                                  </Button>
                                ) : (
                                  <Button
                                    size={Button.SIZES.S}
                                    appearance={Button.APPEARANCES.OUTLINE}
                                    onClick={handleGoToError}
                                  >
                                    Go to error
                                  </Button>
                                )}
                              </StickyActionCell>
                            </StyledTr>
                          ))}
                        </tbody>
                      </IssuesTable>
                    </ScrollableTableContainer>
                  )}
                  {erRow.accepted.length > 0 && !acceptedApproved && (
                    <SaveApproveRow>
                      <Button
                        size={Button.SIZES.M}
                        appearance={Button.APPEARANCES.PRIMARY}
                        onClick={handleSaveApproveAccepted}
                      >
                        Save &amp; Approve
                      </Button>
                    </SaveApproveRow>
                  )}
                </>
              )}

              {/* Dismissed tab */}
              {activeIssueTab === 2 && (
                <>
                  <AcceptedBanner>
                    <AcceptedBannerText>
                      <AcceptedBannerBold>{erRow.dismissed.length}</AcceptedBannerBold> dismissed issue{erRow.dismissed.length !== 1 ? 's' : ''}
                    </AcceptedBannerText>
                  </AcceptedBanner>
                  {erRow.dismissed.length > 0 && (
                    <ScrollableTableContainer>
                      <IssuesTable>
                        <colgroup>
                          <col style={{ width: 160 }} />
                          <col style={{ width: 160 }} />
                          <col style={{ width: 80 }} />
                          <col style={{ width: 110 }} />
                          <col style={{ width: 220 }} />
                          <col style={{ width: 130 }} />
                          <col style={{ width: 160 }} />
                          {!dismissedApproved && <col style={{ width: 180 }} />}
                        </colgroup>
                        <StyledTHead>
                          <tr>
                            <StyledTh>MEMBER</StyledTh>
                            <StyledTh>EMPLOYEE</StyledTh>
                            <StyledTh>RELATION</StyledTh>
                            <StyledTh>ROLE ID</StyledTh>
                            <StyledTh>ISSUE</StyledTh>
                            <StyledTh>BLOCK NAME</StyledTh>
                            <StyledTh>CONTENT</StyledTh>
                            {!dismissedApproved && (
                              <StickyActionTh>ACTIONS</StickyActionTh>
                            )}
                          </tr>
                        </StyledTHead>
                        <tbody>
                          {erRow.dismissed.map((issue) => (
                            <StyledTr key={issue.id} style={{ cursor: 'default' }}>
                              <StyledTd>
                                <EmployeeInfo>
                                  <CellText>{issue.memberName}</CellText>
                                  <CellMono>{issue.memberSsn}</CellMono>
                                </EmployeeInfo>
                              </StyledTd>
                              <StyledTd>
                                <EmployeeInfo>
                                  <CellText>{issue.employeeName}</CellText>
                                  <CellMono>{issue.employeeSsn}</CellMono>
                                </EmployeeInfo>
                              </StyledTd>
                              <StyledTd><CellText>{issue.relation}</CellText></StyledTd>
                              <StyledTd><CellMono>{issue.roleId}</CellMono></StyledTd>
                              <StyledTd>
                                <Tip content={issue.issue} placement="top">
                                  <TruncatedCell>{issue.issue}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              <StyledTd>
                                <Tip content={issue.blockName} placement="top">
                                  <TruncatedCell>{issue.blockName}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              <StyledTd>
                                <Tip content={issue.content} placement="top">
                                  <TruncatedCell style={{ fontFamily: 'monospace', fontSize: 12 }}>{issue.content}</TruncatedCell>
                                </Tip>
                              </StyledTd>
                              {!dismissedApproved && (
                                <StickyActionCell>
                                  <Button
                                    size={Button.SIZES.S}
                                    appearance={Button.APPEARANCES.OUTLINE}
                                    onClick={() => handleMoveToAccepted(issue)}
                                  >
                                    Move to Accepted
                                  </Button>
                                </StickyActionCell>
                              )}
                            </StyledTr>
                          ))}
                        </tbody>
                      </IssuesTable>
                    </ScrollableTableContainer>
                  )}
                  {erRow.dismissed.length > 0 && !dismissedApproved && (
                    <SaveApproveRow>
                      <Button
                        size={Button.SIZES.M}
                        appearance={Button.APPEARANCES.PRIMARY}
                        onClick={handleSaveApproveDismissed}
                      >
                        Save &amp; Approve
                      </Button>
                    </SaveApproveRow>
                  )}
                </>
              )}

              {/* Comments / Activities */}
              <div style={{ marginTop: 32 }}>
                <TabBar>
                  <TabButton active={erBottomTab === 'comments'} onClick={() => setErBottomTab('comments')}>
                    Comments
                  </TabButton>
                  <TabButton active={erBottomTab === 'activities'} onClick={() => setErBottomTab('activities')}>
                    Activities
                  </TabButton>
                </TabBar>
                {erBottomTab === 'comments' ? (
                  <>
                    <CommentArea
                      placeholder="Write a comment…"
                      value={erCommentText}
                      onChange={(e) => setErCommentText(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <Button
                        size={Button.SIZES.S}
                        appearance={Button.APPEARANCES.PRIMARY}
                        onClick={handleErComment}
                      >
                        Comment
                      </Button>
                    </div>
                  </>
                ) : (
                  <ActivityPlaceholder>No recent activities.</ActivityPlaceholder>
                )}
              </div>
            </LeftColumn>

            {/* ── RIGHT ────────────────────────────────────── */}
            <RightColumn>
              {erPreview && (
                <>
                  <PreviewBanner>
                    <Icon type={Icon.TYPES.EYE_OUTLINE} size={14} />
                    <PreviewBannerText>
                      Preview: <PreviewBannerHighlight>{getPreviewLabel(erPreview)}</PreviewBannerHighlight>
                    </PreviewBannerText>
                  </PreviewBanner>

                  {erPreview.type === 'edi' && (
                    <EdiPreview
                      company={erRow.company}
                      carrier={erRow.carrier}
                      transmissionId={erPreview.transmissionId}
                      transmissionDate={erPreview.transmissionDate}
                      onCopy={handleCopyEdi}
                    />
                  )}
                  {erPreview.type === 'census' && (
                    <CensusPreview
                      transmissionId={erPreview.transmissionId}
                      transmissionDate={erPreview.transmissionDate}
                    />
                  )}
                  {erPreview.type === 'attachment' && (
                    <AttachmentPreview filename={erPreview.filename} />
                  )}
                  {erPreview.type === 'email' && (
                    <EmailPreviewER row={erRow} />
                  )}
                </>
              )}
              {!erPreview && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <CellTextMuted>Select a preview to view content</CellTextMuted>
                </div>
              )}
            </RightColumn>
          </TwoColumnLayout>

          {/* Dismiss Modal */}
          <Modal
            isVisible={dismissModalVisible}
            onCancel={() => setDismissModalVisible(false)}
            title="Dismiss Issue"
          >
            <div style={{ padding: theme.space400 }}>
              {dismissingIssue && (
                <CellText style={{ display: 'block', marginBottom: theme.space400 }}>
                  {dismissingIssue.issue}
                </CellText>
              )}
              <FormLabel>Reason</FormLabel>
              <DismissReasonsRow>
                {DISMISS_REASONS.map((r) => (
                  <DismissReasonButton
                    key={r}
                    selected={dismissReason === r}
                    onClick={() => setDismissReason(r)}
                  >
                    {r}
                  </DismissReasonButton>
                ))}
              </DismissReasonsRow>
              <FormLabel>Additional notes (optional)</FormLabel>
              <DismissTextArea
                placeholder="Provide additional context…"
                value={dismissCustom}
                onChange={(e) => setDismissCustom(e.target.value)}
              />
              <ModalFooter>
                <Button
                  size={Button.SIZES.M}
                  appearance={Button.APPEARANCES.GHOST}
                  onClick={handleDismissSkip}
                >
                  Skip &amp; Dismiss
                </Button>
                <Button
                  size={Button.SIZES.M}
                  appearance={Button.APPEARANCES.PRIMARY}
                  onClick={handleDismissConfirm}
                >
                  Submit &amp; Dismiss
                </Button>
              </ModalFooter>
            </div>
          </Modal>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          All Errors Detail View
          ══════════════════════════════════════════════════════ */}
      {viewState.view === 'all-errors-detail' && aeRow && (
        <>
          <Breadcrumb>
            <BreadcrumbLink onClick={() => setViewState({ view: 'main' })}>
              <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
              Benefit Tasks
            </BreadcrumbLink>
            <span style={{ color: theme.colorOnSurfaceVariant }}>{'>'}</span>
            <BreadcrumbLink onClick={() => { setViewState({ view: 'main' }); setActiveMainTab(1); }}>
              All errors
            </BreadcrumbLink>
            <span style={{ color: theme.colorOnSurfaceVariant }}>{'>'}</span>
            <BreadcrumbCurrent>SFDC {aeRow.sfdc}</BreadcrumbCurrent>
          </Breadcrumb>

          <TwoColumnLayout>
            {/* ── LEFT ─────────────────────────────────────── */}
            <LeftColumn>
              <DetailTitle>Error details</DetailTitle>

              <ButtonsRow>
                <div style={{ display: 'flex', gap: theme.space200 }}>
                  <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                    Employee Debugger
                  </Button>
                  <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                    Proxy Link
                  </Button>
                </div>
                <Button
                  size={Button.SIZES.S}
                  appearance={Button.APPEARANCES.PRIMARY}
                  onClick={() => { setResolveRca(''); setResolveComment(''); setResolveModalOpen(true); }}
                >
                  Resolve
                </Button>
              </ButtonsRow>

              {/* Info card */}
              <InfoCard>
                <InfoRow hasBorder>
                  <InfoItem>
                    <InfoLabel>Carrier</InfoLabel>
                    <InfoValue>{aeRow.carrier}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Company</InfoLabel>
                    <InfoValue>{aeRow.company}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Employee Name</InfoLabel>
                    <InfoValue>{aeRow.employeeName}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Dependent</InfoLabel>
                    <InfoValue><InfoBadge>{dependentLabel(aeRow.relation)}</InfoBadge></InfoValue>
                  </InfoItem>
                </InfoRow>
                <InfoRow>
                  <InfoItem>
                    <InfoLabel>
                      Role ID
                      <Tip content="Unique role identifier assigned by the system" placement="top">
                        <InfoTooltipIcon>i</InfoTooltipIcon>
                      </Tip>
                    </InfoLabel>
                    <InfoValue><CellMono>{aeRow.groupId}</CellMono></InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Employee ID</InfoLabel>
                    <InfoValue><CellMono>{aeRow.employeeId}</CellMono></InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Line of Coverage</InfoLabel>
                    <InfoValue><InfoBadge>{aeRow.coverage}</InfoBadge></InfoValue>
                  </InfoItem>
                </InfoRow>
              </InfoCard>

              {/* Form fields row 1 */}
              <FormRow>
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <NativeSelect
                    value={aeStatusValue}
                    onChange={(e) => {
                      setAeStatusValue(e.target.value);
                      if (e.target.value.toLowerCase() === 'resolved' && !aeRcaValue) {
                        setAeRcaError(true);
                      } else {
                        setAeRcaError(false);
                      }
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Stage</FormLabel>
                  <NativeSelect
                    value={aeStageValue}
                    onChange={(e) => setAeStageValue(e.target.value)}
                  >
                    <option value="Triage">Triage</option>
                    <option value="Investigation">Investigation</option>
                    <option value="Carrier outreach">Carrier outreach</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Assignee</FormLabel>
                  <NativeSelect
                    value={aeAssigneeValue}
                    onChange={(e) => setAeAssigneeValue(e.target.value)}
                  >
                    <option value="Richard Satherland">Richard Satherland</option>
                    <option value="Priya Mehta">Priya Mehta</option>
                    <option value="David Kim">David Kim</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                  </NativeSelect>
                </FormField>
              </FormRow>

              {/* Form fields row 2 */}
              <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
                <FormField>
                  <FormLabel error={aeRcaError}>
                    Root Cause Analysis {aeRcaError && '(Required when status is Resolved)'}
                  </FormLabel>
                  <NativeSelect
                    hasError={aeRcaError}
                    value={aeRcaValue}
                    onChange={(e) => {
                      setAeRcaValue(e.target.value);
                      if (e.target.value) setAeRcaError(false);
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Plan mapping error">Plan mapping error</option>
                    <option value="Data entry error">Data entry error</option>
                    <option value="Carrier system error">Carrier system error</option>
                    <option value="Timing issue">Timing issue</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Follow up</FormLabel>
                  <DatePickerFaux>
                    <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={14} />
                    <span>{aeRow.followUp}</span>
                  </DatePickerFaux>
                </FormField>
              </FormRow>

              {/* Issue Detail section */}
              <IssueDetailSection>
                <ViewFileRow>
                  <IssueDetailLabel style={{ margin: 0 }}>ISSUE</IssueDetailLabel>
                  <Button
                    size={Button.SIZES.S}
                    appearance={Button.APPEARANCES.OUTLINE}
                    onClick={() => setAePreview({ type: 'edi', transmissionId: TRANSMISSIONS[0].id, transmissionDate: TRANSMISSIONS[0].date })}
                  >
                    View File
                  </Button>
                </ViewFileRow>
                <IssueTitle>{aeRow.errorTitle}</IssueTitle>
                <IssueDetailLabel style={{ marginBottom: 4 }}>CONTENT</IssueDetailLabel>
                <Tip content={<span style={{ fontSize: 14, lineHeight: '1.5', display: 'block', maxWidth: 480 }}>{aeRow.errorRaw}</span>} placement="top">
                  <ErrorRawText>{aeRow.errorRaw}</ErrorRawText>
                </Tip>
              </IssueDetailSection>

              {/* Transmissions */}
              <TransmissionsSection
                onViewEdi={(id, date) => setAePreview({ type: 'edi', transmissionId: id, transmissionDate: date })}
                onViewCensus={(id, date) => setAePreview({ type: 'census', transmissionId: id, transmissionDate: date })}
              />

              {/* Email Details */}
              <InfoCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <SectionTitleSmall>Email Details</SectionTitleSmall>
                  <ToolbarActions>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.OUTLINE}
                      onClick={() => setAePreview({ type: 'attachment', filename: ATTACHMENTS[0].name })}
                    >
                      View Attachments
                    </Button>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.OUTLINE}
                      onClick={() => setAePreview({ type: 'email' })}
                    >
                      View Email
                    </Button>
                  </ToolbarActions>
                </div>
                <EmailSenderRow>
                  <CellTextMuted>From:</CellTextMuted>
                  <CellText>{aeRow.senderEmail}</CellText>
                </EmailSenderRow>
                <EmailBodyTruncated>{aeRow.emailBody}</EmailBodyTruncated>
              </InfoCard>

              {/* Comments / Activities */}
              <div style={{ marginTop: 32 }}>
                <TabBar>
                  <TabButton active={aeBottomTab === 'comments'} onClick={() => setAeBottomTab('comments')}>
                    Comments
                  </TabButton>
                  <TabButton active={aeBottomTab === 'activities'} onClick={() => setAeBottomTab('activities')}>
                    Activities
                  </TabButton>
                </TabBar>
                {aeBottomTab === 'comments' ? (
                  <>
                    <CommentArea
                      placeholder="Write a comment…"
                      value={aeCommentText}
                      onChange={(e) => setAeCommentText(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <Button
                        size={Button.SIZES.S}
                        appearance={Button.APPEARANCES.PRIMARY}
                        onClick={handleAeComment}
                      >
                        Comment
                      </Button>
                    </div>
                  </>
                ) : (
                  <ActivityPlaceholder>No recent activities.</ActivityPlaceholder>
                )}
              </div>
            </LeftColumn>

            {/* ── RIGHT ────────────────────────────────────── */}
            <RightColumn>
              {aePreview && (
                <>
                  <PreviewBanner>
                    <Icon type={Icon.TYPES.EYE_OUTLINE} size={14} />
                    <PreviewBannerText>
                      Preview: <PreviewBannerHighlight>{getPreviewLabel(aePreview)}</PreviewBannerHighlight>
                    </PreviewBannerText>
                  </PreviewBanner>

                  {aePreview.type === 'edi' && (
                    <EdiPreview
                      company={aeRow.company}
                      carrier={aeRow.carrier}
                      transmissionId={aePreview.transmissionId}
                      transmissionDate={aePreview.transmissionDate}
                      onCopy={handleCopyEdi}
                    />
                  )}
                  {aePreview.type === 'census' && (
                    <CensusPreview
                      transmissionId={aePreview.transmissionId}
                      transmissionDate={aePreview.transmissionDate}
                    />
                  )}
                  {aePreview.type === 'attachment' && (
                    <AttachmentPreview filename={aePreview.filename} />
                  )}
                  {aePreview.type === 'email' && (
                    <EmailPreviewAE row={aeRow} />
                  )}
                </>
              )}
              {!aePreview && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <CellTextMuted>Select a preview to view content</CellTextMuted>
                </div>
              )}
            </RightColumn>
          </TwoColumnLayout>

          {/* Resolve Modal */}
          <Modal
            isVisible={resolveModalOpen}
            onCancel={() => setResolveModalOpen(false)}
            title="Resolve Error"
          >
            <div style={{ padding: theme.space400, display: 'flex', flexDirection: 'column', gap: theme.space400 }}>
              <div>
                <FormLabel>Root Cause Analysis (RCA)</FormLabel>
                <NativeSelect
                  value={resolveRca}
                  onChange={(e) => setResolveRca(e.target.value)}
                >
                  <option value="" disabled>Select a root cause…</option>
                  {RCA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </NativeSelect>
              </div>
              <div>
                <FormLabel>Comment</FormLabel>
                <DismissTextArea
                  placeholder="Add any additional notes or context…"
                  value={resolveComment}
                  onChange={(e) => setResolveComment(e.target.value)}
                />
              </div>
              <ModalFooter>
                <Button
                  size={Button.SIZES.M}
                  appearance={Button.APPEARANCES.GHOST}
                  onClick={() => setResolveModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size={Button.SIZES.M}
                  appearance={Button.APPEARANCES.PRIMARY}
                  onClick={() => {
                    setResolveModalOpen(false);
                    setViewState({ view: 'main' });
                    showToast('Error marked as resolved');
                  }}
                >
                  Resolve
                </Button>
              </ModalFooter>
            </div>
          </Modal>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          Toast
          ══════════════════════════════════════════════════════ */}
      <ToastContainer visible={toastVisible}>
        <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={16} />
        {toastMsg}
      </ToastContainer>
    </PageContainer>
  );
};

export default BandDiscrepancyDemo;
