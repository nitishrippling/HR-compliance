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
 * CustomPreviewThemeContext
 * 
 * Custom color processing logic for Mode Custom:
 * - Primary = user input (no processing)
 * - Primary Container = same as Primary (user input)
 * - On Primary / On Primary Container = white or black based on input Primary
 * - Primary Variant = use the variant logic from the processed algorithm
 */

export interface PreviewTheme {
  // Navigation color (for Mode B - separate from primary)
  colorNav?: string;
  colorOnNav?: string;
  
  // Topbar colors (for Mode Custom - separate from primary)
  colorTopbar?: string;
  colorOnTopbar?: string;
  
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
  topbarColor?: string; // Topbar color for Mode Custom
  darkTopbarColor?: string; // Dark mode topbar color for Mode Custom
  navColor?: string; // Separate nav color for Mode B
  darkNavColor?: string; // Separate dark nav color for Mode B
  lightLogo?: string;
  darkLogo?: string;
  lightLogoBackground?: string;
  darkLogoBackground?: string;
  mode?: 'light' | 'dark';
  children: ReactNode;
}

// =========================================================
// CUSTOM THEME GENERATION LOGIC (Mode Custom)
// =========================================================

// Constants for Variant generation (same as processed algorithm)
const DEFAULTS = {
  LIGHT: {
    PRIMARY_VARIANT: { l: 0.8713, c: 0.0605 }
  },
  DARK: {
    PRIMARY_VARIANT: { l: 0.3917, c: 0.1309 }
  }
};

// Helpers
function normalizeHue(hue: number): number {
  let h = hue;
  while (h < 0) h += 360;
  while (h >= 360) h -= 360;
  return h;
}

function createOKLCH(l: number, c: number, h: number): Color {
  return new Color('oklch', [Math.max(0, Math.min(1, l)), Math.max(0, c), normalizeHue(h)]);
}

function getAPCA(bg: Color, fg: Color): number {
  return Math.abs(bg.contrast(fg, 'APCA'));
}

/**
 * Determine if text should be white or black based on background color using APCA contrast
 * Returns whichever color (white or black) has higher APCA contrast against the background
 */
function determineOnColor(bgColor: Color): Color {
  const h = bgColor.coords[2] || 0;
  
  // Create white and black options with matching hue
  const whiteOption = createOKLCH(0.98, 0.02, h);
  const blackOption = createOKLCH(0.10, 0.02, h);
  
  // Check APCA contrast for both options
  const whiteContrast = getAPCA(bgColor, whiteOption);
  const blackContrast = getAPCA(bgColor, blackOption);
  
  // Return whichever has higher contrast
  return whiteContrast > blackContrast ? whiteOption : blackOption;
}

/**
 * Generate variant color using the same logic as the processed algorithm
 * This uses the DEFAULTS for variant lightness while preserving user's chroma and hue
 */
function generateVariantForToken(userColorOKLCH: Color, mode: 'LIGHT' | 'DARK'): { variant: Color, onVariant: Color } {
  const variantL = mode === 'LIGHT' ? DEFAULTS.LIGHT.PRIMARY_VARIANT.l : DEFAULTS.DARK.PRIMARY_VARIANT.l;
  const variantC = userColorOKLCH.coords[1] || 0;
  const variantH = userColorOKLCH.coords[2] || 0;
  
  const variant = createOKLCH(variantL, variantC, variantH);
  const onVariant = determineOnColor(variant);
  
  return { variant, onVariant };
}

export function colorToHex(c: Color): string {
  const srgb = c.to('srgb');
  srgb.coords[0] = Math.max(0, Math.min(1, srgb.coords[0]));
  srgb.coords[1] = Math.max(0, Math.min(1, srgb.coords[1]));
  srgb.coords[2] = Math.max(0, Math.min(1, srgb.coords[2]));
  return srgb.toString({ format: 'hex' });
}

/**
 * Universal OKLCH Dark Mode Equation
 * 
 * Transforms a Light Mode color (Llight, Clight, Hlight) to Dark Mode (Ldark, Cdark, Hdark):
 * - Ldark = 0.15 + (1 – Llight) × 0.75
 * - Cdark = Clight × 0.85
 * - Hdark = Hlight
 * 
 * @param lightColorHex - The light mode color in hex format
 * @returns The dark mode color in hex format
 */
