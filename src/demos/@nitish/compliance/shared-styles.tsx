import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space1200};
`;

export const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space100} 0 0 0;
`;

export const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

export const TableHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 256px;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StyledTHead = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StyledTh = styled.th`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

export const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StyledTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: top;
`;

export const TypeBadge = styled.span<{ variant?: 'primary' | 'amber' | 'sky' | 'orange' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  border: 1px solid;

  ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    switch (variant) {
      case 'amber':
        return `background-color: rgba(255, 152, 0, 0.08); color: rgb(180, 120, 0); border-color: rgba(255, 152, 0, 0.2);`;
      case 'sky':
        return `background-color: rgba(3, 169, 244, 0.08); color: rgb(2, 119, 172); border-color: rgba(3, 169, 244, 0.2);`;
      case 'orange':
        return `background-color: rgba(255, 87, 34, 0.08); color: rgb(191, 63, 24); border-color: rgba(255, 87, 34, 0.2);`;
      default:
        return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorPrimary}; border-color: ${t.colorOutlineVariant};`;
    }
  }}
`;

export const CreatedByBadge = styled.span<{ isRippling?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 500;
  border: 1px solid;

  ${({ isRippling, theme }) => {
    const t = theme as StyledTheme;
    if (isRippling) {
      return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorPrimary}; border-color: ${t.colorOutlineVariant};`;
    }
    return `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorOnSurfaceVariant}; border-color: ${t.colorOutlineVariant};`;
  }}
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
      case 'success':
        return `background-color: ${t.colorSuccess};`;
      case 'warning':
        return `background-color: ${t.colorWarning};`;
      case 'error':
        return `background-color: ${t.colorError};`;
      default:
        return `background-color: ${t.colorOnSurfaceVariant};`;
    }
  }}
`;

export const StatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const StatusLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

export const StatusDetail = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  padding-left: 18px;
`;

export const DueDate = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 500;
  margin: 0;
  padding-left: 18px;
`;

export const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const CellTextBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

export const CellTextMono = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const CellTextMuted = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const EmptyRow = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space1600} ${({ theme }) => (theme as StyledTheme).space600};
  text-align: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const ActionButtonWrapper = styled.div`
  opacity: 0;
  transition: opacity 150ms ease;

  tr:hover & {
    opacity: 1;
  }
`;
