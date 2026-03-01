import React, { useState } from 'react';
import Icon from '@rippling/pebble/Icon';
import { AppShellLayout, NavSectionData } from '@/components/app-shell';
import { CommandCenterTab, TabId } from './compliance/CommandCenterTab';
import { StateTaxAccountsTab } from './compliance/StateTaxAccountsTab';
import { LocalTaxAccountsTab } from './compliance/LocalTaxAccountsTab';
import { ForeignQualificationTab } from './compliance/ForeignQualificationTab';
import { AdditionalFilingsTab } from './compliance/AdditionalFilingsTab';
import { WorkplacePostersTab } from './compliance/WorkplacePostersTab';

/**
 * Compliance Demo
 *
 * HR Services Compliance Hub converted from Next.js to Pebble Playground.
 * Features:
 * - Command Center with KPI metrics, action items, and service overview cards
 * - State Tax Accounts with searchable data table
 * - Local Tax Accounts with searchable data table
 * - Foreign Qualification tracking
 * - Additional Filings with year filter
 * - Workplace Posters distribution tracking
 * - AI-powered help drawer for compliance guidance
 *
 * Components used:
 * - AppShellLayout (shared app shell)
 * - Button, Icon, Input.Text, Dropdown, Drawer (Pebble)
 * - Custom styled tables with theme tokens
 */

const tabs = [
  'Command Center',
  'State Tax Accounts',
  'Local Tax Accounts',
  'Foreign Qualification',
  'Additional Filings',
  'Workplace Posters',
];

const tabIdMap: TabId[] = [
  'command-center',
  'state-tax',
  'local-tax',
  'foreign-qual',
  'additional-filings',
  'workplace-posters',
];

const ComplianceDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const orgChartSection: NavSectionData = {
    items: [
      { id: 'org-chart', label: 'Org Chart', icon: Icon.TYPES.HIERARCHY_HORIZONTAL_OUTLINE },
    ],
  };

  const appsSection: NavSectionData = {
    items: [
      { id: 'favorites', label: 'Favorites', icon: Icon.TYPES.STAR_OUTLINE, hasSubmenu: true },
      { id: 'time', label: 'Time', icon: Icon.TYPES.TIME_OUTLINE, hasSubmenu: true },
      { id: 'benefits', label: 'Benefits', icon: Icon.TYPES.HEART_OUTLINE, hasSubmenu: true },
      { id: 'payroll', label: 'Payroll', icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE, hasSubmenu: true },
      { id: 'hr-services', label: 'HR Services', icon: Icon.TYPES.SHIELD_OUTLINE, hasSubmenu: true },
      { id: 'finance', label: 'Finance', icon: Icon.TYPES.CREDIT_CARD_OUTLINE, hasSubmenu: true },
      { id: 'talent', label: 'Talent', icon: Icon.TYPES.TALENT_OUTLINE, hasSubmenu: true },
      { id: 'it', label: 'IT', icon: Icon.TYPES.LAPTOP_OUTLINE, hasSubmenu: true },
      { id: 'data', label: 'Data', icon: Icon.TYPES.BAR_CHART_OUTLINE, hasSubmenu: true },
      { id: 'custom-apps', label: 'Custom Apps', icon: Icon.TYPES.CUSTOM_APPS_OUTLINE, hasSubmenu: true },
    ],
  };

  const platformSection: NavSectionData = {
    label: 'Platform',
    items: [
      { id: 'tools', label: 'Tools', icon: Icon.TYPES.WRENCH_OUTLINE, hasSubmenu: true },
      { id: 'company-settings', label: 'Company settings', icon: Icon.TYPES.SETTINGS_OUTLINE, hasSubmenu: true },
      { id: 'app-shop', label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
      { id: 'help', label: 'Help', icon: Icon.TYPES.QUESTION_CIRCLE_OUTLINE },
    ],
  };

  function handleNavigateToTab(tabId: TabId) {
    const index = tabIdMap.indexOf(tabId);
    if (index >= 0) {
      setActiveTab(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <AppShellLayout
      pageTitle="HR Services, Compliance Hub"
      pageTabs={tabs}
      defaultActiveTab={0}
      onTabChange={setActiveTab}
      mainNavSections={[orgChartSection, appsSection]}
      platformNavSection={platformSection}
      companyName="Acme, Inc."
      userInitial="A"
      showNotificationBadge
      notificationCount={3}
    >
      {activeTab === 0 && <CommandCenterTab onNavigate={handleNavigateToTab} />}
      {activeTab === 1 && <StateTaxAccountsTab />}
      {activeTab === 2 && <LocalTaxAccountsTab />}
      {activeTab === 3 && <ForeignQualificationTab />}
      {activeTab === 4 && <AdditionalFilingsTab />}
      {activeTab === 5 && <WorkplacePostersTab />}
    </AppShellLayout>
  );
};

export default ComplianceDemo;