export function convertToDarkMode(lightColorHex: string): string {
  try {
    // Convert light mode color to OKLCH
    const lightColor = new Color(lightColorHex).to('oklch');
    const Llight = lightColor.coords[0];
    const Clight = lightColor.coords[1] || 0;
    const Hlight = lightColor.coords[2] || 0;
    
    // Apply Universal OKLCH Dark Mode Equation
    const Ldark = 0.15 + (1 - Llight) * 0.75;
    const Cdark = Clight * 0.85;
    const Hdark = Hlight;
    
    // Create dark mode color in OKLCH
    const darkColor = createOKLCH(Ldark, Cdark, Hdark);
    
    // Convert to hex
    return colorToHex(darkColor);
  } catch (e) {
    console.error("Error converting to dark mode", e);
    return lightColorHex; // Fallback to original color
  }
}

interface CustomPaletteOutput {
  Light_Main: string;
  Light_OnMain: string;
  Light_Container: string;
  Light_OnContainer: string;
  Light_Variant: string;
  Light_OnVariant: string;
  
  Dark_Main: string;
  Dark_OnMain: string;
  Dark_Container: string;
  Dark_OnContainer: string;
  Dark_Variant: string;
  Dark_OnVariant: string;
}

/**
 * Generate palette for Custom mode:
 * - Main = user input (no processing)
 * - Container = same as Main (user input)
 * - On Main / On Container = white or black based on input
 * - Variant = use variant logic from processed algorithm
 */
export function generateCustomPaletteForToken(userInputHex: string): CustomPaletteOutput {
  const toHex = colorToHex;
  
  // Convert user input to OKLCH for processing
  const userColorOKLCH = new Color(userInputHex).to('oklch');
  
  // Main and Container: Use user input directly (no processing)
  const mainColor = new Color(userInputHex);
  const containerColor = new Color(userInputHex); // Same as Main
  
  // Determine On colors based on the input color
  const mainOKLCH = mainColor.to('oklch');
  const onMain = determineOnColor(mainOKLCH);
  const onContainer = determineOnColor(mainOKLCH); // Same as On Main
  
  // Generate Variant using the processed algorithm logic
  const lightVariant = generateVariantForToken(userColorOKLCH, 'LIGHT');
  const darkVariant = generateVariantForToken(userColorOKLCH, 'DARK');
  
  return {
    Light_Main: toHex(mainColor),
    Light_OnMain: toHex(onMain),
    Light_Container: toHex(containerColor),
    Light_OnContainer: toHex(onContainer),
    Light_Variant: toHex(lightVariant.variant),
    Light_OnVariant: toHex(lightVariant.onVariant),
    
    Dark_Main: toHex(mainColor), // Same as light mode (user input)
    Dark_OnMain: toHex(onMain), // Same as light mode
    Dark_Container: toHex(containerColor), // Same as light mode
    Dark_OnContainer: toHex(onContainer), // Same as light mode
    Dark_Variant: toHex(darkVariant.variant),
    Dark_OnVariant: toHex(darkVariant.onVariant)
  };
}

/**
 * Generate custom theme from user input colors
 */
function generateCustomTheme(inputPrimaryHex: string, inputSecondaryHex?: string, inputTertiaryHex?: string) {
  return {
    primary: generateCustomPaletteForToken(inputPrimaryHex),
    secondary: inputSecondaryHex ? generateCustomPaletteForToken(inputSecondaryHex) : generateCustomPaletteForToken(inputPrimaryHex),
    tertiary: inputTertiaryHex ? generateCustomPaletteForToken(inputTertiaryHex) : generateCustomPaletteForToken(inputPrimaryHex)
  };
}

