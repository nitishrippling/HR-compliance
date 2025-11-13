/**
 * Employee Profile Demo
 *
 * Main employee profile page with sections, compositions, and layout management.
 * Uses AppShellLayout and renders compositions based on layout configuration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Label from '@rippling/pebble/Label';
import ObjectUI from '@rippling/pebble/ObjectUI';
import Dropdown from '@rippling/pebble/Dropdown';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { Employee, ProfileLayout } from './types';
import { getEmployeeById, getLayouts } from './api';
import { SectionContentView } from './components/SectionContentView';
import { MOCK_EMPLOYEES } from './mockData';

const ObjectWrapper = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const StatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
`;

const SidebarNav = styled.div`
  width: 240px;
  flex-shrink: 0;
`;

// Helper to get typed theme (DRY principle)
const getTheme = (theme: unknown): StyledTheme => theme as StyledTheme;

const SectionNavItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => {
    const t = getTheme(theme);
    return `${t.space300} ${t.space400}`;
  }};
  background: ${({ isActive, theme }) =>
    isActive ? getTheme(theme).colorSurfaceContainerLow : 'transparent'};
  border: none;
  border-left: 3px solid
    ${({ isActive, theme }) => (isActive ? getTheme(theme).colorPrimary : 'transparent')};
  border-radius: ${({ theme }) => getTheme(theme).shapeCornerLg};
  cursor: pointer;
  text-align: left;
  ${({ theme }) => getTheme(theme).typestyleV2BodyMedium};
  color: ${({ isActive, theme }) =>
    isActive ? getTheme(theme).colorOnSurface : getTheme(theme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => getTheme(theme).space200};

  &:hover {
    background-color: ${({ theme }) => getTheme(theme).colorSurfaceContainerLow};
  }
`;

const SectionContent = styled.div`
  flex: 1;
`;

const BreadcrumbRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};

  &:hover {
    text-decoration: underline;
  }
`;

const LayoutSwitcherWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  align-items: center;
`;

const LayoutSwitcherLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const EmployeeProfileDemo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = usePebbleTheme();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [layout, setLayout] = useState<ProfileLayout | null>(null);
  const [allLayouts, setAllLayouts] = useState<ProfileLayout[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Load first employee for demo
      const emp = await getEmployeeById(MOCK_EMPLOYEES[0].id);
      setEmployee(emp || MOCK_EMPLOYEES[0]);

      // Load the active layout (from last edit) or default to "Default"
      const layouts = await getLayouts();
      setAllLayouts(layouts); // Store all layouts for switcher
      const activeLayoutId = localStorage.getItem('employee-profile-active-layout-id');

      console.log('[EmployeeProfile] Loading layout:', {
        activeLayoutId,
        availableLayouts: layouts.map(l => ({ id: l.id, name: l.name })),
      });

      let selectedLayout: ProfileLayout | undefined;
      if (activeLayoutId) {
        selectedLayout = layouts.find(l => l.id === activeLayoutId);
        console.log('[EmployeeProfile] Found active layout:', selectedLayout?.name);
      }

      // Fallback to Default layout if no active layout found
      if (!selectedLayout) {
        selectedLayout = layouts.find(l => l.name === 'Default') || layouts[0];
        console.log('[EmployeeProfile] Using fallback layout:', selectedLayout?.name);
      }

      setLayout(selectedLayout);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload data whenever navigating to this page (including from layout editor)
  useEffect(() => {
    loadData();
  }, [location.pathname, loadData]);

  useEffect(() => {
    if (layout && layout.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(layout.sections[0].id);
    }
  }, [layout, activeSectionId]);

  const handleManageTabsAndFields = () => {
    navigate('/employee-profile/layouts');
  };

  const handleLayoutSwitch = (layoutId: string) => {
    const newLayout = allLayouts.find(l => l.id === layoutId);
    if (newLayout) {
      setLayout(newLayout);
      localStorage.setItem('employee-profile-active-layout-id', layoutId);
      // Reset active section to first section of new layout
      setActiveSectionId(newLayout.sections[0]?.id || '');
      console.log('[EmployeeProfile] Switched to layout:', newLayout.name);
    }
  };

  const activeSection = layout?.sections.find(s => s.id === activeSectionId);

  // Main navigation items
  const mainSection: NavSectionData = {
    items: [
      { id: 'people', label: 'People', icon: Icon.TYPES.PEO_OUTLINE },
      { id: 'org-chart', label: 'Org Chart', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
    ],
  };

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      {
        id: 'settings',
        label: 'Company settings',
        icon: Icon.TYPES.SETTINGS_OUTLINE,
        hasSubmenu: true,
      },
    ],
  };

  if (loading || !employee || !layout) {
    return (
      <AppShellLayout
        pageTitle="Employee Profile"
        mainNavSections={[mainSection]}
        platformNavSection={platformSection}
        defaultSidebarCollapsed={true}
        companyName="Rippling"
        userInitial="DV"
      >
        <div>Loading...</div>
      </AppShellLayout>
    );
  }

  return (
    <AppShellLayout
      mainNavSections={[mainSection]}
      platformNavSection={platformSection}
      defaultSidebarCollapsed={true}
      companyName="Rippling"
      userInitial="DV"
    >
      <div style={{ padding: theme.space800 }}>
        <BreadcrumbRow theme={theme}>
          <Breadcrumb>
            <BreadcrumbLink onClick={() => navigate('/')}>People</BreadcrumbLink>
            <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurfaceVariant} />
            <span>{employee.name}'s Profile</span>
          </Breadcrumb>

          <LayoutSwitcherWrapper theme={theme}>
            <LayoutSwitcherLabel theme={theme}>View as:</LayoutSwitcherLabel>
            <Dropdown
              list={allLayouts.map(l => ({
                value: l.id,
                label: l.name,
                onClick: () => handleLayoutSwitch(l.id),
              }))}
              value={layout?.id}
              placement={Dropdown.PLACEMENTS.BOTTOM_START}
            >
              <Button
                appearance={Button.APPEARANCES.OUTLINE}
                size={Button.SIZES.S}
                icon={{
                  type: Icon.TYPES.CHEVRON_DOWN,
                  alignment: Button.ICON_ALIGNMENTS.RIGHT,
                }}
              >
                {layout?.name || 'Select Layout'}
              </Button>
            </Dropdown>
          </LayoutSwitcherWrapper>
        </BreadcrumbRow>

        <ObjectWrapper theme={theme}>
          <ObjectUI.Template>
            <ObjectUI.Header
              title={employee.name}
              label={{
                size: Label.SIZES.S,
                appearance: Label.APPEARANCES.SUCCESS,
                children: employee.status === 'active' ? 'Active' : 'Inactive',
              }}
              caption={employee.title}
              actions={{
                limit: 1,
                list: [
                  {
                    type: ObjectUI.Header.ACTION_TYPES.BUTTON,
                    props: {
                      appearance: Button.APPEARANCES.OUTLINE,
                      size: Button.SIZES.M,
                      icon: {
                        type: Icon.TYPES.SETTINGS_OUTLINE,
                        alignment: Button.ICON_ALIGNMENTS.LEFT,
                      },
                      children: 'Edit Layout',
                      onClick: () => {
                        handleManageTabsAndFields();
                      },
                    },
                  },
                  {
                    type: ObjectUI.Header.ACTION_TYPES.BUTTON,
                    props: {
                      appearance: Button.APPEARANCES.OUTLINE,
                      size: Button.SIZES.M,
                      children: 'View history',
                      onClick: () => {
                        // Handle view history action
                      },
                    },
                  },
                ],
              }}
            />
            <ObjectUI.Stats
              list={[
                {
                  label: 'Locale region',
                  renderer: ({ value }: { value: string }) => (
                    <StatValue theme={theme}>{value || '-'}</StatValue>
                  ),
                  props: { value: employee.localeRegion },
                },
                {
                  label: 'EEOC Ethnicity',
                  renderer: ({ value }: { value: string }) => (
                    <StatValue theme={theme}>{value || '-'}</StatValue>
                  ),
                  props: { value: employee.eeocEthnicity },
                },
              ]}
            />
          </ObjectUI.Template>
        </ObjectWrapper>

        <ContentContainer>
          <SidebarNav>
            {layout.sections.map(section => (
              <SectionNavItem
                key={section.id}
                isActive={section.id === activeSectionId}
                onClick={() => setActiveSectionId(section.id)}
              >
                {section.label}
              </SectionNavItem>
            ))}
          </SidebarNav>

          <SectionContent>
            {activeSection && <SectionContentView section={activeSection} employee={employee} />}
          </SectionContent>
        </ContentContainer>
      </div>
    </AppShellLayout>
  );
};

export default EmployeeProfileDemo;
