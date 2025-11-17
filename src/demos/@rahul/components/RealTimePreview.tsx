import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { PreviewTheme, useLogoContext } from './PreviewThemeContext';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import Avatar from '@rippling/pebble/Avatar';
import Badge from '@rippling/pebble/Atoms/Badge';
import RipplingLogoLight from '@/assets/rippling-logo-light.svg';
import RipplingLogoDark from '@/assets/rippling-logo-dark.svg';

/**
 * RealTimePreview
 * 
 * Pixel-perfect implementation from Figma design.
 * Uses theme tokens for dynamic color updates.
 * Includes Rippling logos with smart selection based on background color.
 * 
 * Logo Selection Logic:
 * - If background needs white text → use Light logo (white/light colored)
 * - If background needs black text → use Dark logo (black/dark colored)
 */

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
 * Determine which logo to use based on background color
 * LogoLight = dark/black logo (for light backgrounds)
 * LogoDark = light/white logo (for dark backgrounds)
 */
function getLogoForBackground(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  // If white text has better contrast (dark background), use LogoDark (white logo)
  // If black text has better contrast (light background), use LogoLight (black logo)
  return whiteContrast > blackContrast ? RipplingLogoDark : RipplingLogoLight;
}

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Section Components
const PreviewSection = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const SectionLabel = styled.div`
  align-self: stretch;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleSmall};
`;

// Dashboard Preview
const DashboardFrame = styled.div`
  align-self: stretch;
  padding: 0 0px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurface};
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const DashboardInner = styled.div`
  width: 100%;
  height: 744px;
  position: relative;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurface};
  overflow: hidden;
`;

// Sidebar Component
const Sidebar = styled.div`
  width: 56px;
  height: 688px;
  left: 0;
  top: 56px;
  position: absolute;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
`;

const SidebarIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => (theme as PreviewTheme).shapeCornerMd};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => (theme as PreviewTheme).colorSurfaceContainerLow};
  }
`;

const SidebarDivider = styled.div`
  width: 40px;
  height: 1px;
  background: ${({ theme }) => (theme as PreviewTheme).colorOutline};
  margin: 8px 0;
`;

// Top Navigation Bar
const TopNavBar = styled.div`
  width: 100%;
  height: 56px;
  left: 0;
  top: 0;
  position: absolute;
  background: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorNav || t.colorPrimary;
  }};
  border-bottom: 1px solid ${({ theme }) => {
    const t = theme as PreviewTheme;
    const onColor = t.colorOnNav || t.colorOnPrimary;
    return `${onColor}1A`;
  }};
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const NavLogoSection = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${({ theme }) => {
    const t = theme as PreviewTheme;
    const onColor = t.colorOnNav || t.colorOnPrimary;
    return `${onColor}33`;
  }};
  color: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorOnNav || t.colorOnPrimary;
  }};
`;

