import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Tabs from '@rippling/pebble/Tabs';

import StandardOverview from './StandardOverview';
import PeoOverview from './PeoOverview';
import HrisOnlyOverview from './HrisOnlyOverview';
import AllGreenOverview from './AllGreenOverview';
import OnboardingOverview from './OnboardingOverview';
import ExpandingOverview from './ExpandingOverview';
import ContractorOnlyOverview from './ContractorOnlyOverview';

const SCENARIOS = [
  { label: 'Standard (HRIS + Payroll)', component: StandardOverview },
  { label: 'PEO (Co-Employment)', component: PeoOverview },
  { label: 'HRIS Only (No Payroll)', component: HrisOnlyOverview },
  { label: 'All Caught Up', component: AllGreenOverview },
  { label: 'New Company / Onboarding', component: OnboardingOverview },
  { label: 'Expanding to New States', component: ExpandingOverview },
  { label: 'Contractor Only', component: ContractorOnlyOverview },
];

const PageWrapper = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-height: 100%;
`;

const HeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const PageHeaderWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => (theme as StyledTheme).space600}
    ${({ theme }) => (theme as StyledTheme).space800} 0;
`;

const PageTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const PageSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const TabsWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space800};
`;

const ContentArea = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => (theme as StyledTheme).space600}
    ${({ theme }) => (theme as StyledTheme).space800}
    ${({ theme }) => (theme as StyledTheme).space1200};
`;

export const ComplianceScenariosPage: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);

  const ActiveComponent = SCENARIOS[activeTab].component;

  return (
    <PageWrapper theme={theme}>
      <HeaderArea theme={theme}>
        <PageHeaderWrapper theme={theme}>
          <PageTitle theme={theme}>Compliance 360 — Scenario Explorer</PageTitle>
          <PageSubtitle theme={theme}>
            How the Overview tab adapts across different customer types and states
          </PageSubtitle>
        </PageHeaderWrapper>
        <TabsWrapper theme={theme}>
          <Tabs activeIndex={activeTab} onChange={(i) => setActiveTab(Number(i))}>
            {SCENARIOS.map((s) => (
              <Tabs.Tab key={s.label} title={s.label} />
            ))}
          </Tabs>
        </TabsWrapper>
      </HeaderArea>

      <ContentArea theme={theme}>
        <ActiveComponent />
      </ContentArea>
    </PageWrapper>
  );
};
