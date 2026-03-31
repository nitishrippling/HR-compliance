import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import Tip from '@rippling/pebble/Tip';
import Dropdown from '@rippling/pebble/Dropdown';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import {
  IssueRow, PreviewState,
  errorReportData, TRANSMISSIONS, ATTACHMENTS,
} from '../band-discrepancy/data';
import {
  EdiPreview, CensusPreview, AttachmentPreview, EmailPreviewER, getPreviewLabel,
} from '../band-discrepancy/PreviewPanel';
import {
  PageContainer, TopNavContainer, NavLogoArea, NavLogoDivider, NavLogoText,
  NavSearchWrapper, NavSearchInput, NavSearchIconWrapper,
  NavIconsArea, NavIconButton, NavCompanyInfo, NavCompanyName,
  TwoColumnLayout, LeftColumn, RightColumn, DetailTitle,
  InfoCardBordered, InfoRow, InfoItem, InfoLabel, InfoValue, InfoBadge, CellMono,
  SectionTitle, TransmissionCard, TransmissionTitle, TransmissionMeta, ExpandButton,
  TabBar, TabButton, IssueCountBadge,
  StyledTHead, StyledTh, StyledTr, StyledTd, CellText, CellTextMuted,
  EmployeeInfo, StickyActionCell, StickyActionTh, ScrollableTableContainer, IssuesTable, TruncatedCell,
  PreviewBanner, PreviewBannerText, PreviewBannerHighlight,
  AcceptedBanner, AcceptedBannerText, AcceptedBannerBold,
  EmptyState, EmptyStateTitle, EmptyStateText,
  AssigneeCell, ToastContainer, ButtonsRow,
} from '../band-discrepancy/shared-styles';

/* ─── Local styled components ──────────────────────────────── */


const SummaryDot = styled.span<{ dotColor: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ dotColor }) => dotColor};
  flex-shrink: 0;
`;

const SummaryText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SummarySeparator = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const FooterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} 0;
  position: sticky;
  bottom: 0;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  z-index: 10;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PendingRow = styled(StyledTr)`
  border-left: 3px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const TransmissionsContainer = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const TransmissionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PreviousTransmissions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-top: ${({ theme }) => (theme as StyledTheme).space300};
`;

const IssuesContainer = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const TableSection = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const EmptyStateCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccessContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ProxyLinkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ActionFadeIn = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  animation: actionFade 200ms ease;

  @keyframes actionFade {
    from { opacity: 0; transform: translateX(-4px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

const ViewToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const ViewToggleBtn = styled.button<{ active?: boolean }>`
  background: ${({ active, theme }) => active ? (theme as StyledTheme).colorSurfaceBright : 'transparent'};
  border: ${({ active, theme }) => active ? `1px solid ${(theme as StyledTheme).colorOutlineVariant}` : '1px solid transparent'};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme, active }) => active
    ? (theme as StyledTheme).colorOnSurface
    : (theme as StyledTheme).colorOnSurfaceVariant
  };
  padding: 4px 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  transition: all 150ms ease;
