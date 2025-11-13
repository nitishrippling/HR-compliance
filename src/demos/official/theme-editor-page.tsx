import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Card from '@rippling/pebble/Card';
import Chip from '@rippling/pebble/Chip';
import Modal from '@rippling/pebble/Modal';
import Input from '@rippling/pebble/Inputs';
import Select from '@rippling/pebble/Inputs/Select';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';
import { ColorInput } from './components/ColorInput';
import { PreviewThemeProvider } from './components/PreviewThemeContext';
import { RealTimePreview } from './components/RealTimePreview';

/**
 * Theme Editor Page
 *
 * Full-screen theme editor with bento grid layout:
 * - Theme selector with color chips
 * - Brand assets upload (light/dark logos)
 * - Color customization (light/dark modes)
 * - Theme assignments to departments
 * - Real-time preview panel
 */

interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

interface ThemeEditorPageProps {
  themeName: string;
  initialTheme?: Theme | null;
  allThemes?: Theme[];
  onBack?: () => void;
  onSave?: (theme: Theme, shouldClose?: boolean) => void;
  onThemeSwitch?: (themeId: string) => void;
}

// Main container with single scroll
const EditorContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space1400};
  padding-bottom: calc(${({ theme }) => (theme as StyledTheme).space1400} + 88px); /* Add space for sticky footer */
  overflow-y: auto;
`;

// Header
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space800};
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

// Bento grid layout
const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// Left column
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

// Right column (preview)
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  position: sticky;
  top: ${({ theme }) => (theme as StyledTheme).space1400};
  align-self: start;
`;

// Card sections
const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SectionSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

// Theme selector with color chips
const ThemeSelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ColorChips = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ColorChip = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

// Logo upload area
const LogoUploadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const LogoUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const UploadBox = styled.div<{ isDark?: boolean }>`
  height: 98px;
  border: 2px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme, isDark }) =>
    isDark
      ? (theme as StyledTheme).colorSurfaceContainerHighest
      : (theme as StyledTheme).colorSurfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const UploadText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const FileTypeHint = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

// Color input grid
const ColorInputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const ColorColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ColumnLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

// Preview section
const PreviewTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const PreviewFrame = styled.div`
  overflow: hidden;
