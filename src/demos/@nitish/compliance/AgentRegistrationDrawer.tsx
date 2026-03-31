import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Drawer from '@rippling/pebble/Drawer';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';
import Input from '@rippling/pebble/Inputs';

type Stage = 'briefing' | 'collect' | 'review' | 'waiting';

/* ═══════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════ */

const PRE_FILLED_FIELDS = [
  { label: 'Legal entity name', value: 'Acme Corporation' },
  { label: 'Federal EIN', value: '47-2814593' },
  { label: 'Entity type', value: 'C Corporation' },
  { label: 'State of formation', value: 'Delaware' },
  { label: 'Formation date', value: 'March 15, 2019' },
  { label: 'Texas business address', value: '1200 Congress Ave, Austin TX 78701' },
  { label: 'Principal office address', value: '555 Market St, San Francisco CA 94105' },
  { label: 'Date first TX wages paid', value: 'February 1, 2026' },
  { label: 'Employees in Texas', value: '3' },
  { label: 'Business type (NAICS)', value: '5415 – Computer Systems Design' },
  { label: 'Contact email', value: 'hr@acmecorp.com' },
];

const OFFICERS = [
  { id: 'jennifer', name: 'Jennifer Walsh', title: 'Chief Executive Officer' },
  { id: 'marcus', name: 'Marcus Rivera', title: 'Chief Financial Officer' },
  { id: 'sarah', name: 'Sarah Chen', title: 'VP of Human Resources' },
];


const TIMELINE_STEPS = [
  { label: 'Submitted to TWC', detail: 'Feb 25, 2026 at 2:34 PM', status: 'done' as const },
  { label: 'Under review by TWC', detail: 'Typically 1–2 business days', status: 'active' as const },
  { label: 'Account number issued', detail: 'Expected by Mar 5, 2026', status: 'upcoming' as const },
  { label: 'Active in Rippling', detail: 'Automatic after account received', status: 'upcoming' as const },
];

const STAGE_LABELS: Record<Stage, { step: number; label: string }> = {
  briefing: { step: 1, label: "Review what's ready" },
  collect: { step: 2, label: 'Confirm 2 things' },
  review: { step: 3, label: 'Review & authorize' },
  waiting: { step: 4, label: 'Submitted' },
};

/* ═══════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════ */

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  flex-shrink: 0;
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

/* ═══════════════════════════════════════════════════════
   PROGRESS INDICATOR
   ═══════════════════════════════════════════════════════ */

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ProgressStep = styled.div<{ active: boolean; done: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  font-weight: 600;
  background-color: ${({ active, done, theme }) => {
    const t = theme as StyledTheme;
    if (done) return t.colorSuccess;
    if (active) return t.colorPrimary;
    return t.colorSurfaceContainerHigh;
  }};
  color: ${({ active, done, theme }) => {
    const t = theme as StyledTheme;
    if (done || active) return t.colorOnPrimary;
    return t.colorOnSurfaceVariant;
  }};
`;

const ProgressConnector = styled.div<{ done: boolean }>`
  flex: 1;
  height: 1px;
  background-color: ${({ done, theme }) =>
    done ? (theme as StyledTheme).colorSuccess : (theme as StyledTheme).colorOutlineVariant};
`;

const ProgressLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

/* ═══════════════════════════════════════════════════════
   TASK HEADER CARD
   ═══════════════════════════════════════════════════════ */

const TaskCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TaskName = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-wrap: wrap;
`;

const TaskMetaItem = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const TaskMetaDot = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOutline};
`;

/* ═══════════════════════════════════════════════════════
   AGENT MESSAGE
   ═══════════════════════════════════════════════════════ */

const AgentMessage = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  align-items: flex-start;
`;

const AgentIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const AgentTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const AgentLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AgentText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  line-height: 1.6;
`;

/* ═══════════════════════════════════════════════════════
   PRE-FILLED SECTION (Stage 1)
   ═══════════════════════════════════════════════════════ */

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const SectionTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const FieldsCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  gap: ${({ theme }) => (theme as StyledTheme).space300};

  &:last-child {
    border-bottom: none;
  }
`;

const FieldCheckIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccessContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FieldLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  width: 175px;
  flex-shrink: 0;
`;

const FieldValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

/* ═══════════════════════════════════════════════════════
   NEEDED SECTION (Stage 1)
   ═══════════════════════════════════════════════════════ */

const NeededCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorWarning};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const NeededRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:last-child {
    border-bottom: none;
  }
`;

const NeededLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const NeededSubLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════════════
   COLLECT STAGE (Stage 2)
   ═══════════════════════════════════════════════════════ */