const NavMainSection = styled.div`
  flex: 1 1 0;
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBar = styled.div`
  flex: 1 1 0;
  padding: 0 12px;
  margin: 8px 0;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => {
    const t = theme as PreviewTheme;
    const onColor = t.colorOnNav || t.colorOnPrimary;
    return `${onColor}1A`;
  }};
  height: 36px;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  opacity: 0.6;
  
  svg {
    fill: none;
    stroke: ${({ theme }) => {
      const t = theme as PreviewTheme;
      return t.colorOnNav || t.colorOnPrimary;
    }};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const SearchIconSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const SearchText = styled.div`
  flex: 1 1 0;
  color: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorOnNav || t.colorOnPrimary;
  }};
  opacity: 0.6;
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyMedium};
`;

const NavRightSection = styled.div`
  padding: 0 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const CompanySection = styled.div`
  padding: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

const CompanyText = styled.div`
  color: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorOnNav || t.colorOnPrimary;
  }};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
  font-weight: 535;
`;

// Unused styled component - kept for potential future use
// const CompanyAvatar = styled.div`
//   width: 32px;
//   height: 32px;
//   border-radius: 9999px;
//   border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
//   background: ${({ theme }) => (theme as PreviewTheme).colorPrimaryContainer};
// `;

const DashboardContent = styled.div`
  left: 76px;
  right: 0;
  top: 80px;
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  padding-right: ${({ theme }) => (theme as PreviewTheme).space600};
`;

const TopBar = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const BreadcrumbArea = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

const BreadcrumbText = styled.div<{ variant?: 'default' | 'active' }>`
  height: 24px;
  padding: 8px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  color: ${({ theme, variant }) => 
    variant === 'active' 
      ? (theme as PreviewTheme).colorOnSurface 
      : (theme as PreviewTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
`;

const DateSelector = styled.div`
  width: 320px;
  height: 32px;
  padding: 0 12px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const DateText = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyMedium};
`;

const CardSection = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const Card = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CardHeader = styled.div`
  align-self: stretch;
  padding: 16px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
`;

// Unused styled component - kept for potential future use
// const AvatarPlaceholder = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 9999px;
//   border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
//   overflow: hidden;
//   background: ${({ theme }) => (theme as PreviewTheme).colorPrimaryContainer};
// `;

const HeaderContent = styled.div`
  flex: 1 1 0;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HeaderTitle = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleMedium};
  font-size: 18px;
  line-height: 22px;
`;

const HeaderDescription = styled.div`
  align-self: stretch;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
`;

const ButtonGroup = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
`;

// Unused styled component - kept for potential future use
// const StyledButton = styled.button<{ appearance?: 'outline' | 'primary' }>`
//   height: 32px;
//   padding: 0 12px;
//   background: ${({ theme, appearance }) =>
//     appearance === 'primary'
//       ? (theme as PreviewTheme).colorPrimary
//       : (theme as PreviewTheme).colorSurfaceBright};
//   overflow: hidden;
//   border-radius: 6px;
//   border: ${({ theme, appearance }) =>
//     appearance === 'outline' 
//       ? `1px solid ${(theme as PreviewTheme).colorOutline}` 
//       : 'none'};
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 6px;
//   cursor: pointer;
//   color: ${({ theme, appearance }) =>
//     appearance === 'primary'
//       ? (theme as PreviewTheme).colorOnPrimary
//       : (theme as PreviewTheme).colorOnSurface};
//   ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleSmall};
//   
//   &:hover {
//     opacity: 0.9;
//   }
// `;

const CardBody = styled.div`
  align-self: stretch;
  padding: 16px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  border-left: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  border-right: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  border-bottom: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
`;

const KeyValueGrid = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const KeyValuePair = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const KeyLabel = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleSmall};
`;

const ValueText = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
`;

const TabsRow = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const TabsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TabsGroup = styled.div`
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1px;
`;

const Tab = styled.button<{ isActive?: boolean }>`
  max-height: 32px;
  min-height: 32px;
  background: ${({ theme, isActive }) =>
    isActive ? (theme as PreviewTheme).colorTertiaryContainer : 'transparent'};
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border: none;
  cursor: pointer;
  color: ${({ theme, isActive }) =>
    isActive 
      ? (theme as PreviewTheme).colorOnTertiaryContainer 
      : (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleSmall};
  
  &:hover {
    opacity: 0.9;
  }
`;

// Unused styled component - kept for potential future use
// const AccentButton = styled.button`
//   height: 32px;
//   padding: 0 12px;
//   background: ${({ theme }) => (theme as PreviewTheme).colorTertiaryVariant};
//   overflow: hidden;
//   border-radius: 6px;
//   border: none;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 6px;
//   cursor: pointer;
//   color: ${({ theme }) => (theme as PreviewTheme).colorOnTertiaryVariant};
//   ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleSmall};
//   
//   &:hover {
//     opacity: 0.9;
//   }
// `;