`;

// Sticky Footer
const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;

const FooterStart = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FooterEnd = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

// Supergroup components for assignments
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

// Modal styles
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

const ThemeEditorPage: React.FC<ThemeEditorPageProps> = ({ 
  themeName, 
  initialTheme, 
  allThemes = [],
  onBack, 
  onSave,
  onThemeSwitch,
}) => {
  const { theme } = usePebbleTheme();
  const { name: currentThemeName, mode: colorMode } = useTheme();
  
  // Detect if current theme is dark mode (check both theme name and color mode)
  const isDarkMode = colorMode === 'dark' || currentThemeName?.toLowerCase().includes('dark') || false;
  const previewMode: 'light' | 'dark' = isDarkMode ? 'dark' : 'light';

  // State for theme configuration - initialize from initialTheme if provided
  const [selectedThemeId, setSelectedThemeId] = useState(initialTheme?.id || '');
  const [primaryColor, setPrimaryColor] = useState(initialTheme?.primaryColor || '#6B2C91');
  const [secondaryColor, setSecondaryColor] = useState(initialTheme?.secondaryColor || '#007991');
  const [tertiaryColor, setTertiaryColor] = useState(initialTheme?.tertiaryColor || '#FF8C00');
  const [darkPrimaryColor, setDarkPrimaryColor] = useState('#B39DDB');
  const [darkSecondaryColor, setDarkSecondaryColor] = useState('#4DD0E1');
  const [darkTertiaryColor, setDarkTertiaryColor] = useState('#8B5A00');
  
  // Modal state for adding new themes
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');

  // Build theme options from allThemes - memoized to update when allThemes changes
  const themeOptions = useMemo(() => 
    allThemes.map(t => ({
      label: t.name,
      value: t.id,
    })),
    [allThemes]
  );

  // Update colors when initialTheme or selectedThemeId changes
  useEffect(() => {
    const currentTheme = allThemes.find(t => t.id === selectedThemeId);
    if (currentTheme) {
      setPrimaryColor(currentTheme.primaryColor);
      setSecondaryColor(currentTheme.secondaryColor);
      setTertiaryColor(currentTheme.tertiaryColor);
    }
  }, [allThemes, selectedThemeId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleReset = () => {
    // Reset to Pebble Berry theme default colors
    setPrimaryColor('#7a005d'); // Berry primary
    setSecondaryColor('#ffa81d'); // Berry secondary
    setTertiaryColor('#1e4aa9'); // Berry tertiary
    setDarkPrimaryColor('#f0d0f5'); // Berry primary variant (lighter for dark mode)
    setDarkSecondaryColor('#ffe0ad'); // Berry secondary variant
    setDarkTertiaryColor('#c8d5ed'); // Berry tertiary variant
  };

  const handleThemeChange = (themeId: string) => {
    // Save current theme before switching (don't close editor)
    if (onSave && selectedThemeId) {
      const currentTheme: Theme = {
        id: selectedThemeId,
        name: allThemes.find(t => t.id === selectedThemeId)?.name || themeName,
        primaryColor,
        secondaryColor,
        tertiaryColor,
      };
      onSave(currentTheme, false);
    }

    // Switch to the selected theme
    const selectedTheme = allThemes.find(t => t.id === themeId);
    if (selectedTheme) {
      setSelectedThemeId(themeId);
      setPrimaryColor(selectedTheme.primaryColor);
      setSecondaryColor(selectedTheme.secondaryColor);
      setTertiaryColor(selectedTheme.tertiaryColor);
      
      // Call parent's onThemeSwitch
      if (onThemeSwitch) {
        onThemeSwitch(themeId);
      }
    }
  };

  const handleAddTheme = () => {
    setNewThemeName('');
    setShowCreateModal(true);
  };

  const handleCancelModal = () => {
    setShowCreateModal(false);
    setNewThemeName('');
  };

  const handleCreateNewTheme = () => {
    // Save the current theme first (don't close editor)
    if (onSave && selectedThemeId) {
      const currentTheme: Theme = {
        id: selectedThemeId,
        name: allThemes.find(t => t.id === selectedThemeId)?.name || themeName,
        primaryColor,
        secondaryColor,
        tertiaryColor,
      };
      onSave(currentTheme, false);
    }

    // Create the new theme with default Rippling Berry theme colors
    const newTheme: Theme = {
      id: `theme-${Date.now()}`,
      name: newThemeName,
      primaryColor: '#7a005d', // Rippling Berry primary
      secondaryColor: '#ffa81d', // Rippling Berry secondary
      tertiaryColor: '#1e4aa9', // Rippling Berry tertiary
    };

    // Add the new theme (don't close editor)
    if (onSave) {
      onSave(newTheme, false);
    }

    // Switch to the new theme
    setSelectedThemeId(newTheme.id);
    setPrimaryColor(newTheme.primaryColor);
    setSecondaryColor(newTheme.secondaryColor);
    setTertiaryColor(newTheme.tertiaryColor);

    // Call parent's onThemeSwitch to update the parent state
    if (onThemeSwitch) {
      onThemeSwitch(newTheme.id);
    }

    // Close modal and reset
    setShowCreateModal(false);
    setNewThemeName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newThemeName.trim()) {
      handleCreateNewTheme();
    }
  };

  const handleSave = () => {
    const savedTheme: Theme = {
      id: selectedThemeId || `theme-${Date.now()}`,
      name: allThemes.find(t => t.id === selectedThemeId)?.name || themeName,
      primaryColor,
      secondaryColor,
      tertiaryColor,
    };
    
    console.log('Saving theme configuration:', savedTheme);
    
    // Call the onSave callback if provided - pass shouldClose: false to stay in editor
    if (onSave) {
      onSave(savedTheme, false);
    }
  };

  return (
    <EditorContainer theme={theme}>
      {/* Header */}
      <PageHeader theme={theme}>
        <Button.Icon
          icon={Icon.TYPES.ARROW_LEFT}
          size={Button.SIZES.S}
          appearance={Button.APPEARANCES.GHOST}
          onClick={handleBack}
          aria-label="Back to themes"
        />
        <PageTitle theme={theme}>Theme Editor</PageTitle>
      </PageHeader>

      <BentoGrid theme={theme}>
        {/* Left Column - Configuration */}
        <LeftColumn theme={theme}>
          {/* Theme Selector Card */}
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="1.5rem">
              <HStack>
                <SectionTitle theme={theme}>Theme Selector</SectionTitle>
                <div style={{ flex: 1 }} />
                <Button
                  size={Button.SIZES.S}
                  appearance={Button.APPEARANCES.OUTLINE}
                  icon={{ type: Icon.TYPES.ADD }}
                  onClick={handleAddTheme}
                >
                  Add Theme
                </Button>
              </HStack>

              <ThemeSelectorRow theme={theme}>
                <div style={{ flex: 1 }}>
                  <Select
                    id="theme-select"
                    list={themeOptions}
                    value={selectedThemeId}
                    onChange={(value) => handleThemeChange(value as string)}
                    size={Select.SIZES.M}
                  />
                </div>
                <ColorChips theme={theme}>
                  <ColorChip color={primaryColor} theme={theme} />
                  <ColorChip color={secondaryColor} theme={theme} />
                  <ColorChip color={tertiaryColor} theme={theme} />
                </ColorChips>
              </ThemeSelectorRow>
            </VStack>
          </Card.Layout>

          {/* Brand Assets Card */}
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="1.5rem">
              <div>
                <SectionTitle theme={theme}>{themeName}</SectionTitle>
                <ColorChips theme={theme} style={{ marginTop: '8px' }}>
                  <ColorChip color={primaryColor} theme={theme} />
                  <ColorChip color={secondaryColor} theme={theme} />
                  <ColorChip color={tertiaryColor} theme={theme} />
                </ColorChips>
              </div>

              <div>
                <SectionTitle theme={theme}>Brand Assets</SectionTitle>
              </div>

              <LogoUploadGrid theme={theme}>
                <LogoUploadArea>
                  <SectionSubtitle theme={theme}>Logo for light backgrounds</SectionSubtitle>
                  <UploadBox theme={theme}>
                    <UploadText theme={theme}>Drop logo here</UploadText>
                  </UploadBox>
                  <FileTypeHint theme={theme}>PNG or SVG</FileTypeHint>
                </LogoUploadArea>

                <LogoUploadArea>
                  <SectionSubtitle theme={theme}>Logo for dark backgrounds</SectionSubtitle>
                  <UploadBox theme={theme} isDark>
                    <UploadText theme={theme}>Drop logo here</UploadText>
                  </UploadBox>
                  <FileTypeHint theme={theme}>PNG or SVG</FileTypeHint>
                </LogoUploadArea>
              </LogoUploadGrid>
            </VStack>
          </Card.Layout>

          {/* Colors Card */}
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="1.5rem">
              <SectionTitle theme={theme}>Colors</SectionTitle>

              <ColorInputGrid theme={theme}>
                <ColorColumn>
                  <ColumnLabel theme={theme}>Light mode colors</ColumnLabel>
                  <ColorInput
                    id="primary-color"
                    label="Primary Color"
                    value={primaryColor}
                    onChange={setPrimaryColor}
                  />
                  <ColorInput
                    id="secondary-color"
                    label="Secondary Color"
                    value={secondaryColor}
                    onChange={setSecondaryColor}
                  />
                  <ColorInput
                    id="tertiary-color"
                    label="Tertiary Color"
                    value={tertiaryColor}
                    onChange={setTertiaryColor}
                  />
                  <Button
                    size={Button.SIZES.M}
                    appearance={Button.APPEARANCES.OUTLINE}
                  >
                    Auto select from logo
                  </Button>
                </ColorColumn>

                <ColorColumn>
                  <ColumnLabel theme={theme}>Dark mode colors</ColumnLabel>
                  <ColorInput
                    id="dark-primary-color"
                    label="Primary Color"
                    value={darkPrimaryColor}
                    onChange={setDarkPrimaryColor}
                  />
                  <ColorInput
                    id="dark-secondary-color"
                    label="Secondary Color"
                    value={darkSecondaryColor}
                    onChange={setDarkSecondaryColor}
                  />
                  <ColorInput
                    id="dark-tertiary-color"
                    label="Tertiary Color"
                    value={darkTertiaryColor}
                    onChange={setDarkTertiaryColor}
                  />
                  <Button
                    size={Button.SIZES.M}
                    appearance={Button.APPEARANCES.OUTLINE}
                  >
                    Auto generate dark mode
                  </Button>
                </ColorColumn>
              </ColorInputGrid>
            </VStack>
          </Card.Layout>

          {/* Theme Assignments Card */}
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="1rem">
              <SectionTitle theme={theme}>Theme Assignments</SectionTitle>
              <SectionSubtitle theme={theme}>{themeName}</SectionSubtitle>
              <SupergroupCard theme={theme}>
                <SupergroupRow>
                  <SupergroupContent theme={theme}>
                    <SupergroupLabel theme={theme}>Include:</SupergroupLabel>
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
                  <SupergroupActions theme={theme}>
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
                <SupergroupFooter theme={theme}>
                  <FooterLabel theme={theme}>Except:</FooterLabel>
                  <FooterPlaceholder theme={theme}>Click to add exceptions</FooterPlaceholder>
                </SupergroupFooter>
              </SupergroupCard>
            </VStack>
          </Card.Layout>
        </LeftColumn>

        {/* Right Column - Preview */}
        <RightColumn theme={theme}>
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="1rem">
              <PreviewTitle theme={theme}>Real-time Preview</PreviewTitle>
              
              <PreviewFrame theme={theme}>
                <PreviewThemeProvider
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  tertiaryColor={tertiaryColor}
                  mode={previewMode}
                >
                  <RealTimePreview />
                </PreviewThemeProvider>
              </PreviewFrame>
            </VStack>
          </Card.Layout>
        </RightColumn>
      </BentoGrid>

      {/* Sticky Footer */}
      <StickyFooter theme={theme}>
        <FooterStart theme={theme}>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.GHOST}
            onClick={handleBack}
            icon={{ type: Icon.TYPES.ARROW_LEFT }}
          >
            Back
          </Button>
        </FooterStart>
        
        <FooterEnd theme={theme}>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.OUTLINE}
            onClick={handleReset}
          >
            Reset to default
          </Button>
          <Button
            size={Button.SIZES.M}
            appearance={Button.APPEARANCES.PRIMARY}
            onClick={handleSave}
          >
            Save changes
          </Button>
        </FooterEnd>
      </StickyFooter>

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
              id="new-theme-name"
              value={newThemeName}
              onChange={(e: any) => setNewThemeName(e?.target?.value || e)}
              onKeyDown={handleKeyDown}
              placeholder="Enter theme name"
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
            onClick={handleCreateNewTheme}
            size={Button.SIZES.M}
            isDisabled={!newThemeName.trim()}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </EditorContainer>
  );
};

export default ThemeEditorPage;
