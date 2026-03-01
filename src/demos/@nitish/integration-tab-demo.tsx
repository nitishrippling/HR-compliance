import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme, usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import Notice from '@rippling/pebble/Notice';
import Status from '@rippling/pebble/Status';
import TableBasic from '@rippling/pebble/TableBasic';
import { HStack } from '@rippling/pebble/Layout/Stack';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';

// --- Types ---

type TransmissionMethod = 'edi' | 'form' | 'manual';

interface Carrier {
  id: string;
  name: string;
  state: string;
  enrollmentType: string;
  transmissionMethod: TransmissionMethod;
  groupId: string | null;
  contactEmail: string | null;
  ediEligible: boolean;
  ediActive: boolean;
  logoColor: string;
  logoInitial: string;
}

// --- Mock Data ---

const CARRIERS: Carrier[] = [
  {
    id: 'cigna',
    name: 'Cigna',
    state: 'Illinois',
    enrollmentType: 'Medical',
    transmissionMethod: 'edi',
    groupId: '125636',
    contactEmail: null,
    ediEligible: true,
    ediActive: true,
    logoColor: '#0070BA',
    logoInitial: 'C',
  },
  {
    id: 'calchoice',
    name: 'CalChoice',
    state: 'California',
    enrollmentType: 'Medical',
    transmissionMethod: 'form',
    groupId: '263637',
    contactEmail: 'enrollments@calchoice.com',
    ediEligible: false,
    ediActive: false,
    logoColor: '#6B3FA0',
    logoInitial: 'C',
  },
  {
    id: 'bcbs',
    name: 'Blue Cross Blue Shield',
    state: 'Illinois',
    enrollmentType: 'Medical',
    transmissionMethod: 'manual',
    groupId: null,
    contactEmail: null,
    ediEligible: true,
    ediActive: false,
    logoColor: '#0054A6',
    logoInitial: 'B',
  },
  {
    id: 'guardian-ca',
    name: 'Guardian',
    state: 'California',
    enrollmentType: 'Dental, Vision',
    transmissionMethod: 'form',
    groupId: null,
    contactEmail: 'benefits@guardiandental.com',
    ediEligible: false,
    ediActive: false,
    logoColor: '#1A6B3C',
    logoInitial: 'G',
  },
  {
    id: 'guardian-il',
    name: 'Guardian',
    state: 'Illinois',
    enrollmentType: 'Dental, Vision',
    transmissionMethod: 'manual',
    groupId: null,
    contactEmail: null,
    ediEligible: false,
    ediActive: false,
    logoColor: '#1A6B3C',
    logoInitial: 'G',
  },
];

// --- Mock updates (relevant to this broker / plan year) ---

const UPDATES = [
  {
    id: '1',
    icon: Icon.TYPES.THUNDERBOLT_FILLED,
    title: 'CarrierConnect now available for Blue Cross Blue Shield (Illinois)',
    meta: 'Feb 24, 2026 · Product',
    description: 'You can enable EDI for BCBS Illinois directly from this page. One-click setup reduces manual file submission.',
    linkLabel: 'Enable EDI',
  },
  {
    id: '2',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
    title: 'New Help article: How to get a Group ID from your carrier',
    meta: 'Feb 20, 2026 · Help Center',
    description: 'Step-by-step guide for obtaining Group IDs from major carriers, including Guardian and CalChoice.',
    linkLabel: 'Read article',
  },
  {
    id: '3',
    icon: Icon.TYPES.EDIT_OUTLINE,
    title: 'Inline Group ID and contact editing on Integrations Summary',
    meta: 'Feb 18, 2026 · Product',
    description: 'Update Group IDs and form-sending contacts without leaving the renewal flow.',
    linkLabel: 'Learn more',
  },
];

// --- Styled Components ---

const SectionCard = styled.div<{ variant: 'success' | 'warning' }>`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const SectionHeaderBar = styled.div<{ variant: 'success' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const SectionIconWrapper = styled.div<{ variant: 'success' | 'warning' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: ${({ theme, variant }) =>
    variant === 'success'
      ? `color-mix(in srgb, ${(theme as StyledTheme).colorSuccess} 12%, transparent)`
      : `color-mix(in srgb, ${(theme as StyledTheme).colorWarning} 12%, transparent)`};
  color: ${({ theme, variant }) =>
    variant === 'success'
      ? (theme as StyledTheme).colorSuccess
      : (theme as StyledTheme).colorWarning};
  flex-shrink: 0;
`;

const SectionTitleText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SectionSubtitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: 2px;
`;

const SectionBody = styled.div`
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const StatCard = styled.div`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const StatNumber = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const StatLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const CarrierLogoCircle = styled.div<{ bgColor: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 600;
  flex-shrink: 0;
`;

const CarrierInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const CarrierName = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
`;

const CarrierState = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const GroupIdText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ContactText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AcknowledgmentCard = styled.div`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 2px solid ${({ theme }) => (theme as StyledTheme).colorOutline};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const AcknowledgmentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AcknowledgmentTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const AcknowledgmentBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CheckboxDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const AcknowledgmentFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const SubToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: 2px;
`;

const SubToggleButton = styled.button<{ isActive: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  padding: ${({ theme }) => `${(theme as StyledTheme).space100} ${(theme as StyledTheme).space300}`};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  border: none;
  cursor: pointer;
  background: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorSurfaceBright : 'transparent'};
  color: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorOnSurface : (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  box-shadow: ${({ isActive }) => (isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  transition: all 0.15s ease;
`;

