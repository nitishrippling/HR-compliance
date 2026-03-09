import React, { useState, useRef, useCallback, RefObject } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import { HomePage } from './HomePage';
import { ComplianceHubContent } from './ComplianceHubContent';
import { Compliance360Page } from './Compliance360Page';
import RipplingLogoBlack from '@/assets/rippling-logo-black.svg';
import RipplingLogoWhite from '@/assets/rippling-logo-white.svg';

export type ViewType = 'home' | 'hr-services' | 'workforce' | 'compliance-360';

/* ─────────────────── Layout shell ─────────────────── */

const ShellContainer = styled.div`
  height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  overflow: hidden;
`;

/* ─────────────────── Top nav ─────────────────── */

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
  width: 266px;
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

const NavRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
`;

const NavSearchBar = styled.div`
  flex: 1;
  max-width: 480px;
  height: 36px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const NavSearchText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const NavAvatarButton = styled.button`
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
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

/* ─────────────────── Sidebar ─────────────────── */

const Sidebar = styled.div<{ collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 0;
  width: ${({ collapsed }) => (collapsed ? '60px' : '266px')};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 200ms ease;
  z-index: 80;
`;

const SidebarScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SidebarFooter = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const SidebarToggleBtn = styled.button`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const NavItemBtn = styled.button<{ isActive?: boolean; collapsed?: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
  background: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorSurfaceContainerLow : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ isActive, theme }) =>
    isActive
      ? (theme as StyledTheme).colorPrimary
      : (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: pointer;
  transition: background 0.1s ease-in-out;
  overflow: hidden;

  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const NavIconWrapper = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NavLabel = styled.div<{ collapsed: boolean }>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  transition: opacity 200ms ease;
`;

const NavChevron = styled.div<{ collapsed: boolean }>`
  margin-left: auto;
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  transition: opacity 200ms ease;
`;

const SectionLabel = styled.div<{ collapsed: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) =>
    (theme as StyledTheme).space100};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  height: 31px;
  display: flex;
  align-items: flex-end;
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  transition: opacity 200ms ease;
  white-space: nowrap;
`;

const NavGroup = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) =>
    (theme as StyledTheme).space200} 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/* ─────────────────── HR Submenu Panel ─────────────────── */

const SubmenuPanel = styled.div<{ open: boolean }>`
  position: fixed;
  left: 266px;
  top: 56px;
  bottom: 0;
  width: 260px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 70;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'all' : 'none')};
  transition: opacity 180ms ease;
`;

const SubmenuHeader = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) =>
    (theme as StyledTheme).space300};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubmenuTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SubmenuScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) =>
    (theme as StyledTheme).space200};
`;

const SubmenuSectionDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

/* ─────────────────── Submenu items ─────────────────── */

const SubmenuItemContainer = styled.div`
  position: relative;
`;

const SubmenuItemBtn = styled.button<{ isHovered?: boolean }>`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space200};
  background: ${({ isHovered, theme }) =>
    isHovered ? getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover') : 'none'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
`;

const SubmenuItemText = styled.span`
  flex: 1;
`;

/* ─────────────────── Hover sub-submenu (Compliance 360 → HR Services / Workforce) ─────────────────── */

const HoverSubMenu = styled.div<{ posTop: number }>`
  position: fixed;
  left: 530px;
  top: ${({ posTop }) => posTop}px;
  width: 200px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 90;
  overflow: hidden;
  padding: ${({ theme }) => (theme as StyledTheme).space100};
`;

const HoverSubMenuItem = styled.button`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  background: none;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

/* ─────────────────── Main content ─────────────────── */

const MainContent = styled.main<{ sidebarWidth: number }>`
  position: fixed;
  left: ${({ sidebarWidth }) => sidebarWidth}px;
  top: 56px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: left 200ms ease;
