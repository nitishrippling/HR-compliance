import React, { ReactNode, createContext, useContext } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import Color from 'colorjs.io';

// Context for logo data
interface LogoContextData {
  lightLogo?: string;
  darkLogo?: string;
  lightLogoBackground?: string;
  darkLogoBackground?: string;
}

const LogoContext = createContext<LogoContextData>({});

export const useLogoContext = () => useContext(LogoContext);

/**
 * PreviewThemeContext
 * 
 * OKLCH-based color system using Pebble Berry theme lightness values.
 * Maintains professional lightness relationships while allowing custom hues.
 * 
 * Process:
 * 1. User provides RGB color
 * 2. Convert to OKLCH to extract Chroma (C) and Hue (H)
 * 3. Apply Berry theme Lightness (L) values to maintain professional brightness
 * 4. Generate full Material Design 3 palette (base, container, variant)
 * 5. Calculate accessible "on" colors (black/white) for each surface
 */

export interface PreviewTheme {
  // Primary colors
  colorPrimary: string;
  colorOnPrimary: string;
  colorPrimaryContainer: string;
  colorOnPrimaryContainer: string;
  colorPrimaryVariant: string;
  colorOnPrimaryVariant: string;
  
  // Secondary colors
  colorSecondary: string;
  colorOnSecondary: string;
  colorSecondaryContainer: string;
  colorOnSecondaryContainer: string;
  colorSecondaryVariant: string;
  colorOnSecondaryVariant: string;
  
  // Tertiary colors
  colorTertiary: string;
  colorOnTertiary: string;
  colorTertiaryContainer: string;
  colorOnTertiaryContainer: string;
  colorTertiaryVariant: string;
  colorOnTertiaryVariant: string;
  
  // Surface colors
  colorSurface: string;
  colorOnSurface: string;
  colorSurfaceVariant: string;
  colorOnSurfaceVariant: string;
  colorSurfaceBright: string;
  colorSurfaceContainerLow: string;
  colorSurfaceContainerHigh: string;
  
  // Outline colors
  colorOutline: string;
  colorOutlineVariant: string;
  
  // Semantic colors
  colorError: string;
  colorSuccess: string;
  colorWarning: string;
  
  // Spacing (Pebble tokens)
  space100: string;
  space200: string;
  space300: string;
  space400: string;
  space600: string;
  space800: string;
  space1000: string;
  
  // Typography (Pebble V2 tokens)
  typestyleV2DisplaySmall: string;
  typestyleV2TitleLarge: string;
  typestyleV2TitleMedium: string;
  typestyleV2TitleSmall: string;
  typestyleV2BodyLarge: string;
  typestyleV2BodyMedium: string;
  typestyleV2BodySmall: string;
  typestyleV2LabelLarge: string;
  typestyleV2LabelMedium: string;
  
  // Shape
  shapeCornerSm: string;
  shapeCornerMd: string;
  shapeCornerLg: string;
  shapeCorner2xl: string;
  shapeCornerFull: string;
}

interface PreviewThemeProviderProps {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  darkPrimaryColor?: string;
  darkSecondaryColor?: string;
  darkTertiaryColor?: string;
  lightLogo?: string;
  darkLogo?: string;
  lightLogoBackground?: string;
  darkLogoBackground?: string;
  mode?: 'light' | 'dark';
  children: ReactNode;
}

/**
 * OKLCH Lightness values extracted from Pebble Berry theme
 * These maintain the professional lightness relationships from Berry
 * while allowing custom hues and chroma from user input
 */
const BERRY_LIGHTNESS = {
  primary: {
    base: 0.3891,      // #7a005d -> OKLCH(0.39, 0.17, 342.03°)
    container: 0.3891, // Same as base in Berry
    variant: 0.8956,   // #f0d0f5 -> OKLCH(0.90, 0.06, 321.71°)
  },
  secondary: {
    base: 0.7986,      // #ffa81d -> OKLCH(0.80, 0.17, 70.93°)
    container: 0.7986, // Same as base in Berry
    variant: 0.9203,   // #ffe0ad -> OKLCH(0.92, 0.07, 79.96°)
  },
  tertiary: {
    base: 0.4391,      // #1e4aa9 -> OKLCH(0.44, 0.16, 262.86°)
    container: 0.4391, // Same as base in Berry
    variant: 0.8706,   // #c8d5ed -> OKLCH(0.87, 0.04, 262.81°)
  },
};

