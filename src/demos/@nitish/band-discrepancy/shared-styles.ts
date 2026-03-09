import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { keyframes } from '@emotion/react';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

export const TopNavContainer = styled.header`
  display: flex;
  height: 48px;
  align-items: center;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
`;

export const NavLogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-shrink: 0;
`;

export const NavLogoDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
`;

export const NavLogoText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  font-weight: 600;
`;

export const NavSearchWrapper = styled.div`
  margin: 0 ${({ theme }) => (theme as StyledTheme).space600};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavSearchInput = styled.input`
  height: 32px;
  width: 100%;
  max-width: 480px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  padding-left: 36px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  outline: none;
  transition: background-color 150ms ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.55);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

export const NavSearchIconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const NavIconsArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const NavIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 150ms ease, background-color 150ms ease;
  color: inherit;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

export const NavCompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-left: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const NavCompanyName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
`;

export const MainContent = styled.main`
  padding: ${({ theme }) => `${(theme as StyledTheme).space600} ${(theme as StyledTheme).space800}`};
`;

export const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

export const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const TabButton = styled.button<{ active: boolean }>`
  position: relative;
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ active, theme }) =>
      active ? (theme as StyledTheme).colorPrimary : 'transparent'};
  }
`;

export const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

export const TableToolbar = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  padding-bottom: 0;
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const GridTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 256px;
`;

export const SearchIconAbsolute = styled.div`
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
    border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StyledTh = styled.th<{ sortable?: boolean }>`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  white-space: nowrap;
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: color 150ms ease;
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: ${({ sortable, theme }) =>
      sortable ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

export const ThContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const highlightBlink = keyframes`
  0%   { background-color: rgba(122, 0, 93, 0.18); }
  15%  { background-color: transparent; }
  30%  { background-color: rgba(122, 0, 93, 0.18); }
  45%  { background-color: transparent; }
  60%  { background-color: rgba(122, 0, 93, 0.12); }
  75%  { background-color: transparent; }
  100% { background-color: transparent; }
`;

export const StyledTr = styled.tr<{ isFlashing?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  ${({ isFlashing, theme }) =>
    isFlashing
      ? `
    animation: ${highlightBlink} 2.4s ease-out forwards;
    border-left: 3px solid ${(theme as StyledTheme).colorPrimary};
  `
      : ''}
`;

export const StyledTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  overflow: hidden;
  max-width: 0;
`;

export const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellTextMuted = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellTextPrimary = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 500;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellTextBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellMono = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SlaContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

export const SlaDot = styled.span<{ status: 'green' | 'amber' | 'red' }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;

  ${({ status, theme }) => {
    const t = theme as StyledTheme;
    switch (status) {
      case 'green':
        return `background-color: ${t.colorSuccess};`;
      case 'amber':
        return `background-color: ${t.colorOnWarningContainer};`;
      case 'red':
        return `background-color: ${t.colorError};`;
    }
  }}
`;

export const SlaText = styled.span<{ status: 'green' | 'amber' | 'red' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};

  ${({ status, theme }) => {
    const t = theme as StyledTheme;
    switch (status) {
      case 'green':
        return `color: ${t.colorSuccess};`;
      case 'amber':
        return `color: ${t.colorOnWarningContainer};`;
      case 'red':
        return `color: ${t.colorError}; font-weight: 500;`;
    }
  }}
`;

export const AssigneeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const AssigneeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChevronCell = styled.td`
  width: 32px;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  opacity: 0;
  transition: opacity 150ms ease;

  tr:hover & {
    opacity: 1;
  }
`;

export const StickyChevronCell = styled.td`
  position: sticky;
  right: 0;
  width: 40px;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  opacity: 0;
  transition: opacity 150ms ease, background-color 150ms ease;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};

  tr:hover & {
    opacity: 1;
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StickyChevronTh = styled.th`
  position: sticky;
  right: 0;
  width: 40px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

export const CheckboxCell = styled.td`
  width: 40px;
  padding-left: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  text-align: center;
`;

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CoverageBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
`;

export const FilterChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const FilterChipX = styled.span`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export const ClearAllButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-left: 4px;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export const FilterChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space800}`};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 150ms ease;
  padding: 0;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export const BreadcrumbCurrent = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const TwoColumnLayout = styled.div`
  display: flex;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space800};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space800};
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  height: calc(100vh - 108px);
`;

export const LeftColumn = styled.div`
  width: 55%;
  overflow-y: auto;
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const RightColumn = styled.div`
  width: 45%;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding-left: ${({ theme }) => (theme as StyledTheme).space600};
  overflow: hidden;
`;

export const DetailTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

export const InfoCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const InfoCardBordered = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const InfoRow = styled.div<{ hasBorder?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  row-gap: ${({ theme }) => (theme as StyledTheme).space300};

  ${({ hasBorder, theme }) =>
    hasBorder
      ? `
    margin-bottom: ${(theme as StyledTheme).space400};
    padding-bottom: ${(theme as StyledTheme).space400};
    border-bottom: 1px solid ${(theme as StyledTheme).colorOutlineVariant};
  `
      : ''}
`;

