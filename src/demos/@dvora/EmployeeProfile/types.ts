/**
 * Type definitions for Employee Profile
 */

/**
 * Employee data structure
 */
export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  manager?: string;
  email?: string;
  phone?: string;
  startDate: string; // ISO date string or formatted date
  location: string;
  address?: string;
  state?: string;
  linkedinProfile?: string;
  legalEntity?: string;
  level?: string;
  teams?: string[];
  jobFamily?: string;
  duties?: string;
  willGetWorkEmail?: boolean;
  status: 'active' | 'inactive' | 'terminated';
  localeRegion?: string;
  eeocEthnicity?: string;
}

/**
 * Composition input parameter definition
 */
export interface CompositionInputParam {
  name: string; // Parameter name (e.g., "employeeId", "period")
  type: 'string' | 'number' | 'boolean' | 'date' | 'object';
  label: string; // Display label
  required?: boolean;
}

/**
 * Field mapping: maps composition input parameter → employee field
 */
export interface FieldMapping {
  paramName: string; // Composition input parameter name
  employeeField: string; // Employee data field name (e.g., "id", "name", "title")
}

/**
 * Composition instance added to a layout section
 */
export interface CompositionInstance {
  id: string; // Unique instance ID
  compositionId: string; // Reference to Composition.id
  compositionSystemName: string; // Reference to Composition.systemName
  fieldMappings: FieldMapping[]; // How to map employee data to composition inputs
}

/**
 * Layout section (e.g., "Role information", "Personal information")
 */
export interface LayoutSection {
  id: string; // Section ID (e.g., "role-information")
  label: string; // Display name (e.g., "Role information")
  compositionInstances: CompositionInstance[]; // Compositions added to this section
  staticSectionIndex?: number; // Position of static section among compositions (0 = first, undefined = first)
}

/**
 * Profile layout configuration
 */
export interface ProfileLayout {
  id: string;
  name: string; // e.g., "Default", "Profile admin view"
  lastModified: string; // ISO date string
  lastModifiedBy: string; // User name
  sections: LayoutSection[]; // All sections in this layout
}

