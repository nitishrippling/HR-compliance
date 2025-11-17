import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import { useTheme } from '@rippling/pebble/theme';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Card from '@rippling/pebble/Card';
import { VStack } from '@rippling/pebble/Layout/Stack';
import { ColorInput } from './components/ColorInput';
import { PreviewThemeProvider } from './components/PreviewThemeContext';
import { RealTimePreview } from './components/RealTimePreview';
import { ThemeMode } from './company-theme-demo';

/**
 * Read-Only Theme View - For Modes A-D
 * 
 * Shows the same layout as the editor but with disabled inputs
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

interface ReadOnlyThemeViewProps {
  theme: Theme;
  currentMode: ThemeMode;
  onEdit: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
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
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ColumnLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

// Removed: HelperText, ChipContainer, PreviewLabel - not needed in read-only view

const EmptyLogoBox = styled.div`
  width: 100%;
  height: 152px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px dashed ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
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
  opacity: 0.9;

  ${({ bgColor }) => bgColor === 'transparent' && `
    background: 
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  `}
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
  pointer-events: none;
  opacity: 0.7;
`;

const BackgroundColorOption = styled.div<{ color: string; isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ color }) => color};
  border: 2px solid ${({ theme, isSelected }) => 
    isSelected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};

  ${({ color }) => color === 'transparent' && `
    background: 
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  `}
`;

const PreviewSection = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
`;

const PreviewFrame = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const DisabledOverlay = styled.div`
  pointer-events: none;
  opacity: 0.8;
`;

const ReadOnlyThemeView: React.FC<ReadOnlyThemeViewProps> = ({
  theme: savedTheme,
  currentMode,
  onEdit,
}) => {
  const { theme } = usePebbleTheme();
  const { name: currentThemeName, mode: colorMode } = useTheme();
  
  const isDarkMode = colorMode === 'dark' || currentThemeName?.toLowerCase().includes('dark') || false;
  const previewMode: 'light' | 'dark' = isDarkMode ? 'dark' : 'light';

  return (
    <Container theme={theme}>
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <VStack gap="2rem">
          {/* Header with Edit Button */}
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Company Logo</SectionTitle>
            <Button
              appearance={Button.APPEARANCES.PRIMARY}
              size={Button.SIZES.M}
              onClick={onEdit}
              icon={{ type: Icon.TYPES.EDIT_OUTLINE }}
            >
              Edit Branding
            </Button>
          </SectionHeader>

          {/* Brand Assets Section */}
          <div>
            <TwoColumnGrid theme={theme}>
              {/* Light Logo Column */}
              <LogoColumn theme={theme}>
                <ColumnLabel theme={theme}>Logo for light backgrounds</ColumnLabel>
                
                {savedTheme.lightLogo ? (
                  <>
                    <LogoPreviewBox theme={theme} bgColor={savedTheme.lightLogoBackground || 'transparent'}>
                      <LogoPreviewImage src={savedTheme.lightLogo} alt="Light logo preview" />
                    </LogoPreviewBox>
                    <div>
                      <BackgroundSelectorLabel theme={theme}>
                        Set logo background
                      </BackgroundSelectorLabel>
                      <BackgroundColorOptions theme={theme}>
                        <BackgroundColorOption
                          theme={theme}
                          color="transparent"
                          isSelected={(savedTheme.lightLogoBackground || 'transparent') === 'transparent'}
                        />
                        <BackgroundColorOption
                          theme={theme}
                          color="#FFFFFF"
                          isSelected={savedTheme.lightLogoBackground === '#FFFFFF'}
                        />
                        <BackgroundColorOption
                          theme={theme}
                          color="#000000"
                          isSelected={savedTheme.lightLogoBackground === '#000000'}
                        />
                      </BackgroundColorOptions>
                    </div>
                  </>
                ) : (
                  <EmptyLogoBox theme={theme}>No logo uploaded</EmptyLogoBox>
                )}
              </LogoColumn>

              {/* Dark Logo Column */}
              <LogoColumn theme={theme}>
                <ColumnLabel theme={theme}>Logo for dark backgrounds</ColumnLabel>
                
                {savedTheme.darkLogo ? (
                  <>
                    <LogoPreviewBox theme={theme} bgColor={savedTheme.darkLogoBackground || 'transparent'}>
                      <LogoPreviewImage src={savedTheme.darkLogo} alt="Dark logo preview" />
                    </LogoPreviewBox>
                    <div>
                      <BackgroundSelectorLabel theme={theme}>
                        Set logo background
                      </BackgroundSelectorLabel>
                      <BackgroundColorOptions theme={theme}>
                        <BackgroundColorOption
                          theme={theme}
                          color="transparent"
                          isSelected={(savedTheme.darkLogoBackground || 'transparent') === 'transparent'}
                        />
                        <BackgroundColorOption
                          theme={theme}
                          color="#FFFFFF"
                          isSelected={savedTheme.darkLogoBackground === '#FFFFFF'}
                        />
                        <BackgroundColorOption
                          theme={theme}
                          color="#000000"
                          isSelected={savedTheme.darkLogoBackground === '#000000'}
                        />
                      </BackgroundColorOptions>
                    </div>
                  </>
                ) : (
                  <EmptyLogoBox theme={theme}>No logo uploaded</EmptyLogoBox>
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
                <DisabledOverlay>
                  <VStack gap="1rem">
                    <ColumnLabel theme={theme}>Light mode colors</ColumnLabel>
                    
                    {/* Mode B: Nav Color Only */}
                    {currentMode === ThemeMode.LOGO_NAV_COLOR && (
                      <ColorInput
                        id="nav-color-readonly"
                        label="Primary Color"
                        value={savedTheme.primaryColor}
                        onChange={() => {}}
                        disabled
                      />
                    )}

                    {/* Mode C: Primary Color */}
                    {currentMode === ThemeMode.LOGO_PRIMARY && (
                      <ColorInput
                        id="primary-color-readonly"
                        label="Primary Color"
                        value={savedTheme.primaryColor}
                        onChange={() => {}}
                        disabled
                      />
                    )}

                    {/* Mode D: Full Palette */}
                    {currentMode === ThemeMode.FULL_PALETTE && (
                      <>
                        <ColorInput
                          id="primary-color-readonly"
                          label="Primary Color"
                          value={savedTheme.primaryColor}
                          onChange={() => {}}
                          disabled
                        />
                        <ColorInput
                          id="secondary-color-readonly"
                          label="Secondary Color"
                          value={savedTheme.secondaryColor}
                          onChange={() => {}}
                          disabled
                        />
                        <ColorInput
                          id="tertiary-color-readonly"
                          label="Tertiary Color"
                          value={savedTheme.tertiaryColor}
                          onChange={() => {}}
                          disabled
                        />
                      </>
                    )}
                  </VStack>
                </DisabledOverlay>

                {/* Dark Mode Colors */}
                <DisabledOverlay>
                  <VStack gap="1rem">
                    <ColumnLabel theme={theme}>Dark mode colors</ColumnLabel>
                    
                    {/* Mode B: Nav Color Only */}
                    {currentMode === ThemeMode.LOGO_NAV_COLOR && (
                      <ColorInput
                        id="dark-nav-color-readonly"
                        label="Primary Color"
                        value={savedTheme.primaryColor}
                        onChange={() => {}}
                        disabled
                      />
                    )}

                    {/* Mode C: Primary Color */}
                    {currentMode === ThemeMode.LOGO_PRIMARY && (
                      <ColorInput
                        id="dark-primary-color-readonly"
                        label="Primary Color"
                        value={savedTheme.primaryColor}
                        onChange={() => {}}
                        disabled
                      />
                    )}

                    {/* Mode D: Full Palette */}
                    {currentMode === ThemeMode.FULL_PALETTE && (
                      <>
                        <ColorInput
                          id="dark-primary-color-readonly"
                          label="Primary Color"
                          value={savedTheme.primaryColor}
                          onChange={() => {}}
                          disabled
                        />
                        <ColorInput
                          id="dark-secondary-color-readonly"
                          label="Secondary Color"
                          value={savedTheme.secondaryColor}
                          onChange={() => {}}
                          disabled
                        />
                        <ColorInput
                          id="dark-tertiary-color-readonly"
                          label="Tertiary Color"
                          value={savedTheme.tertiaryColor}
                          onChange={() => {}}
                          disabled
                        />
                      </>
                    )}
                  </VStack>
                </DisabledOverlay>
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
                primaryColor={savedTheme.primaryColor}
                secondaryColor={savedTheme.secondaryColor}
                tertiaryColor={savedTheme.tertiaryColor}
                darkPrimaryColor={savedTheme.primaryColor}
                darkSecondaryColor={savedTheme.secondaryColor}
                darkTertiaryColor={savedTheme.tertiaryColor}
                lightLogo={savedTheme.lightLogo}
                darkLogo={savedTheme.darkLogo}
                lightLogoBackground={savedTheme.lightLogoBackground}
                darkLogoBackground={savedTheme.darkLogoBackground}
                mode={previewMode}
              >
                <RealTimePreview />
              </PreviewThemeProvider>
            </PreviewFrame>
          </VStack>
        </Card.Layout>
      </PreviewSection>
    </Container>
  );
};

export default ReadOnlyThemeView;