const ContentRow = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const ContentCard = styled.div`
  flex: 1 1 0;
  padding: 16px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const TitleWithIcon = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const CheckIcon = styled.div`
  width: 12px;
  height: 12px;
  background: ${({ theme }) => (theme as PreviewTheme).colorTertiary};
  border-radius: 50%;
  margin-top: 6px;
`;

const TitleWithBadge = styled.div`
  height: 19px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const BadgeText = styled.span`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
  font-weight: 535;
`;

// Unused styled components - kept for potential future use
// const SuccessBadge = styled.div`
//   height: 20px;
//   max-width: 320px;
//   padding: 0 6px;
//   background: ${({ theme }) => (theme as PreviewTheme).colorSuccess}33;
//   border-radius: 9999px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 4px;
// `;
// 
// const BadgeLabel = styled.div`
//   flex: 1 1 0;
//   color: ${({ theme }) => (theme as PreviewTheme).colorSuccess};
//   ${({ theme }) => (theme as PreviewTheme).typestyleV2LabelMedium};
// `;

// Custom button wrapper for TertiaryVariant colors
const TertiaryVariantButtonWrapper = styled.div`
  button {
    background: ${({ theme }) => (theme as PreviewTheme).colorTertiaryVariant} !important;
    color: ${({ theme }) => (theme as PreviewTheme).colorOnTertiaryVariant} !important;
    border-color: ${({ theme }) => (theme as PreviewTheme).colorTertiaryVariant} !important;
    
    &:hover {
      background: ${({ theme }) => (theme as PreviewTheme).colorTertiaryVariant} !important;
      opacity: 0.9;
    }
    
    svg {
      color: ${({ theme }) => (theme as PreviewTheme).colorOnTertiaryVariant} !important;
      fill: ${({ theme }) => (theme as PreviewTheme).colorOnTertiaryVariant} !important;
    }
    
    span {
      color: ${({ theme }) => (theme as PreviewTheme).colorOnTertiaryVariant} !important;
    }
  }
`;

const DescriptionText = styled.div`
  align-self: stretch;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
`;

const ItalicText = styled.div`
  align-self: stretch;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurfaceVariant};
  font-size: 12px;
  font-family: 'Basel Grotesk', sans-serif;
  font-style: italic;
  font-weight: 430;
  line-height: 16px;
`;

// Login Preview
const LoginFrame = styled.div`
  align-self: stretch;
  padding: 39px 40px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurface};
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const LoginContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const LoginCard = styled.div`
  align-self: stretch;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  box-shadow: 0px 10px 14px -3px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const LoginHeader = styled.div`
  align-self: stretch;
  padding: 24px 0;
  background: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorNav || t.colorPrimary;
  }};
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const BrandLogo = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    height: 100%;
    width: auto;
  }
`;

const CompanyName = styled.div`
  color: ${({ theme }) => {
    const t = theme as PreviewTheme;
    return t.colorOnNav || t.colorOnPrimary;
  }};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleLarge};
  font-weight: 600;
`;

const DocumentCompanyName = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2TitleLarge};
  font-weight: 600;
  margin-left: 12px;
`;

const NavLogo = styled.img`
  height: 32px;
  width: auto;
`;

const DocumentLogo = styled.img`
  height: 40px;
  width: auto;
`;

const LoginBody = styled.div`
  padding: 32px 32px 48px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const LockIcon = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '🔒';
    font-size: 48px;
  }
`;

const LoginTitle = styled.div`
  text-align: center;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  font-size: 24px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 29px;
`;

const FormContainer = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
`;

const InputGroup = styled.div`
  width: 576px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const InputLabel = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const LabelText = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
  font-weight: 535;
`;

const RequiredStar = styled.span`
  color: #D55744;
  ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
`;

