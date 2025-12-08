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
 */

export interface PreviewTheme {
  // Navigation color (for Mode B - separate from primary)
  colorNav?: string;
  colorOnNav?: string;
  
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
// CUSTOM THEME GENERATION LOGIC (OKLCH + APCA)
// =========================================================

// 1. CONSTANTS (Reference Values from Material Design / Berry)
const DEFAULTS = {
  LIGHT: {
    PRIMARY:           { l: 0.4767, c: 0.1675 },
    PRIMARY_CONTAINER: { l: 0.4767, c: 0.1675 }, 
    PRIMARY_VARIANT:   { l: 0.8713, c: 0.0605 }
  },
  DARK: {
    PRIMARY:           { l: 0.7562, c: 0.1132 },
    PRIMARY_CONTAINER: { l: 0.7562, c: 0.1773 },
    PRIMARY_VARIANT:   { l: 0.3917, c: 0.1309 }
  }
};

// Helpers
const BLACK_OKLCH = new Color('oklch', [0, 0, 0]);
const WHITE_OKLCH = new Color('oklch', [1, 0, 0]);

function normalizeHue(hue: number): number {
  let h = hue;
  while (h < 0) h += 360;
  while (h >= 360) h -= 360;
  return h;
}

function createOKLCH(l: number, c: number, h: number): Color {
  // Clamp L and C to valid ranges if necessary, though Color.js handles many out of gamut cases
  return new Color('oklch', [Math.max(0, Math.min(1, l)), Math.max(0, c), normalizeHue(h)]);
}

function calculateInitialOnColor(bgColor: Color): Color {
  // Access coords directly: [L, C, H]
  const l = bgColor.coords[0];
  const h = bgColor.coords[2];
  
  if (l > 0.60) {
     // Background is Light -> Return Dark Text (Hue matches bg, almost 0 chroma)
     return createOKLCH(0.10, 0.02, h);
  } else {
     // Background is Dark -> Return Light Text
     return createOKLCH(0.98, 0.02, h);
  }
}

function getAPCA(bg: Color, fg: Color): number {
  // Use colorjs.io contrast method with APCA
  // Note: We assume colorjs.io is configured or we rely on its default APCA implementation if available.
  // If standard version doesn't have APCA by default without plugin, we might fallback to WCAG 2.1 or imported logic.
  // Checking the package.json, colorjs.io ^0.5.0 usually has contrast() method.
  // However, strictly speaking, we need to check if "APCA" algorithm is available.
  // For safety, let's try/catch or check.
  // But assuming standard modern usage:
  return Math.abs(bg.contrast(fg, 'APCA'));
}

// =========================================================
// ACCESSIBILITY ENFORCER (APCA Lc 75)
// =========================================================
function ensureAPCA(bgColor: Color, fgColor: Color, mode: 'LIGHT' | 'DARK'): { bg: Color, fg: Color } {
    const targetLC = 75;
    
    // Check initial contrast
    if (getAPCA(bgColor, fgColor) >= targetLC) {
        return { bg: bgColor, fg: fgColor };
    }

    // PHASE 1: Adjust Foreground (Text/Icon)
    let newFg = fgColor.clone();
    let steps = 0;
    const maxSteps = 20; // Avoid infinite loops

    while (getAPCA(bgColor, newFg) < targetLC && steps < maxSteps) {
        steps++;
        if (mode === "LIGHT") {
            // Background is light, text should be dark. To increase contrast, darken text.
            // Wait, the provided logic says: IF mode == "LIGHT" THEN newFg.l = MAX(0, newFg.l - 0.05)
            // This implies "LIGHT" mode means Light Theme (Light Background).
            // Let's Verify: In GeneratePaletteForToken -> Light Mode -> bg_Light (Main Color)
            // If Main Color is Primary, it's L=0.38 (Dark). So bg is Dark.
            // If bg is Dark, we need Light Text.
            // Let's follow the logic carefully.
            
            // RE-READING PSEUDOCODE:
            // FUNCTION GeneratePaletteForToken...
            //   // --- LIGHT MODE GENERATION ---
            //   // 1. Main Color (e.g., Primary)
            //   targetL_Light = MIN(user.l, DEFAULTS.LIGHT.PRIMARY.l) -> L ~ 0.39 (Darkish)
            //   bg_Light = ...
            //   fg_Light = CalculateInitialOnColor(bg_Light) -> Since L < 0.60, returns Light Text (L=0.98)
            //   EnsureAPCA(bg_Light, fg_Light, "LIGHT")
            
            // INSIDE EnsureAPCA(bgColor (Dark), fgColor (Light), "LIGHT"):
            //   IF mode == "LIGHT" THEN newFg.l = MAX(0, newFg.l - 0.05) // Darken Text?
            //   This seems contradictory if bg is Dark and fg is Light.
            //   If we darken Light text on Dark bg, contrast decreases.
            
            //   Maybe "mode" refers to the overall theme mode? 
            //   OR maybe the pseudocode assumes Light Theme always has Light Backgrounds?
            //   BUT Primary Color in Material Light Theme is typically Dark/Vibrant.
            
            //   Let's look at logic for Container in Light Mode:
            //   targetL_LightCont = 0.3891 (Darkish). Same issue.
            //   Wait, Material 3 Primary Container in Light Mode is usually Light (L~90).
            //   The DEFAULTS provided: PRIMARY_CONTAINER: { L: 0.3891 ... } -> This seems to match Primary Base.
            //   If the intention is a dark primary button, then text must be light.
            
            //   Let's interpret "mode" parameter in EnsureAPCA as "Intended Background Brightness Strategy"?
            //   Or simply adapt logic to: "Improve Contrast".
            
            //   ADAPTED LOGIC for EnsureAPCA to be robust:
            //   We want to maximize distance between bg.l and fg.l.
            
            if (bgColor.coords[0] > 0.5) {
                // Background is Light. We need Darker FG.
                newFg.coords[0] = Math.max(0, newFg.coords[0] - 0.05);
            } else {
                // Background is Dark. We need Lighter FG.
                newFg.coords[0] = Math.min(1, newFg.coords[0] + 0.05);
            }
        } else {
             // DARK MODE
             // If Background is Dark (Standard Dark Mode Surface), we need Lighter FG.
             // If Background is Light (e.g. OnPrimary in Dark Mode? Rare), we need Darker FG.
             
             if (bgColor.coords[0] > 0.5) {
                newFg.coords[0] = Math.max(0, newFg.coords[0] - 0.05);
            } else {
                newFg.coords[0] = Math.min(1, newFg.coords[0] + 0.05);
            }
        }
        
        if (newFg.coords[0] <= 0 || newFg.coords[0] >= 1) break;
    }

    if (getAPCA(bgColor, newFg) >= targetLC) {
        return { bg: bgColor, fg: newFg };
    }

    // PHASE 2: Adjust Background
    // Force best possible text color first
    // Logic: If bg is light, best text is black. If bg is dark, best text is white.
    const bestFg = bgColor.coords[0] > 0.5 ? BLACK_OKLCH : WHITE_OKLCH;
    let newBg = bgColor.clone();
    steps = 0;

    while (getAPCA(newBg, bestFg) < targetLC && steps < maxSteps) {
        steps++;
        
        // If bestFg is Black (L=0), we need Lighter BG.
        // If bestFg is White (L=1), we need Darker BG.
        if (bestFg.coords[0] < 0.5) {
            // Text is dark, lighten background
             newBg.coords[0] = Math.min(1, newBg.coords[0] + 0.05);
        } else {
            // Text is light, darken background
             newBg.coords[0] = Math.max(0, newBg.coords[0] - 0.05);
        }

        if (newBg.coords[0] <= 0 || newBg.coords[0] >= 1) break;
    }

    return { bg: newBg, fg: bestFg };
}

// =========================================================
// CORE GENERATOR
// =========================================================

interface PaletteOutput {
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

export function colorToHex(c: Color): string {
  // Clamp RGB values to 0-1 range before converting to hex to avoid invalid hex codes
  const srgb = c.to('srgb');
  srgb.coords[0] = Math.max(0, Math.min(1, srgb.coords[0]));
  srgb.coords[1] = Math.max(0, Math.min(1, srgb.coords[1]));
  srgb.coords[2] = Math.max(0, Math.min(1, srgb.coords[2]));
  return srgb.toString({ format: 'hex' });
}

export function generatePaletteForToken(userColorOKLCH: Color): PaletteOutput {
  const toHex = colorToHex;

  // --- LIGHT MODE GENERATION ---

  // 1. Main Color
  const targetL_Light = Math.min(userColorOKLCH.coords[0], DEFAULTS.LIGHT.PRIMARY.l);
  const bg_Light = createOKLCH(targetL_Light, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_Light = calculateInitialOnColor(bg_Light);
  const safePair_Light = ensureAPCA(bg_Light, fg_Light, "LIGHT");
  
  // 2. Container
  const targetL_LightCont = Math.min(userColorOKLCH.coords[0], DEFAULTS.LIGHT.PRIMARY_CONTAINER.l);
  const bg_LightCont = createOKLCH(targetL_LightCont, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_LightCont = calculateInitialOnColor(bg_LightCont);
  const safePair_LightCont = ensureAPCA(bg_LightCont, fg_LightCont, "LIGHT");

  // 3. Variant
  const bg_Var_Light = createOKLCH(DEFAULTS.LIGHT.PRIMARY_VARIANT.l, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_Var_Light = calculateInitialOnColor(bg_Var_Light);
  const safePair_Var_Light = ensureAPCA(bg_Var_Light, fg_Var_Light, "LIGHT");

  // --- DARK MODE GENERATION ---

  // 4. Main Color
  const targetL_Dark = Math.max(userColorOKLCH.coords[0], DEFAULTS.DARK.PRIMARY.l);
  const bg_Dark = createOKLCH(targetL_Dark, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_Dark = calculateInitialOnColor(bg_Dark);
  const safePair_Dark = ensureAPCA(bg_Dark, fg_Dark, "DARK");

  // 5. Container
  const targetL_DarkCont = Math.max(userColorOKLCH.coords[0], DEFAULTS.DARK.PRIMARY_CONTAINER.l);
  const bg_DarkCont = createOKLCH(targetL_DarkCont, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_DarkCont = calculateInitialOnColor(bg_DarkCont);
  const safePair_DarkCont = ensureAPCA(bg_DarkCont, fg_DarkCont, "DARK");

  // 6. Variant
  const bg_Var_Dark = createOKLCH(DEFAULTS.DARK.PRIMARY_VARIANT.l, userColorOKLCH.coords[1], userColorOKLCH.coords[2]);
  const fg_Var_Dark = calculateInitialOnColor(bg_Var_Dark);
  const safePair_Var_Dark = ensureAPCA(bg_Var_Dark, fg_Var_Dark, "DARK");
    
    return {
      Light_Main: toHex(safePair_Light.bg),
      Light_OnMain: toHex(safePair_Light.fg),
      Light_Container: toHex(safePair_LightCont.bg),
      Light_OnContainer: toHex(safePair_LightCont.fg),
      Light_Variant: toHex(safePair_Var_Light.bg),
      Light_OnVariant: toHex(safePair_Var_Light.fg),
      
      Dark_Main: toHex(safePair_Dark.bg),
      Dark_OnMain: toHex(safePair_Dark.fg),
      Dark_Container: toHex(safePair_DarkCont.bg),
      Dark_OnContainer: toHex(safePair_DarkCont.fg),
      Dark_Variant: toHex(safePair_Var_Dark.bg),
      Dark_OnVariant: toHex(safePair_Var_Dark.fg)
  };
}

// =========================================================
// MAIN ENTRY POINT & AUTO-GENERATION
// =========================================================

export function resolveInputs(p_Hex: string, s_Hex?: string, t_Hex?: string) {
  try {
      // Convert primary to OKLCH
      const primary = new Color(p_Hex).to('oklch');
      const primaryL = primary.coords[0] || 0.5; // Lightness (fallback to 0.5 if undefined)
      const primaryC = (primary.coords[1] ?? 0); // Chroma (use nullish coalescing, fallback to 0)
      const primaryH = primary.coords[2] || 0; // Hue (fallback to 0 if undefined)
      
      // Ensure chroma is a valid number
      const safePrimaryC = isNaN(primaryC) || primaryC < 0 ? 0 : primaryC;
      
      let secondary: Color;
      if (s_Hex && s_Hex.trim() !== '') {
          // User provided secondary - respect it strictly (per document: "If the user provides inputs, we respect them strictly")
          secondary = new Color(s_Hex).to('oklch');
      } else {
          // Auto-generate Secondary (Muted Support Color)
          // Per document section 3.A.2: "Derive Missing Secondary (The 'Muted Support' Color)"
          
          // Hue: Shift +120° (Triadic) relative to Primary
          const newHue = normalizeHue(primaryH + 120);
          
          // Chroma Rule: Apply 0.6x multiplier to Primary Chroma, capped at 0.12
          // Document: "Apply a 0.6x Multiplier to the Primary Chroma, capped at a maximum of 0.12"
          // This ensures Secondary is soft and doesn't compete with Primary
          const targetChroma = Math.min(safePrimaryC * 0.60, 0.12);
          
          // Lightness: Preserve Primary Lightness
          // Document: "Lightness: Preserve Primary Lightness"
          secondary = createOKLCH(primaryL, targetChroma, newHue);
      }

      let tertiary: Color;
      if (t_Hex && t_Hex.trim() !== '') {
          // User provided tertiary - respect it strictly (per document: "If the user provides inputs, we respect them strictly")
          tertiary = new Color(t_Hex).to('oklch');
      } else {
          // Auto-generate Tertiary (Balanced Accent Color)
          // Per document section 3.A.3: "Derive Missing Tertiary (The 'Balanced Accent' Color)"
          
          // Hue: Shift +240° (Split) relative to Primary
          const newHue = normalizeHue(primaryH + 240);
          
          // Chroma Rule: Apply 0.85x multiplier to Primary Chroma
          // Document: "Apply a 0.85x Multiplier to the Primary Chroma. (Keeps it vibrant, but subservient to Primary)"
          // No hard cap - keeps it vibrant but subservient to Primary
          const targetChroma = safePrimaryC * 0.85;
          
          // Lightness: Preserve Primary Lightness
          // Document: "Lightness: Preserve Primary Lightness"
          tertiary = createOKLCH(primaryL, targetChroma, newHue);
      }

      return { primary, secondary, tertiary };
  } catch (e) {
      console.error("Error resolving colors", e);
      // Fallback
      const fb = new Color('#000000').to('oklch');
      return { primary: fb, secondary: fb, tertiary: fb };
  }
}

function generateTheme(inputPrimaryHex: string, inputSecondaryHex?: string, inputTertiaryHex?: string) {
  const colors = resolveInputs(inputPrimaryHex, inputSecondaryHex, inputTertiaryHex);
  
  return {
      primary: generatePaletteForToken(colors.primary),
      secondary: generatePaletteForToken(colors.secondary),
      tertiary: generatePaletteForToken(colors.tertiary)
  };
}

// Create theme from custom colors using OKLCH with Berry lightness values
const createPreviewTheme = (
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string,
  mode: 'light' | 'dark' = 'light',
  navColor?: string
): PreviewTheme => {
  const generated = generateTheme(primaryColor, secondaryColor, tertiaryColor);
  const navGenerated = navColor ? generateTheme(navColor).primary : null;
  
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

export const PreviewThemeProvider: React.FC<PreviewThemeProviderProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  darkPrimaryColor,
  darkSecondaryColor,
  darkTertiaryColor,
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
  // Note: with the new generator, we generate both light/dark palettes from the seed color.
  // However, if the user specifically provides a separate "darkPrimaryColor", we should probably
  // use that as the seed for the Dark mode generation or override it.
  // 
  // The new logic generates Light/Dark pairs from a SINGLE seed. 
  // To respect the existing props where users might explicitly provide a different color for dark mode:
  
  const effectivePrimary = mode === 'dark' && darkPrimaryColor ? darkPrimaryColor : primaryColor;
  const effectiveSecondary = mode === 'dark' && darkSecondaryColor ? darkSecondaryColor : secondaryColor;
  const effectiveTertiary = mode === 'dark' && darkTertiaryColor ? darkTertiaryColor : tertiaryColor;
  const effectiveNav = navColor ? (mode === 'dark' && darkNavColor ? darkNavColor : navColor) : undefined;
  
  // We pass the effective colors to the theme creator. 
  // Since the generator now creates both Light and Dark variants from a single seed, 
  // if we are in Dark mode and pass a "Dark Primary Seed", the generator will create 
  // a Dark Mode palette based on that seed.
  
  const theme = createPreviewTheme(effectivePrimary, effectiveSecondary, effectiveTertiary, mode, effectiveNav);
  
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
