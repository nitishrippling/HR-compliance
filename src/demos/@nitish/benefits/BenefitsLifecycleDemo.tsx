import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Tip from '@rippling/pebble/Tip';
import Tabs from '@rippling/pebble/Tabs';
import Page from '@rippling/pebble/Page';
import RipplingLogoBlack from '@/assets/rippling-logo-black.svg';
import RipplingLogoWhite from '@/assets/rippling-logo-white.svg';

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

type LifecycleState =
  | 'empty'
  | 'setup-in-progress'
  | 'actions-required'
  | 'in-progress'
  | 'steady-state'
  | 'renewal-oe';

interface StateOption {
  id: LifecycleState;
  label: string;
  step: number;
  description: string;
}

const LIFECYCLE_STATES: StateOption[] = [
  { id: 'empty', label: 'Empty', step: 0, description: 'No benefits configured' },
  { id: 'setup-in-progress', label: 'Setup In Progress', step: 1, description: 'NGE started, not completed' },
  { id: 'actions-required', label: 'Actions Required', step: 2, description: 'Plans active, tasks pending' },
  { id: 'in-progress', label: 'In Progress', step: 3, description: 'EDI/API connections establishing' },
  { id: 'steady-state', label: 'Steady State', step: 4, description: 'All carriers active' },
  { id: 'renewal-oe', label: 'Renewal & OE', step: 5, description: 'Renewal event on steady state' },
];

/* ═══════════════════════════════════════════════
   STATE SWITCHER BAR (Top of viewport)
   ═══════════════════════════════════════════════ */

const SwitcherBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHighest};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  padding: 6px 20px;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SwitcherLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap;
  flex-shrink: 0;
`;

const SwitcherChips = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  flex: 1;
`;

const SwitcherChip = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1.5px solid ${({ isActive }) => (isActive ? 'rgb(13,71,161)' : 'transparent')};
  background-color: ${({ isActive, theme }) =>
    isActive ? 'rgba(13,71,161,0.08)' : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  white-space: nowrap;
  transition: all 100ms ease;
  &:hover {
    border-color: ${({ isActive }) => (isActive ? 'rgb(13,71,161)' : 'rgba(0,0,0,0.15)')};
  }
`;

const ChipStep = styled.span<{ isActive?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  background-color: ${({ isActive }) => (isActive ? 'rgb(13,71,161)' : 'rgba(0,0,0,0.08)')};
  color: ${({ isActive }) => (isActive ? '#fff' : 'rgba(0,0,0,0.45)')};
`;

const ChipLabel = styled.span<{ isActive?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ isActive, theme }) =>
    isActive ? 'rgb(13,71,161)' : (theme as StyledTheme).colorOnSurface};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
`;

const SwitcherDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  flex-shrink: 0;
`;

/* ═══════════════════════════════════════════════
   APP SHELL (Nav + Sidebar)
   ═══════════════════════════════════════════════ */

const ShellContainer = styled.div`
  height: 100vh;
  padding-top: 40px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  overflow: hidden;
`;

const TopNav = styled.nav`
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  height: 56px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  z-index: 100;
`;

const NavLogo = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  flex-shrink: 0;
`;

const LogoImg = styled.img`
  width: 127px;
  height: auto;
  cursor: pointer;
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const NavDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  opacity: 0.2;
`;

const NavBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
`;

const NavBreadcrumbItem = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const NavRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const NavSearchBar = styled.div`
  flex: 1;
  max-width: 420px;
  height: 36px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-right: auto;
`;

const NavSearchText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const NavIconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const NavAvatarBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  top: 96px;
  bottom: 0;
  width: 220px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 80;
`;

const SidebarGroup = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SidebarItem = styled.button<{ isActive?: boolean }>`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  background: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorSurfaceContainerLow : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  transition: background-color 80ms ease;
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const SidebarDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const MainContent = styled.main`
  position: fixed;
  left: 220px;
  top: 96px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

/* ═══════════════════════════════════════════════
   PAGE LAYOUT (shared across states)
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
   SHARED COMPONENTS
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

const Grid = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const GridHeaderRow = styled.div<{ columns: string }>`
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
`;

const GridRow = styled.div<{ isLast?: boolean; columns: string; clickable?: boolean }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  gap: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  align-items: center;
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${(theme as StyledTheme).colorOutlineVariant}`};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: background-color 80ms ease;
  &:hover {
    background-color: ${({ clickable, theme }) =>
      clickable ? (theme as StyledTheme).colorSurfaceContainerLow : 'transparent'};
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

const CellTextBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
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

/* ── Empty state ── */

const EmptyCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  text-align: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space1200};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const EmptyTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const EmptyDesc = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  max-width: 480px;
  margin: 0;
  line-height: 1.6;
