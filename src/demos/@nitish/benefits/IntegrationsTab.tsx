import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space1200};
`;

const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const Desc = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-align: center;
  max-width: 480px;
  margin: 0;
  line-height: 1.6;
`;

const IntegrationsTab: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <Container theme={theme}>
      <Icon type={Icon.TYPES.LINK_OUTLET} size={48} color={theme.colorOnSurfaceVariant} />
      <Title theme={theme}>Carrier Transmission Details</Title>
      <Desc theme={theme}>
        This tab provides a deep-dive into individual carrier connections, EDI/API setup progress, 
        transmission history, and form sending logs. Currently being redesigned as part of the 
        Benefits Integration prototype.
      </Desc>
    </Container>
  );
};

export default IntegrationsTab;
