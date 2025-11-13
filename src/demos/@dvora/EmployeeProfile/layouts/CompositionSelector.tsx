/**
 * Composition Selector
 * 
 * Modal for selecting a composition to add to a layout section.
 * Features grid/list toggle, search, and composition cards.
 */

import React, { useState, useMemo } from 'react';
import Modal from '@rippling/pebble/Modal';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Input from '@rippling/pebble/Inputs';
import Card from '@rippling/pebble/Card';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { Composition } from '../../CompositionManager/types';
import { MOCK_COMPOSITIONS } from '../../CompositionManager/types';

interface CompositionSelectorProps {
  isVisible: boolean;
  onCancel: () => void;
  onSelect: (composition: Composition) => void;
}

const ModalBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  background: ${({ isActive, theme }) =>
    isActive
      ? (theme as StyledTheme).colorSurfaceBright
      : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isActive, theme }) =>
    isActive
      ? (theme as StyledTheme).colorOnSurface
      : (theme as StyledTheme).colorOnSurfaceVariant};
  
  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  max-height: 500px;
  overflow-y: auto;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  max-height: 500px;
  overflow-y: auto;
`;

const CompositionCard = styled(Card.Layout)<{ isList?: boolean }>`
  padding: ${({ theme }) => (theme as unknown as StyledTheme).space600};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => (theme as unknown as StyledTheme).colorSurfaceContainerLow};
    border-color: ${({ theme }) => (theme as unknown as StyledTheme).colorPrimary};
  }
  
  ${({ isList }) =>
    isList &&
    `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `}
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const CompositionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CompositionName = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const CompositionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const UsedInTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

const Tag = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
`;

type ViewMode = 'grid' | 'list';

export const CompositionSelector: React.FC<CompositionSelectorProps> = ({
  isVisible,
  onCancel,
  onSelect,
}) => {
  const { theme } = usePebbleTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredCompositions = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_COMPOSITIONS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_COMPOSITIONS.filter(
      comp =>
        comp.name.toLowerCase().includes(query) ||
        comp.systemName.toLowerCase().includes(query) ||
        comp.usedIn.some(app => app.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleSelect = (composition: Composition) => {
    onSelect(composition);
    setSearchQuery('');
  };

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onCancel}
      title="Add composition"
    >
      <ModalBody>
        <Controls>
          <SearchContainer>
            <Input.Text
              id="search-compositions"
              placeholder="Search compositions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
            />
          </SearchContainer>
          <ViewToggle>
            <ToggleButton
              isActive={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Icon type={Icon.TYPES.LIST_OUTLINE} size={20} />
            </ToggleButton>
            <ToggleButton
              isActive={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <Icon type={Icon.TYPES.LIST_OUTLINE} size={20} />
            </ToggleButton>
          </ViewToggle>
        </Controls>

        {filteredCompositions.length === 0 ? (
          <EmptyState>
            <Icon
              type={Icon.TYPES.SEARCH_OUTLINE}
              size={48}
              color={theme.colorOnSurfaceVariant}
            />
            <p>No compositions found matching "{searchQuery}"</p>
          </EmptyState>
        ) : viewMode === 'grid' ? (
          <GridContainer>
            {filteredCompositions.map(composition => (
              <CompositionCard
                key={composition.id}
                padding={Card.Layout.PADDINGS.PX_24}
                onClick={() => handleSelect(composition)}
              >
                <CardContent>
                  <CardHeader>
                    <CompositionIcon>
                      <Icon
                        type={Icon.TYPES.DOCUMENT_OUTLINE}
                        size={24}
                        color={theme.colorPrimary}
                      />
                    </CompositionIcon>
                    <CompositionName>{composition.name}</CompositionName>
                  </CardHeader>
                  <CompositionDescription>
                    System name: {composition.systemName}
                  </CompositionDescription>
                  {composition.usedIn.length > 0 && (
                    <UsedInTags>
                      {composition.usedIn.map(app => (
                        <Tag key={app}>{app}</Tag>
                      ))}
                    </UsedInTags>
                  )}
                </CardContent>
              </CompositionCard>
            ))}
          </GridContainer>
        ) : (
          <ListContainer>
            {filteredCompositions.map(composition => (
              <CompositionCard
                key={composition.id}
                isList
                padding={Card.Layout.PADDINGS.PX_24}
                onClick={() => handleSelect(composition)}
              >
                <CardContent>
                  <CardHeader>
                    <CompositionIcon>
                      <Icon
                        type={Icon.TYPES.DOCUMENT_OUTLINE}
                        size={24}
                        color={theme.colorPrimary}
                      />
                    </CompositionIcon>
                    <div>
                      <CompositionName>{composition.name}</CompositionName>
                      <CompositionDescription>
                        {composition.systemName} • Used in {composition.usedIn.join(', ')}
                      </CompositionDescription>
                    </div>
                  </CardHeader>
                </CardContent>
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={20} color={theme.colorOnSurfaceVariant} />
              </CompositionCard>
            ))}
          </ListContainer>
        )}
      </ModalBody>

      <Modal.Footer>
        <Button
          appearance={Button.APPEARANCES.OUTLINE}
          onClick={onCancel}
          size={Button.SIZES.M}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

