/**
 * Section Content Component
 *
 * Renders the content of a layout section including static fields and composition instances.
 * Supports drag-and-drop reordering of composition instances.
 */

import React from 'react';
import styled from '@emotion/styled';
import { ReactSortable } from 'react-sortablejs';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { usePebbleTheme, t } from '@/utils/theme';
import { LayoutSection, CompositionInstance, Employee } from '../types';
import { CompositionRenderer } from '../components/CompositionRenderer';
import { MOCK_COMPOSITIONS } from '../../CompositionManager/types';

interface SectionContentProps {
  section: LayoutSection;
  employee: Employee;
  onConfigureInstance: (instance: CompositionInstance) => void;
  onDeleteInstance: (instanceId: string) => void;
  onReorderInstances: (instances: CompositionInstance[], staticSectionIndex?: number) => void;
}

type UnifiedItem =
  | { type: 'static-section'; id: 'static-section' }
  | { type: 'composition'; id: string; instance: CompositionInstance };

const CompositionInstanceBlock = styled.div`
  position: relative;
  padding: ${({ theme }) => t(theme).space400};
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ theme }) => t(theme).shapeCorner2xl};
`;

const InstanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => t(theme).space400};
  padding-left: ${({ theme }) => t(theme).space600};
  min-height: 32px; /* Ensure consistent height for alignment */
`;

const InstanceTitle = styled.h3`
  ${({ theme }) => t(theme).typestyleV2TitleMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;

const InstanceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => t(theme).space200};
`;

const DragHandle = styled.div`
  position: absolute;
  left: ${({ theme }) => t(theme).space400};
  top: ${({ theme }) => t(theme).space400};
  cursor: grab;
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  height: 32px; /* Match InstanceHeader min-height for vertical alignment */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 10;

  &:active {
    cursor: grabbing;
  }
`;

const InstanceContent = styled.div`
  margin-left: ${({ theme }) => t(theme).space600};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => t(theme).space800};
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};
  ${({ theme }) => t(theme).typestyleV2BodyMedium};
  text-align: center;
`;

// Static field display components
const StaticFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => t(theme).space200};
`;

const StaticFieldRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => t(theme).space300} ${({ theme }) => t(theme).space400};
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ theme }) => t(theme).shapeCornerLg};
  gap: ${({ theme }) => t(theme).space400};
`;

const StaticFieldDragHandle = styled.div`
  display: flex;
  align-items: center;
  cursor: grab;
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 10;
  pointer-events: auto;
  padding: ${({ theme }) => t(theme).space200};
  margin: -${({ theme }) => t(theme).space200};

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: ${({ theme }) => t(theme).colorOnSurface};
  }
`;

const StaticFieldLabel = styled.span`
  flex: 1;
  ${({ theme }) => t(theme).typestyleV2BodyMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
`;

const StaticFieldActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => t(theme).space200};
`;

const StaticFieldIconButton = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => t(theme).space200};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled, theme }) =>
    disabled ? t(theme).colorOnSurfaceVariant : t(theme).colorOnSurface};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ disabled, theme }) =>
      disabled ? 'transparent' : t(theme).colorSurfaceContainerLow};
    border-radius: ${({ theme }) => t(theme).shapeCornerSm};
  }
`;

const UnifiedSortableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => t(theme).space400};
`;

const SortableItemWrapper = styled.div`
  margin-bottom: ${({ theme }) => t(theme).space400};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StaticSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ theme }) => t(theme).shapeCorner2xl};
  padding: ${({ theme }) => t(theme).space400};
`;

const SectionFieldsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => t(theme).space400};
  padding: ${({ theme }) => t(theme).space300} ${({ theme }) => t(theme).space400};
`;

const SectionFieldsHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => t(theme).space300};
`;

const SectionFieldsHeaderTitle = styled.h3`
  ${({ theme }) => t(theme).typestyleV2TitleMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;

const SectionFieldsHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => t(theme).space200};
`;

/**
 * Default fields for each section
 */
const SECTION_DEFAULT_FIELDS: Record<string, Array<{ label: string; canDelete: boolean }>> = {
  'role-information': [
    { label: 'Title', canDelete: false },
    { label: 'LinkedIn Profile', canDelete: true },
    { label: 'Legal entity', canDelete: false },
    { label: 'Department', canDelete: false },
    { label: 'How many hours will {name} be working on average in a week?', canDelete: false },
  ],
};