// Unused styled components - kept for potential future use
// const InputField = styled.input`
//   align-self: stretch;
//   height: 48px;
//   min-height: 40px;
//   padding: 0 16px;
//   background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
//   overflow: hidden;
//   border-radius: 10px;
//   border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
//   color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
//   font-size: 15px;
//   font-family: 'Basel Grotesk', sans-serif;
//   font-weight: 430;
//   line-height: 19px;
//   letter-spacing: 0.25px;
//   
//   &::placeholder {
//     color: ${({ theme }) => (theme as PreviewTheme).colorOnSurfaceVariant};
//   }
//   
//   &:focus {
//     outline: 2px solid ${({ theme }) => (theme as PreviewTheme).colorPrimary};
//     border-color: transparent;
//   }
// `;
// 
// const PrimaryButton = styled.button`
//   align-self: stretch;
//   height: 48px;
//   padding: 0 24px;
//   background: ${({ theme }) => (theme as PreviewTheme).colorPrimary};
//   overflow: hidden;
//   border-radius: 10px;
//   border: none;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 8px;
//   cursor: pointer;
//   color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
//   ${({ theme }) => (theme as PreviewTheme).typestyleV2BodyLarge};
//   font-weight: 535;
//   
//   &:hover {
//     opacity: 0.9;
//   }
// `;

const FooterLinks = styled.div`
  align-self: stretch;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 16px;
`;

const FooterContent = styled.div`
  flex: 1 1 0;
  padding: 4px 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

const FooterLinksRight = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 24px;
`;

const FooterLink = styled.a`
  overflow: hidden;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  font-size: 15px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 22px;
  letter-spacing: 0.25px;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Document Preview
const DocumentFrame = styled.div`
  align-self: stretch;
  height: 664px;
  padding: 80px 40px 0;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurface};
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => (theme as PreviewTheme).colorOutline};
  display: inline-flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const DocumentContainer = styled.div`
  width: 720px;
  padding: 24px;
  background: ${({ theme }) => (theme as PreviewTheme).colorSurfaceBright};
  border-radius: 2px;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
`;

const DocumentHeaderRow = styled.div`
  align-self: stretch;
  height: 40px;
  position: relative;
`;

// Unused styled component - kept for potential future use
// const DownloadButton = styled.button`
//   position: absolute;
//   right: 0;
//   top: 0;
//   padding: 8px 16px;
//   background: white;
//   overflow: hidden;
//   border-radius: 2px;
//   border: 2px solid ${({ theme }) => (theme as PreviewTheme).colorPrimaryVariant};
//   display: inline-flex;
//   justify-content: center;
//   align-items: center;
//   gap: 8px;
//   cursor: pointer;
//   color: ${({ theme }) => (theme as PreviewTheme).colorPrimaryVariant};
//   font-size: 15px;
//   font-family: 'Basel Grotesk', sans-serif;
//   font-weight: 535;
//   line-height: 22px;
//   letter-spacing: 0.25px;
//   
//   &:hover {
//     opacity: 0.9;
//   }
// `;

const InfoRow = styled.div`
  width: 744px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 40px;
`;

const InfoColumn = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  font-size: 15px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 22px;
  letter-spacing: 0.25px;
`;

const InfoValue = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnSurface};
  font-size: 15px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 430;
  line-height: 22px;
  letter-spacing: 0.50px;
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background: #E0DEDE;
`;

const PayrollCard = styled.div`
  align-self: stretch;
  height: 372px;
  position: relative;
  background: ${({ theme }) => (theme as PreviewTheme).colorPrimary};
  overflow: hidden;
  border-radius: 4px;
`;

const PayrollContent = styled.div`
  position: absolute;
  left: 36px;
  top: 39px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PayrollGreeting = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
  font-size: 38px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 46px;
  letter-spacing: 0.50px;
`;

const PayrollPeriod = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
  font-size: 17px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 430;
  line-height: 24px;
  letter-spacing: 0.50px;