`;

/* ── Setup progress card ── */

const SetupCard = styled.div`
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SetupTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SetupMeta = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: -${({ theme }) => (theme as StyledTheme).space400};
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StepRow = styled.div<{ status: 'done' | 'current' | 'upcoming' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
`;

const StepIcon = styled.div<{ status: 'done' | 'current' | 'upcoming' }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ status }) => {
    switch (status) {
      case 'done': return 'background-color: rgb(46,125,50); color: #fff;';
      case 'current': return 'background-color: rgb(13,71,161); color: #fff;';
      case 'upcoming': return 'background-color: rgba(0,0,0,0.06); color: rgba(0,0,0,0.3);';
    }
  }}
  font-size: 12px;
  font-weight: 700;
`;

const StepText = styled.span<{ status: 'done' | 'current' | 'upcoming' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ status, theme }) =>
    status === 'upcoming' ? (theme as StyledTheme).colorOnSurfaceVariant : (theme as StyledTheme).colorOnSurface};
  font-weight: ${({ status }) => (status === 'current' ? 600 : 400)};
`;

/* ── Unified Action Table ── */

type ActionPriority = 'critical' | 'required' | 'info';

const ACTION_COLS = 'minmax(90px, 0.6fr) minmax(200px, 2.5fr) minmax(80px, 0.6fr) minmax(90px, 0.7fr) 90px';

/* ── Activity timeline ── */

const ActivityCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const ActivityRow = styled.div<{ isLast?: boolean }>`
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${(theme as StyledTheme).colorOutlineVariant}`};
`;

/* ── Unified Action Table uses shared Grid/GridRow components ── */

/* ═══════════════════════════════════════════════
   CARRIER DATA (for different states)
   ═══════════════════════════════════════════════ */

const MANAGED_COLS = 'minmax(180px, 1.8fr) minmax(80px, 0.7fr) minmax(120px, 1.2fr) minmax(120px, 1.2fr) minmax(100px, 1fr) 80px';
const SELF_COLS = 'minmax(180px, 1.8fr) minmax(80px, 0.7fr) minmax(100px, 1fr) minmax(130px, 1.2fr) minmax(100px, 1fr)';

/* ═══════════════════════════════════════════════
   STATE RENDERERS
   ═══════════════════════════════════════════════ */

