import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import {
  reconData, apiErrorData, DiscrepancyType, ApiErrorRow,
  DISCREPANCY_TYPE_LABELS,
} from './data';

/* ─── Types ──────────────────────────────────────────────── */

type Mode = 'recon' | 'api';

type ViewState =
  | { view: 'list' }
  | { view: 'detail'; id: string };

/* ─── Styled Components ──────────────────────────────────── */

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

// Mode Switcher
const ModeSwitcherBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space600};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ModeBtn = styled.button<{ active?: boolean }>`
  padding: 6px ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ active, theme }) => active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ active, theme }) => active ? (theme as StyledTheme).colorPrimary : 'transparent'};
  color: ${({ active, theme }) => active ? (theme as StyledTheme).colorOnPrimary : (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: ${({ active }) => active ? 600 : 400};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background-color: ${({ active, theme }) => active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const ModeSwitcherLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-right: ${({ theme }) => (theme as StyledTheme).space100};
`;

// EDI/Census tab switcher
const FileTabBar = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: 3px;
  width: fit-content;
`;

const FileTabBtn = styled.button<{ active?: boolean }>`
  padding: 5px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  border: none;
  background-color: ${({ active, theme }) => active ? (theme as StyledTheme).colorSurfaceBright : 'transparent'};
  color: ${({ active, theme }) => active ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: ${({ active }) => active ? 600 : 400};
  cursor: pointer;
  box-shadow: ${({ active }) => active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'};
  transition: all 0.12s ease;
`;

// Census table
const CensusTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
`;

const CensusTh = styled.th`
  text-align: left;
  padding: 6px ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
`;

const CensusTd = styled.td`
  padding: 6px ${({ theme }) => (theme as StyledTheme).space300};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  white-space: nowrap;
`;

const CensusHighlightTd = styled(CensusTd)`
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 600;
`;

const CensusScrollWrap = styled.div`
  overflow-x: auto;
  max-height: 480px;
  overflow-y: auto;
  border-radius: 0 0 ${({ theme }) => (theme as StyledTheme).shapeCorner2xl} ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

// EDI Viewer
const EdiCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHighest};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  overflow: hidden;
`;

const EdiCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const EdiCardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  flex: 1;
`;

const EdiFilename = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const EdiBody = styled.pre`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
  max-height: 480px;
  overflow-y: auto;
`;

// Error Message Card
const ErrorMsgCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorErrorContainer};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorError};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ErrorMsgHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ErrorMsgTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 600;
`;

const ErrorMsgBody = styled.pre`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.7;
  background-color: transparent;
`;

// Top Nav
const TopNav = styled.header`
  display: flex;
  height: 48px;
  align-items: center;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-shrink: 0;
`;

const NavDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.25);
`;

const NavTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
  font-weight: 600;
`;

const NavSearch = styled.div`
  margin: 0 ${({ theme }) => (theme as StyledTheme).space600};
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavSearchInput = styled.input`
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
  &::placeholder { color: rgba(255,255,255,0.55); }
  &:focus { background-color: rgba(255,255,255,0.15); }
`;

const NavSearchIcon = styled.div`
  position: absolute;
  left: calc(50% - 232px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const NavIconBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: none; border: none; cursor: pointer;
  opacity: 0.85; transition: opacity 150ms, background-color 150ms; color: inherit;
  &:hover { opacity: 1; background-color: rgba(255,255,255,0.12); }
`;

const NavCompany = styled.div`
  display: flex; align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-left: ${({ theme }) => (theme as StyledTheme).space200};
`;

const NavCompanyName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
`;

// Layout
const MainContent = styled.main`
  padding: ${({ theme }) => `${(theme as StyledTheme).space600} ${(theme as StyledTheme).space800}`};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const PageTitleArea = styled.div``;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 4px 0;
`;

const PageSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

// Summary stats bar
const StatsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const StatChip = styled.div<{ accent?: 'critical' | 'warning' | 'normal' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ accent, theme }) => {
    const t = theme as StyledTheme;
    if (accent === 'critical') return t.colorError;
    if (accent === 'warning') return t.colorOnWarningContainer;
    return t.colorOutlineVariant;
  }};
  background-color: ${({ accent, theme }) => {
    const t = theme as StyledTheme;
    if (accent === 'critical') return t.colorErrorContainer;
    if (accent === 'warning') return `rgba(${t.colorOnWarningContainer}, 0.08)`;
    return t.colorSurfaceBright;
  }};
  padding: 6px ${({ theme }) => (theme as StyledTheme).space300};
`;

const StatNumber = styled.span<{ accent?: 'critical' | 'warning' | 'normal' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ accent, theme }) => {
    const t = theme as StyledTheme;
    if (accent === 'critical') return t.colorError;
    if (accent === 'warning') return t.colorOnWarningContainer;
    return t.colorOnSurface;
  }};
`;

const StatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

// Toolbar
const TableCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const Toolbar = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const GridTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const ResultCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 240px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px; top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex; align-items: center;
`;

const SearchInput = styled.input`
  width: 100%; height: 34px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  padding-left: 34px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  outline: none; box-sizing: border-box;
  &::placeholder { color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant}; }
  &:focus { border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary}; }
`;

// Table
const TableOverflow = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 2000px;
  border-collapse: collapse;
`;

const THead = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const Th = styled.th<{ w?: string; sortable?: boolean }>`
  width: ${({ w }) => w || 'auto'};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
  white-space: nowrap;
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-right: none; }
  &:hover { color: ${({ sortable, theme }) => sortable ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant}; }
`;

const ThContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 150ms;
  &:last-child { border-bottom: none; }
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const Td = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  overflow: hidden;
  max-width: 0;
