import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Page from '@rippling/pebble/Page';
import Tabs from '@rippling/pebble/Tabs';
import { SubTabs } from './shared-styles';
import { OverviewV3Tab } from './OverviewV3Tab';
import { WorkforceTab } from './WorkforceTab';
import { RegistrationsTab } from './RegistrationsTab';
import { FilingsV3Tab } from './FilingsV3Tab';
import { OthersV3Tab } from './OthersV3Tab';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const HeaderArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
`;

const PageHeaderWrapper = styled.div`
  padding-left: ${({ theme }) => (theme as StyledTheme).space1400};
  padding-right: ${({ theme }) => (theme as StyledTheme).space1400};

  & > div {
    margin-bottom: 0 !important;
  }

  & div[class*='Content'] {
    margin-top: ${({ theme }) => (theme as StyledTheme).space1000} !important;
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space200} !important;
  }
`;

const TabsWrapper = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1400};

  & > div,
  & div[class*='StyledScroll'],
  & div[class*='StyledTabContainer'] {
    box-shadow: none !important;
  }
`;

const SubTabsBar = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space300} ${(theme as StyledTheme).space1400}`};
`;

const ContentArea = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1400}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  flex: 1;
`;

const TAB_NAMES = ['Overview', 'Workforce', 'Registrations', 'Filings', 'Others'];

const SUB_TABS: Record<number, string[]> = {
  1: ['Current', 'Historical'],
  2: ['State tax accounts', 'Local tax accounts', 'Foreign qualification'],
  3: ['Current', 'Historical'],
};


export const Compliance360V3Page: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [subTabIndices, setSubTabIndices] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  const currentSubTabs = SUB_TABS[activeTab];
  const activeSubTab = subTabIndices[activeTab] ?? 0;

  function handleSubTabChange(idx: number) {
    setSubTabIndices(prev => ({ ...prev, [activeTab]: idx }));
  }

  function handleNavigateToModule(tabIndex: number, subTabIndex?: number) {
    setActiveTab(tabIndex);
    if (subTabIndex !== undefined) {
      setSubTabIndices(prev => ({ ...prev, [tabIndex]: subTabIndex }));
    }
  }

  return (
    <PageWrapper theme={theme}>
      <HeaderArea theme={theme}>
        <PageHeaderWrapper theme={theme}>
          <Page.Header
            title="Compliance 360"
            shouldBeUnderlined={false}
            size={Page.Header.SIZES.FLUID}
          />
        </PageHeaderWrapper>

        <TabsWrapper theme={theme}>
          <Tabs.LINK
            activeIndex={activeTab}
            onChange={idx => setActiveTab(Number(idx))}
          >
            {TAB_NAMES.map((name, i) => (
              <Tabs.Tab key={`c360v3-tab-${i}`} title={name} />
            ))}
          </Tabs.LINK>
        </TabsWrapper>
      </HeaderArea>

      {currentSubTabs && (
        <SubTabsBar theme={theme}>
          <SubTabs
            tabs={currentSubTabs}
            activeIndex={activeSubTab}
            onChange={handleSubTabChange}
          />
        </SubTabsBar>
      )}

      <ContentArea theme={theme}>
        {activeTab === 0 && <OverviewV3Tab onNavigateToModule={handleNavigateToModule} />}
        {activeTab === 1 && <WorkforceTab activeSubTab={activeSubTab} />}
        {activeTab === 2 && <RegistrationsTab activeSubTab={activeSubTab} />}
        {activeTab === 3 && <FilingsV3Tab activeSubTab={activeSubTab} />}
        {activeTab === 4 && <OthersV3Tab />}
      </ContentArea>
    </PageWrapper>
  );
};
