import React, { useState, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Tip from '@rippling/pebble/Tip';
import Tabs from '@rippling/pebble/Tabs';
import Page from '@rippling/pebble/Page';
import Input from '@rippling/pebble/Inputs';
import Drawer from '@rippling/pebble/Drawer';
import {
  CarrierIntegration,
  TransmissionMode,
  TransmissionEvent,
  CARRIERS,
  TRANSMISSION_HISTORY,
  getNeedsSetup,
  getRipplingManaged,
  getSelfManaged,
  getCoverageLabel,
  getTransmissionBadgeLabel,
  getStatusLabel,
  getEdiAvailabilityLabel,
  getDrawerFlowType,
  DrawerFlowType,
} from './benefitsData';

/* ═══════════════════════════════════════════════
   PAGE LAYOUT
   ═══════════════════════════════════════════════ */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const PageHeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
`;

const PageHeaderWrapper = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space1400};
  padding-right: ${({ theme }) => (theme as StyledTheme).space1400};
  & > div { margin-bottom: 0 !important; }
  & div[class*='Content'] {
    margin-top: ${({ theme }) => (theme as StyledTheme).space1000} !important;
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200} !important;
  }
`;

const TabsWrapper = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1400};
  & > div, & div[class*='StyledScroll'], & div[class*='StyledTabContainer'] {
    box-shadow: none !important;
  }
`;

const PageContent = styled.div`
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1200}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  box-sizing: border-box;
`;

/* ═══════════════════════════════════════════════
   SUMMARY BANNER
   ═══════════════════════════════════════════════ */

const Banner = styled.div<{ variant: 'warning' | 'success' | 'info' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  ${({ variant }) => {
    switch (variant) {
      case 'warning': return 'background-color: rgba(245,124,0,0.06); border: 1px solid rgba(245,124,0,0.15);';
      case 'success': return 'background-color: rgba(46,125,50,0.06); border: 1px solid rgba(46,125,50,0.15);';
      case 'info': return 'background-color: rgba(13,71,161,0.06); border: 1px solid rgba(13,71,161,0.15);';
    }
  }}
`;

const BannerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const BannerTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const BannerDetail = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════
   SECTION
   ═══════════════════════════════════════════════ */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SectionCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  margin-top: -${({ theme }) => (theme as StyledTheme).space200};
`;

/* ═══════════════════════════════════════════════
   CARRIER GRID (TABLE)
   ═══════════════════════════════════════════════ */

const Grid = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const GridHeader = styled.div<{ columns: string }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  gap: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space500};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const HeaderCell = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: none;
`;

const GridRow = styled.div<{ isLast?: boolean; columns: string }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  gap: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  align-items: center;
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${(theme as StyledTheme).colorOutlineVariant}`};
  transition: background-color 80ms ease;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const CarrierCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  overflow: hidden;
`;

