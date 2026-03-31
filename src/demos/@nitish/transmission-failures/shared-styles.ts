import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

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

export const TabsWrapper = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

/* ── Tables ─────────────────────────────────────────────── */

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

export const ScrollableTableContainer = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
`;

export const StyledTHead = styled.thead`
  tr {
    border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const StyledTh = styled.th`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:last-child {
    border-right: none;
  }
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
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  white-space: nowrap;
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

/* ── Cell Typography ────────────────────────────────────── */

export const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap;
  display: block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellTextMuted = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  display: block;
  max-width: 280px;
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

export const JiraLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};

  &:hover {
    text-decoration: underline;
  }
`;

/* ── Breadcrumbs ────────────────────────────────────────── */

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

/* ── Two-Column Layout ──────────────────────────────────── */

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

/* ── Detail Header ──────────────────────────────────────── */

export const DetailTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const DetailActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const QuickActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  flex-wrap: wrap;
`;

/* ── Info Card ──────────────────────────────────────────── */

export const InfoCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
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
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  transition: background-color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  }
`;

/* ── Error Details ──────────────────────────────────────── */

export const ErrorSection = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const ErrorDetailText = styled.pre`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHighest};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.6;
`;

/* ── Form Fields ────────────────────────────────────────── */

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const FormField = styled.div``;

export const FormLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: 6px;
  display: block;
`;

export const NativeSelect = styled.select`
  width: 100%;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
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

export const NativeInput = styled.input`
  width: 100%;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  outline: none;
  transition: border-color 150ms ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }

  &:focus {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

export const HyperlinkValue = styled.a`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  cursor: pointer;
  min-height: 36px;

  &:hover {
    text-decoration: underline;
  }
`;

/* ── Sections ───────────────────────────────────────────── */

export const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

/* ── Transmission History ───────────────────────────────── */

export const TransmissionCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const TransmissionTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  margin: 0;
`;

export const TransmissionMeta = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const TransmissionDivider = styled.span`
  width: 1px;
  height: 14px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

export const TransmissionBtns = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  flex-shrink: 0;
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

export const StatusDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

/* ── Tabs ────────────────────────────────────────────────── */

export const BottomTabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const BottomTabButton = styled.button<{ active?: boolean }>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
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
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};

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
  text-align: center;
`;

/* ── Preview Panel ──────────────────────────────────────── */

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

export const PreviewTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const PreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
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

/* ── Recurrence Dots ────────────────────────────────────── */

export const RecurrenceDots = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const RecurrenceDot = styled.span<{ active?: boolean; color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ active, color, theme }) =>
    active ? color : (theme as StyledTheme).colorOutlineVariant};
`;

/* ── Summary Card (API Group) ───────────────────────────── */

export const SummaryCard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  row-gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

/* ── Workload Strip ─────────────────────────────────────── */

export const WorkloadStrip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  flex-wrap: wrap;
`;

export const WorkloadChip = styled.div<{ isHighlight?: boolean; isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space100} ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ isHighlight, isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorPrimaryContainer
    : isHighlight ? (theme as StyledTheme).colorErrorContainer
    : (theme as StyledTheme).colorSurfaceContainerLow};
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms ease, box-shadow 150ms ease;
  border: 1.5px solid ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorPrimary : 'transparent'};

  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
  flex-shrink: 0;
`;

export const WorkloadName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const WorkloadCount = styled.span<{ isHighlight?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ isHighlight, theme }) =>
    isHighlight ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 600;
`;

export const WorkloadLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: ${({ theme }) => (theme as StyledTheme).space200};
  flex-shrink: 0;
`;

/* ── Misc ───────────────────────────────────────────────── */

export const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  justify-content: space-between;
`;