`;

const PayrollAmount = styled.div`
  position: absolute;
  left: 36px;
  top: 212px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AmountLabel = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
  font-size: 20px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 28px;
`;

const Amount = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
  font-size: 48px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 535;
  line-height: 58px;
  letter-spacing: 1px;
`;

const AmountNote = styled.div`
  color: ${({ theme }) => (theme as PreviewTheme).colorOnPrimary};
  font-size: 15px;
  font-family: 'Basel Grotesk', sans-serif;
  font-weight: 430;
  line-height: 22px;
  letter-spacing: 0.50px;
`;

const PayrollDecoration = styled.div`
  position: absolute;
  right: -20px;
  top: 66px;
  font-size: 120px;
  opacity: 0.15;
`;

export const RealTimePreview: React.FC = () => {
  const theme = useTheme() as PreviewTheme;
  const logoContext = useLogoContext();
  
  // Determine which logos to use based on background colors and custom uploads
  // If custom logos are provided, use them; otherwise, use default Rippling logos
  const getEffectiveLogo = (backgroundColor: string) => {
    const defaultLogo = getLogoForBackground(backgroundColor);
    
    // Determine if we should use light or dark logo based on contrast
    const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
    const blackContrast = getContrastRatio(backgroundColor, '#000000');
    const shouldUseDarkLogo = whiteContrast > blackContrast;
    
    // Use custom logo if available, otherwise use default
    if (shouldUseDarkLogo && logoContext.darkLogo) {
      return logoContext.darkLogo;
    } else if (!shouldUseDarkLogo && logoContext.lightLogo) {
      return logoContext.lightLogo;
    }
    
    return defaultLogo;
  };
  
  const navLogo = getEffectiveLogo(theme.colorPrimary);
  const loginLogo = getEffectiveLogo(theme.colorPrimary);
  const documentLogo = getEffectiveLogo(theme.colorSurfaceBright);
  
  return (
    <PreviewContainer>
      {/* Dashboard Section */}
      <PreviewSection>
        <SectionLabel>Dashboard</SectionLabel>
        <DashboardFrame>
          <DashboardInner>
            {/* Top Navigation Bar */}
            <TopNavBar>
              <NavLogoSection>
                <NavLogo src={navLogo} alt="Rippling" />
              </NavLogoSection>
              <NavMainSection>
                <SearchBar>
                  <SearchIconWrapper>
                    <SearchIconSvg />
                  </SearchIconWrapper>
                  <SearchText>Search or jump to...</SearchText>
                </SearchBar>
                <NavRightSection>
                  <CompanySection>
                    <CompanyText>Acme, Inc.</CompanyText>
                    <Avatar size={Avatar.SIZES.XS} />
                  </CompanySection>
                </NavRightSection>
              </NavMainSection>
            </TopNavBar>

                {/* Sidebar */}
                <Sidebar>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.HOME_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.FOLDER_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.FOLDER_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarDivider />
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.OFFICE_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.FOLDER_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.COLUMN_BAR_CHART_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.FOLDER_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.DOLLAR_CIRCLE_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.REPORT_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarDivider />
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.SETTINGS_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                  <SidebarIconWrapper>
                    <Icon type={Icon.TYPES.QUESTION_CIRCLE_OUTLINE} size={20} />
                  </SidebarIconWrapper>
                </Sidebar>

                <DashboardContent>
                  <TopBar>
                    <BreadcrumbArea>
                      <BreadcrumbText variant="default">Ready for review</BreadcrumbText>
                      <span style={{ opacity: 0.6, margin: '0 4px' }}>•</span>
                      <BreadcrumbText variant="active">Lydia Lubin</BreadcrumbText>
                    </BreadcrumbArea>
                    <DateSelector>
                      <DateText>Current: 01/01/2025 - 3/31/2025</DateText>
                    </DateSelector>
                  </TopBar>

                  <CardSection>
                    <Card>
                      <CardHeader>
                        <Avatar size={Avatar.SIZES.S} />
                        <HeaderContent>
                          <HeaderTitle>Header title</HeaderTitle>
                          <HeaderDescription>
                            Header description that provides additional context to the header
                          </HeaderDescription>
                        </HeaderContent>
                        <ButtonGroup>
                          <Button 
                            size={Button.SIZES.S} 
                            appearance={Button.APPEARANCES.OUTLINE}
                            icon={{ type: Icon.TYPES.STAR_OUTLINE }}
                          >
                            Button
                          </Button>
                          <Button 
                            size={Button.SIZES.S} 
                            appearance={Button.APPEARANCES.PRIMARY}
                            icon={{ type: Icon.TYPES.EDIT_FILLED }}
                          >
                            Primary Button
                          </Button>
                        </ButtonGroup>
                      </CardHeader>
                      <CardBody>
                        <KeyValueGrid>
                          <KeyValuePair>
                            <KeyLabel>Key label</KeyLabel>
                            <ValueText>Cell value that can be changed</ValueText>
                          </KeyValuePair>
                          <KeyValuePair>
                            <KeyLabel>Key label</KeyLabel>
                            <ValueText>Cell value that can be changed</ValueText>
                          </KeyValuePair>
                          <KeyValuePair>
                            <KeyLabel>Key label</KeyLabel>
                            <ValueText>Cell value that can be changed</ValueText>
                          </KeyValuePair>
                          <KeyValuePair>
                            <KeyLabel>Key label</KeyLabel>
                            <ValueText>Cell value that can be changed</ValueText>
                          </KeyValuePair>
                        </KeyValueGrid>
                      </CardBody>
                    </Card>

                    <TabsRow>
                      <TabsContainer>
                        <TabsGroup>
                          <Tab isActive>Overview</Tab>
                          <Tab>Work analysis</Tab>
                          <Tab>Projects</Tab>
                        </TabsGroup>
                      </TabsContainer>
                      <TertiaryVariantButtonWrapper>
                        <Button 
                          size={Button.SIZES.S} 
                          appearance={Button.APPEARANCES.PRIMARY}
                          icon={{ type: Icon.TYPES.EDIT_FILLED }}
                        >
                          Tertiary Button
                        </Button>
                      </TertiaryVariantButtonWrapper>
                    </TabsRow>

                    <ContentRow>
                      <ContentCard>
                        <TitleWithIcon>
                          <TitleWithBadge>
                            <CheckIcon />
                            <BadgeText>Talent Signal thinks Lydia is</BadgeText>
                            <Badge 
                              text="Fast track" 
                              appearance={Badge.APPEARANCES.SUCCESS_LIGHT}
                              size={Badge.SIZES.M}
                            />
                          </TitleWithBadge>
                        </TitleWithIcon>
                        <DescriptionText>
                          Based on data connected Lydia has been identified as someone with high potential lorem ipsum dolor sit amet, consectetur, quis nostrud exercitation ullamco.
                        </DescriptionText>
                        <ItalicText>
                          Analysis is generated by AI and is not a replacement for manager judgment
                        </ItalicText>
                        <Button 
                          size={Button.SIZES.S}
                          appearance={Button.APPEARANCES.OUTLINE}
                        >
                          Read full work analysis
                        </Button>
                      </ContentCard>

                      <ContentCard>
                        <HeaderTitle style={{ fontSize: '16px', fontWeight: 535 }}>
                          Manager assessment
                        </HeaderTitle>
                        <DescriptionText>
                          Use analysis to support assessment of Lydia's performance over the 90-day check-in period:
                        </DescriptionText>
                        <ItalicText style={{ fontStyle: 'italic', fontSize: '16px' }}>
                          Jan 1, 2025 - Mar 31, 2025
                        </ItalicText>
                        <div style={{ marginTop: 'auto' }}>
                          <Button 
                            size={Button.SIZES.S}
                            appearance={Button.APPEARANCES.ACCENT}
                          >
                            Secondary Button
                          </Button>
                        </div>
                      </ContentCard>
                    </ContentRow>
                  </CardSection>
                </DashboardContent>
              </DashboardInner>
            </DashboardFrame>
      </PreviewSection>

      {/* Login Section */}
      <PreviewSection>
        <SectionLabel>Login</SectionLabel>
        <LoginFrame>
              <LoginContainer>
                <LoginCard>
                  <LoginHeader>
                    <BrandLogo>
                      <img src={loginLogo} alt="Rippling" />
                    </BrandLogo>
                    <CompanyName>Acme Industries</CompanyName>
                  </LoginHeader>
                  <LoginBody>
                    <LockIcon />
                    <LoginTitle>Sign into Acme Industries</LoginTitle>
                    <FormContainer>
                      <InputGroup>
                        <InputLabel>
                          <LabelText>Email address</LabelText>
                          <RequiredStar>*</RequiredStar>
                        </InputLabel>
                      <Input.Text
                        id="email-login"
                        type="email"
                        placeholder="Placeholder text"
                        size={Input.Text.SIZES.L}
                      />
                    </InputGroup>
                    <div style={{ width: '100%' }}>
                      <Button 
                        size={Button.SIZES.L}
                        appearance={Button.APPEARANCES.PRIMARY}
                      >
                        Continue
                      </Button>
                    </div>
                  </FormContainer>
                  </LoginBody>
                </LoginCard>
                <FooterLinks>
                  <FooterContent>
                    <FooterLinksRight>
                      <FooterLink href="#">Help</FooterLink>
                      <FooterLink href="#">Privacy</FooterLink>
                      <FooterLink href="#">Terms</FooterLink>
                    </FooterLinksRight>
                  </FooterContent>
                </FooterLinks>
              </LoginContainer>
            </LoginFrame>
      </PreviewSection>

      {/* Document Section */}
      <PreviewSection>
        <SectionLabel>Document Preview</SectionLabel>
        <DocumentFrame>
              <DocumentContainer>
                <DocumentHeaderRow>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DocumentLogo src={documentLogo} alt="Rippling" />
                    <DocumentCompanyName>Acme Industries</DocumentCompanyName>
                  </div>
                  <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    <Button 
                      size={Button.SIZES.M}
                      appearance={Button.APPEARANCES.OUTLINE}
                      icon={{ type: Icon.TYPES.ARROW_DOWN }}
                    >
                      Download
                    </Button>
                  </div>
                </DocumentHeaderRow>

                <InfoRow>
                  <InfoColumn>
                    <InfoLabel>Employer</InfoLabel>
                    <InfoValue>
                      Acme Industries<br />
                      55 2nd st<br />
                      London, England
                    </InfoValue>
                  </InfoColumn>
                  <Divider />
                  <InfoColumn>
                    <InfoLabel>Pay to</InfoLabel>
                    <InfoValue>
                      John Francisco<br />
                      10 Downing st<br />
                      London, England
                    </InfoValue>
                  </InfoColumn>
                </InfoRow>

                <PayrollCard>
                  <PayrollDecoration>🎉</PayrollDecoration>
                  <PayrollContent>
                    <PayrollGreeting>Hello John,</PayrollGreeting>
                    <PayrollPeriod>
                      Your payroll summary for<br />
                      August 15 to August 31, 2022.
                    </PayrollPeriod>
                  </PayrollContent>
                  <PayrollAmount>
                    <AmountLabel>You've been paid</AmountLabel>
                    <Amount>₹ 3,031.57</Amount>
                    <AmountNote>Manual bank transfer on August 31, 2022.</AmountNote>
                  </PayrollAmount>
                </PayrollCard>
              </DocumentContainer>
            </DocumentFrame>
      </PreviewSection>
    </PreviewContainer>
  );
};