/**
 * Calculate relative luminance for WCAG contrast
 */
function getLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get the best text color (black or white) for a given background
 */
function getTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Convert OKLCH to hex color
 */
function oklchToHex(l: number, c: number, h: number): string {
  try {
    const color = new Color('oklch', [l, c, h]);
    const rgb = color.to('srgb');
    // Clamp values to ensure they're in valid range
    const [r, g, b] = rgb.coords;
    rgb.coords[0] = Math.max(0, Math.min(1, r));
    rgb.coords[1] = Math.max(0, Math.min(1, g));
    rgb.coords[2] = Math.max(0, Math.min(1, b));
    return rgb.toString({ format: 'hex' });
  } catch (error) {
    console.error('OKLCH conversion error:', error);
    return '#000000';
  }
}

/**
 * Create full color palette from base color using OKLCH
 * Maintains Berry theme lightness relationships while using user's hue
 */
function createColorPalette(
  baseColor: string,
  colorType: 'primary' | 'secondary' | 'tertiary'
) {
  try {
    // Convert user's RGB color to OKLCH
    const userColor = new Color(baseColor);
    const userOklch = userColor.to('oklch');
    
    // Extract user's Chroma and Hue (but NOT lightness)
    const userChroma = userOklch.c || 0.15; // Fallback to reasonable chroma
    const userHue = userOklch.h || 0; // Fallback to 0° (red)
    
    // Get Berry lightness values for this color type
    const berryL = BERRY_LIGHTNESS[colorType];
    
    // Create colors using Berry L values with user's C and H
    const base = oklchToHex(berryL.base, userChroma, userHue);
    const container = oklchToHex(berryL.container, userChroma, userHue);
    const variant = oklchToHex(berryL.variant, userChroma * 0.4, userHue); // Reduce chroma for variant
    
    return {
      base,
      onBase: getTextColor(base),
      container,
      onContainer: getTextColor(container),
      variant,
      onVariant: getTextColor(variant),
    };
  } catch (error) {
    console.error('Color palette creation error:', error);
    // Fallback to user's base color
    return {
      base: baseColor,
      onBase: getTextColor(baseColor),
      container: baseColor,
      onContainer: getTextColor(baseColor),
      variant: baseColor,
      onVariant: getTextColor(baseColor),
    };
  }
}

