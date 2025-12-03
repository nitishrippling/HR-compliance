# Color Generation Logic

# Document Overview

| Field | Value |
| :---- | :---- |
| **Project Name** | Company Theme |
| **Component/System** | Color Generation/Theming Engine |
| **Date Created** | 3 Dec 2025 |
| **Last Updated** | 3 Dec 2025 |
| **Version** | v.0.1 |
| **Author** | [Rahul Gajjar](mailto:rgajjar@rippling.com) |

## 

## 1\. Overview

This document outlines the algorithm for generating a comprehensive UI color theme based on minimal user input (Primary, Secondary, Tertiary hex codes). It utilizes the **OKLCH** color space for perceptual uniformity and enforces accessibility standards via **APCA (Advanced Perceptual Contrast Algorithm)** verification.

## 2\. Constants & Reference Values

The system relies on a set of "Reference Colors" derived from a default Rippling theme. These serve as the anchor points for Lightness (L) and Chroma (C) distribution.

**Data Structure:** DEFAULTS

| Mode | Token | Reference L | Reference C | Reference H |
| :---- | :---- | :---- | :---- | :---- |
| **Light** | Primary | 0.3891 | 0.1675 | 342.02 |
|  | Primary Container | 0.3891 | 0.1675 | 342.02 |
|  | Primary Variant | 0.8956 | 0.0605 | 321.71 |
| **Dark** | Primary | 0.7955 | 0.1132 | 324.53 |
|  | Primary Container | 0.5650 | 0.1773 | 340.57 |
|  | Primary Variant | 0.3888 | 0.1309 | 341.89 |

## 3\. Input Normalization & Intelligent Auto-Generation

**Goal:** Create a harmonious hierarchy. If the user provides inputs, we respect them strictly. If we auto-generate, we apply **Chroma Dampening** to ensure the generated colors do not compete with the Primary brand color.

**Input:** UserPrimary, UserSecondary (Optional), UserTertiary (Optional)

### **A. Core Logic**

1. **Convert to OKLCH:** Convert all active inputs to OKLCH.  
2. **Derive Missing Secondary (The "Muted Support" Color):**  
   * *Concept:* Secondary should be distinguishable but soft. It bridges the gap between the brand color and neutral surfaces.  
   * **Hue:** Shift **\+120°** (Triadic) relative to Primary.  
   * **Chroma Rule:** Apply a **0.6x Multiplier** to the Primary Chroma, capped at a maximum of **0.12** (to prevent neon secondary colors).  
   * **Lightness:** Preserve Primary Lightness.  
3. **Derive Missing Tertiary (The "Balanced Accent" Color):**  
   * *Concept:* Tertiary is an accent. It can be vibrant, but should be slightly more reserved than the Primary to avoid clashing.  
   * **Hue:** Shift **\+240°** (Split) relative to Primary.  
   * **Chroma Rule:** Apply a **0.85x Multiplier** to the Primary Chroma. (Keeps it vibrant, but subservient to Primary).  
   * **Lightness:** Preserve Primary Lightness.

### **Why this makes it "Beautiful" (Visual Hierarchy)**

1. **Vibrancy Control:** By capping the Auto-Generated Secondary chroma at 0.12, you guarantee that the Secondary color never looks like a "neon sign." It forces it to be a pastel or an earthy tone (depending on Lightness), which is exactly how Material Design 3 creates that sophisticated, modern look.  
2. **Conflict Reduction:** High Chroma colors often vibrate when placed next to each other. By reducing the Chroma of the generated neighbors, you reduce the "visual vibration" of the palette, making it easier for the eye to scan.  
3. **Preserved Intent:** If the user explicitly selects a neon green Secondary, we respect it. We only impose "good taste" when we are asked to invent the color ourselves.

## 4\. Theme Generation Logic (Per Token)

This logic applies to Primary, Secondary, and Tertiary palettes independently.

### **A. Light Mode Generation**

**1\. Primary & Container**

* **Logic:** Compare User L vs Reference L. Use the **Darker** value to ensure contrast against light backgrounds.  
* Target\_L \= MIN(User\_L, Reference\_L)  
* Target\_C \= User C  
* Target\_H \= User H

