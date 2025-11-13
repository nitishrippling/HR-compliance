/**
 * Composition Placeholder
 * 
 * Generic placeholder component for compositions that don't have
 * specific implementations yet. Displays composition information
 * in a card format.
 */

import React from 'react';
import styled from '@emotion/styled';
import Card from '@rippling/pebble/Card';
import Icon from '@rippling/pebble/Icon';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';

export interface CompositionPlaceholderProps {
  systemName?: string;
  [key: string]: unknown; // Accept any props
}

const CardContainer = styled(Card.Layout)`
  padding: ${({ theme }) => (theme as unknown as StyledTheme).space600};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  text-align: center;
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const Title = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const Description = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const SystemName = styled.code`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  margin-top: ${({ theme }) => (theme as StyledTheme).space300};
`;

/**
 * Placeholder component for compositions without implementations
 */
export const CompositionPlaceholder: React.FC<CompositionPlaceholderProps> = ({
  systemName = 'unknown',
}) => {
  const { theme } = usePebbleTheme();

  // Convert system name to a more readable format
  const readableName = systemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CardContainer padding={Card.Layout.PADDINGS.PX_24}>
      <Content>
        <IconContainer>
          <Icon
            type={Icon.TYPES.DOCUMENT_OUTLINE}
            size={32}
            color={theme.colorOnSurfaceVariant}
          />
        </IconContainer>
        <Title>{readableName}</Title>
        <Description>
          This composition is available but doesn't have a specific implementation yet.
        </Description>
        <SystemName>{systemName}</SystemName>
      </Content>
    </CardContainer>
  );
};