const CarrierLogo = styled.div<{ bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: #fff;
  font-weight: 700;
`;

const CarrierNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CellTextBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CellSecondary = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MissingText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: rgb(211,47,47);
  font-weight: 500;
`;

const EmptyGridRow = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  text-align: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════
   BADGES
   ═══════════════════════════════════════════════ */

const Badge = styled.span<{ variant: 'primary' | 'success' | 'warning' | 'neutral' | 'error' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  white-space: nowrap;
  ${({ variant }) => {
    switch (variant) {
      case 'primary': return 'background-color: rgba(13,71,161,0.08); color: rgb(13,71,161);';
      case 'success': return 'background-color: rgba(46,125,50,0.08); color: rgb(27,94,32);';
      case 'warning': return 'background-color: rgba(245,124,0,0.08); color: rgb(230,110,0);';
      case 'error': return 'background-color: rgba(211,47,47,0.08); color: rgb(211,47,47);';
      case 'neutral': return 'background-color: rgba(0,0,0,0.04); color: rgba(0,0,0,0.45);';
    }
  }}
`;

/* ── EDI mini-progress ── */

const MiniProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const MiniBar = styled.div`
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  overflow: hidden;
`;

const MiniFill = styled.div<{ pct: number }>`
  height: 100%;
  width: ${({ pct }) => pct}%;
  border-radius: 2px;
  background-color: rgb(13,71,161);
`;

const MiniLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

/* ═══════════════════════════════════════════════
   DRAWER STYLES
   ═══════════════════════════════════════════════ */

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
`;

const DrawerCarrierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const DrawerLogo = styled.div<{ bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: #fff;
  font-weight: 700;
`;

const DrawerCarrierInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DrawerCarrierName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const DrawerCarrierMeta = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DrawerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const DrawerSectionTitle = styled.h4`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const FieldLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const FieldHint = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FieldValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const DrawerActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding-top: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

/* ── Option cards (transmission mode selection) ── */

const OptionCard = styled.button<{ isSelected?: boolean; isRecommended?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerXl};
  border: 1.5px solid ${({ theme, isSelected, isRecommended }) =>
    isSelected ? 'rgb(13,71,161)' :
    isRecommended ? 'rgba(13,71,161,0.4)' :
    (theme as StyledTheme).colorOutlineVariant};
  background: ${({ isSelected }) =>
    isSelected ? 'rgba(13,71,161,0.04)' : 'none'};
  cursor: pointer;
  text-align: left;
  transition: border-color 120ms ease, background-color 120ms ease;
  &:hover {
    border-color: rgb(13,71,161);
    background: rgba(13,71,161,0.02);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const OptionTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: left;
`;

const RecommendedBadge = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  background-color: rgba(13,71,161,0.1);
  color: rgb(13,71,161);
  padding: 2px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  font-weight: 600;
`;

const OptionDesc = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  text-align: left;
  line-height: 1.5;
`;

const AlertBox = styled.div<{ variant: 'warning' | 'error' | 'info' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  ${({ variant }) => {
    switch (variant) {
      case 'warning': return 'background-color: rgba(245,124,0,0.06); color: rgb(180,90,0);';
      case 'error': return 'background-color: rgba(211,47,47,0.06); color: rgb(183,28,28);';
      case 'info': return 'background-color: rgba(13,71,161,0.06); color: rgb(13,71,161);';
    }
  }}
`;

const AttestationBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerXl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const AttestationTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const AttestationText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.5;
`;

/* ── Success state ── */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DrawerSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space800} 0;
  text-align: center;
  animation: ${fadeIn} 300ms ease;
`;

const DrawerSuccessTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const DrawerSuccessDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  max-width: 340px;
  line-height: 1.5;
`;

/* ── Drawer step indicator ── */

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const StepDot = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ isActive, isDone }) =>
    isDone ? 'rgb(46,125,50)' :
    isActive ? 'rgb(13,71,161)' : 'rgba(0,0,0,0.15)'};
  transition: background-color 200ms ease;
`;

const StepLine = styled.div<{ isDone?: boolean }>`
  width: 24px;
  height: 2px;
  background-color: ${({ isDone }) =>
    isDone ? 'rgb(46,125,50)' : 'rgba(0,0,0,0.1)'};
  transition: background-color 200ms ease;
`;

const StepLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-left: ${({ theme }) => (theme as StyledTheme).space200};
`;

/* ═══════════════════════════════════════════════
   HISTORY DRAWER STYLES
   ═══════════════════════════════════════════════ */

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryRow = styled.div<{ isLast?: boolean }>`
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${(theme as StyledTheme).colorOutlineVariant}`};
`;

const HistoryDate = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const HistoryDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const HistoryStatus = styled.span<{ status: string }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  white-space: nowrap;
  ${({ status }) => {
    switch (status) {
      case 'confirmed': return 'background-color: rgba(46,125,50,0.08); color: rgb(27,94,32);';
      case 'sent':      return 'background-color: rgba(13,71,161,0.08); color: rgb(13,71,161);';
      case 'failed':    return 'background-color: rgba(211,47,47,0.08); color: rgb(183,28,28);';
      case 'pending':   return 'background-color: rgba(245,124,0,0.08); color: rgb(180,90,0);';
      default:          return 'background-color: rgba(0,0,0,0.04); color: rgba(0,0,0,0.45);';
    }
  }}
`;

const HistoryEmptyState = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space1200} ${({ theme }) => (theme as StyledTheme).space600};
  text-align: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

type DrawerStep = 'choose-mode' | 'fill-data' | 'attestation' | 'success';

interface BenefitsOverviewProps {
  onNavigateToIntegrations?: () => void;
}

const BenefitsOverview: React.FC<BenefitsOverviewProps> = ({ onNavigateToIntegrations }) => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [carriers, setCarriers] = useState<CarrierIntegration[]>([...CARRIERS]);

  // History drawer state
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyCarrierId, setHistoryCarrierId] = useState<string | null>(null);

  const historyCarrier = useMemo(
    () => (historyCarrierId ? carriers.find(c => c.id === historyCarrierId) ?? null : null),
    [historyCarrierId, carriers]
  );
  const historyEvents: TransmissionEvent[] = historyCarrierId ? (TRANSMISSION_HISTORY[historyCarrierId] ?? []) : [];

  const openHistoryDrawer = useCallback((carrier: CarrierIntegration) => {
    setHistoryCarrierId(carrier.id);
    setHistoryDrawerOpen(true);
  }, []);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCarrierId, setDrawerCarrierId] = useState<string | null>(null);
  const [drawerStep, setDrawerStep] = useState<DrawerStep>('choose-mode');
  const [selectedMode, setSelectedMode] = useState<TransmissionMode | null>(null);
  const [groupIdDraft, setGroupIdDraft] = useState('');
  const [contactDraft, setContactDraft] = useState('');
  const [attestChecked, setAttestChecked] = useState(false);

  // Computed sections
  const needsSetup = useMemo(() => getNeedsSetup(carriers), [carriers]);
  const ripplingManaged = useMemo(() => getRipplingManaged(carriers), [carriers]);
  const selfManaged = useMemo(() => getSelfManaged(carriers), [carriers]);

  const totalCount = carriers.length;

  const drawerCarrier = useMemo(
    () => (drawerCarrierId ? carriers.find(c => c.id === drawerCarrierId) ?? null : null),
    [drawerCarrierId, carriers]
  );

  const flowType: DrawerFlowType | null = drawerCarrier ? getDrawerFlowType(drawerCarrier) : null;

  /* ── Drawer management ── */
  const openSetupDrawer = useCallback((carrier: CarrierIntegration) => {
    setDrawerCarrierId(carrier.id);
    setSelectedMode(null);
    setGroupIdDraft(carrier.groupId || '');
    setContactDraft(carrier.sendingContactEmail || '');
    setAttestChecked(false);

    const flow = getDrawerFlowType(carrier);
    if (flow === 'manual-only') {
      setSelectedMode('manual');
      setDrawerStep(carrier.groupId ? 'attestation' : 'fill-data');
    } else {
      setDrawerStep('choose-mode');
    }
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDrawerCarrierId(null);
    setSelectedMode(null);
    setGroupIdDraft('');
    setContactDraft('');
    setAttestChecked(false);
    setDrawerStep('choose-mode');
  }, []);

  /* ── Drawer navigation ── */
  const handleModeSelected = useCallback(() => {
    if (!selectedMode || !drawerCarrier) return;

    const needsGroupId = !drawerCarrier.groupId;
    const needsContact = selectedMode === 'forms-email' && !drawerCarrier.sendingContactEmail;

    if (needsGroupId || needsContact) {
      setDrawerStep('fill-data');
    } else if (selectedMode === 'manual' || selectedMode === 'forms-email') {
      setDrawerStep('attestation');
    } else {
      handleFinalSubmit(selectedMode, drawerCarrier.groupId || '', drawerCarrier.sendingContactEmail || '');
    }
  }, [selectedMode, drawerCarrier]);

  const handleDataNext = useCallback(() => {
    if (!selectedMode || !drawerCarrier) return;

    if (selectedMode === 'manual' || selectedMode === 'forms-email') {
      setDrawerStep('attestation');
    } else {
      handleFinalSubmit(selectedMode, groupIdDraft, contactDraft);
    }
  }, [selectedMode, drawerCarrier, groupIdDraft, contactDraft]);

  const handleFinalSubmit = useCallback((mode: TransmissionMode, gid: string, email: string) => {
    if (!drawerCarrierId) return;

    setCarriers(prev =>
      prev.map(c => {
        if (c.id !== drawerCarrierId) return c;

        const updated = { ...c };
        if (gid.trim()) updated.groupId = gid.trim();
        if (email.trim()) updated.sendingContactEmail = email.trim();
        updated.transmissionMode = mode;

        if (mode === 'manual') {
          updated.configState = 'self-managed';
          updated.setupStatus = 'active';
          updated.attested = true;
          updated.attestedBy = 'Sarah Chen';
          updated.attestedAt = new Date().toISOString();
        } else if (mode === 'edi' || mode === 'api') {
          updated.configState = 'rippling-managed';
          updated.setupStatus = 'in-progress';
          updated.ediProgressStep = 1;
          updated.ediProgressTotal = 5;
          updated.ediProgressLabel = 'Connection Requested';
          updated.dualCommsActive = updated.acceptsForms;
          updated.attested = true;
          updated.attestedBy = 'Sarah Chen';
          updated.attestedAt = new Date().toISOString();
        } else {
          updated.configState = 'rippling-managed';
          updated.setupStatus = 'active';
          updated.attested = true;
          updated.attestedBy = 'Sarah Chen';
          updated.attestedAt = new Date().toISOString();
        }

        return updated;
      })
    );

    setDrawerStep('success');
  }, [drawerCarrierId]);

  const handleAttestSubmit = useCallback(() => {
    if (!drawerCarrierId || !selectedMode) return;
    handleFinalSubmit(selectedMode, groupIdDraft, contactDraft);
  }, [drawerCarrierId, selectedMode, groupIdDraft, contactDraft, handleFinalSubmit]);

  /* ── Needs-setup grid columns ── */
  const setupCols = 'minmax(180px, 1.8fr) minmax(80px, 0.7fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(130px, 1.2fr) 80px';
  const managedCols = 'minmax(180px, 1.8fr) minmax(80px, 0.7fr) minmax(120px, 1.2fr) minmax(120px, 1.2fr) minmax(100px, 1fr) 80px';
  const selfCols = 'minmax(180px, 1.8fr) minmax(80px, 0.7fr) minmax(100px, 1fr) minmax(130px, 1.2fr) minmax(100px, 1fr)';

  /* ── Drawer step count ── */
  const getDrawerStepCount = (): number => {
    if (!drawerCarrier || !flowType) return 2;
    if (flowType === 'manual-only') {
      return drawerCarrier.groupId ? 1 : 2;
    }
    const needsData = !drawerCarrier.groupId || (selectedMode === 'forms-email' && !drawerCarrier.sendingContactEmail);
    if (selectedMode === 'manual') return needsData ? 3 : 2;
    return needsData ? 2 : 1;
  };

  const getCurrentStepNum = (): number => {
    if (flowType === 'manual-only') {
      if (drawerStep === 'fill-data') return 1;
      if (drawerStep === 'attestation') return drawerCarrier?.groupId ? 1 : 2;
    }
    if (drawerStep === 'choose-mode') return 1;
    if (drawerStep === 'fill-data') return 2;
    if (drawerStep === 'attestation') return selectedMode === 'manual' ? (getDrawerStepCount()) : getDrawerStepCount();
    return getDrawerStepCount();
  };

  /* ═══════════════════════════════════════════════
     RENDER: DRAWER CONTENT
     ═══════════════════════════════════════════════ */

  const renderDrawerSteps = () => {
    const total = getDrawerStepCount();
    const current = getCurrentStepNum();
    if (drawerStep === 'success' || total <= 1) return null;

    const steps = Array.from({ length: total }, (_, i) => i + 1);

    return (
      <StepIndicator theme={theme}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <StepDot
              isActive={s === current}
              isDone={s < current || drawerStep === 'success'}
            />
            {i < steps.length - 1 && (
              <StepLine isDone={s < current} />
            )}
          </React.Fragment>
        ))}
        <StepLabel theme={theme}>Step {current} of {total}</StepLabel>
      </StepIndicator>
    );
  };

  const renderChooseMode = () => {
    if (!drawerCarrier || !flowType) return null;

    const showEdi = flowType === 'full-3-options' || flowType === 'edi-and-manual';
    const showForms = flowType === 'full-3-options' || flowType === 'forms-and-manual';

    return (
      <>
        <DrawerSectionTitle theme={theme}>How should enrollments be transmitted?</DrawerSectionTitle>

        {showEdi && (
          <OptionCard
            theme={theme}
            isSelected={selectedMode === 'edi'}
            isRecommended
            onClick={() => setSelectedMode('edi')}
          >
            <OptionHeader theme={theme}>
              <OptionTitle theme={theme}>EDI / API (Automated)</OptionTitle>
              <RecommendedBadge theme={theme}>Recommended</RecommendedBadge>
            </OptionHeader>
            <OptionDesc theme={theme}>
              Rippling transmits enrollment data electronically to {drawerCarrier.carrierName}. Setup takes 2–6 weeks. {drawerCarrier.acceptsForms ? 'Forms will be sent in the meantime.' : ''}
            </OptionDesc>
          </OptionCard>
        )}

        {showForms && (
          <OptionCard
            theme={theme}
            isSelected={selectedMode === 'forms-email'}
            onClick={() => setSelectedMode('forms-email')}
          >
            <OptionTitle theme={theme}>Form Sending (Rippling-managed)</OptionTitle>
            <OptionDesc theme={theme}>
              Rippling generates and emails enrollment forms to {drawerCarrier.carrierName} on your behalf. You are responsible for confirming the carrier processes them.
            </OptionDesc>
          </OptionCard>
        )}

        <OptionCard
          theme={theme}
          isSelected={selectedMode === 'manual'}
          onClick={() => setSelectedMode('manual')}
        >
          <OptionTitle theme={theme}>Manual (Self-managed)</OptionTitle>
          <OptionDesc theme={theme}>
            You handle all enrollment submissions directly with {drawerCarrier.carrierName}. Rippling will not transmit anything for this carrier.
          </OptionDesc>
        </OptionCard>

        {drawerCarrier.carrierDoesNotAcceptForms && (
          <AlertBox theme={theme} variant="warning">
            <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={16} color="rgb(180,90,0)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{drawerCarrier.carrierName} does not accept enrollment forms via email or fax.</span>
          </AlertBox>
        )}

        <DrawerActions theme={theme}>
          <Button size={Button.SIZES.M} appearance={Button.APPEARANCES.OUTLINE} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.PRIMARY}
            onClick={handleModeSelected}
            isDisabled={!selectedMode}
          >
            Continue
          </Button>
        </DrawerActions>
      </>
    );
  };

  const renderFillData = () => {
    if (!drawerCarrier) return null;

    const needsGroupId = !drawerCarrier.groupId;
    const needsContact = selectedMode === 'forms-email' && !drawerCarrier.sendingContactEmail;

    const canProceed = (!needsGroupId || groupIdDraft.trim().length > 0) &&
                       (!needsContact || contactDraft.trim().length > 0);

    return (
      <>
        <DrawerSectionTitle theme={theme}>Complete required information</DrawerSectionTitle>

        {needsGroupId && (
          <FieldBlock theme={theme}>
            <FieldLabel theme={theme}>Group ID *</FieldLabel>
            <FieldHint theme={theme}>
              Your carrier-assigned group number. Required to transmit enrollments.
            </FieldHint>
            <Input.Text
              value={groupIdDraft}
              onChange={(e: any) => setGroupIdDraft(e?.target?.value ?? e)}
              placeholder="e.g. 123456"
              size={Input.Text.SIZES.M}
            />
          </FieldBlock>
        )}

        {!needsGroupId && drawerCarrier.groupId && (
          <FieldBlock theme={theme}>
            <FieldLabel theme={theme}>Group ID</FieldLabel>
            <FieldValue theme={theme}>{drawerCarrier.groupId}</FieldValue>
          </FieldBlock>
        )}

        {needsContact && (
          <FieldBlock theme={theme}>
            <FieldLabel theme={theme}>Carrier contact email *</FieldLabel>
            <FieldHint theme={theme}>
              Rippling will send enrollment forms to this email address.
            </FieldHint>
            <Input.Text
              value={contactDraft}
              onChange={(e: any) => setContactDraft(e?.target?.value ?? e)}
              placeholder="e.g. enrollments@carrier.com"
              size={Input.Text.SIZES.M}
            />
          </FieldBlock>
        )}

        {selectedMode === 'forms-email' && drawerCarrier.sendingContactEmail && !needsContact && (
          <FieldBlock theme={theme}>
            <FieldLabel theme={theme}>Carrier contact email</FieldLabel>
            <FieldValue theme={theme}>{drawerCarrier.sendingContactEmail}</FieldValue>
          </FieldBlock>
        )}

        <DrawerActions theme={theme}>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={() => {
              if (flowType === 'manual-only') {
                closeDrawer();
              } else {
                setDrawerStep('choose-mode');
              }
            }}
          >
            Back
          </Button>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.PRIMARY}
            onClick={handleDataNext}
            isDisabled={!canProceed}
          >
            {selectedMode === 'manual' ? 'Continue' : 'Confirm & Set Up'}
          </Button>
        </DrawerActions>
      </>
    );
  };

  const renderAttestation = () => {
    if (!drawerCarrier) return null;

    const isForms = selectedMode === 'forms-email';

    return (
      <>
        <DrawerSectionTitle theme={theme}>
          {isForms ? 'Confirm form sending' : 'Acknowledge manual responsibility'}
        </DrawerSectionTitle>

        <AttestationBox theme={theme}>
          <AttestationTitle theme={theme}>Before you confirm</AttestationTitle>
          {isForms ? (
            <>
              <AttestationText theme={theme}>
                Rippling will email completed enrollment forms to <strong>{drawerCarrier.sendingContactEmail || contactDraft}</strong> on your behalf whenever an enrollment event occurs.
              </AttestationText>
              <AttestationText theme={theme}>
                1. Rippling sends the form but <strong>cannot confirm</strong> the carrier has received or processed it.
              </AttestationText>
              <AttestationText theme={theme}>
                2. You are responsible for following up with {drawerCarrier.carrierName} to verify each submission was processed.
              </AttestationText>
              <AttestationText theme={theme}>
                3. Unprocessed forms may result in coverage gaps for your employees.
              </AttestationText>
            </>
          ) : (
            <>
              <AttestationText theme={theme}>
                By choosing manual management for <strong>{drawerCarrier.carrierName}</strong>, you understand that:
              </AttestationText>
              <AttestationText theme={theme}>
                1. Rippling will <strong>not</strong> transmit any enrollment data to this carrier.
              </AttestationText>
              <AttestationText theme={theme}>
                2. You are responsible for submitting all new hires, terminations, and changes directly.
              </AttestationText>
              <AttestationText theme={theme}>
                3. Any missed or late submissions may result in coverage gaps for your employees.
              </AttestationText>
            </>
          )}
        </AttestationBox>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.space300 }}>
          <Input.Checkbox
            isChecked={attestChecked}
            onChange={() => setAttestChecked(!attestChecked)}
          />
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => setAttestChecked(!attestChecked)}
          >
            <CellText theme={theme}>
              {isForms
                ? `I understand that Rippling sends forms on my behalf, and I am responsible for confirming ${drawerCarrier.carrierName} has processed each submission.`
                : `I acknowledge that I am responsible for managing enrollments with ${drawerCarrier.carrierName} outside of Rippling.`}
            </CellText>
          </span>
        </div>

        <DrawerActions theme={theme}>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={() => {
              const needsData = !drawerCarrier.groupId || (isForms && !drawerCarrier.sendingContactEmail);
              setDrawerStep(needsData ? 'fill-data' : 'choose-mode');
            }}
          >
            Back
          </Button>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.PRIMARY}
            onClick={handleAttestSubmit}
            isDisabled={!attestChecked}
          >
            Confirm
          </Button>
        </DrawerActions>
      </>
    );
  };

  const renderSuccess = () => {
    if (!drawerCarrier) return null;

    const mode = carriers.find(c => c.id === drawerCarrierId);
    const isManual = mode?.transmissionMode === 'manual';
    const isEdi = mode?.transmissionMode === 'edi' || mode?.transmissionMode === 'api';

    return (
      <DrawerSuccess theme={theme}>
        <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={44} color="rgb(46,125,50)" />
        <DrawerSuccessTitle theme={theme}>
          {isManual ? 'Manual mode confirmed' :
           isEdi ? 'Automation initiated' :
           'Form sending activated'}
        </DrawerSuccessTitle>
        <DrawerSuccessDesc theme={theme}>
          {isManual
            ? `${drawerCarrier.carrierName} has been moved to Self-Managed Transmissions. You are responsible for all enrollment submissions.`
            : isEdi
            ? `${drawerCarrier.carrierName} EDI/API connection has been initiated. ${drawerCarrier.acceptsForms ? 'Forms will be sent in the meantime.' : ''} Track progress in Rippling-Managed Transmissions.`
            : `${drawerCarrier.carrierName} is now set up for form sending. Rippling will email enrollment forms on your behalf. Track status in Rippling-Managed Transmissions.`}
        </DrawerSuccessDesc>
        <Button size={Button.SIZES.M} appearance={Button.APPEARANCES.PRIMARY} onClick={closeDrawer}>
          Done
        </Button>
      </DrawerSuccess>
    );
  };

  const renderDrawerContent = () => {
    if (!drawerCarrier) return null;

    return (
      <DrawerBody theme={theme}>
        <DrawerCarrierHeader theme={theme}>
          <DrawerLogo theme={theme} bg={drawerCarrier.carrierLogoColor}>
            {drawerCarrier.carrierName.charAt(0)}
          </DrawerLogo>
          <DrawerCarrierInfo theme={theme}>
            <DrawerCarrierName theme={theme}>{drawerCarrier.carrierName}</DrawerCarrierName>
            <DrawerCarrierMeta theme={theme}>
              {getCoverageLabel(drawerCarrier)} · Effective {drawerCarrier.effectiveStart}
            </DrawerCarrierMeta>
          </DrawerCarrierInfo>
        </DrawerCarrierHeader>

        {drawerStep !== 'success' && renderDrawerSteps()}

        {drawerStep === 'choose-mode' && renderChooseMode()}
        {drawerStep === 'fill-data' && renderFillData()}
        {drawerStep === 'attestation' && renderAttestation()}
        {drawerStep === 'success' && renderSuccess()}
      </DrawerBody>
    );
  };

  /* ═══════════════════════════════════════════════
     RENDER: PAGE
     ═══════════════════════════════════════════════ */

  const getTransmissionBadgeVariant = (mode: TransmissionMode): 'primary' | 'success' | 'warning' | 'neutral' | 'error' => {
    switch (mode) {
      case 'edi': case 'api': return 'primary';
      case 'forms-email': case 'forms-fax': return 'success';
      case 'manual': return 'neutral';
      case 'not-configured': return 'warning';
    }
  };

  return (
    <PageContainer theme={theme}>
      <PageHeaderArea theme={theme}>
        <PageHeaderWrapper theme={theme}>
          <Page.Header
            title="Benefits Overview"
            shouldBeUnderlined={false}
            size={Page.Header.SIZES.FLUID}
          />
        </PageHeaderWrapper>
        <TabsWrapper theme={theme}>
          <Tabs.LINK activeIndex={activeTab} onChange={idx => setActiveTab(Number(idx))}>
            <Tabs.Tab title="Current benefits" />
            <Tabs.Tab title="Upcoming benefits" />
            <Tabs.Tab title="Past benefits" />
          </Tabs.LINK>
        </TabsWrapper>
      </PageHeaderArea>

      <PageContent theme={theme}>
        {/* ── Summary Banner ── */}
        {needsSetup.length > 0 ? (
          <Banner theme={theme} variant="warning">
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={20} color="rgb(230,110,0)" />
            </div>
            <BannerBody theme={theme}>
              <BannerTitle theme={theme}>
                {needsSetup.length} {needsSetup.length === 1 ? 'carrier needs' : 'carriers need'} your setup
              </BannerTitle>
              <BannerDetail theme={theme}>
                Choose a transmission mode and complete required information to begin sending enrollments.
              </BannerDetail>
            </BannerBody>
          </Banner>
        ) : (
          <Banner theme={theme} variant="success">
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={20} color="rgb(46,125,50)" />
            </div>
            <BannerBody theme={theme}>
              <BannerTitle theme={theme}>All carriers configured</BannerTitle>
              <BannerDetail theme={theme}>
                {totalCount} carriers are set up for enrollment transmission.
              </BannerDetail>
            </BannerBody>
          </Banner>
        )}

        {/* ══════════════════════════════════════
           SECTION 1: NEEDS YOUR SETUP
           ══════════════════════════════════════ */}
        {needsSetup.length > 0 && (
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Needs Your Setup</SectionTitle>
              <SectionCount theme={theme}>({needsSetup.length})</SectionCount>
            </SectionHeader>
            <SectionDescription theme={theme}>
              These carriers are not yet configured for enrollment transmission. Click a carrier to choose a transmission mode and provide required information.
            </SectionDescription>
            <Grid theme={theme}>
              <GridHeader theme={theme} columns={setupCols}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Group ID</HeaderCell>
                <HeaderCell theme={theme}>Contact Email</HeaderCell>
                <HeaderCell theme={theme}>Available Options</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeader>
              {needsSetup.map((carrier, idx) => (
                <GridRow
                  key={carrier.id}
                  theme={theme}
                  isLast={idx === needsSetup.length - 1}
                  columns={setupCols}
                  onClick={() => openSetupDrawer(carrier)}
                >
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={carrier.carrierLogoColor}>
                      {carrier.carrierName.charAt(0)}
                    </CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{carrier.carrierName}</CellTextBold>
                      <CellSecondary theme={theme}>Eff. {carrier.effectiveStart}</CellSecondary>
                    </CarrierNameBlock>
                  </CarrierCell>

                  <CellText theme={theme}>{getCoverageLabel(carrier)}</CellText>

                  <div>
                    {carrier.groupId ? (
                      <CellText theme={theme}>{carrier.groupId}</CellText>
                    ) : (
                      <MissingText theme={theme}>Missing</MissingText>
                    )}
                  </div>

                  <div>
                    {carrier.sendingContactEmail ? (
                      <Tip content={carrier.sendingContactEmail} placement="top">
                        <CellText theme={theme} style={{ cursor: 'help' }}>
                          {carrier.sendingContactEmail.length > 24
                            ? carrier.sendingContactEmail.substring(0, 22) + '...'
                            : carrier.sendingContactEmail}
                        </CellText>
                      </Tip>
                    ) : (
                      <CellSecondary theme={theme}>—</CellSecondary>
                    )}
                  </div>

                  <div>
                    <Badge theme={theme} variant={carrier.ediAvailability === 'available' ? 'primary' : 'neutral'}>
                      {getEdiAvailabilityLabel(carrier)}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      size={Button.SIZES.XS}
                      appearance={Button.APPEARANCES.OUTLINE}
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); openSetupDrawer(carrier); }}
                    >
                      Set up
                    </Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>
        )}

        {/* ══════════════════════════════════════
           SECTION 2: RIPPLING-MANAGED
           ══════════════════════════════════════ */}
        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Rippling-Managed Transmissions</SectionTitle>
            <SectionCount theme={theme}>({ripplingManaged.length})</SectionCount>
          </SectionHeader>
          <SectionDescription theme={theme}>
            Rippling handles enrollment transmission for these carriers via EDI, API, or automated form sending.
          </SectionDescription>
          <Grid theme={theme}>
            <GridHeader theme={theme} columns={managedCols}>
              <HeaderCell theme={theme}>Carrier</HeaderCell>
              <HeaderCell theme={theme}>Coverage</HeaderCell>
              <HeaderCell theme={theme}>Transmission</HeaderCell>
              <HeaderCell theme={theme}>Status</HeaderCell>
              <HeaderCell theme={theme}>Last Sent</HeaderCell>
              <HeaderCell theme={theme} />
            </GridHeader>
            {ripplingManaged.length > 0 ? (
              ripplingManaged.map((carrier, idx) => (
                <GridRow
                  key={carrier.id}
                  theme={theme}
                  isLast={idx === ripplingManaged.length - 1}
                  columns={managedCols}
                  style={{ cursor: 'default' }}
                  onClick={() => {}}
                >
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={carrier.carrierLogoColor}>
                      {carrier.carrierName.charAt(0)}
                    </CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{carrier.carrierName}</CellTextBold>
                      <CellSecondary theme={theme}>Eff. {carrier.effectiveStart}</CellSecondary>
                    </CarrierNameBlock>
                  </CarrierCell>

                  <CellText theme={theme}>{getCoverageLabel(carrier)}</CellText>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CellTextBold theme={theme}>
                      {getTransmissionBadgeLabel(carrier.transmissionMode)}
                    </CellTextBold>
                    {carrier.dualCommsActive && (
                      <Tip content="Forms are also being sent while EDI/API is being set up" placement="top">
                        <CellSecondary theme={theme} style={{ cursor: 'help' }}>
                          + Forms (dual comms)
                        </CellSecondary>
                      </Tip>
                    )}
                    {carrier.cobraNote && (
                      <Tip content={carrier.cobraNote} placement="top">
                        <CellSecondary theme={theme} style={{ cursor: 'help' }}>
                          {carrier.cobraNote}
                        </CellSecondary>
                      </Tip>
                    )}
                  </div>

                  <div>
                    {carrier.setupStatus === 'in-progress' && carrier.ediProgressStep && carrier.ediProgressTotal ? (
                      <MiniProgress theme={theme}>
                        <MiniBar theme={theme}>
                          <MiniFill pct={(carrier.ediProgressStep / carrier.ediProgressTotal) * 100} />
                        </MiniBar>
                        <Tip content={`Step ${carrier.ediProgressStep}/${carrier.ediProgressTotal}: ${carrier.ediProgressLabel}`} placement="top">
                          <MiniLabel theme={theme} style={{ cursor: 'help' }}>
                            {carrier.ediProgressStep}/{carrier.ediProgressTotal}
                          </MiniLabel>
                        </Tip>
                      </MiniProgress>
                    ) : (
                      <Badge theme={theme} variant="success">
                        <Icon type={Icon.TYPES.CHECK} size={10} color="rgb(27,94,32)" />
                        {getStatusLabel(carrier.setupStatus)}
                      </Badge>
                    )}
                  </div>

                  <CellSecondary theme={theme}>
                    {carrier.lastTransmissionDate || '—'}
                  </CellSecondary>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {carrier.setupStatus === 'in-progress' ? (
                      <Tip
                        content={`Step ${carrier.ediProgressStep}/${carrier.ediProgressTotal}: ${carrier.ediProgressLabel}`}
                        placement="left"
                      >
                        <span>
                          <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>
                            EDI Status
                          </Button>
                        </span>
                      </Tip>
                    ) : (
                      <Button
                        size={Button.SIZES.XS}
                        appearance={Button.APPEARANCES.OUTLINE}
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); openHistoryDrawer(carrier); }}
                      >
                        History
                      </Button>
                    )}
                  </div>
                </GridRow>
              ))
            ) : (
              <EmptyGridRow theme={theme}>
                {needsSetup.length > 0
                  ? 'Carriers will appear here after you set them up above.'
                  : 'No Rippling-managed carriers.'}
              </EmptyGridRow>
            )}
          </Grid>
        </Section>

        {/* ══════════════════════════════════════
           SECTION 3: SELF-MANAGED
           ══════════════════════════════════════ */}
        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Self-Managed Transmissions</SectionTitle>
            <SectionCount theme={theme}>({selfManaged.length})</SectionCount>
          </SectionHeader>
          <SectionDescription theme={theme}>
            You are responsible for submitting enrollments directly to these carriers outside of Rippling.
          </SectionDescription>
          <Grid theme={theme}>
            <GridHeader theme={theme} columns={selfCols}>
              <HeaderCell theme={theme}>Carrier</HeaderCell>
              <HeaderCell theme={theme}>Coverage</HeaderCell>
              <HeaderCell theme={theme}>Group ID</HeaderCell>
              <HeaderCell theme={theme}>Acknowledged by</HeaderCell>
              <HeaderCell theme={theme}>Date</HeaderCell>
            </GridHeader>
            {selfManaged.length > 0 ? (
              selfManaged.map((carrier, idx) => (
                <GridRow
                  key={carrier.id}
                  theme={theme}
                  isLast={idx === selfManaged.length - 1}
                  columns={selfCols}
                  style={{ cursor: 'default' }}
                  onClick={() => {}}
                >
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={carrier.carrierLogoColor}>
                      {carrier.carrierName.charAt(0)}
                    </CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{carrier.carrierName}</CellTextBold>
                      <CellSecondary theme={theme}>Eff. {carrier.effectiveStart}</CellSecondary>
                    </CarrierNameBlock>
                  </CarrierCell>

                  <CellText theme={theme}>{getCoverageLabel(carrier)}</CellText>

                  <CellText theme={theme}>{carrier.groupId || '—'}</CellText>

                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
                    <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={14} color="rgb(46,125,50)" />
                    <CellText theme={theme}>{carrier.attestedBy || '—'}</CellText>
                  </div>

                  <CellSecondary theme={theme}>
                    {carrier.attestedAt
                      ? new Date(carrier.attestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </CellSecondary>
                </GridRow>
              ))
            ) : (
              <EmptyGridRow theme={theme}>
                No self-managed carriers. All carriers are handled by Rippling.
              </EmptyGridRow>
            )}
          </Grid>
        </Section>
      </PageContent>

      {/* ═══════════════════════════════════════
         SETUP DRAWER
         ═══════════════════════════════════════ */}
      <Drawer
        isVisible={drawerOpen}
        onCancel={closeDrawer}
        title={
          drawerStep === 'success'
            ? 'Setup Complete'
            : `Set up ${drawerCarrier?.carrierName ?? ''}`
        }
        width={864}
      >
        {renderDrawerContent()}
      </Drawer>

      {/* ═══════════════════════════════════════
         HISTORY DRAWER
         ═══════════════════════════════════════ */}
      <Drawer
        isVisible={historyDrawerOpen}
        onCancel={() => setHistoryDrawerOpen(false)}
        title={historyCarrier ? `${historyCarrier.carrierName} — Transmission History` : 'Transmission History'}
        width={600}
      >
        <DrawerBody theme={theme}>
          {historyCarrier && (
            <DrawerCarrierHeader theme={theme}>
              <DrawerLogo theme={theme} bg={historyCarrier.carrierLogoColor}>
                {historyCarrier.carrierName.charAt(0)}
              </DrawerLogo>
              <DrawerCarrierInfo theme={theme}>
                <DrawerCarrierName theme={theme}>{historyCarrier.carrierName}</DrawerCarrierName>
                <DrawerCarrierMeta theme={theme}>
                  {getCoverageLabel(historyCarrier)} · {getTransmissionBadgeLabel(historyCarrier.transmissionMode)} · Eff. {historyCarrier.effectiveStart}
                </DrawerCarrierMeta>
              </DrawerCarrierInfo>
            </DrawerCarrierHeader>
          )}

          {historyEvents.length > 0 ? (
            <HistoryList theme={theme}>
              {historyEvents.map((event, idx) => (
                <HistoryRow key={idx} theme={theme} isLast={idx === historyEvents.length - 1}>
                  <HistoryDate theme={theme}>{event.date}</HistoryDate>
                  <HistoryDesc theme={theme}>{event.description}</HistoryDesc>
                  <HistoryStatus theme={theme} status={event.status}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </HistoryStatus>
                </HistoryRow>
              ))}
            </HistoryList>
          ) : (
            <HistoryEmptyState theme={theme}>
              No transmission history yet for this carrier.
            </HistoryEmptyState>
          )}

          <DrawerActions theme={theme}>
            <Button size={Button.SIZES.M} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setHistoryDrawerOpen(false)}>
              Close
            </Button>
          </DrawerActions>
        </DrawerBody>
      </Drawer>
    </PageContainer>
  );
};

export default BenefitsOverview;