// Create theme from custom colors
const createCustomPreviewTheme = (
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  mode: 'light' | 'dark' = 'light',
  navColor?: string,
  topbarColor?: string,
  darkTopbarColor?: string
): PreviewTheme => {
  const generated = generateCustomTheme(primaryColor, secondaryColor, tertiaryColor);
  const navGenerated = navColor ? generateCustomTheme(navColor).primary : null;
  
  // Generate topbar colors if provided
  let topbarGenerated: { topbar: string; onTopbar: string } | null = null;
  if (topbarColor) {
    const topbarColorOKLCH = new Color(topbarColor).to('oklch');
    const onTopbar = determineOnColor(topbarColorOKLCH);
    topbarGenerated = {
      topbar: topbarColor,
      onTopbar: colorToHex(onTopbar)
    };
  }
  
  // Generate dark topbar colors if provided
  let darkTopbarGenerated: { topbar: string; onTopbar: string } | null = null;
  if (darkTopbarColor) {
    const darkTopbarColorOKLCH = new Color(darkTopbarColor).to('oklch');
    const onDarkTopbar = determineOnColor(darkTopbarColorOKLCH);
    darkTopbarGenerated = {
      topbar: darkTopbarColor,
      onTopbar: colorToHex(onDarkTopbar)
    };
  }
  
  // Map generated palette to PreviewTheme structure based on mode
  const isLight = mode === 'light';
  
  // Surface colors based on theme mode (Static for now, could be generated too)
  const surfaceColors = !isLight 
    ? {
        colorSurface: '#141415',
        colorOnSurface: '#FAFAFA',
        colorSurfaceVariant: '#A3A3A5',
        colorOnSurfaceVariant: '#A8A8A8',
        colorSurfaceBright: '#21201E',
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
    // Navigation colors (Mode B - if provided)
    ...(navGenerated ? {
      colorNav: isLight ? navGenerated.Light_Main : navGenerated.Dark_Main,
      colorOnNav: isLight ? navGenerated.Light_OnMain : navGenerated.Dark_OnMain,
    } : {}),
    
    // Topbar colors (Mode Custom - if provided)
    ...(topbarGenerated || darkTopbarGenerated ? {
      colorTopbar: isLight 
        ? (topbarGenerated?.topbar || primaryColor)
        : (darkTopbarGenerated?.topbar || topbarGenerated?.topbar || primaryColor),
      colorOnTopbar: isLight
        ? (topbarGenerated?.onTopbar || generated.primary.Light_OnMain)
        : (darkTopbarGenerated?.onTopbar || topbarGenerated?.onTopbar || generated.primary.Dark_OnMain),
    } : {}),
    
    // Primary colors
    colorPrimary: isLight ? generated.primary.Light_Main : generated.primary.Dark_Main,
    colorOnPrimary: isLight ? generated.primary.Light_OnMain : generated.primary.Dark_OnMain,
    colorPrimaryContainer: isLight ? generated.primary.Light_Container : generated.primary.Dark_Container,
    colorOnPrimaryContainer: isLight ? generated.primary.Light_OnContainer : generated.primary.Dark_OnContainer,
    colorPrimaryVariant: isLight ? generated.primary.Light_Variant : generated.primary.Dark_Variant,
    colorOnPrimaryVariant: isLight ? generated.primary.Light_OnVariant : generated.primary.Dark_OnVariant,
    
    // Secondary colors
    colorSecondary: isLight ? generated.secondary.Light_Main : generated.secondary.Dark_Main,
    colorOnSecondary: isLight ? generated.secondary.Light_OnMain : generated.secondary.Dark_OnMain,
    colorSecondaryContainer: isLight ? generated.secondary.Light_Container : generated.secondary.Dark_Container,
    colorOnSecondaryContainer: isLight ? generated.secondary.Light_OnContainer : generated.secondary.Dark_OnContainer,
    colorSecondaryVariant: isLight ? generated.secondary.Light_Variant : generated.secondary.Dark_Variant,
    colorOnSecondaryVariant: isLight ? generated.secondary.Light_OnVariant : generated.secondary.Dark_OnVariant,
    
    // Tertiary colors
    colorTertiary: isLight ? generated.tertiary.Light_Main : generated.tertiary.Dark_Main,
    colorOnTertiary: isLight ? generated.tertiary.Light_OnMain : generated.tertiary.Dark_OnMain,
    colorTertiaryContainer: isLight ? generated.tertiary.Light_Container : generated.tertiary.Dark_Container,
    colorOnTertiaryContainer: isLight ? generated.tertiary.Light_OnContainer : generated.tertiary.Dark_OnContainer,
    colorTertiaryVariant: isLight ? generated.tertiary.Light_Variant : generated.tertiary.Dark_Variant,
    colorOnTertiaryVariant: isLight ? generated.tertiary.Light_OnVariant : generated.tertiary.Dark_OnVariant,
    
    // Surface colors (from mode)
    ...surfaceColors,
    
    // Semantic colors (Keep static for now as per existing)
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

export const CustomPreviewThemeProvider: React.FC<PreviewThemeProviderProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  darkPrimaryColor,
  darkSecondaryColor,
  darkTertiaryColor,
  topbarColor,
  darkTopbarColor,
  navColor,
  darkNavColor,
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
  const effectiveNav = navColor ? (mode === 'dark' && darkNavColor ? darkNavColor : navColor) : undefined;
  const effectiveTopbar = topbarColor ? (mode === 'dark' && darkTopbarColor ? darkTopbarColor : topbarColor) : undefined;
  const effectiveDarkTopbar = mode === 'dark' && darkTopbarColor ? darkTopbarColor : undefined;
  
  const theme = createCustomPreviewTheme(
    effectivePrimary, 
    effectiveSecondary, 
    effectiveTertiary, 
    mode, 
    effectiveNav,
    effectiveTopbar,
    effectiveDarkTopbar
  );
  
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

