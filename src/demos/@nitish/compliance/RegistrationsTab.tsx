import React from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import { StateTaxAccountsV3 } from './StateTaxAccountsV3';
import { LocalTaxAccountsV3 } from './LocalTaxAccountsV3';
import { ForeignQualificationV3 } from './ForeignQualificationV3';

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const RegistrationsTab: React.FC<{ activeSubTab: number }> = ({ activeSubTab }) => {
  return (
    <TabContent>
      {activeSubTab === 0 && <StateTaxAccountsV3 />}
      {activeSubTab === 1 && <LocalTaxAccountsV3 />}
      {activeSubTab === 2 && <ForeignQualificationV3 />}
    </TabContent>
  );
};