**2\. Variant**

* **Logic:** Strict adherence to Reference Lightness to ensure hierarchy, preserving User Hue.  
* Target\_L \= Reference L (0.8956)  
* Target\_C \= User C (Optionally scale by 0.7 for subtler effect)  
* Target\_H \= User H

### **B. Dark Mode Generation**

**1\. Primary & Container**

* **Logic:** Compare User L vs Reference L. Use the **Lighter** value to ensure visibility against dark backgrounds.  
* Target\_L \= MAX(User\_L, Reference\_L)  
* Target\_C \= User C  
* Target\_H \= User H

**2\. Variant**

* **Logic:** Strict adherence to Reference Lightness.  
* Target\_L \= Reference L (0.3888)  
* Target\_C \= User C  
* Target\_H \= User H

## 5\. "On-Color" Calculation (Foreground)

For every generated Background color (Primary, Container, etc.), a corresponding Foreground color (Text/Icon) must be calculated.

Step 1: Initial Polarity Guess

Determine if the background needs Light or Dark text based on a standard OKLCH threshold.

* **Threshold:** L \= 0.60  
* **If Background L \> 0.60:** Return **Dark Token** (L=0.10, C=0.02, H=Background H)  
* **If Background L \<= 0.60:** Return **Light Token** (L=0.98, C=0.02, H=Background H)

**Step 2: Accessibility Verification Loop (APCA)**

After the initial guess, the pair is passed through an accessibility enforcer.

* **Target:** Lc 75 (APCA Lightness Contrast)

**Algorithm:**

1. Calculate APCA Lc for the {Background, Initial\_Foreground} pair.  
2. **IF** |Lc| \< 75:  
   * **Attempt 1 (Nudge Foreground):** Incrementally shift the Foreground L value away from the Background (towards 0 or 1). Limit max iterations (e.g., 20 steps of 0.05).  
   * **Attempt 2 (Nudge Background):** If Foreground hits pure Black/White and |Lc| is still \< 75, reset Foreground to Black/White and incrementally shift the **Background L** value away from the Foreground until compliant.

## 6\. Pseudocode Implementation

