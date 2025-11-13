/**
 * Time Off Request Widget Composition
 * 
 * Mock composition component that displays time off balance and quick request action.
 * Accepts props matching composition input parameters.
 */

import React from 'react';
import styled from '@emotion/styled';
import Card from '@rippling/pebble/Card';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';

export interface TimeOffWidgetProps {
  employeeId?: string;
  employeeName?: string;
  availableBalance?: number;
  usedBalance?: number;
  totalBalance?: number;
  unit?: 'days' | 'hours';
}

const CardContainer = styled(Card.Layout)`
  padding: ${({ theme }) => (theme as unknown as StyledTheme).space600};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Title = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const BalanceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const BalanceLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const BalanceValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const TimeOffWidget: React.FC<TimeOffWidgetProps> = ({
  availableBalance = 15,
  usedBalance = 5,
  totalBalance = 20,
}) => {
  const { theme } = usePebbleTheme();

  const handleRequestTimeOff = () => {
    // Mock action
    console.log('Request time off clicked');
  };

  return (
    <CardContainer padding={Card.Layout.PADDINGS.PX_24}>
      <Header>
        <Title>Time Off</Title>
        <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={24} color={theme.colorOnSurfaceVariant} />
      </Header>

      <BalanceGrid>
        <BalanceCard>
          <BalanceLabel>Available</BalanceLabel>
          <BalanceValue>{availableBalance}</BalanceValue>
        </BalanceCard>
        <BalanceCard>
          <BalanceLabel>Used</BalanceLabel>
          <BalanceValue>{usedBalance}</BalanceValue>
        </BalanceCard>
        <BalanceCard>
          <BalanceLabel>Total</BalanceLabel>
          <BalanceValue>{totalBalance}</BalanceValue>
        </BalanceCard>
      </BalanceGrid>

      <Actions>
        <Button
          appearance={Button.APPEARANCES.PRIMARY}
          size={Button.SIZES.M}
          icon={{
            type: Icon.TYPES.ADD_CIRCLE_OUTLINE,
            alignment: Button.ICON_ALIGNMENTS.LEFT,
          }}
          onClick={handleRequestTimeOff}
        >
          Request Time Off
        </Button>
      </Actions>
    </CardContainer>
  );
};