const HelpLink = styled.button`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const GroupIdInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  min-width: 140px;
`;

const EmptyTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${(theme as StyledTheme).space1600} 0`};
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  text-align: center;
`;

const EmptyTabTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const EmptyTabDescription = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  max-width: 400px;
`;

// --- AI Chat Styled Components (matches Rippling AI design) ---

const ChatOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
`;

const ChatPanel = styled.div`
  width: 480px;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
`;

const ChatTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space400}`};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

const ChatTopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ChatTopBarTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ChatTopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatWelcome = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => `0 ${(theme as StyledTheme).space600} ${(theme as StyledTheme).space600}`};
`;

const RipplingStarIcon = styled.div`
  width: 40px;
  height: 40px;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const ChatGreeting = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ChatGreetingSub = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ChatConversation = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  flex: 1;
  overflow-y: auto;
`;

const ChatMessageUser = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} 0`};
`;

const ChatMessageAi = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.65;
`;

const ChatMessageAiLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ChatMessageAiLabelText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  font-weight: 600;
`;

const ChatInputArea = styled.div`
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600} ${(theme as StyledTheme).space600}`};
  flex-shrink: 0;
`;

const ChatInputBox = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:focus-within {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    box-shadow: 0 0 0 1px ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const ChatTextarea = styled.textarea`
  border: none;
  outline: none;
  resize: none;
  width: 100%;
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space400}`};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  background: transparent;
  font-family: inherit;
  min-height: 56px;

  &::placeholder {
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

const ChatInputActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${(theme as StyledTheme).space200} ${(theme as StyledTheme).space300}`};
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => `${(theme as StyledTheme).space100} ${(theme as StyledTheme).space300}`};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const SendButton = styled.button<{ isActive?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1px solid ${({ theme, isActive }) =>
    isActive ? 'transparent' : (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorOnSurface : 'transparent'};
  color: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorSurfaceBright : (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
`;

const ChatStepsList = styled.ol`
  margin: ${({ theme }) => (theme as StyledTheme).space300} 0;
  padding-left: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ChatBold = styled.strong`
  font-weight: 600;
`;

// --- Task List Styled Components ---

const TasksCard = styled.div`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const TasksHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const TasksHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  flex-shrink: 0;
`;

const TasksTitle = styled.div`
  flex: 1;
`;

const TasksTitleText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const TasksSubtitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TasksBody = styled.div`
  padding: 0;
`;

const TaskCarrierGroup = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const TaskCarrierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const TaskCarrierHeaderText = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  flex: 1;
`;

const TaskItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space600} ${(theme as StyledTheme).space300} ${(theme as StyledTheme).space800}`};
  position: relative;
  cursor: default;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  &:hover .task-get-help {
    opacity: 1;
  }
`;

const TaskGetHelp = styled.button`
  opacity: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => `${(theme as StyledTheme).space100} ${(theme as StyledTheme).space300}`};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
  margin-top: 2px;

  &:hover {
    filter: brightness(0.95);
  }
`;

const TaskIconCircle = styled.div<{ variant: 'pending' | 'done' }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ theme, variant }) =>
    variant === 'done'
      ? (theme as StyledTheme).colorSuccess
      : (theme as StyledTheme).colorOutline};
  background: ${({ theme, variant }) =>
    variant === 'done'
      ? (theme as StyledTheme).colorSuccess
      : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: white;
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TaskLabel = styled.div<{ isDone?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme, isDone }) =>
    isDone ? (theme as StyledTheme).colorOnSurfaceVariant : (theme as StyledTheme).colorOnSurface};
  text-decoration: ${({ isDone }) => (isDone ? 'line-through' : 'none')};
`;

const TaskDueDate = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TaskProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const CountBadge = styled.span<{ variant: 'success' | 'warning' | 'neutral' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  padding: 2px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  font-weight: 600;
  background: ${({ theme, variant }) => {
    if (variant === 'success') return `color-mix(in srgb, ${(theme as StyledTheme).colorSuccess} 10%, transparent)`;
    if (variant === 'warning') return `color-mix(in srgb, ${(theme as StyledTheme).colorWarning} 10%, transparent)`;
    return (theme as StyledTheme).colorSurfaceContainerLow;
  }};
  color: ${({ theme, variant }) => {
    if (variant === 'success') return (theme as StyledTheme).colorSuccess;
    if (variant === 'warning') return (theme as StyledTheme).colorWarning;
    return (theme as StyledTheme).colorOnSurfaceVariant;
  }};
`;

// --- Updates section ---

const UpdatesCard = styled.div`
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
`;

const UpdatesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space400} ${(theme as StyledTheme).space600}`};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const UpdatesHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  flex-shrink: 0;
`;

const UpdatesTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const UpdatesSubtitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const UpdatesBody = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const UpdateItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space400}`};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  }
`;

const UpdateItemIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const UpdateItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const UpdateItemTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 535;
  margin-bottom: 2px;
`;

const UpdateItemMeta = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const UpdateItemLink = styled.button`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
  margin-top: ${({ theme }) => (theme as StyledTheme).space100};

  &:hover {
    text-decoration: underline;
  }
`;

// --- Component ---

const IntegrationTabDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'upcoming'>('upcoming');
  const [acknowledgments, setAcknowledgments] = useState<Record<string, boolean>>({});
  const [bannerVisible, setBannerVisible] = useState(true);
  const [groupIdEdits, setGroupIdEdits] = useState<Record<string, string>>({});
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiChatCarrier, setAiChatCarrier] = useState<string>('');

  const automatedCarriers = useMemo(
    () => CARRIERS.filter((c) => c.ediActive),
    [],
  );
  const attentionCarriers = useMemo(
    () => CARRIERS.filter((c) => !c.ediActive),
    [],
  );
  const missingGroupIdCarriers = useMemo(
    () => attentionCarriers.filter((c) => !c.groupId),
    [attentionCarriers],
  );
  const manualCarriers = useMemo(
    () => attentionCarriers.filter((c) => c.transmissionMethod === 'manual' || c.transmissionMethod === 'form'),
    [attentionCarriers],
  );

  const ackKeys = useMemo(() => {
    const keys: string[] = [];
    manualCarriers.forEach((c) => keys.push(`carrier-${c.id}`));
    if (missingGroupIdCarriers.length > 0) keys.push('missing-group-id');
    keys.push('summary-ack');
    return keys;
  }, [manualCarriers, missingGroupIdCarriers]);

  const allAcknowledged = useMemo(
    () => ackKeys.every((key) => acknowledgments[key]),
    [ackKeys, acknowledgments],
  );

  const toggleAck = (key: string) => {
    setAcknowledgments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGroupIdChange = (carrierId: string, value: string) => {
    setGroupIdEdits((prev) => ({ ...prev, [carrierId]: value }));
  };

  const [aiChatContext, setAiChatContext] = useState<string>('');

  const openAiChat = (carrierName: string, taskContext?: string) => {
    setAiChatCarrier(carrierName);
    setAiChatContext(taskContext || '');
    setShowAiChat(true);
  };

  // Task items generated from carrier data
  interface TaskItem {
    id: string;
    carrierId: string;
    label: string;
    dueDate: string;
    isDone: boolean;
  }

  const carrierTasks = useMemo((): Record<string, TaskItem[]> => {
    const tasks: Record<string, TaskItem[]> = {};
    attentionCarriers.forEach((carrier) => {
      const key = `${carrier.name} (${carrier.state})`;
      const items: TaskItem[] = [];

      if (!carrier.groupId && !groupIdEdits[carrier.id]) {
        items.push({
          id: `${carrier.id}-group-id`,
          carrierId: carrier.id,
          label: 'Provide Group ID to enable enrollment transmission',
          dueDate: 'Before plan year starts',
          isDone: false,
        });
      } else if (!carrier.groupId && groupIdEdits[carrier.id]) {
        items.push({
          id: `${carrier.id}-group-id`,
          carrierId: carrier.id,
          label: 'Provide Group ID to enable enrollment transmission',
          dueDate: 'Before plan year starts',
          isDone: true,
        });
      }

      if (carrier.ediEligible && !carrier.ediActive) {
        items.push({
          id: `${carrier.id}-enable-edi`,
          carrierId: carrier.id,
          label: 'Enable EDI/API connection via CarrierConnect',
          dueDate: 'Recommended before Open Enrollment',
          isDone: false,
        });
      }

      if (carrier.transmissionMethod === 'form') {
        items.push({
          id: `${carrier.id}-verify-contact`,
          carrierId: carrier.id,
          label: `Verify form-sending contact: ${carrier.contactEmail || 'Not set'}`,
          dueDate: 'Before enrollment window opens',
          isDone: !!carrier.contactEmail,
        });
        items.push({
          id: `${carrier.id}-submit-oe`,
          carrierId: carrier.id,
          label: 'Submit Open Enrollment files to carrier',
          dueDate: 'During OE window',
          isDone: false,
        });
        items.push({
          id: `${carrier.id}-confirm-receipt`,
          carrierId: carrier.id,
          label: 'Confirm carrier received and processed enrollments',
          dueDate: 'Within 2 weeks of OE close',
          isDone: false,
        });
      }

      if (carrier.transmissionMethod === 'manual') {
        items.push({
          id: `${carrier.id}-submit-enrollments`,
          carrierId: carrier.id,
          label: 'Manually submit all employee enrollments to carrier',
          dueDate: 'During OE window',
          isDone: false,
        });
        items.push({
          id: `${carrier.id}-confirm-coverage`,
          carrierId: carrier.id,
          label: 'Confirm all employees have active coverage',
          dueDate: 'Within 2 weeks of OE close',
          isDone: false,
        });
      }

      if (items.length > 0) tasks[key] = items;
    });
    return tasks;
  }, [attentionCarriers, groupIdEdits]);

  const totalTasks = useMemo(
    () => Object.values(carrierTasks).flat().length,
    [carrierTasks],
  );
  const completedTasks = useMemo(
    () => Object.values(carrierTasks).flat().filter((t) => t.isDone).length,
    [carrierTasks],
  );
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTransmissionStatus = (carrier: Carrier) => {
    if (carrier.ediActive) {
      return <Status appearance={Status.APPEARANCES.SUCCESS} text="EDI Connected" size={Status.SIZES.S} />;
    }
    if (carrier.ediEligible) {
      return <Status appearance={Status.APPEARANCES.PRIMARY} text="EDI Available" size={Status.SIZES.S} />;
    }
    if (carrier.transmissionMethod === 'form') {
      return <Status appearance={Status.APPEARANCES.WARNING} text="Form Sending" size={Status.SIZES.S} />;
    }
    return <Status appearance={Status.APPEARANCES.ERROR} text="Manual" size={Status.SIZES.S} />;
  };

  // --- Navigation ---

  const benefitsSection: NavSectionData = {
    items: [
      { id: 'benefits-overview', label: 'Benefits Overview', icon: Icon.TYPES.DASHBOARD },
      { id: 'my-benefits', label: 'My Benefits', icon: Icon.TYPES.HEART_OUTLINE },
    ],
  };

  const managementSection: NavSectionData = {
    items: [
      { id: 'enrollments', label: 'Enrollments', icon: Icon.TYPES.DOCUMENT_OUTLINE, hasSubmenu: true },
      { id: 'open-enrollment', label: 'Open Enrollment', icon: Icon.TYPES.CALENDAR_OUTLINE },
      { id: 'integrations', label: 'Integrations', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'deductions', label: 'Deductions', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE },
      { id: 'workers-comp', label: "Workers' Comp", icon: Icon.TYPES.SHIELD_OUTLINE },
      { id: 'benefits-settings', label: 'Benefits Settings', icon: Icon.TYPES.SETTINGS_OUTLINE },
    ],
  };

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
      { id: 'company-settings', label: 'Company settings', icon: Icon.TYPES.SETTINGS_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  const pageActions = (
    <HStack gap="0.5rem">
      <SubToggle>
        <SubToggleButton
          isActive={activeSubTab === 'current'}
          onClick={() => setActiveSubTab('current')}
        >
          Current
        </SubToggleButton>
        <SubToggleButton
          isActive={activeSubTab === 'upcoming'}
          onClick={() => setActiveSubTab('upcoming')}
        >
          Upcoming
        </SubToggleButton>
      </SubToggle>
      <Button
        appearance={Button.APPEARANCES.OUTLINE}
        size={Button.SIZES.M}
        icon={{ type: Icon.TYPES.FILTER }}
      >
        Filter
      </Button>
    </HStack>
  );

  return (
    <AppShellLayout
      pageTitle="Integrations"
      pageTabs={['Overview', 'Account structure']}
      defaultActiveTab={0}
      onTabChange={setActiveMainTab}
      pageActions={pageActions}
      mainNavSections={[benefitsSection, managementSection]}
      platformNavSection={platformSection}
      companyName="Walters, Nelson and S..."
      userInitial="W"
      showNotificationBadge
      notificationCount={3}
    >
      {activeMainTab === 1 ? (
        <EmptyTabContainer>
          <Icon type={Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE} size={48} color={theme.colorOnSurfaceVariant} />
          <EmptyTabTitle>Account Structure</EmptyTabTitle>
          <EmptyTabDescription>
            Account structure settings for your carrier integrations will appear here.
          </EmptyTabDescription>
        </EmptyTabContainer>
      ) : (
      <>
      {/* Top Banner */}
      {bannerVisible && (
        <Notice.Warning
          title="Review your carrier integrations before proceeding"
          description="Some carriers require manual enrollment management. Review the transmission method for each carrier below and confirm your responsibilities."
          isCloseable
          onClose={(close) => {
            setBannerVisible(false);
            close();
          }}
        />
      )}

      {/* Summary Stats */}
      <StatsRow>
        <StatCard>
          <StatNumber>{CARRIERS.length}</StatNumber>
          <HStack gap="0.5rem" align="center">
            <StatLabel>Total Carriers</StatLabel>
            <CountBadge variant="neutral">{`Plan Year ${new Date().getFullYear()}`}</CountBadge>
          </HStack>
        </StatCard>
        <StatCard>
          <StatNumber>{automatedCarriers.length}</StatNumber>
          <HStack gap="0.5rem" align="center">
            <StatLabel>Automated</StatLabel>
            <CountBadge variant="success">EDI/API</CountBadge>
          </HStack>
        </StatCard>
        <StatCard>
          <StatNumber>{attentionCarriers.length}</StatNumber>
          <HStack gap="0.5rem" align="center">
            <StatLabel>Need Attention</StatLabel>
            <CountBadge variant="warning">Action Required</CountBadge>
          </HStack>
        </StatCard>
      </StatsRow>

      {/* Section: Automated Connections */}
      <SectionCard variant="success">
        <SectionHeaderBar variant="success">
          <SectionIconWrapper variant="success">
            <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={20} />
          </SectionIconWrapper>
          <div style={{ flex: 1 }}>
            <SectionTitleText>
              Rippling Handles These
              <CountBadge variant="success">{automatedCarriers.length}</CountBadge>
            </SectionTitleText>
            <SectionSubtitle>Active EDI/API connections — no action needed from you.</SectionSubtitle>
          </div>
        </SectionHeaderBar>
        <SectionBody>
          {automatedCarriers.length > 0 ? (
            <TableBasic>
              <TableBasic.THead>
                <TableBasic.Tr>
                  <TableBasic.Th>Carrier</TableBasic.Th>
                  <TableBasic.Th>Enrollment Type</TableBasic.Th>
                  <TableBasic.Th>Connection</TableBasic.Th>
                  <TableBasic.Th>Group ID</TableBasic.Th>
                  <TableBasic.Th>Status</TableBasic.Th>
                </TableBasic.Tr>
              </TableBasic.THead>
              <TableBasic.TBody>
                {automatedCarriers.map((carrier) => (
                  <TableBasic.Tr key={carrier.id}>
                    <TableBasic.Td>
                      <CarrierInfo>
                        <CarrierLogoCircle bgColor={carrier.logoColor}>
                          {carrier.logoInitial}
                        </CarrierLogoCircle>
                        <div>
                          <CarrierName>{carrier.name}</CarrierName>
                          <CarrierState>{carrier.state}</CarrierState>
                        </div>
                      </CarrierInfo>
                    </TableBasic.Td>
                    <TableBasic.Td>{carrier.enrollmentType}</TableBasic.Td>
                    <TableBasic.Td>
                      {getTransmissionStatus(carrier)}
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <GroupIdText>{carrier.groupId}</GroupIdText>
                    </TableBasic.Td>
                    <TableBasic.Td>
                      <Status appearance={Status.APPEARANCES.SUCCESS} text="Connected" size={Status.SIZES.S} />
                    </TableBasic.Td>
                  </TableBasic.Tr>
                ))}
              </TableBasic.TBody>
            </TableBasic>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: theme.space800 }}>
              <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={24} color={theme.colorOnSurfaceVariant} />
              <StatLabel>No carriers with active EDI/API connections.</StatLabel>
            </div>
          )}
        </SectionBody>
      </SectionCard>

      {/* Section: Requires Attention */}
      <SectionCard variant="warning">
        <SectionHeaderBar variant="warning">
          <SectionIconWrapper variant="warning">
            <Icon type={Icon.TYPES.WARNING_TRIANGLE_FILLED} size={20} />
          </SectionIconWrapper>
          <div style={{ flex: 1 }}>
            <SectionTitleText>
              These Need Your Attention
              <CountBadge variant="warning">{attentionCarriers.length}</CountBadge>
            </SectionTitleText>
            <SectionSubtitle>
              These carriers require manual enrollment management or have blockers that need resolution.
            </SectionSubtitle>
          </div>
        </SectionHeaderBar>
        <SectionBody>
          <TableBasic>
            <TableBasic.THead>
              <TableBasic.Tr>
                <TableBasic.Th>Carrier</TableBasic.Th>
                <TableBasic.Th>Enrollment Type</TableBasic.Th>
                <TableBasic.Th>Transmission</TableBasic.Th>
                <TableBasic.Th>Contact</TableBasic.Th>
                <TableBasic.Th>Group ID</TableBasic.Th>
                <TableBasic.Th>Action</TableBasic.Th>
              </TableBasic.Tr>
            </TableBasic.THead>
            <TableBasic.TBody>
              {attentionCarriers.map((carrier) => (
                <TableBasic.Tr key={carrier.id}>
                  <TableBasic.Td>
                    <CarrierInfo>
                      <CarrierLogoCircle bgColor={carrier.logoColor}>
                        {carrier.logoInitial}
                      </CarrierLogoCircle>
                      <div>
                        <CarrierName>{carrier.name}</CarrierName>
                        <CarrierState>{carrier.state}</CarrierState>
                      </div>
                    </CarrierInfo>
                  </TableBasic.Td>
                  <TableBasic.Td>{carrier.enrollmentType}</TableBasic.Td>
                  <TableBasic.Td>
                    {getTransmissionStatus(carrier)}
                  </TableBasic.Td>
                  <TableBasic.Td>
                    {carrier.contactEmail ? (
                      <HStack gap="0.25rem" align="center">
                        <ContactText>{carrier.contactEmail}</ContactText>
                        <Button.Icon
                          icon={Icon.TYPES.EDIT_OUTLINE}
                          size={Button.Icon.SIZES.XS}
                          appearance={Button.Icon.APPEARANCES.GHOST}
                          aria-label={`Edit contact for ${carrier.name}`}
                          onClick={() => {}}
                        />
                      </HStack>
                    ) : (
                      <ContactText>—</ContactText>
                    )}
                  </TableBasic.Td>
                  <TableBasic.Td>
                    {carrier.groupId ? (
                      <GroupIdText>{carrier.groupId}</GroupIdText>
                    ) : groupIdEdits[carrier.id] !== undefined && groupIdEdits[carrier.id] !== '' ? (
                      <GroupIdText>{groupIdEdits[carrier.id]}</GroupIdText>
                    ) : (
                      <GroupIdInputWrapper>
                        <Input.Text
                          id={`group-id-${carrier.id}`}
                          value={groupIdEdits[carrier.id] || ''}
                          onChange={(e: any) => handleGroupIdChange(carrier.id, e?.target?.value ?? e)}
                          placeholder="Enter Group ID"
                          size={Input.Text.SIZES.S}
                        />
                      </GroupIdInputWrapper>
                    )}
                  </TableBasic.Td>
                  <TableBasic.Td>
                    {carrier.ediEligible && !carrier.ediActive ? (
                      <Button
                        appearance={Button.APPEARANCES.PRIMARY}
                        size={Button.SIZES.XS}
                        icon={{ type: Icon.TYPES.THUNDERBOLT_OUTLINE }}
                        onClick={() => {}}
                      >
                        Enable EDI
                      </Button>
                    ) : !carrier.groupId && !groupIdEdits[carrier.id] ? (
                      <HelpLink onClick={() => openAiChat(carrier.name)}>
                        How to get Group ID
                      </HelpLink>
                    ) : null}
                  </TableBasic.Td>
                </TableBasic.Tr>
              ))}
            </TableBasic.TBody>
          </TableBasic>
        </SectionBody>
      </SectionCard>

      {/* Section: Your Tasks */}
      <TasksCard>
        <TasksHeader>
          <TasksHeaderIcon>
            <Icon type={Icon.TYPES.CHECKLIST} size={18} />
          </TasksHeaderIcon>
          <TasksTitle>
            <TasksTitleText>
              Your Tasks
              <CountBadge variant="neutral" style={{ marginLeft: 8 }}>
                {completedTasks}/{totalTasks}
              </CountBadge>
            </TasksTitleText>
            <TasksSubtitle>
              Complete these action items before Open Enrollment begins.
            </TasksSubtitle>
          </TasksTitle>
        </TasksHeader>
        <TasksBody>
          {Object.entries(carrierTasks).map(([carrierKey, tasks]) => {
            const carrier = attentionCarriers.find(
              (c) => `${c.name} (${c.state})` === carrierKey,
            );
            return (
              <TaskCarrierGroup key={carrierKey}>
                <TaskCarrierHeader>
                  {carrier && (
                    <CarrierLogoCircle bgColor={carrier.logoColor}>
                      {carrier.logoInitial}
                    </CarrierLogoCircle>
                  )}
                  <TaskCarrierHeaderText>{carrierKey}</TaskCarrierHeaderText>
                  {getTransmissionStatus(carrier!)}
                </TaskCarrierHeader>
                {tasks.map((task) => (
                  <TaskItemRow key={task.id}>
                    <TaskIconCircle variant={task.isDone ? 'done' : 'pending'}>
                      {task.isDone && <Icon type={Icon.TYPES.CHECK} size={12} />}
                    </TaskIconCircle>
                    <TaskContent>
                      <TaskLabel isDone={task.isDone}>{task.label}</TaskLabel>
                      <TaskDueDate>{task.dueDate}</TaskDueDate>
                    </TaskContent>
                    <TaskGetHelp
                      className="task-get-help"
                      onClick={() => openAiChat(
                        `${carrier?.name} (${carrier?.state})`,
                        task.label,
                      )}
                    >
                      <Icon type={Icon.TYPES.RIPPLING_AI} size={14} />
                      Get help
                    </TaskGetHelp>
                  </TaskItemRow>
                ))}
              </TaskCarrierGroup>
            );
          })}
        </TasksBody>
        <TaskProgressBar>
          <ProgressLabel>{taskProgressPercent}% complete</ProgressLabel>
          <ProgressTrack>
            <ProgressFill percent={taskProgressPercent} />
          </ProgressTrack>
          <ProgressLabel>{completedTasks} of {totalTasks} tasks</ProgressLabel>
        </TaskProgressBar>
      </TasksCard>

      {/* Section: Acknowledgment */}
      <AcknowledgmentCard>
        <AcknowledgmentHeader>
          <Icon type={Icon.TYPES.APPROVE_REJECT_SHIELD_OUTLINE} size={20} color={theme.colorOnSurface} />
          <AcknowledgmentTitle>Acknowledgment Required</AcknowledgmentTitle>
        </AcknowledgmentHeader>
        <AcknowledgmentBody>
          {/* Per-carrier acknowledgments */}
          {manualCarriers.map((carrier, idx) => (
            <React.Fragment key={carrier.id}>
              <Input.Checkbox
                name={`ack-carrier-${carrier.id}`}
                label={
                  <span>
                    I understand that for <strong>{carrier.name} ({carrier.state})</strong>,
                    I am responsible for submitting employee enrollments as no automated
                    connection is active.
                  </span>
                }
                value={!!acknowledgments[`carrier-${carrier.id}`]}
                onChange={() => toggleAck(`carrier-${carrier.id}`)}
              />
              {idx < manualCarriers.length - 1 && <CheckboxDivider />}
            </React.Fragment>
          ))}

          {/* Missing Group ID acknowledgment */}
          {missingGroupIdCarriers.length > 0 && (
            <>
              <CheckboxDivider />
              <Input.Checkbox
                name="ack-missing-group-id"
                label={
                  <span>
                    I understand enrollments for{' '}
                    <strong>
                      {missingGroupIdCarriers.map((c) => `${c.name} (${c.state})`).join(', ')}
                    </strong>{' '}
                    cannot be transmitted until Group IDs are provided.
                  </span>
                }
                value={!!acknowledgments['missing-group-id']}
                onChange={() => toggleAck('missing-group-id')}
              />
            </>
          )}

          {/* Summary acknowledgment */}
          <CheckboxDivider />
          <Input.Checkbox
            name="ack-summary"
            label={
              <span>
                I acknowledge that for all carriers listed above without an active EDI/API
                connection, <strong>I am responsible for submitting and confirming the Open
                Enrollment employee enrollments</strong>, as no automated connection is currently active.
              </span>
            }
            value={!!acknowledgments['summary-ack']}
            onChange={() => toggleAck('summary-ack')}
          />
        </AcknowledgmentBody>
        <AcknowledgmentFooter>
          <Button
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.M}
            icon={{ type: Icon.TYPES.USER_OUTLINE }}
            onClick={() => {}}
          >
            Assign to Admin
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            size={Button.SIZES.M}
            isDisabled={!allAcknowledged}
            onClick={() => {}}
          >
            Confirm & Proceed
          </Button>
        </AcknowledgmentFooter>
      </AcknowledgmentCard>

      {/* Section: Updates for you */}
      <UpdatesCard>
        <UpdatesHeader>
          <UpdatesHeaderIcon>
            <Icon type={Icon.TYPES.MEGAPHONE_OUTLINE} size={18} />
          </UpdatesHeaderIcon>
          <div style={{ flex: 1 }}>
            <UpdatesTitle>Updates for you</UpdatesTitle>
            <UpdatesSubtitle>What Rippling has done recently that’s relevant to your integrations.</UpdatesSubtitle>
          </div>
          <Button
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.S}
            icon={{ type: Icon.TYPES.ARROW_UP_RIGHT }}
            onClick={() => window.open('/integration-updates', '_blank')}
          >
            See all
          </Button>
        </UpdatesHeader>
        <UpdatesBody>
          {UPDATES.map((update) => (
            <UpdateItem key={update.id}>
              <UpdateItemIcon>
                <Icon type={update.icon} size={14} />
              </UpdateItemIcon>
              <UpdateItemContent>
                <UpdateItemTitle>{update.title}</UpdateItemTitle>
                <UpdateItemMeta>{update.meta}</UpdateItemMeta>
                <UpdateItemTitle style={{ fontWeight: 400, marginTop: 4 }}>{update.description}</UpdateItemTitle>
                <UpdateItemLink onClick={() => {}}>{update.linkLabel}</UpdateItemLink>
              </UpdateItemContent>
            </UpdateItem>
          ))}
        </UpdatesBody>
      </UpdatesCard>
      </>
      )}

      {/* Rippling AI Chat Panel */}
      {showAiChat && (
        <ChatOverlay onClick={() => setShowAiChat(false)}>
          <ChatPanel onClick={(e) => e.stopPropagation()}>
            {/* Top bar */}
            <ChatTopBar>
              <ChatTopBarLeft>
                <Button.Icon
                  icon={Icon.TYPES.HAMBURGER}
                  size={Button.Icon.SIZES.XS}
                  appearance={Button.Icon.APPEARANCES.GHOST}
                  aria-label="Menu"
                  onClick={() => {}}
                />
                <ChatTopBarTitle>New chat</ChatTopBarTitle>
              </ChatTopBarLeft>
              <ChatTopBarRight>
                <Button.Icon
                  icon={Icon.TYPES.USERS_OUTLINE}
                  size={Button.Icon.SIZES.XS}
                  appearance={Button.Icon.APPEARANCES.GHOST}
                  aria-label="Share"
                  onClick={() => {}}
                />
                <Button.Icon
                  icon={Icon.TYPES.ADD_CIRCLE_OUTLINE}
                  size={Button.Icon.SIZES.XS}
                  appearance={Button.Icon.APPEARANCES.GHOST}
                  aria-label="New"
                  onClick={() => {}}
                />
                <Button.Icon
                  icon={Icon.TYPES.EXPAND}
                  size={Button.Icon.SIZES.XS}
                  appearance={Button.Icon.APPEARANCES.GHOST}
                  aria-label="Expand"
                  onClick={() => {}}
                />
                <Button.Icon
                  icon={Icon.TYPES.CLOSE}
                  size={Button.Icon.SIZES.XS}
                  appearance={Button.Icon.APPEARANCES.GHOST}
                  aria-label="Close"
                  onClick={() => setShowAiChat(false)}
                />
              </ChatTopBarRight>
            </ChatTopBar>

            {/* Chat body */}
            <ChatBody>
              {aiChatCarrier ? (
                <ChatConversation>
                  <ChatMessageUser>
                    {aiChatContext
                      ? `Help me with: "${aiChatContext}" for ${aiChatCarrier}`
                      : `How do I get a Group ID for ${aiChatCarrier}?`}
                  </ChatMessageUser>
                  <div>
                    <ChatMessageAiLabel>
                      <RipplingStarIcon style={{ width: 16, height: 16 }}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                      </RipplingStarIcon>
                      <ChatMessageAiLabelText>Rippling AI</ChatMessageAiLabelText>
                    </ChatMessageAiLabel>
                    <ChatMessageAi>
                      {aiChatContext?.toLowerCase().includes('group id') ? (
                        <>
                          A <ChatBold>Group ID</ChatBold> (also called a Policy Number or Group Number) is
                          assigned by the carrier when a group benefits plan is set up. Here&apos;s how to get it:
                          <ChatStepsList>
                            <li><ChatBold>Check your carrier welcome packet</ChatBold> — the carrier sends a welcome kit with the Group ID when the plan is first set up.</li>
                            <li><ChatBold>Contact the carrier directly</ChatBold> — call the employer services line and request the Group ID for your company&apos;s plan.</li>
                            <li><ChatBold>Ask your previous broker</ChatBold> — if this is a renewal or transfer, the prior broker should have the Group ID on file.</li>
                            <li><ChatBold>Check the carrier portal</ChatBold> — log in to the employer portal. The Group ID is typically on the dashboard or under Plan Details.</li>
                          </ChatStepsList>
                          Once you have the Group ID, enter it in the field on the Integrations page.
                          Enrollments <ChatBold>cannot be transmitted</ChatBold> until a valid Group ID is provided.
                        </>
                      ) : aiChatContext?.toLowerCase().includes('edi') ? (
                        <>
                          To <ChatBold>enable EDI/API</ChatBold> for {aiChatCarrier}, follow these steps:
                          <ChatStepsList>
                            <li><ChatBold>Click &quot;Enable EDI&quot;</ChatBold> on the carrier row in the Integrations tab — this initiates a CarrierConnect setup request.</li>
                            <li><ChatBold>Verify your Group ID</ChatBold> — an active Group ID is required before the EDI connection can be established.</li>
                            <li><ChatBold>Allow 5-10 business days</ChatBold> — the carrier needs to activate the electronic connection on their end.</li>
                            <li><ChatBold>Monitor the status</ChatBold> — once active, the carrier will move to the &quot;Rippling Handles These&quot; section automatically.</li>
                          </ChatStepsList>
                          Once EDI is active, Rippling will transmit enrollments automatically — no manual file submission required.
                        </>
                      ) : aiChatContext?.toLowerCase().includes('verify') || aiChatContext?.toLowerCase().includes('contact') ? (
                        <>
                          To <ChatBold>verify your form-sending contact</ChatBold> for {aiChatCarrier}:
                          <ChatStepsList>
                            <li><ChatBold>Check the Contact column</ChatBold> — confirm the email/fax listed is the correct recipient at the carrier for enrollment forms.</li>
                            <li><ChatBold>Click the edit icon</ChatBold> to update the contact if it&apos;s incorrect or outdated.</li>
                            <li><ChatBold>Confirm with your agency</ChatBold> — ensure the contact aligns with your agency&apos;s preferred submission contacts.</li>
                            <li><ChatBold>Send a test</ChatBold> — consider sending a test form to verify the contact is active and receiving submissions.</li>
                          </ChatStepsList>
                          Rippling will send enrollment forms to this contact. If the contact is wrong, enrollments will not reach the carrier.
                        </>
                      ) : aiChatContext?.toLowerCase().includes('submit') || aiChatContext?.toLowerCase().includes('enrollment') ? (
                        <>
                          To <ChatBold>submit enrollments</ChatBold> for {aiChatCarrier}:
                          <ChatStepsList>
                            <li><ChatBold>Download the enrollment file</ChatBold> — go to Enrollments &gt; Export to generate the enrollment data for this carrier.</li>
                            <li><ChatBold>Format per carrier requirements</ChatBold> — each carrier may require a specific file format (Excel, CSV, or their own template).</li>
                            <li><ChatBold>Submit via the carrier&apos;s portal or email</ChatBold> — upload the file to the carrier&apos;s employer portal or email it to the designated contact.</li>
                            <li><ChatBold>Confirm receipt</ChatBold> — follow up with the carrier within 3-5 business days to confirm they received and processed the enrollments.</li>
                          </ChatStepsList>
                          <ChatBold>Important:</ChatBold> Since this carrier has no automated connection, you are responsible for ensuring all employee enrollments are submitted and confirmed before coverage begins.
                        </>
                      ) : aiChatContext?.toLowerCase().includes('confirm') || aiChatContext?.toLowerCase().includes('coverage') ? (
                        <>
                          To <ChatBold>confirm coverage</ChatBold> for {aiChatCarrier}:
                          <ChatStepsList>
                            <li><ChatBold>Contact the carrier</ChatBold> — reach out to your carrier rep or employer services within 2 weeks of OE close.</li>
                            <li><ChatBold>Request an enrollment confirmation report</ChatBold> — ask for a list of all employees the carrier has on file for the new plan year.</li>
                            <li><ChatBold>Cross-reference with Rippling</ChatBold> — compare the carrier&apos;s list against the enrollment data in Rippling to identify any gaps.</li>
                            <li><ChatBold>Resolve discrepancies immediately</ChatBold> — submit any missing enrollments before the plan year effective date.</li>
                          </ChatStepsList>
                          Employees without confirmed coverage may face gaps in benefits. Act promptly to avoid disruptions.
                        </>
                      ) : (
                        <>
                          Here&apos;s how I can help with <ChatBold>{aiChatContext}</ChatBold> for {aiChatCarrier}:
                          <ChatStepsList>
                            <li>Check the <ChatBold>Integrations</ChatBold> tab for the current status of this carrier.</li>
                            <li>Review the <ChatBold>Your Tasks</ChatBold> section for all pending action items.</li>
                            <li>Visit the <ChatBold>Help Center</ChatBold> for detailed carrier-specific guides.</li>
                            <li>Contact your <ChatBold>Partner Success Manager</ChatBold> if you need hands-on assistance.</li>
                          </ChatStepsList>
                          Is there something specific about this task I can help clarify?
                        </>
                      )}
                    </ChatMessageAi>
                  </div>
                </ChatConversation>
              ) : (
                <ChatWelcome>
                  <RipplingStarIcon>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </RipplingStarIcon>
                  <ChatGreeting>Hi Nitish,</ChatGreeting>
                  <ChatGreetingSub>What do you need help with?</ChatGreetingSub>
                </ChatWelcome>
              )}
            </ChatBody>

            {/* Input area */}
            <ChatInputArea>
              <ChatInputBox>
                <ChatTextarea
                  placeholder="Ask anything"
                  rows={2}
                />
                <ChatInputActions>
                  <UploadButton>
                    <Icon type={Icon.TYPES.UPLOAD} size={14} />
                    Upload
                  </UploadButton>
                  <SendButton>
                    <Icon type={Icon.TYPES.ARROW_UP} size={16} />
                  </SendButton>
                </ChatInputActions>
              </ChatInputBox>
            </ChatInputArea>
          </ChatPanel>
        </ChatOverlay>
      )}
    </AppShellLayout>
  );
};

export default IntegrationTabDemo;