`;

const CheckboxTd = styled.td`
  width: 40px;
  padding-left: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
`;

const StickyTh = styled.th`
  position: sticky; right: 0; width: 40px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const StickyTd = styled.td`
  position: sticky; right: 0; width: 40px;
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  opacity: 0;
  transition: opacity 150ms, background-color 150ms;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  tr:hover & { opacity: 1; background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap; display: block;
  overflow: hidden; text-overflow: ellipsis;
`;

const CellMuted = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap; display: block;
  overflow: hidden; text-overflow: ellipsis;
`;

const CellMono = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap; display: block;
  overflow: hidden; text-overflow: ellipsis;
`;

const EmpStack = styled.div`
  display: flex;
  flex-direction: column;
`;

const SlaWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

const SlaDot = styled.span<{ s: 'green' | 'amber' | 'red' }>`
  width: 8px; height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  flex-shrink: 0;
  background-color: ${({ s, theme }) => {
    const t = theme as StyledTheme;
    if (s === 'green') return t.colorSuccess;
    if (s === 'amber') return t.colorOnWarningContainer;
    return t.colorError;
  }};
`;

const SlaText = styled.span<{ s: 'green' | 'amber' | 'red' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ s, theme }) => {
    const t = theme as StyledTheme;
    if (s === 'green') return t.colorSuccess;
    if (s === 'amber') return t.colorOnWarningContainer;
    return t.colorError;
  }};
  ${({ s }) => s === 'red' ? 'font-weight: 500;' : ''}
`;

const AssigneeCell = styled.div`
  display: flex; align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const AssigneeName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  white-space: nowrap;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  white-space: nowrap;
`;

// Detail view
const Breadcrumb = styled.nav`
  display: flex; align-items: center; gap: 6px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space800}`};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const BreadcrumbLink = styled.button`
  background: none; border: none; cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: 0; transition: color 150ms;
  &:hover { color: ${({ theme }) => (theme as StyledTheme).colorOnSurface}; }
`;

const BreadcrumbCurrent = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const TwoCol = styled.div`
  display: flex;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space800};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space800};
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  height: calc(100vh - 108px);
`;

const LeftCol = styled.div`
  width: 55%;
  overflow-y: auto;
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
`;

const RightCol = styled.div`
  width: 45%;
  position: sticky; top: 0;
  display: flex; flex-direction: column;
  border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding-left: ${({ theme }) => (theme as StyledTheme).space600};
  overflow: hidden;
`;

const DetailHeader = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;


const DetailTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 4px 0;
`;

const DetailSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const ActionRow = styled.div`
  display: flex; align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const InfoCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: ${({ theme }) => (theme as StyledTheme).space600};
  row-gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const InfoItem = styled.div``;

const InfoLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 4px 0;
`;

const InfoValue = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  margin: 0;
  display: flex; align-items: center;
  min-height: 28px;
`;

const InfoBadge = styled.span`
  display: inline-flex; align-items: center;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const SectionHeader = styled.div`
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FormField = styled.div``;

const FormLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: 6px;
  display: block;
`;

const NativeSelect = styled.select`
  width: 100%; height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: 0 36px 0 ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  cursor: pointer; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
  &:focus { border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary}; }
`;

const TabBar = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const TabBtn = styled.button<{ active: boolean }>`
  position: relative;
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  font-weight: 500;
  background: none; border: none; cursor: pointer;
  color: ${({ active, theme }) => active ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  transition: color 150ms;
  &:hover { color: ${({ theme }) => (theme as StyledTheme).colorOnSurface}; }
  &::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background-color: ${({ active, theme }) => active ? (theme as StyledTheme).colorPrimary : 'transparent'};
  }
`;

const CommentArea = styled.textarea`
  width: 100%;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  min-height: 100px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6; resize: none; outline: none;
  border: 1px solid transparent;
  transition: border-color 150ms; box-sizing: border-box;
  &::placeholder { color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant}; }
  &:focus { border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary}; }
`;

// Transmissions
const TransmissionCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  box-sizing: border-box;
`;

const TransmissionTitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  margin: 0;
`;

const TransmissionMeta = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 2px 0 0 0;
`;

// Preview panel (right column)
const PreviewLabel = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
`;

const PreviewContent = styled.div`
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

// AI Summary card
const AiCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const AiCardHeader = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AiCardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const AiBadge = styled.span`
  display: inline-flex; align-items: center;
  padding: 1px 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 500;
`;

const AiCardBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const AiText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
  margin: 0;
`;

// Resolution guidance card
const ResolutionCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const ResolutionHeader = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ResolutionTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ResolutionBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ResolutionText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

const AiGeneratedNote = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

// Discrepancy comparison table
const CompareCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const CompareHeader = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex; align-items: center; gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const CompareTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CompareTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CompareTHead = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const CompareTh = styled.th`
  padding: ${({ theme }) => (theme as StyledTheme).space200} ${({ theme }) => (theme as StyledTheme).space400};
  text-align: left;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500;
`;

const CompareTr = styled.tr<{ severity?: 'mismatch' | 'warning' | 'match' }>`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child { border-bottom: none; }
  background-color: ${({ severity, theme }) => {
    const t = theme as StyledTheme;
    if (severity === 'mismatch') return `${t.colorErrorContainer}20`;
    if (severity === 'warning') return `rgba(255,180,0,0.06)`;
    return 'transparent';
  }};
`;

const CompareTd = styled.td<{ highlight?: 'mismatch' | 'warning' }>`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ highlight, theme }) => {
    const t = theme as StyledTheme;
    if (highlight === 'mismatch') return t.colorError;
    if (highlight === 'warning') return t.colorOnWarningContainer;
    return t.colorOnSurface;
  }};
  font-weight: ${({ highlight }) => highlight ? '500' : '400'};
`;

