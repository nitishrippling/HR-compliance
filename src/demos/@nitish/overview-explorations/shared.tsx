import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  max-width: 960px;
`;

export const GroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const GroupLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const GroupName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

export const GroupDesc = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const GroupCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 600;
`;

export const GroupViewAll = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0;
`;

export const StatusDot = styled.span<{ status: 'success' | 'warning' | 'error' | 'neutral' }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;
  ${({ status, theme }) => {
    const t = theme as StyledTheme;
    switch (status) {
      case 'success': return `background-color: ${t.colorSuccess};`;
      case 'warning': return `background-color: ${t.colorWarning};`;
      case 'error': return `background-color: ${t.colorError};`;
      default: return `background-color: ${t.colorOnSurfaceVariant};`;
    }
  }}
`;

export const UrgencyBadge = styled.span<{ urgency: 'overdue' | 'due-this-week' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  white-space: nowrap;
  flex-shrink: 0;
  background-color: ${({ urgency }) =>
    urgency === 'overdue' ? 'rgba(183,28,28,0.08)' : 'rgba(245,124,0,0.08)'};
  color: ${({ urgency }) =>
    urgency === 'overdue' ? 'rgb(183,28,28)' : 'rgb(245,124,0)'};
`;

export const CurationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const CurationLink = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  &:hover { text-decoration: underline; }
`;

export const PenaltyText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

export const CategoryChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  white-space: nowrap;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;