```
// =========================================================
// CUSTOM THEME GENERATION LOGIC (OKLCH + APCA)
// =========================================================

// 1. CONSTANTS (Reference Values from Material Design)
CONST DEFAULTS = {
  LIGHT: {
    PRIMARY:           { L: 0.3891, C: 0.1675 },
    PRIMARY_CONTAINER: { L: 0.3891, C: 0.1675 }, 
    PRIMARY_VARIANT:   { L: 0.8956, C: 0.0605 }
  },
  DARK: {
    PRIMARY:           { L: 0.7955, C: 0.1132 },
    PRIMARY_CONTAINER: { L: 0.5650, C: 0.1773 },
    PRIMARY_VARIANT:   { L: 0.3888, C: 0.1309 }
  }
}

// =========================================================
// MAIN ENTRY POINT
// =========================================================
FUNCTION GenerateTheme(inputPrimaryHex, inputSecondaryHex, inputTertiaryHex):

  // 1. Input Normalization & Intelligent Auto-Generation
  colors = ResolveInputs(inputPrimaryHex, inputSecondaryHex, inputTertiaryHex)

  // 2. Generate Palettes for each brand color
  // We apply the same structural logic to Primary, Secondary, and Tertiary
  theme = {}
  
  theme.primary   = GeneratePaletteForToken(colors.primary, DEFAULTS)
  theme.secondary = GeneratePaletteForToken(colors.secondary, DEFAULTS)
  theme.tertiary  = GeneratePaletteForToken(colors.tertiary, DEFAULTS)

  RETURN theme
END FUNCTION

// =========================================================
// AUTO-GENERATION LOGIC (Beautiful Hierarchy)
// =========================================================
FUNCTION ResolveInputs(p_Hex, s_Hex, t_Hex):
  
  // Master Source
  primary = HexToOKLCH(p_Hex)
  
  // Resolve Secondary (Muted Support)
  IF s_Hex IS NOT NULL:
      secondary = HexToOKLCH(s_Hex)
  ELSE:
      newHue = NormalizeHue(primary.h + 120) // Triadic
      // CHROMA DAMPENING: 60% of primary, capped at 0.12 for elegance
      targetChroma = MIN(primary.c * 0.60, 0.12) 
      secondary = CreateOKLCH(primary.l, targetChroma, newHue)

  // Resolve Tertiary (Balanced Accent)
  IF t_Hex IS NOT NULL:
      tertiary = HexToOKLCH(t_Hex)
  ELSE:
      newHue = NormalizeHue(primary.h + 240) // Split
      // CHROMA BALANCING: 85% of primary. No hard cap, keep it vibrant.
      targetChroma = primary.c * 0.85 
      tertiary = CreateOKLCH(primary.l, targetChroma, newHue)

  RETURN { primary: primary, secondary: secondary, tertiary: tertiary }
END FUNCTION

// =========================================================
// CORE GENERATOR (Applied to each color role)
// =========================================================
FUNCTION GeneratePaletteForToken(userColorOKLCH, DEFAULTS):
  PALETTE = {}

  // --- LIGHT MODE GENERATION ---
  
  // 1. Main Color (e.g., Primary)
  // Logic: Use Darker L to ensure visibility on light backgrounds
  targetL_Light = MIN(userColorOKLCH.l, DEFAULTS.LIGHT.PRIMARY.l)
  bg_Light = CreateOKLCH(targetL_Light, userColorOKLCH.c, userColorOKLCH.h)
  fg_Light = CalculateInitialOnColor(bg_Light)
  
  safePair_Light = EnsureAPCA(bg_Light, fg_Light, "LIGHT")
  PALETTE.Light_Main = safePair_Light.bg
  PALETTE.Light_OnMain = safePair_Light.fg

  // 2. Container
  // Logic: Same as Main (per requirements), or use specific container ref logic if needed
  targetL_LightCont = MIN(userColorOKLCH.l, DEFAULTS.LIGHT.PRIMARY_CONTAINER.l)
  bg_LightCont = CreateOKLCH(targetL_LightCont, userColorOKLCH.c, userColorOKLCH.h)
  fg_LightCont = CalculateInitialOnColor(bg_LightCont)

  safePair_LightCont = EnsureAPCA(bg_LightCont, fg_LightCont, "LIGHT")
  PALETTE.Light_Container = safePair_LightCont.bg
  PALETTE.Light_OnContainer = safePair_LightCont.fg

  // 3. Variant
  // Logic: Strict adherence to Reference L. Keep User Hue.
  bg_Var_Light = CreateOKLCH(DEFAULTS.LIGHT.PRIMARY_VARIANT.l, userColorOKLCH.c, userColorOKLCH.h)
  fg_Var_Light = CalculateInitialOnColor(bg_Var_Light)

  safePair_Var_Light = EnsureAPCA(bg_Var_Light, fg_Var_Light, "LIGHT")
  PALETTE.Light_Variant = safePair_Var_Light.bg
  PALETTE.Light_OnVariant = safePair_Var_Light.fg


  // --- DARK MODE GENERATION ---

  // 4. Main Color (e.g., Primary)
  // Logic: Use Lighter L to ensure visibility on dark backgrounds
  targetL_Dark = MAX(userColorOKLCH.l, DEFAULTS.DARK.PRIMARY.l)
  bg_Dark = CreateOKLCH(targetL_Dark, userColorOKLCH.c, userColorOKLCH.h)
  fg_Dark = CalculateInitialOnColor(bg_Dark)

  safePair_Dark = EnsureAPCA(bg_Dark, fg_Dark, "DARK")
  PALETTE.Dark_Main = safePair_Dark.bg
  PALETTE.Dark_OnMain = safePair_Dark.fg

  // 5. Container
  targetL_DarkCont = MAX(userColorOKLCH.l, DEFAULTS.DARK.PRIMARY_CONTAINER.l)
  bg_DarkCont = CreateOKLCH(targetL_DarkCont, userColorOKLCH.c, userColorOKLCH.h)
  fg_DarkCont = CalculateInitialOnColor(bg_DarkCont)

  safePair_DarkCont = EnsureAPCA(bg_DarkCont, fg_DarkCont, "DARK")
  PALETTE.Dark_Container = safePair_DarkCont.bg
  PALETTE.Dark_OnContainer = safePair_DarkCont.fg
  
  // 6. Variant
  bg_Var_Dark = CreateOKLCH(DEFAULTS.DARK.PRIMARY_VARIANT.l, userColorOKLCH.c, userColorOKLCH.h)
  fg_Var_Dark = CalculateInitialOnColor(bg_Var_Dark)

  safePair_Var_Dark = EnsureAPCA(bg_Var_Dark, fg_Var_Dark, "DARK")
  PALETTE.Dark_Variant = safePair_Var_Dark.bg
  PALETTE.Dark_OnVariant = safePair_Var_Dark.fg

  RETURN PALETTE
END FUNCTION

// =========================================================
// ACCESSIBILITY ENFORCER (APCA Lc 75)
// =========================================================
FUNCTION EnsureAPCA(bgColor, fgColor, mode):
    targetLC = 75
    
    // Check initial contrast
    IF ABS(GetAPCA(bgColor, fgColor)) >= targetLC THEN RETURN {bg: bgColor, fg: fgColor}

    // PHASE 1: Adjust Foreground (Text/Icon)
    // We prefer changing text color over brand background color
    newFg = fgColor
    WHILE ABS(GetAPCA(bgColor, newFg)) < targetLC:
        IF mode == "LIGHT" THEN 
            newFg.l = MAX(0, newFg.l - 0.05) // Darken Text
        ELSE 
            newFg.l = MIN(1, newFg.l + 0.05) // Lighten Text
        
        IF newFg.l == 0 OR newFg.l == 1 THEN BREAK // Hit limits
    END WHILE

    // If Fixed, return
    IF ABS(GetAPCA(bgColor, newFg)) >= targetLC THEN RETURN {bg: bgColor, fg: newFg}

    // PHASE 2: Adjust Background (if Phase 1 failed)
    // The background is mid-tone, so no text works. We must shift the background.
    
    // Force best possible text color first (Black or White)
    bestFg = (mode == "LIGHT") ? BLACK_OKLCH : WHITE_OKLCH
    newBg = bgColor
    
    WHILE ABS(GetAPCA(newBg, bestFg)) < targetLC:
        IF mode == "LIGHT" THEN
            newBg.l = MIN(1, newBg.l + 0.05) // Wash out background (make lighter)
        ELSE
            newBg.l = MAX(0, newBg.l - 0.05) // Darken background
        
        IF newBg.l == 0 OR newBg.l == 1 THEN BREAK
    END WHILE

    RETURN {bg: newBg, fg: bestFg}
END FUNCTION

// =========================================================
// HELPERS
// =========================================================

// Determine if we need light or dark text based on background
FUNCTION CalculateInitialOnColor(bgColor):
  IF bgColor.l > 0.60 THEN
     // Background is Light -> Return Dark Text (Hue matches bg, almost 0 chroma)
     RETURN { l: 0.10, c: 0.02, h: bgColor.h } 
  ELSE
     // Background is Dark -> Return Light Text
     RETURN { l: 0.98, c: 0.02, h: bgColor.h }
  END IF
END FUNCTION

FUNCTION NormalizeHue(hue):
  WHILE hue < 0: hue = hue + 360
  WHILE hue >= 360: hue = hue - 360
  RETURN hue
END FUNCTION

```

## 7\. Implementation Notes

1. **Gamut Mapping:** Converting Hex \-\> OKLCH \-\> Modified OKLCH \-\> Hex may result in colors outside the sRGB gamut. A gamut clipping or compression step must be applied before final rendering.  
2. **Luminance Calculation:** APCA relies on relative luminance ($Y$). Conversion chain: OKLCH \-\> Linear sRGB \-\> Y.  
3. **Variant Chroma:** If the user input has extremely high chroma, generated Variants may vibrate visually. Consider clamping Variant Chroma to MIN(User\_C, 0.12).

