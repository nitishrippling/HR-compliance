import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

export type StatusFilterValue = 'active' | 'all' | 'completed';

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  overflow: hidden;
`;

const FilterPill = styled.button<{ isActive: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  padding: 4px ${({ theme }) => (theme as StyledTheme).space400};
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
  white-space: nowrap;

  background-color: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorPrimary : 'transparent'};
  color: ${({ isActive, theme }) =>
    isActive ? (theme as StyledTheme).colorOnPrimary : (theme as StyledTheme).colorOnSurfaceVariant};

  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorSurfaceContainerLow};
  }

  & + & {
    border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (v: StatusFilterValue) => void;
}

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
];

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <FilterGroup>
      {OPTIONS.map(opt => (
        <FilterPill
          key={opt.value}
          isActive={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </FilterPill>
      ))}
    </FilterGroup>
  );
};
