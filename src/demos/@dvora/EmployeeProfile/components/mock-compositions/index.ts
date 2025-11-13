/**
 * Composition Component Registry
 * 
 * Maps composition systemName to React components.
 * Used by CompositionRenderer to dynamically render compositions.
 */

import React from 'react';
import { PayrollSummaryCard } from './PayrollSummaryCard';
import { TimeOffWidget } from './TimeOffWidget';

/**
 * Registry mapping composition systemName → React component
 */
export const COMPOSITION_COMPONENTS: Record<string, React.ComponentType<Record<string, unknown>>> = {
  'payroll_summary_card_v3': PayrollSummaryCard,
  'time_off_request_widget': TimeOffWidget,
};

/**
 * Get component for a composition by systemName
 */
export function getCompositionComponent(systemName: string): React.ComponentType<Record<string, unknown>> | null {
  return COMPOSITION_COMPONENTS[systemName] || null;
}

/**
 * Check if a composition component exists
 */
export function hasCompositionComponent(systemName: string): boolean {
  return systemName in COMPOSITION_COMPONENTS;
}

