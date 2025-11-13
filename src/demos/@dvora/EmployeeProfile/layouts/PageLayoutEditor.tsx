/**
 * Page Layout Editor
 *
 * Editor for configuring profile layout sections and adding compositions.
 * Features section navigation, composition instances, and configuration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { t } from '@/utils/theme';
import { ProfileLayout, CompositionInstance } from '../types';
import { getLayoutById, saveLayout } from '../api';
import { CompositionSelector } from './CompositionSelector';
import { CompositionConfigDrawer } from '../components/CompositionConfigDrawer';
import { SectionContent } from './SectionContent';
import { Composition } from '../../CompositionManager/types';
import { MOCK_COMPOSITIONS } from '../../CompositionManager/types';
import { MOCK_EMPLOYEES } from '../mockData';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => t(theme).colorSurface};
`;

const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  padding: ${({ theme }) => t(theme).space600};
  overflow-y: auto;
  border-radius: ${({ theme }) => t(theme).shapeCornerLg};
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => t(theme).space600};
`;

const SidebarTitle = styled.h3`
  ${({ theme }) => t(theme).typestyleV2TitleMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => t(theme).space400};
`;

const SectionItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => t(theme).space300} ${({ theme }) => t(theme).space400};
  background: ${({ isActive, theme }) =>
    isActive ? t(theme).colorSurfaceContainerLow : 'transparent'};
  border: none;
  border-left: 3px solid
    ${({ isActive, theme }) => (isActive ? t(theme).colorPrimary : 'transparent')};
  border-radius: ${({ theme }) => t(theme).shapeCornerLg};
  cursor: pointer;
  text-align: left;
  ${({ theme }) => t(theme).typestyleV2BodyMedium};
  color: ${({ isActive, theme }) =>
    isActive ? t(theme).colorOnSurface : t(theme).colorOnSurfaceVariant};

  &:hover {
    background-color: ${({ theme }) => t(theme).colorSurfaceContainerLow};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => t(theme).space600};
  /* background-color: ${({ theme }) => t(theme).colorSurfaceBright}; */
  /* border-bottom: 1px solid ${({ theme }) => t(theme).colorOutlineVariant}; */
`;

const HeaderTitle = styled.h1`
  ${({ theme }) => t(theme).typestyleV2DisplaySmall};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => t(theme).space300};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => t(theme).space300};
  padding: 0 ${({ theme }) => t(theme).space600} ${({ theme }) => t(theme).space400};
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: ${({ theme }) => t(theme).space600};
  padding: ${({ theme }) => t(theme).space600};
`;

const SectionContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: ${({ theme }) => t(theme).space400};
`;

