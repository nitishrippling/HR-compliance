import React from 'react';
import { NavigationShell, ViewType } from './compliance/NavigationShell';

/**
 * Compliance Demo
 *
 * Full navigation flow:
 * 1. Home page — "Hello, John" greeting, tasks card, Rippling apps grid
 * 2. Click "HR" in sidebar → opens HR Services submenu panel
 * 3. Click "Compliance 360" in submenu → navigates to Compliance 360 hub
 * 4. Compliance 360 has 6 tabs, one per compliance category
 * 5. Click the Rippling logo → returns to Home
 *
 * Pass initialView="compliance-360" to start directly on the Compliance 360 page.
 */

interface ComplianceDemoProps {
  initialView?: ViewType;
}

const ComplianceDemo: React.FC<ComplianceDemoProps> = ({ initialView }) => (
  <NavigationShell initialView={initialView} />
);

export default ComplianceDemo;
