import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Card from '@rippling/pebble/Card';
import Modal from '@rippling/pebble/Modal';
import Input from '@rippling/pebble/Inputs';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { VStack } from '@rippling/pebble/Layout/Stack';
import ThemeEditorPage from './theme-editor-page';

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

const CompanyThemeDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [themeName, setThemeName] = useState('Acme Theme');
  const [showEditor, setShowEditor] = useState(false);

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
    setShowCreateModal(true);
  };

  const handleSaveTheme = () => {
    // In a real app, this would save the theme to the backend
    console.log('Creating theme:', themeName);
    setShowCreateModal(false);
    // Show the theme editor
    setShowEditor(true);
  };

  const handleCancelModal = () => {
    setShowCreateModal(false);
    // Reset form
    setThemeName('Acme Theme');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && themeName.trim()) {
      handleSaveTheme();
    }
  };

  const pageActions = (
    <Button 
      appearance={Button.APPEARANCES.OUTLINE} 
      size={Button.SIZES.M}
      onClick={handleCreateTheme}
      icon={{ type: Icon.TYPES.ADD }}
    >
      Create Theme
    </Button>
  );

  // If editor is open, show theme editor page
  if (showEditor) {
    return <ThemeEditorPage themeName={themeName} onBack={() => setShowEditor(false)} />;
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

