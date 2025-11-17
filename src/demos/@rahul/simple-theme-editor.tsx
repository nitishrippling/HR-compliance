import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Card from '@rippling/pebble/Card';
import Chip from '@rippling/pebble/Chip';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { VStack } from '@rippling/pebble/Layout/Stack';
import { ColorInput } from './components/ColorInput';
import { PreviewThemeProvider } from './components/PreviewThemeContext';
import { RealTimePreview } from './components/RealTimePreview';
import { ThemeMode } from './company-theme-demo';

/**
 * Simple Theme Editor - For Modes A-D
 * 
 * Simplified single-page layout without theme selector or assignments:
 * - Brand Assets section (all modes)
 * - Colors section (conditional based on mode)
 * - Real-time Preview section below
 */

interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  navColor?: string;
  lightLogo?: string;
  darkLogo?: string;
  lightLogoBackground?: string;
  darkLogoBackground?: string;
}

interface SimpleThemeEditorProps {
  theme: Theme;
  currentMode: ThemeMode;
  onSave: (theme: Theme) => void;
  onCancel: () => void;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding-bottom: 64px; /* Space for sticky footer */
`;

const ContentArea = styled.div`
  max-width: 1174px;
  margin: 0 auto;
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const LogoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ColumnLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const HelperText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ChipContainer = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const UploadBox = styled.div`
  width: 100%;
  height: 168px;
  border: 2px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  }
`;

const UploadText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PreviewLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LogoPreviewBox = styled.div<{ bgColor?: string }>`
  width: 100%;
  height: 152px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const LogoPreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const BackgroundSelectorLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const BackgroundColorOptions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const BackgroundColorOption = styled.div<{ color: string; isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ color }) => color};
  border: 2px solid ${({ theme, isSelected }) => 
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: border-color 0.2s;
  position: relative;

  ${({ color }) => color === 'transparent' && `
    background: 
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  `}

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PreviewSection = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space800};
`;

const PreviewFrame = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space800};
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  z-index: 100;
`;

const SimpleThemeEditor: React.FC<SimpleThemeEditorProps> = ({
  theme: initialTheme,
  currentMode,
  onSave,
  onCancel,
}) => {
  const { theme } = usePebbleTheme();
  const { name: currentThemeName, mode: colorMode } = useTheme();
  
  const isDarkMode = colorMode === 'dark' || currentThemeName?.toLowerCase().includes('dark') || false;
  const previewMode: 'light' | 'dark' = isDarkMode ? 'dark' : 'light';

  // State for theme configuration
  const [primaryColor, setPrimaryColor] = useState(initialTheme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialTheme.secondaryColor);
  const [tertiaryColor, setTertiaryColor] = useState(initialTheme.tertiaryColor);
  
  // Dark mode colors
  const [darkPrimaryColor, setDarkPrimaryColor] = useState(initialTheme.primaryColor);
  const [darkSecondaryColor, setDarkSecondaryColor] = useState(initialTheme.secondaryColor);
  const [darkTertiaryColor, setDarkTertiaryColor] = useState(initialTheme.tertiaryColor);

  // Logo state
  const [lightLogo, setLightLogo] = useState(initialTheme.lightLogo || '');
  const [darkLogo, setDarkLogo] = useState(initialTheme.darkLogo || '');
  const [lightLogoBackground, setLightLogoBackground] = useState(initialTheme.lightLogoBackground || 'transparent');
  const [darkLogoBackground, setDarkLogoBackground] = useState(initialTheme.darkLogoBackground || 'transparent');
  const [lightLogoFileName, setLightLogoFileName] = useState('');
  const [darkLogoFileName, setDarkLogoFileName] = useState('');

  // Logo upload handlers
  const handleLightLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLightLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLightLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDarkLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDarkLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDarkLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLightLogo = () => {
    setLightLogo('');
    setLightLogoFileName('');
    setLightLogoBackground('transparent');
  };

  const handleRemoveDarkLogo = () => {
    setDarkLogo('');
    setDarkLogoFileName('');
    setDarkLogoBackground('transparent');
  };

  const handleSave = () => {
    const updatedTheme: Theme = {
      ...initialTheme,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      lightLogo,
      darkLogo,
      lightLogoBackground,
      darkLogoBackground,
    };
    onSave(updatedTheme);
  };

  // Sidebar navigation
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

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  const tabs = ['Flow Configuration', 'Notifications', 'Billing', 'Branding', 'Security'];

  return (
    <AppShellLayout
      pageTitle="Company Settings"
      pageTabs={tabs}
      defaultActiveTab={3}
      mainNavSections={[companySettingsSection]}
      platformNavSection={platformSection}
      companyName="Acme, Inc."
      userInitial="A"
    >
      <PageContainer theme={theme}>
        <ContentArea theme={theme}>
          <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
            <VStack gap="2rem">
              <PageTitle theme={theme}>Company Logo</PageTitle>

              {/* Brand Assets Section */}
              <div>
                <SectionTitle theme={theme}>Brand Assets</SectionTitle>
                <TwoColumnGrid theme={theme}>
                  {/* Light Logo Column */}
                  <LogoColumn theme={theme}>
                    <ColumnLabel theme={theme}>Logo for light backgrounds</ColumnLabel>
                    
                    {lightLogo && (
                      <ChipContainer theme={theme}>
                        <Chip isCloseable onClose={handleRemoveLightLogo}>
                          {lightLogoFileName || 'Uploaded logo'}
                        </Chip>
                      </ChipContainer>
                    )}
                    
                    <HiddenFileInput
                      type="file"
                      id="light-logo-upload"
                      accept="image/png, image/svg+xml"
                      onChange={handleLightLogoUpload}
                    />
                    
                    {lightLogo ? (
                      <>
                        <HelperText theme={theme}>
                          Recommended using a dark colored logo fir lighter background
                        </HelperText>
                        <PreviewLabel theme={theme}>Preview</PreviewLabel>
                        <LogoPreviewBox theme={theme} bgColor={lightLogoBackground}>
                          <LogoPreviewImage src={lightLogo} alt="Light logo preview" />
                        </LogoPreviewBox>
                        <div>
                          <BackgroundSelectorLabel theme={theme}>
                            Set logo background
                          </BackgroundSelectorLabel>
                          <BackgroundColorOptions theme={theme}>
                            <BackgroundColorOption
                              theme={theme}
                              color="transparent"
                              isSelected={lightLogoBackground === 'transparent'}
                              onClick={() => setLightLogoBackground('transparent')}
                              aria-label="Transparent background"
                            />
                            <BackgroundColorOption
                              theme={theme}
                              color="#FFFFFF"
                              isSelected={lightLogoBackground === '#FFFFFF'}
                              onClick={() => setLightLogoBackground('#FFFFFF')}
                              aria-label="White background"
                            />
                            <BackgroundColorOption
                              theme={theme}
                              color="#000000"
                              isSelected={lightLogoBackground === '#000000'}
                              onClick={() => setLightLogoBackground('#000000')}
                              aria-label="Black background"
                            />
                          </BackgroundColorOptions>
                        </div>
                      </>
                    ) : (
                      <UploadBox 
                        theme={theme}
                        onClick={() => document.getElementById('light-logo-upload')?.click()}
                      >
                        <UploadText theme={theme}>Drop logo here</UploadText>
                      </UploadBox>
                    )}
                  </LogoColumn>

                  {/* Dark Logo Column */}
                  <LogoColumn theme={theme}>
                    <ColumnLabel theme={theme}>Logo for dark backgrounds</ColumnLabel>
                    
                    {darkLogo && (
                      <ChipContainer theme={theme}>
                        <Chip isCloseable onClose={handleRemoveDarkLogo}>
                          {darkLogoFileName || 'Uploaded logo'}
                        </Chip>
                      </ChipContainer>
                    )}
                    
                    <HiddenFileInput
                      type="file"
                      id="dark-logo-upload"
                      accept="image/png, image/svg+xml"
                      onChange={handleDarkLogoUpload}
                    />
                    
                    {darkLogo ? (
                      <>
                        <HelperText theme={theme}>
                          Recommended using a light colored logo for darker background
                        </HelperText>
                        <PreviewLabel theme={theme}>Preview</PreviewLabel>
                        <LogoPreviewBox theme={theme} bgColor={darkLogoBackground}>
                          <LogoPreviewImage src={darkLogo} alt="Dark logo preview" />
                        </LogoPreviewBox>
                        <div>
                          <BackgroundSelectorLabel theme={theme}>
                            Set logo background
                          </BackgroundSelectorLabel>
                          <BackgroundColorOptions theme={theme}>
                            <BackgroundColorOption
                              theme={theme}
                              color="transparent"
                              isSelected={darkLogoBackground === 'transparent'}
                              onClick={() => setDarkLogoBackground('transparent')}
                              aria-label="Transparent background"
                            />
                            <BackgroundColorOption
                              theme={theme}
                              color="#FFFFFF"
                              isSelected={darkLogoBackground === '#FFFFFF'}
                              onClick={() => setDarkLogoBackground('#FFFFFF')}
                              aria-label="White background"
                            />
                            <BackgroundColorOption
                              theme={theme}
                              color="#000000"
                              isSelected={darkLogoBackground === '#000000'}
                              onClick={() => setDarkLogoBackground('#000000')}
                              aria-label="Black background"
                            />
                          </BackgroundColorOptions>
                        </div>
                      </>
                    ) : (
                      <UploadBox 
                        theme={theme}
                        onClick={() => document.getElementById('dark-logo-upload')?.click()}
                      >
                        <UploadText theme={theme}>Drop logo here</UploadText>
                      </UploadBox>
                    )}
                  </LogoColumn>
                </TwoColumnGrid>
              </div>

              {/* Colors Section - Conditional based on mode */}
              {currentMode !== ThemeMode.LOGO_ONLY && (
                <div>
                  <SectionTitle theme={theme}>
                    {currentMode === ThemeMode.LOGO_NAV_COLOR ? 'Navigation Color' : 'Primary Color'}
                  </SectionTitle>
                  <TwoColumnGrid theme={theme}>
                    {/* Light Mode Colors */}
                    <VStack gap="1rem">
                      <ColumnLabel theme={theme}>Light mode colors</ColumnLabel>
                      
                      {/* Mode B: Nav Color Only */}
                      {currentMode === ThemeMode.LOGO_NAV_COLOR && (
                        <ColorInput
                          id="nav-color"
                          label="Primary Color"
                          value={primaryColor}
                          onChange={setPrimaryColor}
                        />
                      )}

                      {/* Mode C: Primary Color (auto-calc palette) */}
                      {currentMode === ThemeMode.LOGO_PRIMARY && (
                        <ColorInput
                          id="primary-color"
                          label="Primary Color"
                          value={primaryColor}
                          onChange={setPrimaryColor}
                        />
                      )}

                      {/* Mode D: Full Palette */}
                      {currentMode === ThemeMode.FULL_PALETTE && (
                        <>
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
                        </>
                      )}
                    </VStack>

                    {/* Dark Mode Colors */}
                    <VStack gap="1rem">
                      <ColumnLabel theme={theme}>Dark mode colors</ColumnLabel>
                      
                      {/* Mode B: Nav Color Only */}
                      {currentMode === ThemeMode.LOGO_NAV_COLOR && (
                        <ColorInput
                          id="dark-nav-color"
                          label="Primary Color"
                          value={darkPrimaryColor}
                          onChange={setDarkPrimaryColor}
                        />
                      )}

                      {/* Mode C: Primary Color (auto-calc palette) */}
                      {currentMode === ThemeMode.LOGO_PRIMARY && (
                        <ColorInput
                          id="dark-primary-color"
                          label="Primary Color"
                          value={darkPrimaryColor}
                          onChange={setDarkPrimaryColor}
                        />
                      )}

                      {/* Mode D: Full Palette */}
                      {currentMode === ThemeMode.FULL_PALETTE && (
                        <>
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
                        </>
                      )}
                    </VStack>
                  </TwoColumnGrid>
                </div>
              )}
            </VStack>
          </Card.Layout>

          {/* Real-time Preview Section */}
          <PreviewSection theme={theme}>
            <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
              <VStack gap="1rem">
                <SectionTitle theme={theme}>Real-time Preview</SectionTitle>
                <PreviewFrame theme={theme}>
                  <PreviewThemeProvider
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    tertiaryColor={tertiaryColor}
                    darkPrimaryColor={darkPrimaryColor}
                    darkSecondaryColor={darkSecondaryColor}
                    darkTertiaryColor={darkTertiaryColor}
                    lightLogo={lightLogo}
                    darkLogo={darkLogo}
                    lightLogoBackground={lightLogoBackground}
                    darkLogoBackground={darkLogoBackground}
                    mode={previewMode}
                  >
                    <RealTimePreview />
                  </PreviewThemeProvider>
                </PreviewFrame>
              </VStack>
            </Card.Layout>
          </PreviewSection>
        </ContentArea>

        {/* Sticky Footer */}
        <StickyFooter theme={theme}>
          <Button
            appearance={Button.APPEARANCES.OUTLINE}
            size={Button.SIZES.M}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            size={Button.SIZES.M}
            onClick={handleSave}
          >
            Save
          </Button>
        </StickyFooter>
      </PageContainer>
    </AppShellLayout>
  );
};

export default SimpleThemeEditor;