export const PageLayoutEditor: React.FC = () => {
  const { layoutId } = useParams<{ layoutId: string }>();
  const navigate = useNavigate();
  const [layout, setLayout] = useState<ProfileLayout | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [showCompositionSelector, setShowCompositionSelector] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<CompositionInstance | null>(null);
  const [selectedComposition, setSelectedComposition] = useState<Composition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (layout && layout.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(layout.sections[0].id);
    }
  }, [layout, activeSectionId]);

  const loadLayout = useCallback(async () => {
    if (!layoutId) return;
    try {
      const data = await getLayoutById(layoutId);
      if (data) {
        setLayout(data);
      }
    } catch (error) {
      console.error('Failed to load layout:', error);
    } finally {
      setLoading(false);
    }
  }, [layoutId]);

  useEffect(() => {
    loadLayout();
  }, [layoutId, loadLayout]);

  const handleSave = async () => {
    if (!layout) return;
    try {
      await saveLayout({
        ...layout,
        lastModified: new Date().toISOString(),
        lastModifiedBy: 'Current User',
      });
      // Store the layout ID so it remains active
      localStorage.setItem('employee-profile-active-layout-id', layout.id);
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
  };

  const handleSaveAndExit = async () => {
    if (!layout) return;
    try {
      const updatedLayout = {
        ...layout,
        lastModified: new Date().toISOString(),
        lastModifiedBy: 'Current User',
      };
      console.log('[PageLayoutEditor] Saving layout:', {
        id: updatedLayout.id,
        name: updatedLayout.name,
        sections: updatedLayout.sections.map(s => ({
          id: s.id,
          label: s.label,
          compositionCount: s.compositionInstances.length
        }))
      });
      await saveLayout(updatedLayout);
      // Store the layout ID so the profile knows which one to display
      localStorage.setItem('employee-profile-active-layout-id', layout.id);
      console.log('[PageLayoutEditor] Saved and set active layout ID:', layout.id);
      // Navigate back to the profile with the updated layout
      navigate('/employee-profile');
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
  };

  const handleCancel = () => {
    navigate('/employee-profile/layouts');
  };

  const handleAddComposition = () => {
    setShowCompositionSelector(true);
  };

  const handleCompositionSelect = (composition: Composition) => {
    if (!layout || !activeSectionId) return;

    // Create new composition instance
    const newInstance: CompositionInstance = {
      id: `instance-${Date.now()}`,
      compositionId: composition.id,
      compositionSystemName: composition.systemName,
      fieldMappings: [],
    };

    // Add to active section
    const updatedLayout = {
      ...layout,
      sections: layout.sections.map(section =>
        section.id === activeSectionId
          ? {
              ...section,
              compositionInstances: [...section.compositionInstances, newInstance],
            }
          : section,
      ),
    };

    setLayout(updatedLayout);
    setShowCompositionSelector(false);
  };

  const handleConfigureInstance = (instance: CompositionInstance) => {
    const composition = MOCK_COMPOSITIONS.find(c => c.id === instance.compositionId);
    setSelectedInstance(instance);
    setSelectedComposition(composition || null);
    setShowConfigDrawer(true);
  };

  const handleSaveMappings = (mappings: CompositionInstance['fieldMappings']) => {
    if (!layout || !selectedInstance) return;

    const updatedLayout = {
      ...layout,
      sections: layout.sections.map(section => ({
        ...section,
        compositionInstances: section.compositionInstances.map(inst =>
          inst.id === selectedInstance.id ? { ...inst, fieldMappings: mappings } : inst,
        ),
      })),
    };

    setLayout(updatedLayout);
    setShowConfigDrawer(false);
    setSelectedInstance(null);
    setSelectedComposition(null);
  };

  const handleDeleteInstance = (instanceId: string) => {
    if (!layout) return;

    const updatedLayout = {
      ...layout,
      sections: layout.sections.map(section => ({
        ...section,
        compositionInstances: section.compositionInstances.filter(inst => inst.id !== instanceId),
      })),
    };

    setLayout(updatedLayout);
  };

  const handleCompositionInstanceReorder = (
    instances: CompositionInstance[],
    staticSectionIndex?: number,
  ) => {
    if (!layout || !activeSectionId) return;

    const updatedLayout = {
      ...layout,
      sections: layout.sections.map(section =>
        section.id === activeSectionId
          ? {
              ...section,
              compositionInstances: instances,
              staticSectionIndex: staticSectionIndex,
            }
          : section,
      ),
    };

    setLayout(updatedLayout);
  };

  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  if (!layout) {
    return (
      <Container>
        <div>Layout not found</div>
      </Container>
    );
  }

  const activeSection = layout.sections.find(s => s.id === activeSectionId);
  const sampleEmployee = MOCK_EMPLOYEES[0]; // Use first employee for preview

  return (
    <>
      <Container>
        <MainContent>
          <Header>
            <HeaderTitle>{layout.name}</HeaderTitle>
            <HeaderActions>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.M}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                appearance={Button.APPEARANCES.PRIMARY}
                size={Button.SIZES.M}
                onClick={handleSaveAndExit}
              >
                Save and exit
              </Button>
              <Button
                appearance={Button.APPEARANCES.OUTLINE}
                size={Button.SIZES.M}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </HeaderActions>
          </Header>

          <ActionButtonsContainer>
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              icon={{
                type: Icon.TYPES.DOCUMENT_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Add section
            </Button>
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              icon={{
                type: Icon.TYPES.LIST_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Add related list
            </Button>
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              icon={{
                type: Icon.TYPES.CUSTOM_FIELDS_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Add related field
            </Button>
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              icon={{
                type: Icon.TYPES.REPORTS_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Add report
            </Button>
            <Button
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.M}
              onClick={handleAddComposition}
              icon={{
                type: Icon.TYPES.APPS_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Add composition
            </Button>
          </ActionButtonsContainer>

          <ContentArea>
            <Sidebar>
              <SidebarHeader>
                <SidebarTitle>Edit tabs</SidebarTitle>
                <Button.Icon
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.S}
                  icon={Icon.TYPES.EDIT_OUTLINE}
                  aria-label="Edit tabs"
                />
              </SidebarHeader>
              <SectionList>
                {layout.sections.map(section => (
                  <SectionItem
                    key={section.id}
                    isActive={section.id === activeSectionId}
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    {section.label}
                  </SectionItem>
                ))}
              </SectionList>
            </Sidebar>
            <SectionContentWrapper>
              {activeSection && (
                <SectionContent
                  section={activeSection}
                  employee={sampleEmployee}
                  onConfigureInstance={handleConfigureInstance}
                  onDeleteInstance={handleDeleteInstance}
                  onReorderInstances={handleCompositionInstanceReorder}
                />
              )}
            </SectionContentWrapper>
          </ContentArea>
        </MainContent>
      </Container>

      {showCompositionSelector && (
        <CompositionSelector
          isVisible={showCompositionSelector}
          onCancel={() => setShowCompositionSelector(false)}
          onSelect={handleCompositionSelect}
        />
      )}

      {showConfigDrawer && (
        <CompositionConfigDrawer
          isVisible={showConfigDrawer}
          onCancel={() => {
            setShowConfigDrawer(false);
            setSelectedInstance(null);
            setSelectedComposition(null);
          }}
          onSave={handleSaveMappings}
          instance={selectedInstance}
          composition={selectedComposition}
        />
      )}
    </>
  );
};
