/**
 * Payroll Summary Card Composition
 * 
 * Mock composition component that displays payroll summary information.
 * Accepts props matching composition input parameters.
 */

import React from 'react';
import styled from '@emotion/styled';
import Card from '@rippling/pebble/Card';
import Icon from '@rippling/pebble/Icon';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';

export interface PayrollSummaryCardProps {
  employeeId?: string;
  employeeName?: string;
  period?: string; // e.g., "Current Period", "Last Pay Period"
  grossPay?: number;
  netPay?: number;
  deductions?: number;
  payDate?: string;
}

const CardContainer = styled(Card.Layout)`
  padding: ${({ theme }) => (theme as unknown as StyledTheme).space600};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const Title = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const PeriodBadge = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space300} 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const Amount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const NetPayAmount = styled(Amount)`
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
  padding-top: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const PayrollSummaryCard: React.FC<PayrollSummaryCardProps> = ({
  period = 'Current Period',
  grossPay = 5000.00,
  netPay = 3750.00,
  deductions = 1250.00,
  payDate = '12/15/2024',
}) => {
  const { theme } = usePebbleTheme();

  return (
    <CardContainer padding={Card.Layout.PADDINGS.PX_24}>
      <Header>
        <Title>Payroll Summary</Title>
        <PeriodBadge>{period}</PeriodBadge>
      </Header>

      <AmountRow>
        <Label>Gross Pay</Label>
        <Amount>${grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Amount>
      </AmountRow>

      <AmountRow>
        <Label>Deductions</Label>
        <Amount>-${deductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Amount>
      </AmountRow>

      <AmountRow>
        <Label>Net Pay</Label>
        <NetPayAmount>${netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</NetPayAmount>
      </AmountRow>

      <Footer>
        <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={16} color={theme.colorOnSurfaceVariant} />
        <span>Pay date: {payDate}</span>
      </Footer>
    </CardContainer>
  );
};

