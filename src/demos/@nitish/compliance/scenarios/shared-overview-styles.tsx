import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export const SectionHeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionHeaderStatsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space1000};
`;

export const SectionName = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

export const ViewAllLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

export const StatValue = styled.span<{ variant?: 'error' | 'success' | 'info' | 'default' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  white-space: nowrap;
  color: ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    switch (variant) {
      case 'error': return t.colorError;
      case 'success': return t.colorSuccess;
      case 'info': return t.colorOnSurface;
      default: return t.colorOnSurface;
    }
  }};
`;

const COL_WIDTHS = { subject: '30%', category: '18%', dueDate: '18%', risk: '28%', chevron: '32px' };

export const TableColGroup = () => (
  <colgroup>
    <col style={{ width: COL_WIDTHS.subject }} />
    <col style={{ width: COL_WIDTHS.category }} />
    <col style={{ width: COL_WIDTHS.dueDate }} />
    <col style={{ width: COL_WIDTHS.risk }} />
    <col style={{ width: COL_WIDTHS.chevron }} />
  </colgroup>
);

export const ActionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const ActionTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const ActionTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
`;

export const TaskName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const CategoryText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const DueDateText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const PenaltyText = styled.span<{ isCharged?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isCharged }) => (isCharged ? 'rgb(183,28,28)' : 'rgb(100,100,100)')};
  font-weight: ${({ isCharged }) => (isCharged ? 500 : 400)};
`;

export const ChevronCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  width: 32px;
`;

export const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const ImpactTitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ImpactTitleText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

export const ImpactSubtitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const ImpactStatsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  flex-wrap: wrap;
`;

export const ImpactStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ImpactStatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 600;
`;

export const ImpactStatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const EmptyCardBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800} ${({ theme }) => (theme as StyledTheme).space600};
  text-align: center;
`;

export const EmptyCardText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

export const EmptyCardCta = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export const SuccessText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  margin: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
`;

export const Banner = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimaryContainer};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;
