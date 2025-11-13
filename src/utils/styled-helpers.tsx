/**
 * Shared Styled Components Utilities
 *
 * Provides reusable base styled components to reduce repetition and enforce DRY principles.
 * These components handle common patterns like flex layouts, typography, surfaces, etc.
 *
 * Usage:
 * ```typescript
 * import { FlexRow, Heading, SurfaceCard, t } from '@/utils/styled-helpers';
 *
 * const MyComponent = styled(FlexRow)`
 *   // Additional styles here
 * `;
 *
 * const MyCard = styled(SurfaceCard)`
 *   // Override or extend base styles
 * `;
 * ```
 */

import styled from '@emotion/styled';
import { t } from './theme';

/**
 * Re-export t() helper for convenience
 * @see ./theme.ts for t() function documentation
 */
export { t };

/**
 * Base flex row container with common defaults
 *
 * Props:
 * - gap?: string - Override default gap (defaults to space200)
 * - alignItems?: string - Override default alignment (defaults to 'center')
 * - justifyContent?: string - Override justify-content
 */
export const FlexRow = styled.div<{ gap?: string; alignItems?: string; justifyContent?: string }>`
  display: flex;
  align-items: ${({ alignItems = 'center' }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  gap: ${({ gap, theme }) => gap || t(theme).space200};
`;

/**
 * Base flex column container with common defaults
 *
 * Props:
 * - gap?: string - Override default gap (defaults to space200)
 */
export const FlexColumn = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap, theme }) => gap || t(theme).space200};
`;

/**
 * Base surface card component with common styling
 *
 * Props:
 * - padding?: string - Override default padding (defaults to space400)
 * - borderRadius?: string - Override default border radius (defaults to shapeCorner2xl)
 */
export const SurfaceCard = styled.div<{ padding?: string; borderRadius?: string }>`
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ borderRadius, theme }) => borderRadius || t(theme).shapeCorner2xl};
  padding: ${({ padding, theme }) => padding || t(theme).space400};
`;

/**
 * Base heading component with variant support
 *
 * Props:
 * - variant?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'labelLarge'
 */
export const Heading = styled.h1<{
  variant?: 'display' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'labelLarge';
}>`
  ${({ variant = 'display', theme }) => {
    const styles: Record<string, string> = {
      display: t(theme).typestyleV2DisplaySmall,
      titleLarge: t(theme).typestyleV2TitleLarge,
      titleMedium: t(theme).typestyleV2TitleMedium,
      titleSmall: t(theme).typestyleV2TitleSmall,
      labelLarge: t(theme).typestyleV2LabelLarge,
    };
    return styles[variant];
  }};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;

/**
 * Base body text component
 */
export const BodyText = styled.span`
  ${({ theme }) => t(theme).typestyleV2BodyMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
`;

/**
 * Base label text component (for form labels, etc.)
 */
export const LabelText = styled.label`
  ${({ theme }) => t(theme).typestyleV2LabelMedium};
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};
`;

/**
 * Base icon button component
 *
 * Props:
 * - disabled?: boolean
 */
export const IconButtonBase = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => t(theme).space200};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled, theme }) =>
    disabled ? t(theme).colorOnSurfaceVariant : t(theme).colorOnSurface};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ disabled, theme }) =>
      disabled ? 'transparent' : t(theme).colorSurfaceContainerLow};
    border-radius: ${({ theme }) => t(theme).shapeCornerSm};
  }
`;

/**
 * Base drag handle component
 */
export const DragHandleBase = styled.div`
  display: flex;
  align-items: center;
  cursor: grab;
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};

  &:active {
    cursor: grabbing;
  }
`;