const ContextualNote = styled.div`
  display: flex; align-items: flex-start; gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const ContextualNoteText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
`;

// Timeline
const TimelineCard = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const TimelineHeader = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex; align-items: center;
  justify-content: space-between;
`;

const TimelineTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const TimelineBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const TimelineList = styled.ul`
  list-style: none;
  margin: 0; padding: 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 7px; top: 8px; bottom: 8px;
    width: 1px;
    background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const TimelineItem = styled.li`
  position: relative;
  padding-left: ${({ theme }) => (theme as StyledTheme).space600};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  &:last-child { padding-bottom: 0; }
`;

const TimelineDot = styled.span<{ type: string }>`
  position: absolute;
  left: 0; top: 4px;
  width: 15px; height: 15px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ type, theme }) => {
    const t = theme as StyledTheme;
    if (type === 'created') return t.colorPrimary;
    if (type === 'resolved') return t.colorSuccess;
    if (type === 'dismissed') return t.colorOnSurfaceVariant;
    return t.colorOutlineVariant;
  }};
  background-color: ${({ type, theme }) => {
    const t = theme as StyledTheme;
    if (type === 'created') return t.colorPrimary;
    if (type === 'resolved') return t.colorSuccess;
    return t.colorSurfaceBright;
  }};
`;

const TimelineEventRow = styled.div`
  display: flex; align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TimelineEventName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const TimelineDateStr = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  flex-shrink: 0;
`;

const TimelineDetail = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 2px 0 0 0;
  line-height: 1.5;
`;

const ExpandBtn = styled.button`
  background: none; border: none; cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 500; padding: 0;
  display: flex; align-items: center; gap: 4px;
  transition: color 150ms;
  &:hover { color: ${({ theme }) => (theme as StyledTheme).colorOnSurface}; }
