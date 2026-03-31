import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { CommandCenterTab, TabId } from './CommandCenterTab';
import { StateTaxAccountsTab } from './StateTaxAccountsTab';
import { LocalTaxAccountsTab } from './LocalTaxAccountsTab';
import { ForeignQualificationTab } from './ForeignQualificationTab';

/* ═══════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;


/* ═══════════════════════════════════════════════════════
   TAB DATA
   ═══════════════════════════════════════════════════════ */

const TABS = [
  'Command center',
  'State tax accounts',
  'Local tax accounts',
  'Foreign qualification',
];

const TAB_ID_MAP: TabId[] = [
  'command-center',
  'state-tax',
  'local-tax',
  'foreign-qual',
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export const EntityTab: React.FC<{ activeSubTab: number; onNavigateSubTab: (idx: number) => void }> = ({
  activeSubTab,
  onNavigateSubTab,
}) => {
  const { theme } = usePebbleTheme();

  function handleNavigateToTab(tabId: TabId) {
    const index = TAB_ID_MAP.indexOf(tabId);
    if (index >= 0) onNavigateSubTab(index);
  }

  return (
    <TabContent theme={theme}>
      {activeSubTab === 0 && <CommandCenterTab onNavigate={handleNavigateToTab} />}
      {activeSubTab === 1 && <StateTaxAccountsTab />}
      {activeSubTab === 2 && <LocalTaxAccountsTab />}
      {activeSubTab === 3 && <ForeignQualificationTab />}
    </TabContent>
  );
};