// Create theme from custom colors using OKLCH with Berry lightness values
const createPreviewTheme = (
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  mode: 'light' | 'dark' = 'light'
): PreviewTheme => {
  const primary = createColorPalette(primaryColor, 'primary');
  const secondary = createColorPalette(secondaryColor, 'secondary');
  const tertiary = createColorPalette(tertiaryColor, 'tertiary');
  
  // Surface colors based on theme mode
  const surfaceColors = mode === 'dark' 
    ? {
        colorSurface: '#141415',
        colorOnSurface: '#FAFAFA',
        colorSurfaceVariant: '#A3A3A5',
        colorOnSurfaceVariant: '#A8A8A8',
        colorSurfaceBright: '#202022',
        colorSurfaceContainerLow: '#171614',
        colorSurfaceContainerHigh: '#232220',
        colorOutline: 'rgba(255, 255, 255, 0.2)',
        colorOutlineVariant: 'rgba(255, 255, 255, 0.1)',
      }
    : {


        colorSurface: '#F9F7F6',
        colorOnSurface: '#000000',
        colorSurfaceVariant: '#716F6C',
        colorOnSurfaceVariant: '#716F6C',
        colorSurfaceBright: '#FFFFFF',
        colorSurfaceContainerLow: '#F3F1EE',
        colorSurfaceContainerHigh: '#E6E4E1',
        colorOutline: 'rgba(0, 0, 0, 0.2)',
        colorOutlineVariant: 'rgba(0, 0, 0, 0.1)',
      };
  
  return {
    // Primary colors
    colorPrimary: primary.base,
    colorOnPrimary: primary.onBase,
    colorPrimaryContainer: primary.container,
    colorOnPrimaryContainer: primary.onContainer,
    colorPrimaryVariant: primary.variant,
    colorOnPrimaryVariant: primary.onVariant,
    
    // Secondary colors
    colorSecondary: secondary.base,
    colorOnSecondary: secondary.onBase,
    colorSecondaryContainer: secondary.container,
    colorOnSecondaryContainer: secondary.onContainer,
    colorSecondaryVariant: secondary.variant,
    colorOnSecondaryVariant: secondary.onVariant,
    
    // Tertiary colors
    colorTertiary: tertiary.base,
    colorOnTertiary: tertiary.onBase,
    colorTertiaryContainer: tertiary.container,
    colorOnTertiaryContainer: tertiary.onContainer,
    colorTertiaryVariant: tertiary.variant,
    colorOnTertiaryVariant: tertiary.onVariant,
    
    // Surface colors (from mode)
    ...surfaceColors,
    
    // Semantic colors
    colorError: '#D32F2F',
    colorSuccess: '#388E3C',
    colorWarning: '#F57C00',
    
    // Spacing (Pebble tokens)
    space100: '4px',
    space200: '8px',
    space300: '12px',
    space400: '16px',
    space600: '24px',
    space800: '32px',
    space1000: '40px',
    
    // Typography (Pebble v2 tokens)
    typestyleV2DisplaySmall: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 535;
      line-height: 44px;
      letter-spacing: 0;
    `,
    typestyleV2TitleLarge: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 22px;
      font-weight: 535;
      line-height: 26px;
      letter-spacing: 0;
    `,
    typestyleV2TitleMedium: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 16px;
      font-weight: 535;
      line-height: 24px;
      letter-spacing: 0;
    `,
    typestyleV2TitleSmall: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 535;
      line-height: 20px;
      letter-spacing: 0;
    `,
    typestyleV2BodyLarge: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 16px;
      font-weight: 430;
      line-height: 24px;
      letter-spacing: 0;
    `,
    typestyleV2BodyMedium: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 430;
      line-height: 20px;
      letter-spacing: 0;
    `,
    typestyleV2BodySmall: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 430;
      line-height: 16px;
      letter-spacing: 0;
    `,
    typestyleV2LabelLarge: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 535;
      line-height: 20px;
      letter-spacing: 0;
    `,
    typestyleV2LabelMedium: `
      font-family: 'Basel Grotesk', -apple-system, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 535;
      line-height: 16px;
      letter-spacing: 0;
    `,
    
    // Shape
    shapeCornerSm: '4px',
    shapeCornerMd: '6px',
    shapeCornerLg: '8px',
    shapeCorner2xl: '12px',
    shapeCornerFull: '9999px',
  };
};

export const PreviewThemeProvider: React.FC<PreviewThemeProviderProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  darkPrimaryColor,
  darkSecondaryColor,
  darkTertiaryColor,
  lightLogo,
  darkLogo,
  lightLogoBackground,
  darkLogoBackground,
  mode = 'light',
  children,
}) => {
  // Use dark mode colors if provided and mode is dark, otherwise use light mode colors
  const effectivePrimary = mode === 'dark' && darkPrimaryColor ? darkPrimaryColor : primaryColor;
  const effectiveSecondary = mode === 'dark' && darkSecondaryColor ? darkSecondaryColor : secondaryColor;
  const effectiveTertiary = mode === 'dark' && darkTertiaryColor ? darkTertiaryColor : tertiaryColor;
  
  const theme = createPreviewTheme(effectivePrimary, effectiveSecondary, effectiveTertiary, mode);
  
  const logoData: LogoContextData = {
    lightLogo,
    darkLogo,
    lightLogoBackground,
    darkLogoBackground,
  };
  
  return (
    <EmotionThemeProvider theme={theme}>
      <LogoContext.Provider value={logoData}>
        {children}
      </LogoContext.Provider>
    </EmotionThemeProvider>
  );
};