`;

/* ─────────────────── Overlay (close submenu on outside click) ─────────────────── */

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 65;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

/* ─────────────────── Component ─────────────────── */

interface NavItemDef {
  id: string;
  label: string;
  icon: string;
  hasSubmenu?: boolean;
  isHRServices?: boolean;
}

interface HRSubmenuItemDef {
  id: string;
  label: string;
  icon: string;
  isDivider?: boolean;
  isCompliance360?: boolean;
}

const PRIMARY_NAV: NavItemDef[] = [
  { id: 'org-chart', label: 'Org Chart', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
];

const APPS_NAV: NavItemDef[] = [
  { id: 'favorites', label: 'Favorites', icon: Icon.TYPES.STAR_OUTLINE, hasSubmenu: true },
  { id: 'benefits', label: 'Benefits', icon: Icon.TYPES.HEART_OUTLINE, hasSubmenu: true },
  { id: 'payroll', label: 'Payroll', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, hasSubmenu: true },
  {
    id: 'hr-services',
    label: 'HR',
    icon: Icon.TYPES.SHIELD_OUTLINE,
    hasSubmenu: true,
    isHRServices: true,
  },
  { id: 'finance', label: 'Finance', icon: Icon.TYPES.CREDIT_CARD_OUTLINE, hasSubmenu: true },
  { id: 'talent', label: 'Talent', icon: Icon.TYPES.TALENT_OUTLINE, hasSubmenu: true },
  { id: 'it', label: 'IT', icon: Icon.TYPES.LAPTOP_OUTLINE, hasSubmenu: true },
  { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
  {
    id: 'custom-apps',
    label: 'Custom Apps',
    icon: Icon.TYPES.CUSTOM_APPS_OUTLINE,
    hasSubmenu: true,
  },
];

const PLATFORM_NAV: NavItemDef[] = [
  { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
  {
    id: 'company-settings',
    label: 'Company settings',
    icon: Icon.TYPES.SETTINGS_OUTLINE,
    hasSubmenu: true,
  },
  { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
  { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
];

const HR_SUBMENU_ITEMS: HRSubmenuItemDef[] = [
  { id: 'hr-overview', label: 'HR Overview', icon: Icon.TYPES.TALENT_OUTLINE },
  { id: 'people', label: 'People', icon: Icon.TYPES.USERS_OUTLINE },
  { id: 'anniversaries', label: 'Anniversaries', icon: Icon.TYPES.CALENDAR_OUTLINE },
  { id: 'divider-1', label: '', icon: '', isDivider: true },
  {
    id: 'compliance-360',
    label: 'Compliance 360',
    icon: Icon.TYPES.APPROVE_REJECT_SHIELD_OUTLINE,
    isCompliance360: true,
  },
  { id: 'eeo-reporting', label: 'EEO Reporting', icon: Icon.TYPES.BAR_CHART_OUTLINE },
  {
    id: 'employment-verifications',
    label: 'Employment Verifications',
    icon: Icon.TYPES.FILE_USER_CHECK_OUTLINE,
  },
  {
    id: 'work-authorization',
    label: 'Work Authorization',
    icon: Icon.TYPES.FINGERPRINT,
  },
  { id: 'divider-2', label: '', icon: '', isDivider: true },
  {
    id: 'discover-more',
    label: 'Discover more HR apps',
    icon: Icon.TYPES.ADD_CIRCLE_OUTLINE,
  },
];

interface NavigationShellProps {
  initialView?: ViewType;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({ initialView = 'home' }) => {
  const { theme, mode: currentMode } = usePebbleTheme();

  const [view, setView] = useState<ViewType>(initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hrSubmenuOpen, setHrSubmenuOpen] = useState(false);
  const [compliance360Hovered, setCompliance360Hovered] = useState(false);
  const [hoverSubmenuTop, setHoverSubmenuTop] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compliance360BtnRef = useRef<HTMLButtonElement>(null);

  const handleLogoClick = useCallback(() => {
    setView('home');
    setHrSubmenuOpen(false);
    setCompliance360Hovered(false);
  }, []);

  const handleHRServicesClick = useCallback(() => {
    setHrSubmenuOpen(prev => !prev);
    setCompliance360Hovered(false);
  }, []);

  const handleNavigateToHRServices = useCallback(() => {
    setView('hr-services');
    setHrSubmenuOpen(false);
    setCompliance360Hovered(false);
  }, []);

  const handleNavigateToWorkforce = useCallback(() => {
    setView('workforce');
    setHrSubmenuOpen(false);
    setCompliance360Hovered(false);
  }, []);

  const handleNavigateToCompliance360 = useCallback(() => {
    setView('compliance-360');
    setHrSubmenuOpen(false);
    setCompliance360Hovered(false);
  }, []);

  const handleCompliance360MouseEnter = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (compliance360BtnRef.current) {
      const rect = compliance360BtnRef.current.getBoundingClientRect();
      setHoverSubmenuTop(rect.top);
    }
    setCompliance360Hovered(true);
  }, []);

  const handleCompliance360MouseLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      setCompliance360Hovered(false);
    }, 120);
  }, []);

  const handleHoverSubMenuMouseEnter = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setCompliance360Hovered(true);
  }, []);

  const handleHoverSubMenuMouseLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      setCompliance360Hovered(false);
    }, 120);
  }, []);

  const isHRActive = hrSubmenuOpen || view === 'hr-services' || view === 'workforce' || view === 'compliance-360';
  const sidebarWidth = sidebarCollapsed ? 60 : 266;

  const renderSidebarItem = (item: NavItemDef) => {
    if (item.isHRServices) {
      return (
        <NavItemBtn
          key={item.id}
          theme={theme}
          isActive={isHRActive}
          onClick={handleHRServicesClick}
        >
          <NavIconWrapper theme={theme}>
            <Icon
              type={item.icon}
              size={20}
              color={isHRActive ? theme.colorPrimary : theme.colorOnSurface}
            />
          </NavIconWrapper>
          <NavLabel theme={theme} collapsed={sidebarCollapsed}>
            {item.label}
          </NavLabel>
          {item.hasSubmenu && (
            <NavChevron theme={theme} collapsed={sidebarCollapsed}>
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={isHRActive ? theme.colorPrimary : theme.colorOnSurface} />
            </NavChevron>
          )}
        </NavItemBtn>
      );
    }

    return (
      <NavItemBtn key={item.id} theme={theme}>
        <NavIconWrapper theme={theme}>
          <Icon type={item.icon} size={20} color={theme.colorOnSurface} />
        </NavIconWrapper>
        <NavLabel theme={theme} collapsed={sidebarCollapsed}>
          {item.label}
        </NavLabel>
        {item.hasSubmenu && (
          <NavChevron theme={theme} collapsed={sidebarCollapsed}>
            <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurface} />
          </NavChevron>
        )}
      </NavItemBtn>
    );
  };

  return (
    <ShellContainer theme={theme}>
      {/* ── Top Nav ── */}
      <TopNav theme={theme}>
        <NavLogo theme={theme}>
          <LogoImg
            src={currentMode === 'dark' ? RipplingLogoWhite : RipplingLogoBlack}
            alt="Rippling"
            theme={theme}
            onClick={handleLogoClick}
          />
        </NavLogo>
        <NavDivider theme={theme} />
        <NavRight theme={theme}>
          <NavSearchBar theme={theme}>
            <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} color={theme.colorOnSurfaceVariant} />
            <NavSearchText theme={theme}>Search or jump to...</NavSearchText>
          </NavSearchBar>
          <NavActions>
            <NavIconBtn theme={theme} aria-label="Help">
              <Icon type={Icon.TYPES.HELP_OUTLINE} size={20} color={theme.colorOnSurface} />
            </NavIconBtn>
            <NavIconBtn theme={theme} aria-label="Create">
              <Icon type={Icon.TYPES.ADD_CIRCLE_OUTLINE} size={20} color={theme.colorOnSurface} />
            </NavIconBtn>
            <NavIconBtn theme={theme} aria-label="Notifications">
              <Icon
                type={Icon.TYPES.NOTIFICATION_OUTLINE}
                size={20}
                color={theme.colorOnSurface}
              />
            </NavIconBtn>
            <NavDivider theme={theme} />
            <NavAvatarButton theme={theme}>A</NavAvatarButton>
          </NavActions>
        </NavRight>
      </TopNav>

      {/* ── Sidebar ── */}
      <Sidebar theme={theme} collapsed={sidebarCollapsed}>
        <SidebarScrollArea theme={theme}>
          {/* Primary section */}
          <NavGroup theme={theme}>{PRIMARY_NAV.map(renderSidebarItem)}</NavGroup>

          {/* Apps section */}
          <NavGroup theme={theme}>
            <SectionLabel theme={theme} collapsed={sidebarCollapsed} />
            {APPS_NAV.map(renderSidebarItem)}
          </NavGroup>

          {/* Platform section */}
          <NavGroup theme={theme}>
            <SectionLabel theme={theme} collapsed={sidebarCollapsed}>
              Platform
            </SectionLabel>
            {PLATFORM_NAV.map(renderSidebarItem)}
          </NavGroup>
        </SidebarScrollArea>

        <SidebarFooter theme={theme}>
          <NavGroup theme={theme}>
            <SidebarToggleBtn
              theme={theme}
              onClick={() => setSidebarCollapsed(prev => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <NavIconWrapper theme={theme}>
                <Icon
                  type={
                    sidebarCollapsed
                      ? Icon.TYPES.EXPAND_PANEL_OUTLINE
                      : Icon.TYPES.COLLAPSE_PANEL_OUTLINE
                  }
                  size={20}
                  color={theme.colorOnSurfaceVariant}
                />
              </NavIconWrapper>
              <NavLabel theme={theme} collapsed={sidebarCollapsed}>
                Collapse
              </NavLabel>
            </SidebarToggleBtn>
          </NavGroup>
        </SidebarFooter>
      </Sidebar>

      {/* ── HR Services Submenu Panel ── */}
      <SubmenuPanel theme={theme} open={hrSubmenuOpen}>
        <SubmenuHeader theme={theme}>
          <SubmenuTitle theme={theme}>HR Services</SubmenuTitle>
        </SubmenuHeader>
        <SubmenuScrollArea theme={theme}>
          {HR_SUBMENU_ITEMS.map(item => {
            if (item.isDivider) {
              return <SubmenuSectionDivider key={item.id} theme={theme} />;
            }

            if (item.isCompliance360) {
              return (
                <SubmenuItemContainer key={item.id}>
                  <SubmenuItemBtn
                    ref={compliance360BtnRef as RefObject<HTMLButtonElement>}
                    theme={theme}
                    isHovered={view === 'compliance-360'}
                    onClick={handleNavigateToCompliance360}
                  >
                    <Icon
                      type={item.icon}
                      size={18}
                      color={theme.colorOnSurface}
                    />
                    <SubmenuItemText theme={theme}>{item.label}</SubmenuItemText>
                    <Icon
                      type={Icon.TYPES.CHEVRON_RIGHT}
                      size={14}
                      color={theme.colorOnSurfaceVariant}
                    />
                  </SubmenuItemBtn>
                </SubmenuItemContainer>
              );
            }

            return (
              <SubmenuItemBtn key={item.id} theme={theme}>
                <Icon type={item.icon} size={18} color={theme.colorOnSurface} />
                <SubmenuItemText theme={theme}>{item.label}</SubmenuItemText>
              </SubmenuItemBtn>
            );
          })}
        </SubmenuScrollArea>
      </SubmenuPanel>

      {/* Hover flyout for Compliance 360 → HR Services / Workforce (rendered at root to escape overflow/transform) */}
      {hrSubmenuOpen && compliance360Hovered && (
        <HoverSubMenu
          theme={theme}
          posTop={hoverSubmenuTop}
          onMouseEnter={handleHoverSubMenuMouseEnter}
          onMouseLeave={handleHoverSubMenuMouseLeave}
        >
          <HoverSubMenuItem theme={theme} onClick={handleNavigateToHRServices}>
            <Icon
              type={Icon.TYPES.SHIELD_OUTLINE}
              size={16}
              color={theme.colorOnSurface}
            />
            HR Services
          </HoverSubMenuItem>
          <HoverSubMenuItem theme={theme} onClick={handleNavigateToWorkforce}>
            <Icon
              type={Icon.TYPES.USERS_OUTLINE}
              size={16}
              color={theme.colorOnSurface}
            />
            Workforce
          </HoverSubMenuItem>
        </HoverSubMenu>
      )}

      {/* Click-outside overlay to close submenu */}
      <Overlay
        visible={hrSubmenuOpen}
        onClick={() => {
          setHrSubmenuOpen(false);
          setCompliance360Hovered(false);
        }}
        style={{ left: sidebarWidth + (hrSubmenuOpen ? 260 : 0) }}
      />

      {/* ── Main Content ── */}
      <MainContent theme={theme} sidebarWidth={sidebarWidth}>
        {view === 'home' && <HomePage onNavigateToHR={handleNavigateToCompliance360} />}
        {view === 'hr-services' && (
          <ComplianceHubContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
        {view === 'workforce' && <Compliance360Page />}
        {view === 'compliance-360' && <Compliance360Page />}
      </MainContent>
    </ShellContainer>
  );
};