`;

/* ─── Helper Components ──────────────────────────────────── */

function DiscrepancyTypeLabel({ type }: { type: DiscrepancyType }) {
  return <TypeBadge>{DISCREPANCY_TYPE_LABELS[type]}</TypeBadge>;
}

/* ─── Main Component ─────────────────────────────────────── */

const ReconciliationFlowDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [mode, setMode] = useState<Mode>('recon');
  const [viewState, setViewState] = useState<ViewState>({ view: 'list' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'comment' | 'activities'>('comment');
  const [commentText, setCommentText] = useState('');
  const [timelineExpanded, setTimelineExpanded] = useState(true);
  const [ediTab, setEdiTab] = useState<'edi' | 'census'>('edi');

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setViewState({ view: 'list' });
    setSearchQuery('');
  };

  const selectedReconRow =
    mode === 'recon' && viewState.view === 'detail'
      ? reconData.find(r => r.id === viewState.id) ?? null
      : null;

  const selectedApiRow =
    mode === 'api' && viewState.view === 'detail'
      ? apiErrorData.find(r => r.id === viewState.id) ?? null
      : null;

  // Keep backward compat alias
  const selectedRow = selectedReconRow;

  const filteredRows = reconData.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(q) ||
      r.memberName.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.carrier.toLowerCase().includes(q) ||
      r.sfdc.includes(q) ||
      DISCREPANCY_TYPE_LABELS[r.discrepancyType].toLowerCase().includes(q)
    );
  });

  const filteredApiRows = apiErrorData.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(q) ||
      r.memberName.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.carrier.toLowerCase().includes(q) ||
      r.errorMessage.toLowerCase().includes(q)
    );
  });

  /* ─── TopNav ──────────────────────────────────────────── */
  const topNav = (
    <TopNav>
      <NavLogo>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="rgba(255,255,255,0.2)" />
          <path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7z" fill="white" />
        </svg>
        <NavDivider />
        <NavTitle>Benefits</NavTitle>
      </NavLogo>
      <NavSearch>
        <NavSearchIcon>
          <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color="rgba(255,255,255,0.55)" />
        </NavSearchIcon>
        <NavSearchInput placeholder="Search or jump to..." />
      </NavSearch>
      <NavActions>
        {[Icon.TYPES.QUESTION_CIRCLE_OUTLINE, Icon.TYPES.ACCESSIBILITY_OUTLINE, Icon.TYPES.MESSAGE_OUTLINE, Icon.TYPES.NOTIFICATION_OUTLINE, Icon.TYPES.SETTINGS_OUTLINE].map((ic, i) => (
          <NavIconBtn key={i} aria-label="nav-action">
            <Icon type={ic} size={16} color="rgba(255,255,255,0.85)" />
          </NavIconBtn>
        ))}
        <NavCompany>
          <NavCompanyName>Acme, Inc.</NavCompanyName>
          <Avatar name="Acme Inc" size={Avatar.SIZES.S} />
        </NavCompany>
      </NavActions>
    </TopNav>
  );

  /* ─── List View ───────────────────────────────────────── */
  const listView = (
    <MainContent>
      <TableCard>
        <Toolbar>
          <ToolbarLeft>
            <GridTitle>Discrepancies</GridTitle>
            <ResultCount>{filteredRows.length} results</ResultCount>
          </ToolbarLeft>
          <ToolbarRight>
            <SearchWrapper>
              <SearchIcon>
                <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
              </SearchIcon>
              <SearchInput
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
              <Icon type={Icon.TYPES.FILTER} size={14} />
              &nbsp;Filter
            </Button>
          </ToolbarRight>
        </Toolbar>

        <TableOverflow>
          <StyledTable>
            <THead>
              <tr>
                <th style={{ width: 40, paddingLeft: 16 }}><input type="checkbox" /></th>
                <Th>EMPLOYEE</Th>
                <Th>MEMBER</Th>
                <Th>RELATIONSHIP</Th>
                <Th>COMPANY</Th>
                <Th>CARRIER</Th>
                <Th>ASSIGNEE</Th>
                <Th sortable><ThContent>SLA <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} /></ThContent></Th>
                <Th>STATUS</Th>
                <Th>STATUS DETAIL</Th>
                <Th sortable><ThContent>CREATED AT <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} /></ThContent></Th>
                <Th>DISCREPANCY TYPE</Th>
                <Th>ROOT CAUSE</Th>
                <Th>ROOT CAUSE DETAIL</Th>
                <StickyTh />
              </tr>
            </THead>
            <tbody>
              {filteredRows.map(row => (
                <Tr key={row.id} onClick={() => setViewState({ view: 'detail', id: row.id })}>
                  <CheckboxTd onClick={e => e.stopPropagation()}>
                    <input type="checkbox" />
                  </CheckboxTd>
                  <Td>
                    <EmpStack>
                      <CellText>{row.employeeName}</CellText>
                      <CellMono>{row.employeeSsn}</CellMono>
                    </EmpStack>
                  </Td>
                  <Td>
                    <EmpStack>
                      <CellText>{row.memberName}</CellText>
                      <CellMono>{row.memberSsn}</CellMono>
                    </EmpStack>
                  </Td>
                  <Td><CellMuted>{row.relationship}</CellMuted></Td>
                  <Td><CellText>{row.company}</CellText></Td>
                  <Td><CellText>{row.carrier}</CellText></Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}>
                    <AssigneeCell>
                      <Avatar name={row.assignee} size={Avatar.SIZES.S} />
                      <AssigneeName>{row.assignee}</AssigneeName>
                    </AssigneeCell>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}>
                    <SlaWrap>
                      <SlaDot s={row.sla.status} />
                      <SlaText s={row.sla.status}>{row.sla.label}</SlaText>
                    </SlaWrap>
                  </Td>
                  <Td><CellText>{row.status}</CellText></Td>
                  <Td><CellMuted>{row.statusDetail}</CellMuted></Td>
                  <Td><CellMuted>{row.createdAt}</CellMuted></Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}><CellText>{DISCREPANCY_TYPE_LABELS[row.discrepancyType]}</CellText></Td>
                  <Td><CellMuted>{row.rootCause}</CellMuted></Td>
                  <Td><CellMuted>{row.rootCauseDetail}</CellMuted></Td>
                  <StickyTd>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurfaceVariant} />
                  </StickyTd>
                </Tr>
              ))}
            </tbody>
          </StyledTable>
        </TableOverflow>
      </TableCard>
    </MainContent>
  );

  /* ─── Detail View ─────────────────────────────────────── */
  const detailView = selectedRow ? (
    <>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => setViewState({ view: 'list' })}>
          <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
          Reconciliation
        </BreadcrumbLink>
        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={theme.colorOnSurfaceVariant} />
        <BreadcrumbCurrent>{DISCREPANCY_TYPE_LABELS[selectedRow.discrepancyType]}</BreadcrumbCurrent>
      </Breadcrumb>

      <TwoCol>
        {/* Left column */}
        <LeftCol>
          <DetailHeader>
            <DetailTitle>
              {DISCREPANCY_TYPE_LABELS[selectedRow.discrepancyType].replace('Mismatch', 'differs between Rippling and ')}
              {selectedRow.carrier}
            </DetailTitle>
            <DetailSubtitle>Discrepancy found during recon · {selectedRow.createdAt}</DetailSubtitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200, marginTop: theme.space300 }}>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Employee Debugger</Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Group Debugger</Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Proxy Link</Button>
              <div style={{ flex: 1 }} />
              <Button size={Button.SIZES.S}>Resolve</Button>
            </div>
          </DetailHeader>

          {/* Identity card */}
          <InfoCard>
            <InfoGrid>
              {/* Row 1 */}
              <InfoItem>
                <InfoLabel>Carrier</InfoLabel>
                <InfoValue>{selectedRow.carrier}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Company</InfoLabel>
                <InfoValue>{selectedRow.company}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Employee Name</InfoLabel>
                <InfoValue>{selectedRow.employeeName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Dependent</InfoLabel>
                <InfoValue><InfoBadge>{selectedRow.relationship}</InfoBadge></InfoValue>
              </InfoItem>
              {/* Divider spanning all 4 columns */}
              <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${theme.colorOutlineVariant}`, margin: `${theme.space100} 0` }} />
              {/* Row 2 */}
              <InfoItem>
                <InfoLabel style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Role ID
                  <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={13} color={theme.colorOnSurfaceVariant} />
                </InfoLabel>
                <InfoValue>{selectedRow.sfdc ? `ID${selectedRow.sfdc}` : '—'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Employee ID</InfoLabel>
                <InfoValue>ID{selectedRow.sfdc}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Line of Coverage</InfoLabel>
                <InfoValue><InfoBadge>{selectedRow.coverage}</InfoBadge></InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoCard>

          {/* Workflow fields */}
          <Section>
            <SectionHeader>
              <SectionTitle>Workflow</SectionTitle>
            </SectionHeader>
            <InfoCard>
              <FormGrid>
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <NativeSelect defaultValue={selectedRow.status}>
                    <option>Open</option>
                    <option>In review</option>
                    <option>In progress</option>
                    <option>Resolved</option>
                    <option>Dismissed</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Status Detail</FormLabel>
                  <NativeSelect defaultValue={selectedRow.statusDetail}>
                    <option>Pending</option>
                    <option>Carrier outreach</option>
                    <option>Investigation</option>
                    <option>Escalated</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Root Cause</FormLabel>
                  <NativeSelect defaultValue={selectedRow.rootCause}>
                    <option>Mapping error</option>
                    <option>EDI error</option>
                    <option>Carrier processing</option>
                    <option>Data entry error</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Root Cause Detail</FormLabel>
                  <NativeSelect defaultValue={selectedRow.rootCauseDetail}>
                    <option>Process Gap</option>
                    <option>Plan Config</option>
                    <option>Retroactive change</option>
                    <option>Timing issue</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Assignee</FormLabel>
                  <NativeSelect defaultValue={selectedRow.assignee}>
                    <option>Richard Satherland</option>
                    <option>Priya Mehta</option>
                    <option>David Kim</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Discrepancy Type</FormLabel>
                  <NativeSelect defaultValue={selectedRow.discrepancyType}>
                    {Object.entries(DISCREPANCY_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </NativeSelect>
                </FormField>
              </FormGrid>
            </InfoCard>
          </Section>

          {/* AI Summary */}
          <Section>
            <AiCard>
              <AiCardHeader>
                <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={14} color={theme.colorPrimary} />
                <AiCardTitle>AI Diagnosis</AiCardTitle>
              </AiCardHeader>
              <AiCardBody>
                <AiText>{selectedRow.aiSummary}</AiText>
              </AiCardBody>
            </AiCard>
          </Section>

          {/* Transmissions */}
          <Section>
            <SectionHeader>
              <SectionTitle>Transmissions</SectionTitle>
            </SectionHeader>
            <TransmissionCard>
              <div>
                <TransmissionTitle>TR-2026-0318</TransmissionTitle>
                <TransmissionMeta>Mar 18, 2026 · 06:12 AM PST · 834 EDI</TransmissionMeta>
              </div>
              <div style={{ display: 'flex', gap: theme.space200 }}>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>View EDI</Button>
                <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>View Census</Button>
              </div>
            </TransmissionCard>
            <ExpandBtn style={{ marginTop: theme.space300 }} onClick={() => setTimelineExpanded(v => !v)}>
              <Icon type={timelineExpanded ? Icon.TYPES.CHEVRON_UP : Icon.TYPES.CHEVRON_DOWN} size={14} />
              {timelineExpanded ? 'Hide previous transmissions' : 'Show previous transmissions'}
            </ExpandBtn>
            {timelineExpanded && (
              <div style={{ marginTop: theme.space300, display: 'flex', flexDirection: 'column', gap: theme.space200 }}>
                {[
                  { id: 'TR-2026-0311', date: 'Mar 11, 2026 · 06:10 AM PST · 834 EDI' },
                  { id: 'TR-2026-0304', date: 'Mar 4, 2026 · 06:08 AM PST · 834 EDI' },
                ].map(t => (
                  <TransmissionCard key={t.id}>
                    <div>
                      <TransmissionTitle>{t.id}</TransmissionTitle>
                      <TransmissionMeta>{t.date}</TransmissionMeta>
                    </div>
                    <div style={{ display: 'flex', gap: theme.space200 }}>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>View EDI</Button>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>View Census</Button>
                    </div>
                  </TransmissionCard>
                ))}
              </div>
            )}
          </Section>

          {/* Comment / Activity & Timeline tabs */}
          <Section>
            <TabBar>
              <TabBtn active={activeTab === 'comment'} onClick={() => setActiveTab('comment')}>Comment</TabBtn>
              <TabBtn active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>Activity</TabBtn>
            </TabBar>
            {activeTab === 'comment' && (
              <>
                <CommentArea
                  placeholder="Add a comment or note for your team..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button size={Button.SIZES.S}>Comment</Button>
                </div>
              </>
            )}
            {activeTab === 'activities' && (
              <TimelineList>
                {selectedRow.timeline.map(ev => (
                  <TimelineItem key={ev.id}>
                    <TimelineDot type={ev.type} />
                    <TimelineEventRow>
                      <TimelineEventName>{ev.event}</TimelineEventName>
                      <TimelineDateStr>{ev.date} · {ev.time}</TimelineDateStr>
                    </TimelineEventRow>
                    {ev.detail && <TimelineDetail>{ev.detail}</TimelineDetail>}
                  </TimelineItem>
                ))}
              </TimelineList>
            )}
          </Section>
        </LeftCol>

        {/* Right column — comparison + resolution */}
        <RightCol>
          <PreviewContent>

            {/* Rippling vs Carrier comparison */}
            <CompareCard>
              <CompareHeader>
                <Icon type={Icon.TYPES.EYE_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                <CompareTitle>Rippling vs {selectedRow.carrier}</CompareTitle>
              </CompareHeader>
              <CompareTable>
                <CompareTHead>
                  <tr>
                    <CompareTh style={{ width: '38%' }}>Field</CompareTh>
                    <CompareTh>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: theme.colorPrimary,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={10} color={theme.colorOnPrimary} />
                        </span>
                        Rippling
                      </span>
                    </CompareTh>
                    <CompareTh>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={selectedRow.carrier} size={Avatar.SIZES.S} />
                        {selectedRow.carrier}
                      </span>
                    </CompareTh>
                  </tr>
                </CompareTHead>
                <tbody>
                  {selectedRow.discrepancyFields.filter(f => f.severity !== 'match').map(f => (
                    <React.Fragment key={f.field}>
                      <CompareTr severity={f.severity}>
                        <CompareTd style={{ color: theme.colorOnSurfaceVariant, fontSize: 13 }}>
                          {f.field}
                        </CompareTd>
                        <CompareTd highlight={f.severity}>
                          {f.ripplingValue}
                        </CompareTd>
                        <CompareTd highlight={f.severity}>
                          {f.carrierValue}
                        </CompareTd>
                      </CompareTr>
                      {f.contextualNote && (
                        <tr>
                          <td colSpan={3} style={{ padding: 0 }}>
                            <ContextualNote>
                              <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={13} color={theme.colorOnSurfaceVariant} style={{ flexShrink: 0, marginTop: 1 }} />
                              <ContextualNoteText>{f.contextualNote}</ContextualNoteText>
                            </ContextualNote>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </CompareTable>
            </CompareCard>

            {/* Resolution Guidance */}
            <ResolutionCard>
              <ResolutionHeader>
                <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                <ResolutionTitle>Resolution Guidance</ResolutionTitle>
              </ResolutionHeader>
              <ResolutionBody>
                <ResolutionText>{selectedRow.resolutionGuidance}</ResolutionText>
                <AiGeneratedNote>This guidance is AI generated</AiGeneratedNote>
              </ResolutionBody>
            </ResolutionCard>

          </PreviewContent>
        </RightCol>
      </TwoCol>
    </>
  ) : null;

  /* ─── API Errors List View ───────────────────────────────── */
  const apiListView = (
    <MainContent>
      <TableCard>
        <Toolbar>
          <ToolbarLeft>
            <GridTitle>Errors</GridTitle>
            <ResultCount>{filteredApiRows.length} results</ResultCount>
          </ToolbarLeft>
          <ToolbarRight>
            <SearchWrapper>
              <SearchIcon>
                <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
              </SearchIcon>
              <SearchInput
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
              <Icon type={Icon.TYPES.FILTER} size={14} />
              &nbsp;Filter
            </Button>
          </ToolbarRight>
        </Toolbar>

        <TableOverflow>
          <StyledTable>
            <THead>
              <tr>
                <th style={{ width: 40, paddingLeft: 16 }}><input type="checkbox" /></th>
                <Th>EMPLOYEE</Th>
                <Th>MEMBER</Th>
                <Th>RELATIONSHIP</Th>
                <Th>COMPANY</Th>
                <Th>CARRIER</Th>
                <Th>ASSIGNEE</Th>
                <Th sortable><ThContent>SLA <Icon type={Icon.TYPES.CHEVRON_DOWN} size={12} /></ThContent></Th>
                <Th>STATUS</Th>
                <Th>STATUS DETAIL</Th>
                <Th>CREATED AT</Th>
                <Th>ERROR MESSAGE</Th>
                <Th>ROOT CAUSE</Th>
                <Th>ROOT CAUSE DETAIL</Th>
                <StickyTh />
              </tr>
            </THead>
            <tbody>
              {filteredApiRows.map(row => (
                <Tr key={row.id} onClick={() => setViewState({ view: 'detail', id: row.id })}>
                  <td style={{ width: 40, paddingLeft: 16 }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" />
                  </td>
                  <Td>
                    <EmpStack>
                      <CellText>{row.employeeName}</CellText>
                      <CellMono>{row.employeeSsn}</CellMono>
                    </EmpStack>
                  </Td>
                  <Td>
                    <EmpStack>
                      <CellText>{row.memberName}</CellText>
                      <CellMono>{row.memberSsn}</CellMono>
                    </EmpStack>
                  </Td>
                  <Td><CellMuted>{row.relationship}</CellMuted></Td>
                  <Td><CellText>{row.company}</CellText></Td>
                  <Td><CellText>{row.carrier}</CellText></Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}>
                    <AssigneeCell>
                      <Avatar name={row.assignee} size={Avatar.SIZES.S} />
                      <AssigneeName>{row.assignee}</AssigneeName>
                    </AssigneeCell>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}>
                    <SlaWrap>
                      <SlaDot s={row.sla.status} />
                      <SlaText s={row.sla.status}>{row.sla.label}</SlaText>
                    </SlaWrap>
                  </Td>
                  <Td><CellText>{row.status}</CellText></Td>
                  <Td><CellMuted>{row.statusDetail}</CellMuted></Td>
                  <Td><CellMuted>{row.createdAt}</CellMuted></Td>
                  <Td style={{ whiteSpace: 'nowrap', maxWidth: 'none' }}>
                    <CellText style={{ color: theme.colorError }}>{row.errorMessage}</CellText>
                  </Td>
                  <Td><CellMuted>{row.rootCause}</CellMuted></Td>
                  <Td><CellMuted>{row.rootCauseDetail}</CellMuted></Td>
                  <StickyTd>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={theme.colorOnSurfaceVariant} />
                  </StickyTd>
                </Tr>
              ))}
            </tbody>
          </StyledTable>
        </TableOverflow>
      </TableCard>
    </MainContent>
  );

  /* ─── API Errors Detail View ─────────────────────────────── */
  const apiDetailView = selectedApiRow ? (
    <>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => setViewState({ view: 'list' })}>
          <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
          API Errors
        </BreadcrumbLink>
        <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={theme.colorOnSurfaceVariant} />
        <BreadcrumbCurrent>{selectedApiRow.errorMessage}</BreadcrumbCurrent>
      </Breadcrumb>

      <TwoCol>
        {/* Left column */}
        <LeftCol>
          <DetailHeader>
            <DetailTitle>
              {selectedApiRow.errorMessage} — {selectedApiRow.carrier}
            </DetailTitle>
            <DetailSubtitle>Carrier rejection received · {selectedApiRow.createdAt}</DetailSubtitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.space200, marginTop: theme.space300 }}>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Employee Debugger</Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Group Debugger</Button>
              <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>Proxy Link</Button>
              <div style={{ flex: 1 }} />
              <Button size={Button.SIZES.S}>Resolve</Button>
            </div>
          </DetailHeader>

          {/* Identity card */}
          <InfoCard>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Carrier</InfoLabel>
                <InfoValue>{selectedApiRow.carrier}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Company</InfoLabel>
                <InfoValue>{selectedApiRow.company}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Employee Name</InfoLabel>
                <InfoValue>{selectedApiRow.employeeName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Dependent</InfoLabel>
                <InfoValue><InfoBadge>{selectedApiRow.relationship}</InfoBadge></InfoValue>
              </InfoItem>
              <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${theme.colorOutlineVariant}`, margin: `${theme.space100} 0` }} />
              <InfoItem>
                <InfoLabel style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Role ID
                  <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={13} color={theme.colorOnSurfaceVariant} />
                </InfoLabel>
                <InfoValue>{selectedApiRow.sfdc ? `ID${selectedApiRow.sfdc}` : '—'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Employee ID</InfoLabel>
                <InfoValue>ID{selectedApiRow.sfdc}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Line of Coverage</InfoLabel>
                <InfoValue><InfoBadge>{selectedApiRow.coverage}</InfoBadge></InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoCard>

          {/* Workflow */}
          <Section>
            <SectionHeader>
              <SectionTitle>Workflow</SectionTitle>
            </SectionHeader>
            <InfoCard>
              <FormGrid>
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <NativeSelect defaultValue={selectedApiRow.status}>
                    <option>Open</option>
                    <option>In review</option>
                    <option>In progress</option>
                    <option>Resolved</option>
                    <option>Dismissed</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Status Detail</FormLabel>
                  <NativeSelect defaultValue={selectedApiRow.statusDetail}>
                    <option>Pending</option>
                    <option>Carrier outreach</option>
                    <option>Investigation</option>
                    <option>Escalated</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Root Cause</FormLabel>
                  <NativeSelect defaultValue={selectedApiRow.rootCause}>
                    <option>Mapping error</option>
                    <option>EDI error</option>
                    <option>Carrier processing</option>
                    <option>Data entry error</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Root Cause Detail</FormLabel>
                  <NativeSelect defaultValue={selectedApiRow.rootCauseDetail}>
                    <option>Process Gap</option>
                    <option>Plan Config</option>
                    <option>Retroactive change</option>
                    <option>Timing issue</option>
                  </NativeSelect>
                </FormField>
                <FormField>
                  <FormLabel>Assignee</FormLabel>
                  <NativeSelect defaultValue={selectedApiRow.assignee}>
                    <option>Richard Satherland</option>
                    <option>Priya Mehta</option>
                    <option>David Kim</option>
                  </NativeSelect>
                </FormField>
              </FormGrid>
            </InfoCard>
          </Section>

          {/* Error Message from Carrier */}
          <Section>
            <ErrorMsgCard>
              <ErrorMsgHeader>
                <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={16} color={theme.colorError} />
                <ErrorMsgTitle>Carrier Error Message</ErrorMsgTitle>
              </ErrorMsgHeader>
              <ErrorMsgBody>{selectedApiRow.errorDetail}</ErrorMsgBody>
            </ErrorMsgCard>
          </Section>

          {/* Transmissions */}
          <Section>
            <SectionHeader>
              <SectionTitle>Transmissions</SectionTitle>
            </SectionHeader>
            <TransmissionCard>
              <div>
                <TransmissionTitle>TR-2026-0318</TransmissionTitle>
                <TransmissionMeta>Mar 18, 2026 · 06:12 AM PST · 834 EDI</TransmissionMeta>
              </div>
              <div style={{ display: 'flex', gap: theme.space200 }}>
                <Button
                  size={Button.SIZES.S}
                  appearance={ediTab === 'edi' ? Button.APPEARANCES.PRIMARY : Button.APPEARANCES.OUTLINE}
                  onClick={() => setEdiTab('edi')}
                >View EDI</Button>
                <Button
                  size={Button.SIZES.S}
                  appearance={ediTab === 'census' ? Button.APPEARANCES.PRIMARY : Button.APPEARANCES.OUTLINE}
                  onClick={() => setEdiTab('census')}
                >View Census</Button>
              </div>
            </TransmissionCard>
            <ExpandBtn style={{ marginTop: theme.space300 }} onClick={() => setTimelineExpanded(v => !v)}>
              <Icon type={timelineExpanded ? Icon.TYPES.CHEVRON_UP : Icon.TYPES.CHEVRON_DOWN} size={14} />
              {timelineExpanded ? 'Hide previous transmissions' : 'Show previous transmissions'}
            </ExpandBtn>
            {timelineExpanded && (
              <div style={{ marginTop: theme.space300, display: 'flex', flexDirection: 'column', gap: theme.space200 }}>
                {[
                  { id: 'TR-2026-0311', date: 'Mar 11, 2026 · 06:10 AM PST · 834 EDI' },
                  { id: 'TR-2026-0304', date: 'Mar 4, 2026 · 06:08 AM PST · 834 EDI' },
                ].map(t => (
                  <TransmissionCard key={t.id}>
                    <div>
                      <TransmissionTitle>{t.id}</TransmissionTitle>
                      <TransmissionMeta>{t.date}</TransmissionMeta>
                    </div>
                    <div style={{ display: 'flex', gap: theme.space200 }}>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setEdiTab('edi')}>View EDI</Button>
                      <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE} onClick={() => setEdiTab('census')}>View Census</Button>
                    </div>
                  </TransmissionCard>
                ))}
              </div>
            )}
          </Section>

          {/* Comment / Activity */}
          <Section>
            <TabBar>
              <TabBtn active={activeTab === 'comment'} onClick={() => setActiveTab('comment')}>Comment</TabBtn>
              <TabBtn active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>Activity</TabBtn>
            </TabBar>
            {activeTab === 'comment' && (
              <>
                <CommentArea
                  placeholder="Add a comment or note for your team..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button size={Button.SIZES.S}>Comment</Button>
                </div>
              </>
            )}
            {activeTab === 'activities' && (
              <TimelineList>
                {selectedApiRow.timeline.map(ev => (
                  <TimelineItem key={ev.id}>
                    <TimelineDot type={ev.type} />
                    <TimelineEventRow>
                      <TimelineEventName>{ev.event}</TimelineEventName>
                      <TimelineDateStr>{ev.date} · {ev.time}</TimelineDateStr>
                    </TimelineEventRow>
                    {ev.detail && <TimelineDetail>{ev.detail}</TimelineDetail>}
                  </TimelineItem>
                ))}
              </TimelineList>
            )}
          </Section>
        </LeftCol>

        {/* Right column — EDI / Census viewer */}
        <RightCol>
          <PreviewContent>
            {ediTab === 'edi' && (
              <EdiCard>
                <EdiCardHeader>
                  <Icon type={Icon.TYPES.EYE_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                  <EdiCardTitle>834 EDI Transaction</EdiCardTitle>
                  <EdiFilename>TR-2026-0318.edi</EdiFilename>
                </EdiCardHeader>
                <EdiBody>{selectedApiRow.ediPreview}</EdiBody>
              </EdiCard>
            )}

            {ediTab === 'census' && (
              <EdiCard>
                <EdiCardHeader>
                  <Icon type={Icon.TYPES.EYE_OUTLINE} size={14} color={theme.colorOnSurfaceVariant} />
                  <EdiCardTitle>Census Snapshot</EdiCardTitle>
                  <EdiFilename>census-2026-0318.csv</EdiFilename>
                </EdiCardHeader>
                <CensusScrollWrap>
                  <CensusTable>
                    <thead>
                      <tr>
                        <CensusTh>Employee ID</CensusTh>
                        <CensusTh>Last Name</CensusTh>
                        <CensusTh>First Name</CensusTh>
                        <CensusTh>SSN</CensusTh>
                        <CensusTh>DOB</CensusTh>
                        <CensusTh>Gender</CensusTh>
                        <CensusTh>Coverage</CensusTh>
                        <CensusTh>Plan Code</CensusTh>
                        <CensusTh>Tier</CensusTh>
                        <CensusTh>Eff. Date</CensusTh>
                        <CensusTh>Group ID</CensusTh>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <CensusTd>ID{selectedApiRow.sfdc}</CensusTd>
                        <CensusTd>{selectedApiRow.employeeName.split(', ')[0]}</CensusTd>
                        <CensusTd>{selectedApiRow.employeeName.split(', ')[1]}</CensusTd>
                        <CensusTd>{selectedApiRow.employeeSsn}</CensusTd>
                        <CensusTd>1982-04-15</CensusTd>
                        <CensusTd>F</CensusTd>
                        <CensusTd>{selectedApiRow.coverage}</CensusTd>
                        <CensusHighlightTd>{selectedApiRow.plan.split(' — ')[0].replace(/\s/g, '-').toUpperCase()}-26</CensusHighlightTd>
                        <CensusTd>Employee Only</CensusTd>
                        <CensusTd>2026-01-01</CensusTd>
                        <CensusTd>{selectedApiRow.groupId}</CensusTd>
                      </tr>
                      {['Martinez, Elena', 'Okonkwo, James', 'Patel, Raj'].map((name, i) => (
                        <tr key={i}>
                          <CensusTd>ID{parseInt(selectedApiRow.sfdc) + i + 1}</CensusTd>
                          <CensusTd>{name.split(', ')[0]}</CensusTd>
                          <CensusTd>{name.split(', ')[1]}</CensusTd>
                          <CensusTd>***-**-{3300 + i * 111}</CensusTd>
                          <CensusTd>{1978 + i * 3}-0{i + 1}-{10 + i * 5}</CensusTd>
                          <CensusTd>{i % 2 === 0 ? 'M' : 'F'}</CensusTd>
                          <CensusTd>{selectedApiRow.coverage}</CensusTd>
                          <CensusTd>{selectedApiRow.plan.split(' — ')[0].replace(/\s/g, '-').toUpperCase()}-26</CensusTd>
                          <CensusTd>Employee Only</CensusTd>
                          <CensusTd>2026-01-01</CensusTd>
                          <CensusTd>{selectedApiRow.groupId}</CensusTd>
                        </tr>
                      ))}
                    </tbody>
                  </CensusTable>
                </CensusScrollWrap>
              </EdiCard>
            )}
          </PreviewContent>
        </RightCol>
      </TwoCol>
    </>
  ) : null;

  /* ─── Mode Switcher ──────────────────────────────────────── */
  const modeSwitcher = (
    <ModeSwitcherBar>
      <ModeSwitcherLabel>View:</ModeSwitcherLabel>
      <ModeBtn active={mode === 'recon'} onClick={() => handleModeSwitch('recon')}>
        Recon Errors
      </ModeBtn>
      <ModeBtn active={mode === 'api'} onClick={() => handleModeSwitch('api')}>
        API Errors
      </ModeBtn>
    </ModeSwitcherBar>
  );

  return (
    <PageContainer>
      {topNav}
      {modeSwitcher}
      {mode === 'recon' && viewState.view === 'list' && listView}
      {mode === 'recon' && viewState.view === 'detail' && detailView}
      {mode === 'api' && viewState.view === 'list' && apiListView}
      {mode === 'api' && viewState.view === 'detail' && apiDetailView}
    </PageContainer>
  );
};

export default ReconciliationFlowDemo;