const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const QuestionLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const QuestionNote = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.5;
`;

const OfficerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const OfficerCard = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 1.5px solid ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimaryContainer : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    border-color: ${({ selected, theme }) =>
      selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
    background-color: ${({ selected, theme }) =>
      selected ? (theme as StyledTheme).colorPrimaryContainer : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const RadioIndicator = styled.div<{ selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  background-color: ${({ selected, theme }) =>
    selected ? (theme as StyledTheme).colorPrimary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;

  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
    background-color: ${({ theme }) => (theme as StyledTheme).colorOnPrimary};
    opacity: ${({ selected }) => (selected ? 1 : 0)};
  }
`;

const OfficerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OfficerName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const OfficerTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ToggleRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border: 1.5px solid ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimaryContainer : (theme as StyledTheme).colorSurfaceBright};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ active, theme }) =>
    active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurface};
  font-weight: ${({ active }) => (active ? 600 : 400)};
  cursor: pointer;
  transition: all 120ms ease;
  text-align: center;

  &:hover {
    border-color: ${({ active, theme }) =>
      active ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOutline};
  }
`;

const InputWrapper = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

/* ═══════════════════════════════════════════════════════
   REVIEW STAGE (Stage 3)
   ═══════════════════════════════════════════════════════ */

const ReviewHeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ReviewTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const ReviewSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
`;

const ReviewSectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ReviewSectionTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ReviewFieldsCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const ReviewFieldRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  gap: ${({ theme }) => (theme as StyledTheme).space300};

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewFieldLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  width: 170px;
  flex-shrink: 0;
`;

const ReviewFieldValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  flex: 1;
`;

const SourceChip = styled.span<{ variant: 'rippling' | 'user' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  padding: 1px 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  white-space: nowrap;
  flex-shrink: 0;
  background-color: ${({ variant, theme }) =>
    variant === 'rippling'
      ? (theme as StyledTheme).colorPrimaryContainer
      : (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ variant, theme }) =>
    variant === 'rippling'
      ? (theme as StyledTheme).colorOnPrimaryContainer
      : (theme as StyledTheme).colorOnSurfaceVariant};
`;

const AuthNote = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

/* ═══════════════════════════════════════════════════════
   WAITING STAGE (Stage 4)
   ═══════════════════════════════════════════════════════ */

const SuccessHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccessContainer};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorSuccess};
  text-align: center;
`;

const SuccessIconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  margin: 0;
  font-weight: 600;
`;

const SuccessTimestamp = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  opacity: 0.8;
`;

const TimelineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const TimelineRow = styled.div<{ status: 'done' | 'active' | 'upcoming' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ status, theme }) => {
    const t = theme as StyledTheme;
    if (status === 'active') return t.colorSurfaceContainerLow;
    return t.colorSurfaceBright;
  }};
  opacity: ${({ status }) => (status === 'upcoming' ? 0.6 : 1)};

  &:last-child {
    border-bottom: none;
  }
`;

const TimelineIcon = styled.div<{ status: 'done' | 'active' | 'upcoming' }>`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ status, theme }) => {
    const t = theme as StyledTheme;
    if (status === 'done') return t.colorSuccess;
    if (status === 'active') return t.colorPrimary;
    return t.colorSurfaceContainerHigh;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TimelineText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const TimelineLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const TimelineDetail = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const WhatNextCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space500};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const WhatNextTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const WhatNextText = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.6;
