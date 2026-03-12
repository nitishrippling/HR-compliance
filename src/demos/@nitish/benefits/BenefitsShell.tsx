import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import RipplingLogoBlack from '@/assets/rippling-logo-black.svg';
import RipplingLogoWhite from '@/assets/rippling-logo-white.svg';
import BenefitsOverview from './BenefitsOverview';
import IntegrationsTab from './IntegrationsTab';

export type BenefitsView = 'overview' | 'integrations';

/* ═══════════════════════════════════════════════
   LAYOUT SHELL
   ═══════════════════════════════════════════════ */

const ShellContainer = styled.div`
  height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  overflow: hidden;
`;

/* ── Top Nav ── */

const TopNav = styled.nav`
  position: fixed;
  top: 0;
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

const NavBreadcrumbItem = styled.span<{ isActive?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const NavBreadcrumbSep = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
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

const NavUserLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ── Sidebar ── */

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  top: 56px;
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

const SectionDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SectionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
`;

/* ── Main content ── */

const MainContent = styled.main`
  position: fixed;
  left: 220px;
  top: 56px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

/* ═══════════════════════════════════════════════
   SIDEBAR NAV DATA
   ═══════════════════════════════════════════════ */

interface NavItemDef {
  id: string;
  label: string;
  icon: string;
  view?: BenefitsView;
}

const BENEFITS_NAV: NavItemDef[] = [
  { id: 'overview', label: 'Benefits Overview', icon: Icon.TYPES.HEART_OUTLINE, view: 'overview' },
  { id: 'my-benefits', label: 'My Benefits', icon: Icon.TYPES.USER_OUTLINE },
];

const MANAGEMENT_NAV: NavItemDef[] = [
  { id: 'enrollments', label: 'Enrollments', icon: Icon.TYPES.DOCUMENT_OUTLINE },
  { id: 'open-enrollment', label: 'Open Enrollment', icon: Icon.TYPES.CALENDAR_OUTLINE },
  { id: 'integrations', label: 'Integrations', icon: Icon.TYPES.LINK_OUTLET, view: 'integrations' },
  { id: 'deductions', label: 'Deductions', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE },
  { id: 'workers-comp', label: "Workers' Comp", icon: Icon.TYPES.SHIELD_OUTLINE },
  { id: 'benefits-settings', label: 'Benefits Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
];

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

interface BenefitsShellProps {
  initialView?: BenefitsView;
}

export const BenefitsShell: React.FC<BenefitsShellProps> = ({ initialView = 'overview' }) => {
  const { theme, mode: currentMode } = usePebbleTheme();
  const [view, setView] = useState<BenefitsView>(initialView);

  const handleNavClick = useCallback((item: NavItemDef) => {
    if (item.view) setView(item.view);
  }, []);

  const renderNavItem = (item: NavItemDef) => {
    const isActive = item.view === view;
    return (
      <SidebarItem
        key={item.id}
        theme={theme}
        isActive={isActive}
        onClick={() => handleNavClick(item)}
      >
        <Icon type={item.icon} size={18} color={isActive ? theme.colorPrimary : theme.colorOnSurface} />
        {item.label}
      </SidebarItem>
    );
  };

  return (
    <ShellContainer theme={theme}>
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
          <NavBreadcrumbItem theme={theme} onClick={() => setView('overview')}>
            Benefits
          </NavBreadcrumbItem>
          <NavBreadcrumbSep theme={theme}>
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={14} color={theme.colorOnSurfaceVariant} />
          </NavBreadcrumbSep>
        </NavBreadcrumb>

        <NavRight theme={theme}>
          <NavSearchBar theme={theme}>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} color={theme.colorOnSurfaceVariant} />
            <NavSearchText theme={theme}>Search or jump to...</NavSearchText>
          </NavSearchBar>
          <NavIconBtn theme={theme} aria-label="Help">
            <Icon type={Icon.TYPES.HELP_OUTLINE} size={20} color={theme.colorOnSurface} />
          </NavIconBtn>
          <NavIconBtn theme={theme} aria-label="Create">
            <Icon type={Icon.TYPES.ADD_CIRCLE_OUTLINE} size={20} color={theme.colorOnSurface} />
          </NavIconBtn>
          <NavIconBtn theme={theme} aria-label="Notifications">
            <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={20} color={theme.colorOnSurface} />
          </NavIconBtn>
          <NavDivider theme={theme} />
          <NavUserLabel theme={theme}>Walters, Nelson and S...</NavUserLabel>
          <NavAvatarBtn theme={theme}>W</NavAvatarBtn>
        </NavRight>
      </TopNav>

      {/* Sidebar */}
      <Sidebar theme={theme}>
        <SidebarGroup theme={theme}>
          {BENEFITS_NAV.map(renderNavItem)}
        </SidebarGroup>
        <SidebarGroup theme={theme}>
          <SectionDivider theme={theme} />
          {MANAGEMENT_NAV.map(renderNavItem)}
        </SidebarGroup>
        <SidebarGroup theme={theme}>
          <SectionDivider theme={theme} />
          <SectionLabel theme={theme}>Platform</SectionLabel>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.BAR_CHART_OUTLINE} size={18} color={theme.colorOnSurface} />
            Data <span style={{ fontSize: 10, background: theme.colorSuccessContainer, color: theme.colorSuccess, padding: '1px 6px', borderRadius: 999, marginLeft: 4, fontWeight: 600 }}>New</span>
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.WRENCH_OUTLINE} size={18} color={theme.colorOnSurface} />
            Tools
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={18} color={theme.colorOnSurface} />
            Company settings
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.INTEGRATED_APPS_OUTLINE} size={18} color={theme.colorOnSurface} />
            App Shop
          </SidebarItem>
          <SidebarItem theme={theme}>
            <Icon type={Icon.TYPES.HELP_OUTLINE} size={18} color={theme.colorOnSurface} />
            Help
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>

      {/* Main Content */}
      <MainContent theme={theme}>
        {view === 'overview' && (
          <BenefitsOverview onNavigateToIntegrations={() => setView('integrations')} />
        )}
        {view === 'integrations' && <IntegrationsTab />}
      </MainContent>
    </ShellContainer>
  );
};