`;

/* ─── Types ────────────────────────────────────────────────── */

type IssueTab = 'toReview' | 'accepted' | 'dismissed';
type ViewMode = 'flat' | 'tabbed';

/* ─── Rippling Logo SVG ────────────────────────────────────── */

function RipplingLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="white" />
      <path d="M6 7h12M6 12h12M6 17h12" stroke="#7A005D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Checkmark Circle SVG ─────────────────────────────────── */

function CheckCircle({ size = 28, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Top Navigation Bar
   ═══════════════════════════════════════════════════════════════ */

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
        <NavIconButton aria-label="Accessibility">
          <Icon type={Icon.TYPES.ACCESSIBILITY_OUTLINE} size={16} color="rgba(255,255,255,0.85)" />
        </NavIconButton>
        <NavIconButton aria-label="Messages">
          <Icon type={Icon.TYPES.EMAIL_OUTLINE} size={16} color="rgba(255,255,255,0.85)" />
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

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

interface ErrorReportV2DemoProps {
  defaultViewMode?: ViewMode;
}

const ErrorReportV2Demo: React.FC<ErrorReportV2DemoProps> = ({ defaultViewMode = 'flat' }) => {
  const { theme } = usePebbleTheme();

  /* ── initial data ─────────────────────────────────────────── */
  const initialReport = errorReportData[0];

  /* ── state ────────────────────────────────────────────────── */
  const [toReview, setToReview] = useState<IssueRow[]>(() => [...initialReport.toReview]);
  const [accepted, setAccepted] = useState<IssueRow[]>([]);
  const [dismissed, setDismissed] = useState<IssueRow[]>([]);
  const [pendingAcceptIds, setPendingAcceptIds] = useState<Set<string>>(new Set());
  const [pendingDismissIds, setPendingDismissIds] = useState<Set<string>>(new Set());
  const [isSaved, setIsSaved] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const [activeTab, setActiveTab] = useState<IssueTab>('toReview');
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [showPreviousTransmissions, setShowPreviousTransmissions] = useState(false);
  const [erPreview, setErPreview] = useState<PreviewState>({ type: 'email' });

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── toast helper ─────────────────────────────────────────── */
  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* ── issue actions ────────────────────────────────────────── */
  const handleAccept = useCallback((issue: IssueRow) => {
    setToReview((prev) => prev.filter((i) => i.id !== issue.id));
    setAccepted((prev) => [...prev, issue]);
    setPendingAcceptIds((prev) => new Set(prev).add(issue.id));
    setIsSaved(false);
    showToast('Issue accepted');
  }, [showToast]);

  const handleDismiss = useCallback((issue: IssueRow) => {
    setToReview((prev) => prev.filter((i) => i.id !== issue.id));
    setDismissed((prev) => [...prev, issue]);
    setPendingDismissIds((prev) => new Set(prev).add(issue.id));
    setIsSaved(false);
    showToast('Issue dismissed');
  }, [showToast]);

  const undoAccept = useCallback((issue: IssueRow) => {
    setAccepted((prev) => prev.filter((i) => i.id !== issue.id));
    setToReview((prev) => [...prev, issue]);
    setPendingAcceptIds((prev) => {
      const next = new Set(prev);
      next.delete(issue.id);
      return next;
    });
    setIsSaved(false);
    showToast('Action undone');
  }, [showToast]);

  const undoDismiss = useCallback((issue: IssueRow) => {
    setDismissed((prev) => prev.filter((i) => i.id !== issue.id));
    setToReview((prev) => [...prev, issue]);
    setPendingDismissIds((prev) => {
      const next = new Set(prev);
      next.delete(issue.id);
      return next;
    });
    setIsSaved(false);
    showToast('Action undone');
  }, [showToast]);

  const moveAcceptedToDismissed = useCallback((issue: IssueRow) => {
    setAccepted((prev) => prev.filter((i) => i.id !== issue.id));
    setDismissed((prev) => [...prev, issue]);
    setPendingDismissIds((prev) => new Set(prev).add(issue.id));
    setIsSaved(false);
    showToast('Issue moved to Dismissed');
  }, [showToast]);

  const moveDismissedToAccepted = useCallback((issue: IssueRow) => {
    setDismissed((prev) => prev.filter((i) => i.id !== issue.id));
    setAccepted((prev) => [...prev, issue]);
    setPendingAcceptIds((prev) => new Set(prev).add(issue.id));
    setIsSaved(false);
    showToast('Issue moved to Accepted');
  }, [showToast]);

  /* ── save / approve ───────────────────────────────────────── */
  const hasPendingChanges = pendingAcceptIds.size + pendingDismissIds.size > 0;

  const handleSave = useCallback(() => {
    setPendingAcceptIds(new Set());
    setPendingDismissIds(new Set());
    setIsSaved(true);
    showToast('Changes saved');
  }, [showToast]);

  const handleApprove = useCallback(() => {
    setIsApproved(true);
    showToast('Report approved');
  }, [showToast]);

  /* ── preview helpers ──────────────────────────────────────── */
  const setEdiPreview = useCallback((transmission: typeof TRANSMISSIONS[number]) => {
    setErPreview({ type: 'edi', transmissionId: transmission.id, transmissionDate: transmission.date });
  }, []);

  const setCensusPreview = useCallback((transmission: typeof TRANSMISSIONS[number]) => {
    setErPreview({ type: 'census', transmissionId: transmission.id, transmissionDate: transmission.date });
  }, []);

  /* ── render transmission card ─────────────────────────────── */
  const renderTransmissionRow = useCallback((t: typeof TRANSMISSIONS[number]) => (
    <TransmissionCard key={t.id}>
      <div>
        <TransmissionTitle>{t.id}</TransmissionTitle>
        <TransmissionMeta>
          {t.date} &middot; {t.time} &middot; {t.segments} segments &middot; {t.members} members &middot; {t.status}
        </TransmissionMeta>
      </div>
      <TransmissionButtonGroup>
        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setEdiPreview(t)}>
          View EDI
        </Button>
        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setCensusPreview(t)}>
          View Census
        </Button>
      </TransmissionButtonGroup>
    </TransmissionCard>
  ), [setEdiPreview, setCensusPreview]);

  /* ── flat view: derived issue list ──────────────────────────── */
  const allIssuesFlat = useMemo(() => {
    const acceptedIds = new Set(accepted.map(i => i.id));
    const dismissedIds = new Set(dismissed.map(i => i.id));

    return initialReport.toReview.map(issue => ({
      ...issue,
      status: acceptedIds.has(issue.id)
        ? 'accepted' as const
        : dismissedIds.has(issue.id)
          ? 'dismissed' as const
          : 'pending' as const,
    }));
  }, [accepted, dismissed, initialReport.toReview]);

  /* ── render flat table ──────────────────────────────────────── */
  const renderFlatTable = useCallback(() => {
    if (allIssuesFlat.length === 0) {
      return (
        <EmptyState>
          <EmptyStateTitle>No issues found</EmptyStateTitle>
          <EmptyStateText>This error report has no issues to review.</EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <ScrollableTableContainer>
        <IssuesTable>
          <StyledTHead>
            <tr>
              <StyledTh style={{ width: '12%' }}>MEMBER</StyledTh>
              <StyledTh style={{ width: '12%' }}>EMPLOYEE</StyledTh>
              <StyledTh style={{ width: '7%' }}>RELATION</StyledTh>
              <StyledTh style={{ width: '10%' }}>ROLE ID</StyledTh>
              <StyledTh style={{ width: '18%' }}>ISSUE</StyledTh>
              <StyledTh style={{ width: '12%' }}>BLOCK NAME</StyledTh>
              <StyledTh style={{ width: '14%' }}>CONTENT</StyledTh>
              <StickyActionTh style={{ width: '15%' }}>STATUS</StickyActionTh>
            </tr>
          </StyledTHead>
          <tbody>
            {allIssuesFlat.map((issue) => (
              <StyledTr key={issue.id}>
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
                  <Tip content={issue.issue}>
                    <TruncatedCell>{issue.issue}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StyledTd>
                  <Tip content={issue.blockName}>
                    <TruncatedCell>{issue.blockName}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StyledTd>
                  <Tip content={issue.content}>
                    <TruncatedCell>{issue.content}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StickyActionCell style={{ backgroundColor: theme.colorSurfaceBright }}>
                  {issue.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: theme.space200 }}>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => handleAccept(issue)}>
                        Accept
                      </Button>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => handleDismiss(issue)}>
                        Dismiss
                      </Button>
                    </div>
                  ) : issue.status === 'accepted' ? (
                    <ActionFadeIn>
                      {isApproved ? (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => {}}>
                          Go to Errors
                        </Button>
                      ) : (
                        <>
                          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.SUCCESS} onClick={() => {}}>
                            Accepted
                          </Button>
                          <Tip content="Undo">
                            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST} onClick={() => undoAccept(issue)}>
                              <Icon type={Icon.TYPES.UNDO} size={14} />
                            </Button>
                          </Tip>
                        </>
                      )}
                    </ActionFadeIn>
                  ) : (
                    <ActionFadeIn>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => {}}>
                        Dismissed
                      </Button>
                      {!isApproved && (
                        <Tip content="Undo">
                          <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST} onClick={() => undoDismiss(issue)}>
                            <Icon type={Icon.TYPES.UNDO} size={14} />
                          </Button>
                        </Tip>
                      )}
                    </ActionFadeIn>
                  )}
                </StickyActionCell>
              </StyledTr>
            ))}
          </tbody>
        </IssuesTable>
      </ScrollableTableContainer>
    );
  }, [allIssuesFlat, theme, handleAccept, handleDismiss, undoAccept, undoDismiss, isApproved]);

  /* ── render issue table: to review ────────────────────────── */
  const renderToReviewTable = useCallback(() => {
    if (toReview.length === 0) {
      return (
        <EmptyState>
          <EmptyStateCircle>
            <CheckCircle size={28} color={theme.colorSuccess} />
          </EmptyStateCircle>
          <EmptyStateTitle>All errors are reviewed</EmptyStateTitle>
          <EmptyStateText>Every issue has been accepted or dismissed.</EmptyStateText>
        </EmptyState>
      );
    }
    return (
      <ScrollableTableContainer>
        <IssuesTable>
          <StyledTHead>
            <tr>
              <StyledTh style={{ width: '12%' }}>MEMBER</StyledTh>
              <StyledTh style={{ width: '12%' }}>EMPLOYEE</StyledTh>
              <StyledTh style={{ width: '7%' }}>RELATION</StyledTh>
              <StyledTh style={{ width: '10%' }}>ROLE ID</StyledTh>
              <StyledTh style={{ width: '20%' }}>ISSUE</StyledTh>
              <StyledTh style={{ width: '12%' }}>BLOCK NAME</StyledTh>
              <StyledTh style={{ width: '15%' }}>CONTENT</StyledTh>
              <StickyActionTh style={{ width: '12%' }}>ACTIONS</StickyActionTh>
            </tr>
          </StyledTHead>
          <tbody>
            {toReview.map((issue) => (
              <StyledTr key={issue.id}>
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
                  <Tip content={issue.issue}>
                    <TruncatedCell>{issue.issue}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StyledTd>
                  <Tip content={issue.blockName}>
                    <TruncatedCell>{issue.blockName}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StyledTd>
                  <Tip content={issue.content}>
                    <TruncatedCell>{issue.content}</TruncatedCell>
                  </Tip>
                </StyledTd>
                <StickyActionCell>
                  <div style={{ display: 'flex', gap: theme.space200 }}>
                    <Button size={Button.SIZES.S} onClick={() => handleAccept(issue)}>
                      Accept
                    </Button>
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => handleDismiss(issue)}>
                      Dismiss
                    </Button>
                  </div>
                </StickyActionCell>
              </StyledTr>
            ))}
          </tbody>
        </IssuesTable>
      </ScrollableTableContainer>
    );
  }, [toReview, handleAccept, handleDismiss, theme]);

  /* ── render issue table: accepted ─────────────────────────── */
  const renderAcceptedTable = useCallback(() => {
    if (accepted.length === 0) {
      return (
        <EmptyState>
          <EmptyStateTitle>No accepted issues yet</EmptyStateTitle>
          <EmptyStateText>Accept issues from the review tab to see them here.</EmptyStateText>
        </EmptyState>
      );
    }
    return (
      <>
        <AcceptedBanner>
          <AcceptedBannerText>
            <AcceptedBannerBold>{accepted.length}</AcceptedBannerBold> accepted issue(s) ready for approval
          </AcceptedBannerText>
        </AcceptedBanner>
        <ScrollableTableContainer>
          <IssuesTable>
            <StyledTHead>
              <tr>
                <StyledTh style={{ width: '12%' }}>MEMBER</StyledTh>
                <StyledTh style={{ width: '12%' }}>EMPLOYEE</StyledTh>
                <StyledTh style={{ width: '7%' }}>RELATION</StyledTh>
                <StyledTh style={{ width: '10%' }}>ROLE ID</StyledTh>
                <StyledTh style={{ width: '20%' }}>ISSUE</StyledTh>
                <StyledTh style={{ width: '12%' }}>BLOCK NAME</StyledTh>
                <StyledTh style={{ width: '15%' }}>CONTENT</StyledTh>
                <StickyActionTh style={{ width: '12%' }}>ACTIONS</StickyActionTh>
              </tr>
            </StyledTHead>
            <tbody>
              {accepted.map((issue) => {
                const isPending = pendingAcceptIds.has(issue.id);
                const Row = isPending ? PendingRow : StyledTr;
                return (
                  <Row key={issue.id}>
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
                      <Tip content={issue.issue}>
                        <TruncatedCell>{issue.issue}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StyledTd>
                      <Tip content={issue.blockName}>
                        <TruncatedCell>{issue.blockName}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StyledTd>
                      <Tip content={issue.content}>
                        <TruncatedCell>{issue.content}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StickyActionCell>
                      {isPending ? (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => undoAccept(issue)}>
                          Undo
                        </Button>
                      ) : isApproved ? (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                          Go to error
                        </Button>
                      ) : (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => moveAcceptedToDismissed(issue)}>
                          Move to Dismissed
                        </Button>
                      )}
                    </StickyActionCell>
                  </Row>
                );
              })}
            </tbody>
          </IssuesTable>
        </ScrollableTableContainer>
      </>
    );
  }, [accepted, pendingAcceptIds, isApproved, undoAccept, moveAcceptedToDismissed]);

  /* ── render issue table: dismissed ────────────────────────── */
  const renderDismissedTable = useCallback(() => {
    if (dismissed.length === 0) {
      return (
        <EmptyState>
          <EmptyStateTitle>No dismissed issues</EmptyStateTitle>
          <EmptyStateText>Dismiss issues from the review tab to see them here.</EmptyStateText>
        </EmptyState>
      );
    }
    return (
      <>
        <AcceptedBanner>
          <AcceptedBannerText>
            <AcceptedBannerBold>{dismissed.length}</AcceptedBannerBold> dismissed issue(s)
          </AcceptedBannerText>
        </AcceptedBanner>
        <ScrollableTableContainer>
          <IssuesTable>
            <StyledTHead>
              <tr>
                <StyledTh style={{ width: '12%' }}>MEMBER</StyledTh>
                <StyledTh style={{ width: '12%' }}>EMPLOYEE</StyledTh>
                <StyledTh style={{ width: '7%' }}>RELATION</StyledTh>
                <StyledTh style={{ width: '10%' }}>ROLE ID</StyledTh>
                <StyledTh style={{ width: '20%' }}>ISSUE</StyledTh>
                <StyledTh style={{ width: '12%' }}>BLOCK NAME</StyledTh>
                <StyledTh style={{ width: '15%' }}>CONTENT</StyledTh>
                <StickyActionTh style={{ width: '12%' }}>ACTIONS</StickyActionTh>
              </tr>
            </StyledTHead>
            <tbody>
              {dismissed.map((issue) => {
                const isPending = pendingDismissIds.has(issue.id);
                const Row = isPending ? PendingRow : StyledTr;
                return (
                  <Row key={issue.id}>
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
                      <Tip content={issue.issue}>
                        <TruncatedCell>{issue.issue}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StyledTd>
                      <Tip content={issue.blockName}>
                        <TruncatedCell>{issue.blockName}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StyledTd>
                      <Tip content={issue.content}>
                        <TruncatedCell>{issue.content}</TruncatedCell>
                      </Tip>
                    </StyledTd>
                    <StickyActionCell>
                      {isPending ? (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => undoDismiss(issue)}>
                          Undo
                        </Button>
                      ) : isApproved ? null : (
                        <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => moveDismissedToAccepted(issue)}>
                          Move to Accepted
                        </Button>
                      )}
                    </StickyActionCell>
                  </Row>
                );
              })}
            </tbody>
          </IssuesTable>
        </ScrollableTableContainer>
      </>
    );
  }, [dismissed, pendingDismissIds, isApproved, undoDismiss, moveDismissedToAccepted]);

  /* ── render right preview pane ────────────────────────────── */
  const renderPreview = useCallback(() => {
    if (!erPreview) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CellTextMuted>Select a preview to view content</CellTextMuted>
        </div>
      );
    }

    return (
      <>
        <PreviewBanner>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={14} />
          <PreviewBannerText>
            Viewing: <PreviewBannerHighlight>{getPreviewLabel(erPreview)}</PreviewBannerHighlight>
          </PreviewBannerText>
        </PreviewBanner>

        {erPreview.type === 'edi' && (
          <EdiPreview
            company={initialReport.company}
            carrier={initialReport.carrier}
            transmissionId={erPreview.transmissionId}
            transmissionDate={erPreview.transmissionDate}
            onCopy={() => showToast('EDI content copied to clipboard')}
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
          <EmailPreviewER row={initialReport} />
        )}
      </>
    );
  }, [erPreview, initialReport, showToast]);

  /* ── render ───────────────────────────────────────────────── */
  return (
    <PageContainer>
      <TopNav />

      <TwoColumnLayout>
        {/* ═══ LEFT COLUMN ═══ */}
        <LeftColumn>
          <DetailTitle>Error report details</DetailTitle>

          {/* Action buttons */}
          <ButtonsRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
              <ProxyLinkButton>
                <Icon type={Icon.TYPES.LINK_OUTLET} size={14} />
                Proxy Link
              </ProxyLinkButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
              <Dropdown
                list={ATTACHMENTS.map((att, idx) => ({ label: att.name, value: idx }))}
                onChange={(idx: number) => setErPreview({ type: 'attachment', filename: ATTACHMENTS[idx].name })}
                shouldAutoClose
              >
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
                  View Attachments <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                </Button>
              </Dropdown>
              <Button
                size={Button.SIZES.S}
                appearance={Button.APPEARANCES.OUTLINE}
                onClick={() => setErPreview({ type: 'email' })}
              >
                View Email
              </Button>
            </div>
          </ButtonsRow>

          {/* Metadata Card */}
          <InfoCardBordered>
            <InfoRow hasBorder>
              <InfoItem>
                <InfoLabel>Carrier</InfoLabel>
                <InfoValue>{initialReport.carrier}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Company</InfoLabel>
                <InfoValue>{initialReport.company}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group ID</InfoLabel>
                <InfoValue>{initialReport.groupId}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Group CID</InfoLabel>
                <InfoValue>{initialReport.sfdc}</InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow>
              <InfoItem>
                <InfoLabel>Assignee</InfoLabel>
                <InfoValue>
                  <AssigneeCell>
                    <Avatar title={initialReport.assignee} type={Avatar.TYPES?.USER || 'USER'} size={Avatar.SIZES.XS} isCompact />
                    {initialReport.assignee}
                  </AssigneeCell>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>{initialReport.status}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Line of Coverage</InfoLabel>
                <InfoValue>
                  <InfoBadge>{initialReport.lineOfCoverage}</InfoBadge>
                </InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoCardBordered>

          {/* Transmissions Section */}
          <TransmissionsContainer>
            <SectionHeader>
              <SectionTitle>Transmissions</SectionTitle>
            </SectionHeader>

            {renderTransmissionRow(TRANSMISSIONS[0])}

            {TRANSMISSIONS.length > 1 && (
              <>
                {showPreviousTransmissions ? (
                  <PreviousTransmissions>
                    {TRANSMISSIONS.slice(1).map(renderTransmissionRow)}
                    <ExpandButton onClick={() => setShowPreviousTransmissions(false)}>
                      <Icon type={Icon.TYPES.CHEVRON_UP} size={12} />
                      Hide
                    </ExpandButton>
                  </PreviousTransmissions>
                ) : (
                  <ExpandButton onClick={() => setShowPreviousTransmissions(true)}>
                    <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} />
                    Show {TRANSMISSIONS.length - 1} older
                  </ExpandButton>
                )}
              </>
            )}
          </TransmissionsContainer>

          {/* Issues Section */}
          <IssuesContainer>
            <TableSection>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.space300 }}>
                <SectionTitle style={{ margin: 0 }}>
                  Issues ({initialReport.toReview.length})
                </SectionTitle>
                <ViewToggleGroup>
                  <ViewToggleBtn active={viewMode === 'flat'} onClick={() => setViewMode('flat')}>
                    List
                  </ViewToggleBtn>
                  <ViewToggleBtn active={viewMode === 'tabbed'} onClick={() => setViewMode('tabbed')}>
                    Tabbed
                  </ViewToggleBtn>
                </ViewToggleGroup>
              </div>

              {viewMode === 'flat' ? (
                renderFlatTable()
              ) : (
                <>
                  <TabBar>
                    <TabButton active={activeTab === 'toReview'} onClick={() => setActiveTab('toReview')}>
                      Issues to review
                      <IssueCountBadge accent={toReview.length > 0}>{toReview.length}</IssueCountBadge>
                    </TabButton>
                    <TabButton active={activeTab === 'accepted'} onClick={() => setActiveTab('accepted')}>
                      Accepted
                      <IssueCountBadge>{accepted.length}</IssueCountBadge>
                    </TabButton>
                    <TabButton active={activeTab === 'dismissed'} onClick={() => setActiveTab('dismissed')}>
                      Dismissed
                      <IssueCountBadge>{dismissed.length}</IssueCountBadge>
                    </TabButton>
                  </TabBar>

                  {activeTab === 'toReview' && renderToReviewTable()}
                  {activeTab === 'accepted' && renderAcceptedTable()}
                  {activeTab === 'dismissed' && renderDismissedTable()}
                </>
              )}
            </TableSection>
          </IssuesContainer>

          {/* Save / Approve Footer — sticky to bottom of scroll area */}
          <FooterBar>
            <SummaryText>
              <SummaryDot dotColor={theme.colorSuccess} />
              {accepted.length} accepted
              <SummarySeparator>&middot;</SummarySeparator>
              <SummaryDot dotColor={theme.colorOnSurfaceVariant} />
              {dismissed.length} dismissed
              <SummarySeparator>&middot;</SummarySeparator>
              <SummaryDot dotColor={theme.colorWarning} />
              {toReview.length} remaining
            </SummaryText>
            <FooterActions>
              {isSaved ? (
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => {}}>
                  Saved
                </Button>
              ) : (
                <Button
                  size={Button.SIZES.S}
                  appearance={hasPendingChanges ? Button.APPEARANCES.OUTLINE : Button.APPEARANCES.GHOST}
                  onClick={hasPendingChanges ? handleSave : undefined}
                >
                  Save
                </Button>
              )}
              {isApproved ? (
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.PRIMARY} onClick={() => {}}>
                  Approved
                </Button>
              ) : isSaved && toReview.length === 0 ? (
                <Button
                  size={Button.SIZES.S}
                  appearance={Button.APPEARANCES.PRIMARY}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              ) : (
                <Tip content={toReview.length > 0
                  ? 'Please accept or dismiss all issues before approving'
                  : 'Please save errors first before approving'
                }>
                  <span>
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.GHOST}
                      onClick={() => {}}
                    >
                      Approve
                    </Button>
                  </span>
                </Tip>
              )}
            </FooterActions>
          </FooterBar>
        </LeftColumn>

        {/* ═══ RIGHT COLUMN ═══ */}
        <RightColumn>
          {renderPreview()}
        </RightColumn>
      </TwoColumnLayout>

      {/* Toast */}
      <ToastContainer visible={toastVisible}>
        <Icon type={Icon.TYPES.CHECK} size={14} />
        {toastMessage}
      </ToastContainer>
    </PageContainer>
  );
};

export default ErrorReportV2Demo;