export const InfoItem = styled.div``;

export const InfoLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 4px 0;
`;

export const InfoValue = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  margin: 0;
  display: flex;
  align-items: center;
  min-height: 32px;
`;

export const InfoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const InfoTooltipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-size: 8px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-left: 4px;
  vertical-align: middle;
`;

export const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const SectionTitleSmall = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const TransmissionCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const TransmissionTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  margin: 0;
`;

export const TransmissionMeta = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 2px 0 0 0;
`;

export const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  margin-top: ${({ theme }) => (theme as StyledTheme).space300};
  padding: 0;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;

export const PreviewBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
  flex-shrink: 0;
`;

export const PreviewBannerText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

export const PreviewBannerHighlight = styled.span`
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const PreviewContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const PreviewTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const PreviewTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const PreviewMetaBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const PreviewMetaLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const PreviewMetaValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const PreviewDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

export const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const OutlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const CodeViewer = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export const CodeViewerInner = styled.div`
  display: flex;
`;

export const LineNumbers = styled.div`
  flex-shrink: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  padding-right: ${({ theme }) => (theme as StyledTheme).space300};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  user-select: none;
`;

export const LineNumber = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 20px;
  text-align: right;
`;

export const CodeContent = styled.pre`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 20px;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
`;

export const EmailHeader = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export const EmailFieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EmailFieldLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  width: 48px;
  flex-shrink: 0;
`;

export const EmailFieldValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const EmailFieldValueBold = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const EmailBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const EmailBodyText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

export const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
`;

export const AttachmentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AttachmentName = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AttachmentSize = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 2px 0 0 0;
`;

export const SeverityContainer = styled.span<{ severity: 'critical' | 'warning' | 'match' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;

  ${({ severity, theme }) => {
    const t = theme as StyledTheme;
    switch (severity) {
      case 'critical':
        return `color: ${t.colorOnSurface};`;
      case 'warning':
        return `color: ${t.colorOnSurfaceVariant};`;
      case 'match':
        return `color: ${t.colorOnSurfaceVariant};`;
    }
  }}
`;

export const SummaryChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: 4px ${({ theme }) => (theme as StyledTheme).space300};
`;

export const SummaryChipText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

export const CommentArea = styled.textarea`
  width: 100%;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  min-height: 100px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
  resize: none;
  outline: none;
  border: 1px solid transparent;
  transition: border-color 150ms ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }

  &:focus {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

export const ActivityPlaceholder = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const ToastContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 300ms ease;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const FormField = styled.div``;

export const FormLabel = styled.label<{ error?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  color: ${({ error, theme }) =>
    error ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOnSurface};
  margin-bottom: 6px;
  display: block;
`;

export const DismissReasonButton = styled.button<{ selected: boolean }>`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1px solid;
  padding: 6px ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
  background-color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorSurfaceBright};
  border-color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorOnPrimary : (theme as StyledTheme).colorOnSurface};

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const DismissTextArea = styled.textarea`
  width: 100%;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  min-height: 80px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
  resize: none;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }

  &:focus {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

export const AcceptedBanner = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AcceptedBannerText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const AcceptedBannerBold = styled.span`
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => (theme as StyledTheme).space1600} 0;
`;

export const EmptyStateTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 4px 0;
`;

export const EmptyStateText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

export const IssueCountBadge = styled.span<{ accent?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  padding: 0 6px;
  margin-left: ${({ theme }) => (theme as StyledTheme).space200};

  ${({ accent, theme }) => {
    const t = theme as StyledTheme;
    return accent
      ? `background-color: ${t.colorPrimary}; color: ${t.colorOnPrimary};`
      : `background-color: ${t.colorSurfaceContainerLow}; color: ${t.colorOnSurfaceVariant};`;
  }}
`;

export const StickyActionCell = styled.td`
  position: sticky;
  right: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};

  tr:hover & {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StickyActionTh = styled.th`
  position: sticky;
  right: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  white-space: nowrap;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

export const SaveApproveRow = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding-top: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const DatePickerFaux = styled.div`
  display: flex;
  height: 36px;
  align-items: center;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  cursor: pointer;
  transition: background-color 150ms ease;
  gap: ${({ theme }) => (theme as StyledTheme).space200};

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const IssueDetailSection = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const IssueDetailLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

export const IssueTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

export const ErrorRawText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  margin: 0;
`;

export const TruncatedCell = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  cursor: default;
`;

export const ScrollableTableContainer = styled.div`
  overflow-x: auto;
`;

export const IssuesTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  justify-content: space-between;
`;

export const NativeSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ hasError, theme }) =>
    hasError ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOutlineVariant};
  padding: 0 36px 0 ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  cursor: pointer;
  outline: none;
  transition: border-color 150ms ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;

  &:focus {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;