const BenefitsLifecycleDemo: React.FC = () => {
  const { theme, mode: currentMode } = usePebbleTheme();
  const [activeState, setActiveState] = useState<LifecycleState>('empty');
  const [activeTab, setActiveTab] = useState(0);

  const currentOption = LIFECYCLE_STATES.find(s => s.id === activeState)!;

  /* ── State 0: Empty ── */
  const renderEmpty = () => (
    <EmptyCentered theme={theme}>
      <EmptyIcon theme={theme}>
        <Icon type={Icon.TYPES.HEART_OUTLINE} size={36} color={theme.colorPrimary} />
      </EmptyIcon>
      <EmptyTitle theme={theme}>Set up benefits for your company</EmptyTitle>
      <EmptyDesc theme={theme}>
        Get started by selecting insurance carriers and configuring benefit plans
        for your employees. Rippling will guide you through each step.
      </EmptyDesc>
      <Button
        size={Button.SIZES.L}
        appearance={Button.APPEARANCES.PRIMARY}
        onClick={() => setActiveState('setup-in-progress')}
      >
        Get Started
      </Button>
      <CellSecondary theme={theme}>
        This typically takes 15-20 minutes to complete.
      </CellSecondary>
    </EmptyCentered>
  );

  /* ── State 1: Setup In Progress ── */
  const renderSetupInProgress = () => {
    const steps = [
      { label: 'Select insurance carriers', status: 'done' as const },
      { label: 'Configure plan details', status: 'done' as const },
      { label: 'Set employee eligibility rules', status: 'current' as const },
      { label: 'Add Group IDs & carrier info', status: 'upcoming' as const },
      { label: 'Review & confirm plans', status: 'upcoming' as const },
      { label: 'Set effective date & launch enrollment', status: 'upcoming' as const },
    ];

    return (
      <EmptyCentered theme={theme} style={{ minHeight: 'auto', paddingTop: theme.space800 }}>
        <SetupCard theme={theme}>
          <div>
            <SetupTitle theme={theme}>Insurance Setup</SetupTitle>
            <SetupMeta theme={theme}>Step 3 of 6 · Last saved 2 hours ago</SetupMeta>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: s.status === 'done' ? 'rgb(46,125,50)' :
                    s.status === 'current' ? 'rgb(13,71,161)' : theme.colorSurfaceContainerHigh,
                }} />
              </React.Fragment>
            ))}
          </div>

          <StepsList>
            {steps.map((s, i) => (
              <StepRow key={i} theme={theme} status={s.status}>
                <StepIcon status={s.status}>
                  {s.status === 'done' ? (
                    <Icon type={Icon.TYPES.CHECK} size={14} color="#fff" />
                  ) : (
                    i + 1
                  )}
                </StepIcon>
                <StepText theme={theme} status={s.status}>{s.label}</StepText>
                {s.status === 'current' && (
                  <Badge theme={theme} variant="primary">In progress</Badge>
                )}
              </StepRow>
            ))}
          </StepsList>

          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              size={Button.SIZES.L}
              appearance={Button.APPEARANCES.PRIMARY}
              onClick={() => setActiveState('actions-required')}
            >
              Continue Setup
            </Button>
          </div>
        </SetupCard>
      </EmptyCentered>
    );
  };

  /* ── State 2: Actions Required ── */
  const renderActionsRequired = () => {
    const actions: { priority: ActionPriority; title: string; context: string; due: string; status: string; cta: string }[] = [
      { priority: 'critical', title: 'Configure transmission — Guardian (Dental)', context: 'EDI/API available · Group ID missing', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'critical', title: 'Configure transmission — Guardian (Vision)', context: 'EDI/API available · Group ID missing', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'critical', title: 'Configure transmission — Anthem (Medical)', context: 'EDI/API available · Group ID: 332211', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'critical', title: 'Configure transmission — Cigna (Medical)', context: 'EDI/API available · Group ID: 125636', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'critical', title: 'Configure transmission — Principal (Life)', context: 'EDI/API available · Group ID: 88421', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'critical', title: 'Configure transmission — New York Life (Disability)', context: 'Forms only · Group ID missing', due: 'Apr 1', status: 'Not started', cta: 'Set up' },
      { priority: 'required', title: 'Sign insurance documents (2 pending)', context: 'Summary Plan Description, Plan of Participation', due: 'Mar 30', status: 'Not started', cta: 'Sign' },
      { priority: 'required', title: 'Authorize COBRA TPA for 3 carriers', context: 'Cigna, Blue Cross, Guardian', due: 'Apr 15', status: 'Not started', cta: 'Authorize' },
    ];

    return (
      <PageContainer theme={theme}>
        <PageHeaderArea theme={theme}>
          <PageHeaderWrapper theme={theme}>
            <Page.Header title="Benefits Overview" shouldBeUnderlined={false} size={Page.Header.SIZES.FLUID} />
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
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Actions</SectionTitle>
              <SectionCount theme={theme}>({actions.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={ACTION_COLS}>
                <HeaderCell theme={theme}>Priority</HeaderCell>
                <HeaderCell theme={theme}>Task</HeaderCell>
                <HeaderCell theme={theme}>Due</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {actions.map((a, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === actions.length - 1} columns={ACTION_COLS}>
                  <div>
                    <Badge theme={theme} variant={a.priority === 'critical' ? 'error' : 'warning'}>
                      {a.priority === 'critical' ? 'Critical' : 'Required'}
                    </Badge>
                  </div>
                  <CarrierNameBlock theme={theme}>
                    <CellTextBold theme={theme}>{a.title}</CellTextBold>
                    <CellSecondary theme={theme}>{a.context}</CellSecondary>
                  </CarrierNameBlock>
                  <CellSecondary theme={theme}>{a.due}</CellSecondary>
                  <Badge theme={theme} variant="neutral">{a.status}</Badge>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>{a.cta}</Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>
        </PageContent>
      </PageContainer>
    );
  };

  /* ── State 3: In Progress ── */
  const renderInProgress = () => {
    const inProgressActions: { priority: ActionPriority; title: string; context: string; due: string; status: string; cta: string }[] = [
      { priority: 'info', title: 'Respond to Cigna authorization request', context: 'Cigna has requested authorization forms to complete your EDI connection', due: 'Due Mar 25', status: 'Waiting on you', cta: 'Respond' },
    ];

    const managedCarriers = [
      { name: 'Blue Cross', type: 'Medical', state: 'IL', color: '#003DA5', mode: 'EDI', status: 'in-progress', step: 2, total: 5, stepLabel: 'Validation', dualComms: true, lastSent: 'Mar 5, 2026' },
      { name: 'Cigna', type: 'Medical', state: 'IL', color: '#0072BC', mode: 'EDI', status: 'in-progress', step: 1, total: 5, stepLabel: 'Requirements', dualComms: true, lastSent: 'Mar 7, 2026' },
      { name: 'Guardian', type: 'Dental', state: 'CA', color: '#1565C0', mode: 'EDI', status: 'in-progress', step: 4, total: 5, stepLabel: 'Carrier Testing', dualComms: true, lastSent: 'Mar 9, 2026' },
      { name: 'Kaiser', type: 'Medical', state: 'CA', color: '#D32F2F', mode: 'API', status: 'active', step: 0, total: 0, stepLabel: '', dualComms: false, lastSent: 'Mar 10, 2026', cobraNote: 'COBRA via forms' },
      { name: 'CalChoice', type: 'Medical', state: 'CA', color: '#2E7D32', mode: 'Forms', status: 'active', step: 0, total: 0, stepLabel: '', dualComms: false, lastSent: 'Mar 8, 2026' },
      { name: 'Anthem', type: 'Medical', state: 'IL', color: '#0D47A1', mode: 'Forms', status: 'active', step: 0, total: 0, stepLabel: '', dualComms: false, lastSent: 'Mar 6, 2026' },
    ];

    const selfManaged = [
      { name: 'MetLife', type: 'Life', state: 'NY', color: '#00695C', groupId: '77234', attestedBy: 'Sarah Chen', attestedAt: 'Feb 10, 2026' },
      { name: 'New York Life', type: 'Disability', state: 'IL', color: '#004990', groupId: '—', attestedBy: 'Sarah Chen', attestedAt: 'Mar 1, 2026' },
    ];

    return (
      <PageContainer theme={theme}>
        <PageHeaderArea theme={theme}>
          <PageHeaderWrapper theme={theme}>
            <Page.Header title="Benefits Overview" shouldBeUnderlined={false} size={Page.Header.SIZES.FLUID} />
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
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Actions</SectionTitle>
              <SectionCount theme={theme}>({inProgressActions.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={ACTION_COLS}>
                <HeaderCell theme={theme}>Priority</HeaderCell>
                <HeaderCell theme={theme}>Task</HeaderCell>
                <HeaderCell theme={theme}>Due</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {inProgressActions.map((a, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === inProgressActions.length - 1} columns={ACTION_COLS}>
                  <div>
                    <Badge theme={theme} variant="primary">Info</Badge>
                  </div>
                  <CarrierNameBlock theme={theme}>
                    <CellTextBold theme={theme}>{a.title}</CellTextBold>
                    <CellSecondary theme={theme}>{a.context}</CellSecondary>
                  </CarrierNameBlock>
                  <CellSecondary theme={theme}>{a.due}</CellSecondary>
                  <Badge theme={theme} variant="warning">{a.status}</Badge>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>{a.cta}</Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>

          {/* Rippling-Managed — read-only monitoring */}
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Rippling-Managed Transmissions</SectionTitle>
              <SectionCount theme={theme}>({managedCarriers.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={MANAGED_COLS}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Transmission</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme}>Last Sent</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {managedCarriers.map((c, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === managedCarriers.length - 1} columns={MANAGED_COLS}>
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={c.color}>{c.name.charAt(0)}</CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{c.name}</CellTextBold>
                      <CellSecondary theme={theme}>Eff. March 01, 2026</CellSecondary>
                    </CarrierNameBlock>
                  </CarrierCell>
                  <CellText theme={theme}>{c.type} · {c.state}</CellText>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CellTextBold theme={theme}>{c.mode}</CellTextBold>
                    {c.dualComms && (
                      <Tip content="Forms are also being sent while EDI/API is being set up" placement="top">
                        <CellSecondary theme={theme} style={{ cursor: 'help' }}>+ Forms (dual comms)</CellSecondary>
                      </Tip>
                    )}
                    {(c as any).cobraNote && (
                      <CellSecondary theme={theme}>{(c as any).cobraNote}</CellSecondary>
                    )}
                  </div>
                  <div>
                    {c.status === 'in-progress' ? (
                      <MiniProgress theme={theme}>
                        <MiniBar theme={theme}>
                          <MiniFill pct={(c.step / c.total) * 100} />
                        </MiniBar>
                        <Tip content={`Step ${c.step}/${c.total}: ${c.stepLabel}`} placement="top">
                          <MiniLabel theme={theme} style={{ cursor: 'help' }}>{c.step}/{c.total}</MiniLabel>
                        </Tip>
                      </MiniProgress>
                    ) : (
                      <Badge theme={theme} variant="success">
                        <Icon type={Icon.TYPES.CHECK} size={10} color="rgb(27,94,32)" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CellSecondary theme={theme}>{c.lastSent}</CellSecondary>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>
                      {c.status === 'in-progress' ? 'Details' : 'History'}
                    </Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>

          {/* Self-Managed — read-only */}
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Self-Managed Transmissions</SectionTitle>
              <SectionCount theme={theme}>({selfManaged.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={SELF_COLS}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Group ID</HeaderCell>
                <HeaderCell theme={theme}>Acknowledged by</HeaderCell>
                <HeaderCell theme={theme}>Date</HeaderCell>
              </GridHeaderRow>
              {selfManaged.map((c, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === selfManaged.length - 1} columns={SELF_COLS}>
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={c.color}>{c.name.charAt(0)}</CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{c.name}</CellTextBold>
                      <CellSecondary theme={theme}>Eff. March 01, 2026</CellSecondary>
                    </CarrierNameBlock>
                  </CarrierCell>
                  <CellText theme={theme}>{c.type} · {c.state}</CellText>
                  <CellText theme={theme}>{c.groupId}</CellText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
                    <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={14} color="rgb(46,125,50)" />
                    <CellText theme={theme}>{c.attestedBy}</CellText>
                  </div>
                  <CellSecondary theme={theme}>{c.attestedAt}</CellSecondary>
                </GridRow>
              ))}
            </Grid>
          </Section>
        </PageContent>
      </PageContainer>
    );
  };

  /* ── State 4: Steady State ── */
  const renderSteadyState = () => {
    const allCarriers = [
      { name: 'Blue Cross', type: 'Medical', state: 'IL', color: '#003DA5', mode: 'EDI', lastSent: 'Mar 12, 2026' },
      { name: 'Cigna', type: 'Medical', state: 'IL', color: '#0072BC', mode: 'EDI', lastSent: 'Mar 12, 2026' },
      { name: 'Guardian', type: 'Dental', state: 'CA', color: '#1565C0', mode: 'EDI', lastSent: 'Mar 11, 2026' },
      { name: 'Guardian', type: 'Vision', state: 'CA', color: '#1565C0', mode: 'EDI', lastSent: 'Mar 11, 2026' },
      { name: 'Kaiser', type: 'Medical', state: 'CA', color: '#D32F2F', mode: 'API', lastSent: 'Mar 12, 2026', cobraNote: 'COBRA via forms' },
      { name: 'CalChoice', type: 'Medical', state: 'CA', color: '#2E7D32', mode: 'Forms', lastSent: 'Mar 10, 2026' },
      { name: 'Anthem', type: 'Medical', state: 'IL', color: '#0D47A1', mode: 'Forms', lastSent: 'Mar 9, 2026' },
      { name: 'Principal', type: 'Life', state: 'IL', color: '#6A1B9A', mode: 'EDI', lastSent: 'Mar 10, 2026' },
    ];

    const selfManaged = [
      { name: 'MetLife', type: 'Life', state: 'NY', color: '#00695C', groupId: '77234', attestedBy: 'Sarah Chen', attestedAt: 'Feb 10, 2026' },
      { name: 'New York Life', type: 'Disability', state: 'IL', color: '#004990', groupId: '—', attestedBy: 'Sarah Chen', attestedAt: 'Mar 1, 2026' },
    ];

    const recentActivity = [
      { date: 'Mar 12', desc: 'New hire enrollment — 2 employees sent to Blue Cross', status: 'confirmed' },
      { date: 'Mar 12', desc: 'EDI file transmitted to Cigna (weekly batch)', status: 'confirmed' },
      { date: 'Mar 11', desc: 'Termination — 1 employee sent to Guardian', status: 'confirmed' },
      { date: 'Mar 10', desc: 'API transaction to Kaiser — 4 employees', status: 'confirmed' },
      { date: 'Mar 10', desc: 'Enrollment form emailed to CalChoice — 1 new hire', status: 'sent' },
      { date: 'Mar 9', desc: 'Dependent add — 1 employee form sent to Anthem', status: 'sent' },
    ];

    return (
      <PageContainer theme={theme}>
        <PageHeaderArea theme={theme}>
          <PageHeaderWrapper theme={theme}>
            <Page.Header title="Benefits Overview" shouldBeUnderlined={false} size={Page.Header.SIZES.FLUID} />
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
          {/* Rippling-Managed */}
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Rippling-Managed Transmissions</SectionTitle>
              <SectionCount theme={theme}>({allCarriers.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={MANAGED_COLS}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Transmission</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme}>Last Sent</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {allCarriers.map((c, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === allCarriers.length - 1} columns={MANAGED_COLS}>
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={c.color}>{c.name.charAt(0)}</CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{c.name}</CellTextBold>
                    </CarrierNameBlock>
                  </CarrierCell>
                  <CellText theme={theme}>{c.type} · {c.state}</CellText>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CellTextBold theme={theme}>{c.mode}</CellTextBold>
                    {(c as any).cobraNote && <CellSecondary theme={theme}>{(c as any).cobraNote}</CellSecondary>}
                  </div>
                  <Badge theme={theme} variant="success">
                    <Icon type={Icon.TYPES.CHECK} size={10} color="rgb(27,94,32)" />Active
                  </Badge>
                  <CellSecondary theme={theme}>{c.lastSent}</CellSecondary>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>History</Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>

          {/* Self-Managed */}
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Self-Managed Transmissions</SectionTitle>
              <SectionCount theme={theme}>({selfManaged.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={SELF_COLS}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Group ID</HeaderCell>
                <HeaderCell theme={theme}>Acknowledged by</HeaderCell>
                <HeaderCell theme={theme}>Date</HeaderCell>
              </GridHeaderRow>
              {selfManaged.map((c, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === selfManaged.length - 1} columns={SELF_COLS}>
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={c.color}>{c.name.charAt(0)}</CarrierLogo>
                    <CarrierNameBlock><CellTextBold theme={theme}>{c.name}</CellTextBold></CarrierNameBlock>
                  </CarrierCell>
                  <CellText theme={theme}>{c.type} · {c.state}</CellText>
                  <CellText theme={theme}>{c.groupId}</CellText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200 }}>
                    <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={14} color="rgb(46,125,50)" />
                    <CellText theme={theme}>{c.attestedBy}</CellText>
                  </div>
                  <CellSecondary theme={theme}>{c.attestedAt}</CellSecondary>
                </GridRow>
              ))}
            </Grid>
          </Section>

          {/* Recent Activity */}
          <Section theme={theme}>
            <SectionTitle theme={theme}>Recent Activity</SectionTitle>
            <ActivityCard theme={theme}>
              {recentActivity.map((a, idx) => (
                <ActivityRow key={idx} theme={theme} isLast={idx === recentActivity.length - 1}>
                  <CellSecondary theme={theme}>{a.date}</CellSecondary>
                  <CellText theme={theme}>{a.desc}</CellText>
                  <Badge theme={theme} variant={a.status === 'confirmed' ? 'success' : 'primary'}>
                    {a.status === 'confirmed' ? 'Confirmed' : 'Sent'}
                  </Badge>
                </ActivityRow>
              ))}
            </ActivityCard>
          </Section>
        </PageContent>
      </PageContainer>
    );
  };

  /* ── State 5: Renewal & OE ── */
  const renderRenewalOE = () => {
    const renewalActions: { priority: ActionPriority; title: string; context: string; due: string; status: string; cta: string }[] = [
      { priority: 'required', title: 'Review Medical renewal — Blue Cross IL', context: 'Renewal packet available · Review new rates and plan options', due: '47 days', status: 'Not started', cta: 'Review' },
      { priority: 'required', title: 'Review Dental renewal — Guardian CA', context: 'Renewal packet available · Updated plan comparison ready', due: '47 days', status: 'In progress', cta: 'Continue' },
      { priority: 'required', title: 'Review Vision renewal — Guardian CA', context: 'Renewal packet available · Review new rates and plan options', due: '47 days', status: 'Not started', cta: 'Review' },
      { priority: 'required', title: 'Submit OE files to CalChoice, MetLife', context: 'No EDI/API available — you must submit the OE census manually', due: 'Due May 1', status: 'Not started', cta: 'Download files' },
      { priority: 'required', title: 'OE File Accountability sign-off', context: 'Acknowledge responsibility for submitting OE enrollments to non-automated carriers', due: 'Due May 1', status: 'Not started', cta: 'Sign off' },
    ];

    const steadyCarriers = [
      { name: 'Blue Cross', type: 'Medical', state: 'IL', color: '#003DA5', mode: 'EDI', lastSent: 'Mar 12, 2026', renewalBadge: true },
      { name: 'Cigna', type: 'Medical', state: 'IL', color: '#0072BC', mode: 'EDI', lastSent: 'Mar 12, 2026' },
      { name: 'Guardian', type: 'Dental', state: 'CA', color: '#1565C0', mode: 'EDI', lastSent: 'Mar 11, 2026', renewalBadge: true },
      { name: 'Kaiser', type: 'Medical', state: 'CA', color: '#D32F2F', mode: 'API', lastSent: 'Mar 12, 2026' },
      { name: 'CalChoice', type: 'Medical', state: 'CA', color: '#2E7D32', mode: 'Forms', lastSent: 'Mar 10, 2026' },
    ];

    return (
      <PageContainer theme={theme}>
        <PageHeaderArea theme={theme}>
          <PageHeaderWrapper theme={theme}>
            <Page.Header title="Benefits Overview" shouldBeUnderlined={false} size={Page.Header.SIZES.FLUID} />
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
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Actions</SectionTitle>
              <SectionCount theme={theme}>({renewalActions.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={ACTION_COLS}>
                <HeaderCell theme={theme}>Priority</HeaderCell>
                <HeaderCell theme={theme}>Task</HeaderCell>
                <HeaderCell theme={theme}>Due</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {renewalActions.map((a, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === renewalActions.length - 1} columns={ACTION_COLS}>
                  <div>
                    <Badge theme={theme} variant="warning">Required</Badge>
                  </div>
                  <CarrierNameBlock theme={theme}>
                    <CellTextBold theme={theme}>{a.title}</CellTextBold>
                    <CellSecondary theme={theme}>{a.context}</CellSecondary>
                  </CarrierNameBlock>
                  <CellSecondary theme={theme}>{a.due}</CellSecondary>
                  <Badge theme={theme} variant={a.status === 'In progress' ? 'primary' : 'neutral'}>{a.status}</Badge>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>{a.cta}</Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>

          {/* Carrier Status — read-only monitoring */}
          <Section theme={theme}>
            <SectionHeader theme={theme}>
              <SectionTitle theme={theme}>Carrier Integrations</SectionTitle>
              <SectionCount theme={theme}>({steadyCarriers.length})</SectionCount>
            </SectionHeader>
            <Grid theme={theme}>
              <GridHeaderRow theme={theme} columns={MANAGED_COLS}>
                <HeaderCell theme={theme}>Carrier</HeaderCell>
                <HeaderCell theme={theme}>Coverage</HeaderCell>
                <HeaderCell theme={theme}>Transmission</HeaderCell>
                <HeaderCell theme={theme}>Status</HeaderCell>
                <HeaderCell theme={theme}>Last Sent</HeaderCell>
                <HeaderCell theme={theme} />
              </GridHeaderRow>
              {steadyCarriers.map((c, idx) => (
                <GridRow key={idx} theme={theme} isLast={idx === steadyCarriers.length - 1} columns={MANAGED_COLS}>
                  <CarrierCell theme={theme}>
                    <CarrierLogo theme={theme} bg={c.color}>{c.name.charAt(0)}</CarrierLogo>
                    <CarrierNameBlock>
                      <CellTextBold theme={theme}>{c.name}</CellTextBold>
                      {(c as any).renewalBadge && <Badge theme={theme} variant="warning" style={{ marginTop: 2 }}>Renewal due</Badge>}
                    </CarrierNameBlock>
                  </CarrierCell>
                  <CellText theme={theme}>{c.type} · {c.state}</CellText>
                  <CellTextBold theme={theme}>{c.mode}</CellTextBold>
                  <Badge theme={theme} variant="success">
                    <Icon type={Icon.TYPES.CHECK} size={10} color="rgb(27,94,32)" />Active
                  </Badge>
                  <CellSecondary theme={theme}>{c.lastSent}</CellSecondary>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.OUTLINE}>History</Button>
                  </div>
                </GridRow>
              ))}
            </Grid>
          </Section>
        </PageContent>
      </PageContainer>
    );
  };

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */

  return (
    <ShellContainer theme={theme}>
      {/* State Switcher Bar */}
      <SwitcherBar theme={theme}>
        <SwitcherLabel theme={theme}>State:</SwitcherLabel>
        <SwitcherChips>
          {LIFECYCLE_STATES.map(s => (
            <SwitcherChip
              key={s.id}
              theme={theme}
              isActive={activeState === s.id}
              onClick={() => setActiveState(s.id)}
            >
              <ChipStep isActive={activeState === s.id}>{s.step}</ChipStep>
              <ChipLabel theme={theme} isActive={activeState === s.id}>{s.label}</ChipLabel>
            </SwitcherChip>
          ))}
        </SwitcherChips>
        <SwitcherDesc theme={theme}>{currentOption.description}</SwitcherDesc>
      </SwitcherBar>

      {/* Top Nav */}
      <TopNav theme={theme}>
        <NavLogo theme={theme}>
          <LogoImg
            src={currentMode === 'dark' ? RipplingLogoWhite : RipplingLogoBlack}
            alt="Rippling"
            theme={theme}
          />
        </NavLogo>
        <NavDivider theme={theme} />
        <NavBreadcrumb theme={theme}>
          <NavBreadcrumbItem theme={theme}>Benefits</NavBreadcrumbItem>
          <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} color={theme.colorOnSurfaceVariant} />
        </NavBreadcrumb>
        <NavRight theme={theme}>
          <NavSearchBar theme={theme}>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} color={theme.colorOnSurfaceVariant} />
            <NavSearchText theme={theme}>Search or jump to...</NavSearchText>
          </NavSearchBar>
          <NavIconBtn theme={theme} aria-label="Help">
            <Icon type={Icon.TYPES.HELP_OUTLINE} size={20} color={theme.colorOnSurface} />
          </NavIconBtn>
          <NavIconBtn theme={theme} aria-label="Notifications">
            <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={20} color={theme.colorOnSurface} />
          </NavIconBtn>
          <NavDivider theme={theme} />
          <NavAvatarBtn theme={theme}>S</NavAvatarBtn>
        </NavRight>
      </TopNav>

      {/* Sidebar */}
      <Sidebar theme={theme}>
        <SidebarGroup theme={theme}>
          <SidebarItem theme={theme} isActive>
            <Icon type={Icon.TYPES.HEART_OUTLINE} size={18} color={theme.colorPrimary} />
            Benefits Overview
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.USER_OUTLINE} size={18} color={theme.colorOnSurface} />
            My Benefits
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup theme={theme}>
          <SidebarDivider theme={theme} />
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={18} color={theme.colorOnSurface} />
            Enrollments
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={18} color={theme.colorOnSurface} />
            Open Enrollment
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.LINK_OUTLET} size={18} color={theme.colorOnSurface} />
            Integrations
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.DOLLAR_CIRCLE_OUTLINE} size={18} color={theme.colorOnSurface} />
            Deductions
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={18} color={theme.colorOnSurface} />
            Benefits Settings
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>

      {/* Main Content */}
      <MainContent theme={theme}>
        {activeState === 'empty' && renderEmpty()}
        {activeState === 'setup-in-progress' && renderSetupInProgress()}
        {activeState === 'actions-required' && renderActionsRequired()}
        {activeState === 'in-progress' && renderInProgress()}
        {activeState === 'steady-state' && renderSteadyState()}
        {activeState === 'renewal-oe' && renderRenewalOE()}
      </MainContent>
    </ShellContainer>
  );
};

export default BenefitsLifecycleDemo;