export const SectionContent: React.FC<SectionContentProps> = ({
  section,
  employee,
  onConfigureInstance,
  onDeleteInstance,
  onReorderInstances,
}) => {
  const { theme } = usePebbleTheme();

  const hasStaticSection = !!SECTION_DEFAULT_FIELDS[section.id];

  // Create unified list: static section (if exists) + composition instances
  // Respects staticSectionIndex to place the static section at the correct position
  const createUnifiedList = React.useCallback((): UnifiedItem[] => {
    const items: UnifiedItem[] = [];

    // Add all composition instances first
    section.compositionInstances.forEach(instance => {
      items.push({ type: 'composition', id: instance.id, instance });
    });

    // Insert static section at the specified index (default to 0 if not specified)
    if (hasStaticSection) {
      const staticIndex = section.staticSectionIndex ?? 0;
      items.splice(staticIndex, 0, { type: 'static-section', id: 'static-section' });
    }

    return items;
  }, [section.compositionInstances, section.staticSectionIndex, hasStaticSection]);

  const [unifiedItems, setUnifiedItems] = React.useState<UnifiedItem[]>(createUnifiedList());

  // Update local state when section prop changes
  React.useEffect(() => {
    setUnifiedItems(createUnifiedList());
  }, [createUnifiedList]);

  // Handle reorder and notify parent
  const handleReorder = (newItems: UnifiedItem[]) => {
    setUnifiedItems(newItems);

    // Find the new position of the static section
    const staticSectionIndex = newItems.findIndex(item => item.type === 'static-section');

    // Extract composition instances in their new order
    const newInstances = newItems
      .filter(
        (item): item is Extract<UnifiedItem, { type: 'composition' }> =>
          item.type === 'composition',
      )
      .map(item => item.instance);

    // Pass both the reordered instances and the new static section position
    onReorderInstances(newInstances, staticSectionIndex >= 0 ? staticSectionIndex : undefined);
  };

  // Render static section content
  const renderStaticSection = () => {
    if (!hasStaticSection) return null;

    return (
      <StaticSectionContainer>
        <SectionFieldsHeader>
          <SectionFieldsHeaderLeft>
            <StaticFieldDragHandle className="drag-handle">
              <Icon type={Icon.TYPES.DRAG} size={20} />
            </StaticFieldDragHandle>
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.EDIT_OUTLINE}
              aria-label="Edit section"
            />
            <SectionFieldsHeaderTitle>{section.label}</SectionFieldsHeaderTitle>
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.EYE_OUTLINE}
              aria-label="Hide section"
            />
          </SectionFieldsHeaderLeft>
          <SectionFieldsHeaderActions>
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.ADD_CIRCLE_OUTLINE}
              aria-label="Add field"
            />
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.COPY_OUTLINE}
              aria-label="Duplicate"
            />
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.TRASH_OUTLINE}
              aria-label="Delete section"
            />
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.SETTINGS_OUTLINE}
              aria-label="Settings"
            />
          </SectionFieldsHeaderActions>
        </SectionFieldsHeader>
        <StaticFieldsContainer>
          {SECTION_DEFAULT_FIELDS[section.id].map((field, index) => (
            <StaticFieldRow key={index}>
              <StaticFieldDragHandle>
                <Icon type={Icon.TYPES.DRAG} size={20} />
              </StaticFieldDragHandle>
              <StaticFieldLabel>{field.label}</StaticFieldLabel>
              <StaticFieldActions>
                <StaticFieldIconButton aria-label="Settings">
                  <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={20} />
                </StaticFieldIconButton>
                <StaticFieldIconButton disabled={!field.canDelete} aria-label="Delete field">
                  <Icon type={Icon.TYPES.TRASH_OUTLINE} size={20} />
                </StaticFieldIconButton>
              </StaticFieldActions>
            </StaticFieldRow>
          ))}
        </StaticFieldsContainer>
      </StaticSectionContainer>
    );
  };

  // Render composition instance
  const renderCompositionInstance = (instance: CompositionInstance) => {
    const composition = MOCK_COMPOSITIONS.find(c => c.id === instance.compositionId);

    return (
      <CompositionInstanceBlock key={instance.id}>
        <DragHandle className="drag-handle">
          <Icon type={Icon.TYPES.DRAG} size={20} />
        </DragHandle>
        <InstanceHeader>
          <InstanceTitle>{composition?.name || 'Unknown Composition'}</InstanceTitle>
          <InstanceActions>
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.EDIT_OUTLINE}
              onClick={() => onConfigureInstance(instance)}
              aria-label="Edit"
            />
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.SETTINGS_OUTLINE}
              onClick={() => onConfigureInstance(instance)}
              aria-label="Configure"
            />
            <Button.Icon
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={Icon.TYPES.TRASH_OUTLINE}
              onClick={() => onDeleteInstance(instance.id)}
              aria-label="Delete"
            />
          </InstanceActions>
        </InstanceHeader>
        <InstanceContent>
          <CompositionRenderer instance={instance} employee={employee} />
        </InstanceContent>
      </CompositionInstanceBlock>
    );
  };

  if (unifiedItems.length === 0) {
    return (
      <EmptyState>
        <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={48} color={theme.colorOnSurfaceVariant} />
        <p>No compositions added yet. Click "Add composition" to get started.</p>
      </EmptyState>
    );
  }

  return (
    <UnifiedSortableContainer>
      <ReactSortable
        list={unifiedItems}
        setList={handleReorder}
        animation={150}
        handle=".drag-handle"
        ghostClass="sortable-ghost"
        chosenClass="sortable-chosen"
        dragClass="sortable-drag"
        filter=".no-drag"
        preventOnFilter={false}
      >
        {unifiedItems.map(item => {
          if (item.type === 'static-section') {
            return (
              <SortableItemWrapper key={item.id} data-id={item.id}>
                {renderStaticSection()}
              </SortableItemWrapper>
            );
          } else {
            return (
              <SortableItemWrapper key={item.id} data-id={item.id}>
                {renderCompositionInstance(item.instance)}
              </SortableItemWrapper>
            );
          }
        })}
      </ReactSortable>
    </UnifiedSortableContainer>
  );
};
