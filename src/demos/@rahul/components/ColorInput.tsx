import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

/**
 * ColorInput Component
 * 
 * Custom color input component for theme editor.
 * Displays a color picker with label and hex value display.
 */

interface ColorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const Label = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    opacity: 0.9;
  }
`;

const ColorPickerInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const HexValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-transform: uppercase;
  font-family: monospace;
`;

export const ColorInput: React.FC<ColorInputProps> = ({ id, label, value, onChange }) => {
  return (
    <ColorInputContainer>
      <Label htmlFor={id}>{label}</Label>
      <InputWrapper>
        <ColorSwatch color={value}>
          <ColorPickerInput
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </ColorSwatch>
        <HexValue>{value}</HexValue>
      </InputWrapper>
    </ColorInputContainer>
  );
};