`;

const ConfirmationCode = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-top: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ConfirmationLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ConfirmationValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

/* ═══════════════════════════════════════════════════════
   LINK BUTTON
   ═══════════════════════════════════════════════════════ */

const LinkButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  border: none;
  background: none;
  padding: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/* ═══════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════ */

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

interface AgentRegistrationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const AgentRegistrationDrawer: React.FC<AgentRegistrationDrawerProps> = ({
  open,
  onClose,
}) => {
  const [stage, setStage] = useState<Stage>('briefing');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('jennifer');
  const [hasPriorAccount, setHasPriorAccount] = useState<boolean>(false);
  const [priorAccountNumber, setPriorAccountNumber] = useState('');

  function handleClose() {
    setStage('briefing');
    setSelectedOfficer('jennifer');
    setHasPriorAccount(false);
    setPriorAccountNumber('');
    onClose();
  }

  const stageIndex = { briefing: 0, collect: 1, review: 2, waiting: 3 };
  const currentIndex = stageIndex[stage];

  const selectedOfficerObj = OFFICERS.find(o => o.id === selectedOfficer)!;

  const REVIEW_SECTIONS_DYNAMIC = [
    {
      title: 'Company Information',
      fields: [
        { label: 'Legal entity name', value: 'Acme Corporation', source: 'Rippling' as const },
        { label: 'Federal EIN', value: '47-2814593', source: 'Rippling' as const },
        { label: 'Entity type', value: 'C Corporation', source: 'Rippling' as const },
        { label: 'State of formation', value: 'Delaware', source: 'Rippling' as const },
        { label: 'Formation date', value: 'March 15, 2019', source: 'Rippling' as const },
      ],
    },
    {
      title: 'Texas Operations',
      fields: [
        { label: 'Texas business address', value: '1200 Congress Ave, Austin TX 78701', source: 'Rippling' as const },
        { label: 'Date first TX wages paid', value: 'February 1, 2026', source: 'Rippling' as const },
        { label: 'Employees in Texas', value: '3', source: 'Rippling' as const },
        { label: 'Business type', value: 'Computer Systems Design (NAICS 5415)', source: 'Rippling' as const },
      ],
    },
    {
      title: 'Filing Authorization',
      fields: [
        {
          label: 'Prior TX account',
          value: hasPriorAccount ? priorAccountNumber || '—' : 'None – first registration',
          source: 'You confirmed' as const,
        },
        {
          label: 'Authorized signer',
          value: `${selectedOfficerObj.name}, ${selectedOfficerObj.title.split(' ').slice(-1)[0]}`,
          source: 'You selected' as const,
        },
        { label: 'Contact email', value: 'hr@acmecorp.com', source: 'Rippling' as const },
        { label: 'Principal office address', value: '555 Market St, San Francisco CA 94105', source: 'Rippling' as const },
      ],
    },
  ];

  return (
    <Drawer
      isVisible={open}
      onCancel={handleClose}
      title="Compliance Agent"
      width={560}
      isCompact
    >
      <DrawerBody>
        <Content>
          {/* ── Progress indicator ── */}
          <ProgressRow>
            {[1, 2, 3, 4].map((n, i) => (
              <React.Fragment key={n}>
                <ProgressStep active={currentIndex === i} done={currentIndex > i}>
                  {currentIndex > i ? (
                    <Icon type={Icon.TYPES.CHECK} size={10} color="white" />
                  ) : (
                    n
                  )}
                </ProgressStep>
                {i < 3 && <ProgressConnector done={currentIndex > i} />}
              </React.Fragment>
            ))}
            <ProgressLabel>
              Step {currentIndex + 1} of 4 — {STAGE_LABELS[stage].label}
            </ProgressLabel>
          </ProgressRow>

          {/* ── Task header card ── */}
          <TaskCard>
            <TaskName>Texas Withholding Registration</TaskName>
            <TaskMeta>
              <TaskMetaItem>
                <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={12} />
                Form C-1
              </TaskMetaItem>
              <TaskMetaDot>·</TaskMetaDot>
              <TaskMetaItem>Texas Workforce Commission</TaskMetaItem>
              <TaskMetaDot>·</TaskMetaDot>
              <TaskMetaItem style={{ color: 'rgb(183,28,28)' }}>
                <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={12} />
                Due Feb 28, 2026
              </TaskMetaItem>
            </TaskMeta>
          </TaskCard>

          {/* ══════════════════════════════════════════════
              STAGE 1: BRIEFING
          ══════════════════════════════════════════════ */}
          {stage === 'briefing' && (
            <>
              <AgentMessage>
                <AgentIconWrapper>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={16} color="var(--color-primary, #1a73e8)" />
                </AgentIconWrapper>
                <AgentTextBlock>
                  <AgentLabel>Rippling AI</AgentLabel>
                  <AgentText>
                    I've reviewed your company profile and can pre-fill <strong>11 of 13 required fields</strong> on Form C-1. This cuts a 30-minute task down to a 2-minute review — I just need 2 quick things from you before I prepare the submission.
                  </AgentText>
                </AgentTextBlock>
              </AgentMessage>

              <Divider />

              <SectionBlock>
                <SectionHeader>
                  <Icon type={Icon.TYPES.CHECK_CIRCLE_OUTLINE} size={16} color="rgb(46,125,50)" />
                  <SectionTitle>Pre-filled from your Rippling profile</SectionTitle>
                  <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.SUCCESS}>
                    11 fields
                  </Label>
                </SectionHeader>
                <FieldsCard>
                  {PRE_FILLED_FIELDS.map((field, i) => (
                    <FieldRow key={i}>
                      <FieldCheckIcon>
                        <Icon type={Icon.TYPES.CHECK} size={9} color="rgb(46,125,50)" />
                      </FieldCheckIcon>
                      <FieldLabel>{field.label}</FieldLabel>
                      <FieldValue>{field.value}</FieldValue>
                    </FieldRow>
                  ))}
                </FieldsCard>
              </SectionBlock>

              <SectionBlock>
                <SectionHeader>
                  <Icon type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE} size={16} color="rgb(245,124,0)" />
                  <SectionTitle>Still needed from you</SectionTitle>
                  <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.WARNING}>
                    2 things
                  </Label>
                </SectionHeader>
                <NeededCard>
                  <NeededRow>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <Icon type={Icon.TYPES.USER_OUTLINE} size={14} color="rgb(245,124,0)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <NeededLabel>Authorized signer for this filing</NeededLabel>
                      <NeededSubLabel>
                        TWC requires a named officer to certify the application
                      </NeededSubLabel>
                    </div>
                  </NeededRow>
                  <NeededRow>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={14} color="rgb(245,124,0)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <NeededLabel>Prior Texas employer account (if any)</NeededLabel>
                      <NeededSubLabel>
                        Required if this company has previously registered with TWC
                      </NeededSubLabel>
                    </div>
                  </NeededRow>
                </NeededCard>
              </SectionBlock>
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 2: COLLECT
          ══════════════════════════════════════════════ */}
          {stage === 'collect' && (
            <>
              <AgentMessage>
                <AgentIconWrapper>
                  <Icon type={Icon.TYPES.RIPPLING_AI} size={16} color="var(--color-primary, #1a73e8)" />
                </AgentIconWrapper>
                <AgentTextBlock>
                  <AgentLabel>Rippling AI</AgentLabel>
                  <AgentText>
                    Just two quick things before I prepare the submission.
                  </AgentText>
                </AgentTextBlock>
              </AgentMessage>

              <Divider />

              <QuestionBlock>
                <QuestionLabel>1. Who will authorize this filing?</QuestionLabel>
                <QuestionNote>
                  The authorized signer certifies that all information is accurate under penalty of perjury. This is required by the Texas Workforce Commission.
                </QuestionNote>
                <OfficerOptions>
                  {OFFICERS.map(officer => (
                    <OfficerCard
                      key={officer.id}
                      selected={selectedOfficer === officer.id}
                      onClick={() => setSelectedOfficer(officer.id)}
                    >
                      <RadioIndicator selected={selectedOfficer === officer.id} />
                      <OfficerInfo>
                        <OfficerName>{officer.name}</OfficerName>
                        <OfficerTitle>{officer.title}</OfficerTitle>
                      </OfficerInfo>
                    </OfficerCard>
                  ))}
                </OfficerOptions>
              </QuestionBlock>

              <Divider />

              <QuestionBlock>
                <QuestionLabel>
                  2. Has Acme Corporation previously registered as a Texas employer?
                </QuestionLabel>
                <QuestionNote>
                  If you have a prior TWC account number, TWC will link it to this registration.
                </QuestionNote>
                <ToggleRow>
                  <ToggleButton
                    active={hasPriorAccount}
                    onClick={() => setHasPriorAccount(true)}
                  >
                    Yes, we have a prior account
                  </ToggleButton>
                  <ToggleButton
                    active={!hasPriorAccount}
                    onClick={() => setHasPriorAccount(false)}
                  >
                    No, this is our first time
                  </ToggleButton>
                </ToggleRow>

                {hasPriorAccount && (
                  <InputWrapper>
                    <Input.Text
                      id="prior-account-number"
                      size={Input.Text.SIZES.M}
                      placeholder="Enter prior TWC account number"
                      value={priorAccountNumber}
                      onChange={(e: any) => setPriorAccountNumber(e?.target?.value ?? e)}
                    />
                  </InputWrapper>
                )}
              </QuestionBlock>
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 3: REVIEW
          ══════════════════════════════════════════════ */}
          {stage === 'review' && (
            <>
              <ReviewHeaderBlock>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ReviewTitle>Review & Authorize</ReviewTitle>
                  <Label size={Label.SIZES.S} appearance={Label.APPEARANCES.SUCCESS}>
                    Ready to submit
                  </Label>
                </div>
                <ReviewSubtitle>
                  Below is exactly what will be submitted to the Texas Workforce Commission (Form C-1). Review each section, then authorize to proceed.
                </ReviewSubtitle>
              </ReviewHeaderBlock>

              <Divider />

              {REVIEW_SECTIONS_DYNAMIC.map(section => (
                <ReviewSectionBlock key={section.title}>
                  <ReviewSectionTitle>{section.title}</ReviewSectionTitle>
                  <ReviewFieldsCard>
                    {section.fields.map((field, i) => (
                      <ReviewFieldRow key={i}>
                        <ReviewFieldLabel>{field.label}</ReviewFieldLabel>
                        <ReviewFieldValue>{field.value}</ReviewFieldValue>
                        <SourceChip variant={field.source === 'Rippling' ? 'rippling' : 'user'}>
                          {field.source}
                        </SourceChip>
                      </ReviewFieldRow>
                    ))}
                  </ReviewFieldsCard>
                </ReviewSectionBlock>
              ))}

              <AuthNote>
                By clicking "Authorize & Submit," {selectedOfficerObj.name} certifies that the
                information above is accurate and complete to the best of their knowledge.
              </AuthNote>
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 4: WAITING
          ══════════════════════════════════════════════ */}
          {stage === 'waiting' && (
            <>
              <SuccessHeader>
                <SuccessIconCircle>
                  <Icon type={Icon.TYPES.CHECK} size={24} color="white" />
                </SuccessIconCircle>
                <SuccessTitle>Submitted to Texas Workforce Commission</SuccessTitle>
                <SuccessTimestamp>Feb 25, 2026 at 2:34 PM · Form C-1</SuccessTimestamp>
              </SuccessHeader>

              <SectionBlock>
                <SectionTitle>What's happening</SectionTitle>
                <TimelineBlock>
                  {TIMELINE_STEPS.map((step, i) => (
                    <TimelineRow key={i} status={step.status}>
                      <TimelineIcon status={step.status}>
                        {step.status === 'done' && (
                          <Icon type={Icon.TYPES.CHECK} size={14} color="white" />
                        )}
                        {step.status === 'active' && (
                          <Icon type={Icon.TYPES.REFRESH_OUTLINE} size={14} color="white" />
                        )}
                        {step.status === 'upcoming' && (
                          <Icon type={Icon.TYPES.INFO_CIRCLE_OUTLINE} size={14} color="rgb(150,150,150)" />
                        )}
                      </TimelineIcon>
                      <TimelineText>
                        <TimelineLabel>{step.label}</TimelineLabel>
                        <TimelineDetail>{step.detail}</TimelineDetail>
                      </TimelineText>
                    </TimelineRow>
                  ))}
                </TimelineBlock>
              </SectionBlock>

              <WhatNextCard>
                <WhatNextTitle>What happens next</WhatNextTitle>
                <WhatNextText>
                  The Texas Workforce Commission will review your application and issue your employer account number within 5–7 business days. Rippling will automatically configure your Texas withholding once the account number is received — no action needed on your end.
                </WhatNextText>
                <ConfirmationCode>
                  <ConfirmationLabel>Confirmation:</ConfirmationLabel>
                  <ConfirmationValue>TWC-2026-02-AC9877</ConfirmationValue>
                </ConfirmationCode>
              </WhatNextCard>
            </>
          )}
        </Content>

        {/* ── Footer ── */}
        <Footer>
          {stage === 'briefing' && (
            <>
              <Button
                appearance={Button.APPEARANCES.GHOST}
                size={Button.SIZES.S}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button size={Button.SIZES.S} onClick={() => setStage('collect')}>
                Continue
                <Icon type={Icon.TYPES.ARROW_RIGHT} size={14} />
              </Button>
            </>
          )}

          {stage === 'collect' && (
            <>
              <Button
                appearance={Button.APPEARANCES.GHOST}
                size={Button.SIZES.S}
                onClick={() => setStage('briefing')}
              >
                <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
                Back
              </Button>
              <Button size={Button.SIZES.S} onClick={() => setStage('review')}>
                Prepare Submission
                <Icon type={Icon.TYPES.ARROW_RIGHT} size={14} />
              </Button>
            </>
          )}

          {stage === 'review' && (
            <>
              <FooterRight>
                <Button
                  appearance={Button.APPEARANCES.GHOST}
                  size={Button.SIZES.S}
                  onClick={() => setStage('collect')}
                >
                  <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
                  Back
                </Button>
                <LinkButton onClick={() => window.open('https://twc.texas.gov', '_blank')}>
                  Open in TWC Portal
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} />
                </LinkButton>
              </FooterRight>
              <Button size={Button.SIZES.S} onClick={() => setStage('waiting')}>
                Authorize & Submit
              </Button>
            </>
          )}

          {stage === 'waiting' && (
            <>
              <LinkButton onClick={() => window.open('https://twc.texas.gov', '_blank')}>
                Check TWC status
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} />
              </LinkButton>
              <Button size={Button.SIZES.S} onClick={handleClose}>
                Done
              </Button>
            </>
          )}
        </Footer>
      </DrawerBody>
    </Drawer>
  );
};
