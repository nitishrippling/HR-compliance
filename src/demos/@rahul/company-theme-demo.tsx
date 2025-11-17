import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Card from '@rippling/pebble/Card';
import Modal from '@rippling/pebble/Modal';
import Input from '@rippling/pebble/Inputs';
import Chip from '@rippling/pebble/Chip';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';
import ThemeEditorPage from './theme-editor-page';
import SimpleThemeEditor from './simple-theme-editor';

export enum ThemeMode {
  LOGO_ONLY = 'logo-only',
  LOGO_NAV_COLOR = 'logo-nav-color',
  LOGO_PRIMARY = 'logo-primary',
  FULL_PALETTE = 'full-palette',
  MULTI_THEME = 'multi-theme',
}

export interface ThemeModeOption {
  mode: ThemeMode;
  label: string;
  description: string;
}

export const THEME_MODES: ThemeModeOption[] = [
  {
    mode: ThemeMode.LOGO_ONLY,
    label: 'Mode A — Logo only',
    description: 'Light and dark logos only',
  },
  {
    mode: ThemeMode.LOGO_NAV_COLOR,
    label: 'Mode B — Logo + Nav color',
    description: 'Logos and navigation bar color',
  },
  {
    mode: ThemeMode.LOGO_PRIMARY,
    label: 'Mode C — Logo + Primary (auto calc)',
    description: 'Logos and primary color with auto-calculated palette',
  },
  {
    mode: ThemeMode.FULL_PALETTE,
    label: 'Mode D — Full palette',
    description: 'Primary, secondary, and tertiary colors',
  },
  {
    mode: ThemeMode.MULTI_THEME,
    label: 'Mode E — Multi-theme',
    description: 'Multiple themes with assignments',
  },
];

interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  navColor?: string; // Navigation bar color for Mode B
  lightLogo?: string; // Data URL or file path for light background logo
  darkLogo?: string; // Data URL or file path for dark background logo
  lightLogoBackground?: string; // Background color for light logo
  darkLogoBackground?: string; // Background color for dark logo
}

/**
 * Company Theme Demo
 *
 * Showcases the Company Settings > Branding > Theme Settings interface
 * featuring an empty state for theme creation with call-to-action.
 *
 * Components used:
 * - AppShellLayout (app shell structure)
 * - Card (theme settings container)
 * - Button (Create Theme actions)
 * - Icon (empty state illustration)
 */

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  text-align: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const IllustrationWrapper = styled.div`
  width: 140px;
  height: 140px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: linear-gradient(135deg, 
    ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow} 0%, 
    ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const IllustrationIcon = styled.div`
  position: relative;
  z-index: 2;
  opacity: 0.6;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const IllustrationBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHighest};
  opacity: 0.4;
`;

const EmptyStateTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 535;
`;

const EmptyStateDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  max-width: 480px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const CardTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const Label = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  font-weight: 535;
`;

const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const SectionSubtitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const LogoPreviewSmall = styled.div<{ bgColor?: string }>`
  width: 120px;
  height: 80px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space300};

  ${({ bgColor }) => bgColor === 'transparent' && `
    background: 
      linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
      linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
    background-size: 12px 12px;
    background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
  `}

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ColorPreviewSwatch = styled.div<{ color: string; label?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};

  &::before {
    content: '';
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
    background-color: ${({ color }) => color};
    border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    display: block;
  }

  &::after {
    content: ${({ label }) => label ? `'${label}'` : '""'};
    ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

const ThemeLibraryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space800};
`;

const ThemeCard = styled.button`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  
  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    .delete-button {
      opacity: 1;
    }
  }
`;

const ThemeCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ThemeCardName = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
  flex: 1;
`;

const DeleteButtonWrapper = styled.div`
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ColorChipsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ColorChip = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AssignmentSection = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const AssignmentThemeTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  font-weight: 535;
`;

const SupergroupCard = styled.div`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space350};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  padding-bottom: 0;
`;

const SupergroupRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SupergroupContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  flex: 1;
`;

const SupergroupLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SupergroupActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SupergroupFooter = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  height: 54px;
  padding-right: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FooterLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const FooterPlaceholder = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ModeSelectWrapper = styled.div`
  min-width: 200px;

  /* Remove extra margin from dropdown menu content - override PageHeaderWrapper styles */
  [role="listbox"] div[class*='Content'] {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: ${({ theme }) => (theme as StyledTheme).space200};
  }

  /* Additional specificity to override global styles */
  div[class*='Content'][class*='css-'] {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
`;

const CompanyThemeDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<ThemeMode>(ThemeMode.MULTI_THEME);
  
  // Store list of themes - start with empty array
  const [themes, setThemes] = useState<Theme[]>([]);

  // Sidebar navigation - Company Settings section
  const companySettingsSection: NavSectionData = {
    items: [
      { id: 'api-tokens', label: 'API Tokens', icon: Icon.TYPES.DOCUMENT_OUTLINE },
      { id: 'company-settings', label: 'Company Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
      { id: 'data-manager', label: 'Data Manager', icon: Icon.TYPES.ARCHIVE_FILLED },
      { id: 'organizational-data', label: 'Organizational Data', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
      { id: 'permissions', label: 'Permissions', icon: Icon.TYPES.LOCK_OUTLINE },
      { id: 'saved-supergroups', label: 'Saved Supergroups', icon: Icon.TYPES.USERS_OUTLINE },
      { id: 'security', label: 'Security', icon: Icon.TYPES.LOCK_OUTLINE },
    ],
  };

  // Platform navigation section
  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  // Company Settings tabs
  const tabs = ['Flow Configuration', 'Notifications', 'Billing', 'Branding', 'Security'];

  const handleCreateTheme = () => {
    setThemeName('');
    setEditingThemeId(null);
    setShowCreateModal(true);
  };

  const handleEditTheme = (themeId: string) => {
    const themeToEdit = themes.find(t => t.id === themeId);
    if (themeToEdit) {
      setThemeName(themeToEdit.name);
      setEditingThemeId(themeId);
      setShowEditor(true);
    }
  };

  const handleDeleteTheme = (themeId: string, event: React.MouseEvent) => {
    // Prevent card click event from triggering
    event.stopPropagation();
    // Remove theme from list
    setThemes(themes.filter(t => t.id !== themeId));
  };

  const handleSaveTheme = () => {
    // Create the initial theme object with default Rippling Berry colors
    const newTheme: Theme = {
      id: `theme-${Date.now()}`,
      name: themeName,
      primaryColor: '#7a005d', // Rippling Berry primary
      secondaryColor: '#ffa81d', // Rippling Berry secondary
      tertiaryColor: '#1e4aa9', // Rippling Berry tertiary
    };
    
    // Add the theme to the themes array
    setThemes([...themes, newTheme]);
    setEditingThemeId(newTheme.id);
    
    console.log('Creating theme:', themeName);
    setShowCreateModal(false);
    // Show the theme editor
    setShowEditor(true);
  };

  const handleSaveThemeFromEditor = (savedTheme: Theme, shouldClose: boolean = false) => {
    // Check if this theme already exists in the array
    const existingThemeIndex = themes.findIndex(t => t.id === savedTheme.id);
    
    if (existingThemeIndex !== -1) {
      // Update existing theme
      const updatedThemes = [...themes];
      updatedThemes[existingThemeIndex] = savedTheme;
      setThemes(updatedThemes);
    } else {
      // Add new theme (this handles themes created from within the editor)
      setThemes([...themes, savedTheme]);
      setEditingThemeId(savedTheme.id);
      setThemeName(savedTheme.name);
    }
    
    // Only close the editor if explicitly requested (e.g., from "Save changes" button)
    if (shouldClose) {
      setShowEditor(false);
      setEditingThemeId(null);
    }
  };

  const handleCancelModal = () => {
    setShowCreateModal(false);
    // Reset form
    setThemeName('');
    setEditingThemeId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && themeName.trim()) {
      handleSaveTheme();
    }
  };

  const pageActions = (
    <HStack gap="0.5rem">
      {/* Mode Selector */}
      <ModeSelectWrapper theme={theme}>
        <Input.Select
          size={Input.Select.SIZES.M}
          value={currentMode}
          onChange={(value) => {
            setCurrentMode(value as ThemeMode);
          }}
          list={THEME_MODES.map((modeOption) => ({
            label: modeOption.label.split('—')[0].trim(),
            value: modeOption.mode,
          }))}
        />
      </ModeSelectWrapper>

      {themes.length > 0 && (
        <Button 
          appearance={Button.APPEARANCES.PRIMARY} 
          size={Button.SIZES.M}
          onClick={() => {
            // Open editor for the first theme (or you could show a dropdown to select)
            if (themes.length > 0) {
              handleEditTheme(themes[0].id);
            }
          }}
          icon={{ type: Icon.TYPES.EDIT_OUTLINE }}
        >
          Theme Editor
        </Button>
      )}
      <Button 
        appearance={themes.length > 0 ? Button.APPEARANCES.OUTLINE : Button.APPEARANCES.PRIMARY}
        size={Button.SIZES.M}
        onClick={handleCreateTheme}
        icon={{ type: Icon.TYPES.ADD }}
      >
        Create Theme
      </Button>
    </HStack>
  );

  // If editor is open, show appropriate editor based on mode
  if (showEditor) {
    const editingTheme = editingThemeId ? themes.find(t => t.id === editingThemeId) : null;
    
    // For Modes A-D, use simple editor
    if (currentMode !== ThemeMode.MULTI_THEME) {
      // Create a single theme if it doesn't exist
      const singleTheme = themes.length > 0 ? themes[0] : {
        id: 'default-theme',
        name: 'Default Theme',
        primaryColor: '#7a005d',
        secondaryColor: '#ffa81d',
        tertiaryColor: '#1e4aa9',
      };

      return (
        <SimpleThemeEditor
          theme={singleTheme}
          currentMode={currentMode}
          onSave={(updatedTheme) => {
            // For single-theme modes, just update or add the single theme
            if (themes.length === 0) {
              setThemes([updatedTheme]);
            } else {
              setThemes([updatedTheme]);
            }
            setShowEditor(false);
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingThemeId(null);
          }}
        />
      );
    }

    // For Mode E, use complex multi-theme editor
    return (
      <ThemeEditorPage 
        themeName={themeName} 
        initialTheme={editingTheme}
        allThemes={themes}
        currentMode={currentMode}
        onBack={() => {
          setShowEditor(false);
          setEditingThemeId(null);
        }}
        onSave={handleSaveThemeFromEditor}
        onThemeSwitch={(themeId: string) => {
          // Switch to a different theme
          const theme = themes.find(t => t.id === themeId);
          if (theme) {
            setEditingThemeId(themeId);
            setThemeName(theme.name);
          }
        }}
      />
    );
  }

  return (
    <AppShellLayout
      pageTitle="Company Settings"
      pageTabs={tabs}
      defaultActiveTab={3} // Branding tab is active (0-indexed)
      pageActions={pageActions}
      mainNavSections={[companySettingsSection]}
      platformNavSection={platformSection}
      companyName="Acme, Inc."
      userInitial="A"
    >
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>

        {/* For Modes A-D: Show simple branding UI */}
        {currentMode !== ThemeMode.MULTI_THEME ? (
          <>
            {themes.length === 0 ? (
              // Empty state for simple modes
              <EmptyStateContainer>
                <IllustrationWrapper>
                  <IllustrationBackground />
                  <IllustrationIcon>
                    <Icon 
                      type={Icon.TYPES.CUP_DROPLET_OUTLINE} 
                      size={64}
                    />
                  </IllustrationIcon>
                </IllustrationWrapper>

                <VStack gap="1rem">
                  <EmptyStateTitle>
                    No branding configured yet
                  </EmptyStateTitle>
                  <EmptyStateDescription>
                    Get started by setting up your company's visual identity including logos and colors.
                  </EmptyStateDescription>
                </VStack>

                <Button 
                  appearance={Button.APPEARANCES.PRIMARY} 
                  size={Button.SIZES.M}
                  onClick={() => setShowEditor(true)}
                  icon={{ type: Icon.TYPES.EDIT_OUTLINE }}
                >
                  Edit Branding
                </Button>
              </EmptyStateContainer>
            ) : (
              // Show current branding
              <VStack gap="2rem">
                <HStack gap="1rem" align="center" justify="space-between">
                  <div>
                    <SectionTitle>Company Branding</SectionTitle>
                    <SectionDescription>
                      Your company's visual identity
                    </SectionDescription>
                  </div>
                  <Button
                    appearance={Button.APPEARANCES.PRIMARY}
                    size={Button.SIZES.M}
                    onClick={() => setShowEditor(true)}
                    icon={{ type: Icon.TYPES.EDIT_OUTLINE }}
                  >
                    Edit Branding
                  </Button>
                </HStack>

                {/* Preview current branding */}
                <HStack gap="3rem" align="flex-start">
                  {/* Logos Preview */}
                  {(themes[0].lightLogo || themes[0].darkLogo) && (
                    <VStack gap="0.75rem">
                      <SectionSubtitle>Logos</SectionSubtitle>
                      <HStack gap="1rem">
                        {themes[0].lightLogo && (
                          <LogoPreviewSmall bgColor={themes[0].lightLogoBackground || 'transparent'}>
                            <img src={themes[0].lightLogo} alt="Light logo" />
                          </LogoPreviewSmall>
                        )}
                        {themes[0].darkLogo && (
                          <LogoPreviewSmall bgColor={themes[0].darkLogoBackground || '#1a1a1a'}>
                            <img src={themes[0].darkLogo} alt="Dark logo" />
                          </LogoPreviewSmall>
                        )}
                      </HStack>
                    </VStack>
                  )}

                  {/* Colors Preview */}
                  {currentMode !== ThemeMode.LOGO_ONLY && (
                    <VStack gap="0.75rem">
                      <SectionSubtitle>Colors</SectionSubtitle>
                      <HStack gap="0.75rem">
                        <ColorPreviewSwatch color={themes[0].primaryColor} label="Primary" />
                        {currentMode === ThemeMode.FULL_PALETTE && (
                          <>
                            <ColorPreviewSwatch color={themes[0].secondaryColor} label="Secondary" />
                            <ColorPreviewSwatch color={themes[0].tertiaryColor} label="Tertiary" />
                          </>
                        )}
                      </HStack>
                    </VStack>
                  )}
                </HStack>
              </VStack>
            )}
          </>
        ) : (
          // Mode E: Multi-theme mode
          <>
            {themes.length === 0 ? (
              // Empty state for multi-theme mode
              <EmptyStateContainer>
                <IllustrationWrapper>
                  <IllustrationBackground />
                  <IllustrationIcon>
                    <Icon 
                      type={Icon.TYPES.CUP_DROPLET_OUTLINE} 
                      size={64}
                    />
                  </IllustrationIcon>
                </IllustrationWrapper>

                <VStack gap="1rem">
                  <EmptyStateTitle>
                    Currently, there are no themes created in your account.
                  </EmptyStateTitle>
                  <EmptyStateDescription>
                    Initiate the theme creation process by clicking the button below to customize 
                    the appearance and ambiance of your organization.
                  </EmptyStateDescription>
                </VStack>

                <Button 
                  appearance={Button.APPEARANCES.PRIMARY} 
                  size={Button.SIZES.M}
                  onClick={handleCreateTheme}
                  icon={{ type: Icon.TYPES.ADD }}
                >
                  Create a Theme
                </Button>
              </EmptyStateContainer>
            ) : (
              // Theme library
              <>
                <SectionTitle>Theme Library</SectionTitle>
                <ThemeLibraryGrid>
                  {themes.map((themeItem) => (
                    <ThemeCard
                      key={themeItem.id}
                      onClick={() => handleEditTheme(themeItem.id)}
                    >
                      <ThemeCardHeader>
                        <ThemeCardName>{themeItem.name}</ThemeCardName>
                        <DeleteButtonWrapper className="delete-button">
                          <Button.Icon
                            icon={Icon.TYPES.TRASH_OUTLINE}
                            size={Button.Icon.SIZES.XS}
                            appearance={Button.Icon.APPEARANCES.GHOST}
                            aria-label="Delete theme"
                            onClick={(e) => handleDeleteTheme(themeItem.id, e)}
                          />
                        </DeleteButtonWrapper>
                      </ThemeCardHeader>
                      <ColorChipsContainer>
                        <ColorChip color={themeItem.primaryColor} />
                        <ColorChip color={themeItem.secondaryColor} />
                        <ColorChip color={themeItem.tertiaryColor} />
                      </ColorChipsContainer>
                    </ThemeCard>
                  ))}
                </ThemeLibraryGrid>

                {/* Assignments Section */}
                <SectionTitle>Assignments</SectionTitle>
                {themes.map((themeItem) => (
                  <AssignmentSection key={`assignment-${themeItem.id}`}>
                    <AssignmentThemeTitle>{themeItem.name}</AssignmentThemeTitle>
                    <SupergroupCard>
                      <SupergroupRow>
                        <SupergroupContent>
                          <SupergroupLabel>Include:</SupergroupLabel>
                          <Chip.Group>
                            <Chip 
                              size={Chip.SIZES.L}
                              icon={Icon.TYPES.USER_OUTLINE}
                            >
                              Emerson Culhane
                            </Chip>
                            <Chip 
                              size={Chip.SIZES.L}
                              icon={Icon.TYPES.USERS_OUTLINE}
                            >
                              All admins
                            </Chip>
                          </Chip.Group>
                        </SupergroupContent>
                        <SupergroupActions>
                          <Button.Icon
                            icon={Icon.TYPES.USERS_OUTLINE}
                            size={Button.Icon.SIZES.XS}
                            appearance={Button.Icon.APPEARANCES.OUTLINE}
                            aria-label="Add user or group"
                            onClick={() => console.log('Add user/group')}
                          />
                          <Button.Icon
                            icon={Icon.TYPES.SETTINGS_OUTLINE}
                            size={Button.Icon.SIZES.XS}
                            appearance={Button.Icon.APPEARANCES.OUTLINE}
                            aria-label="Settings"
                            onClick={() => console.log('Settings')}
                          />
                        </SupergroupActions>
                      </SupergroupRow>
                      <SupergroupFooter>
                        <FooterLabel>Except:</FooterLabel>
                        <FooterPlaceholder>Click to add exceptions</FooterPlaceholder>
                      </SupergroupFooter>
                    </SupergroupCard>
                  </AssignmentSection>
                ))}
              </>
            )}
          </>
        )}
      </Card.Layout>

      {/* Create Theme Modal */}
      <Modal
        isVisible={showCreateModal}
        onCancel={handleCancelModal}
        title="Create a new theme"
        width={500}
      >
        <ModalBody theme={theme}>
          <FormField theme={theme}>
            <Label theme={theme}>Theme name</Label>
            <Input.Text
              id="theme-name"
              value={themeName}
              onChange={(e: any) => setThemeName(e?.target?.value || e)}
              onKeyDown={handleKeyDown}
              placeholder="Acme Theme"
              size={Input.Text.SIZES.M}
              autoFocus
            />
          </FormField>
        </ModalBody>
        
        <Modal.Footer>
          <Button
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={handleCancelModal}
            size={Button.SIZES.M}
          >
            Cancel
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            onClick={handleSaveTheme}
            size={Button.SIZES.M}
            isDisabled={!themeName.trim()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </AppShellLayout>
  );
};

export default CompanyThemeDemo;

