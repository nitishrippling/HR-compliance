import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Page from '@rippling/pebble/Page';
import Tabs from '@rippling/pebble/Tabs';
import { CommandCenterTab, TabId } from './CommandCenterTab';
import { StateTaxAccountsTab } from './StateTaxAccountsTab';
import { LocalTaxAccountsTab } from './LocalTaxAccountsTab';
import { ForeignQualificationTab } from './ForeignQualificationTab';

interface ComplianceHubContentProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  onBack?: () => void;
}

/* ─────────────────── Layout (mirrors AppShellLayout internals) ─────────────────── */

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const PageHeaderArea = styled.div`
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

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space1400} 0;
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  &:hover { text-decoration: underline; }
`;

const BreadcrumbSep = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const BreadcrumbCurrent = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PageContent = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) =>
    `${(theme as StyledTheme).space800} ${(theme as StyledTheme).space1400}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  flex: 1;
`;

/* ─────────────────── Tab data ─────────────────── */

const TABS = [
  'Command Center',
  'State Tax Accounts',
  'Local Tax Accounts',
  'Foreign Qualification',
];

const TAB_ID_MAP: TabId[] = [
  'command-center',
  'state-tax',
  'local-tax',
  'foreign-qual',
];

/* ─────────────────── Component ─────────────────── */

export const ComplianceHubContent: React.FC<ComplianceHubContentProps> = ({
  activeTab,
  onTabChange,
  onBack,
}) => {
  const { theme } = usePebbleTheme();

  function handleNavigateToTab(tabId: TabId) {
    const index = TAB_ID_MAP.indexOf(tabId);
    if (index >= 0) {
      onTabChange(index);
    }
  }

  return (
    <ContentContainer theme={theme}>
      {/* Page header with tabs */}
      <PageHeaderArea theme={theme}>
        {onBack && (
          <Breadcrumb theme={theme}>
            <BreadcrumbLink theme={theme} onClick={onBack}>Compliance 360</BreadcrumbLink>
            <BreadcrumbSep theme={theme}>/</BreadcrumbSep>
            <BreadcrumbCurrent theme={theme}>Entity</BreadcrumbCurrent>
          </Breadcrumb>
        )}
        <PageHeaderWrapper theme={theme}>
          <Page.Header
            title="Entity"
            shouldBeUnderlined={false}
            size={Page.Header.SIZES.FLUID}
          />
        </PageHeaderWrapper>

        <TabsWrapper theme={theme}>
          <Tabs.LINK
            activeIndex={activeTab}
            onChange={idx => onTabChange(Number(idx))}
          >
            {TABS.map((tab, index) => (
              <Tabs.Tab key={`hub-tab-${index}`} title={tab} />
            ))}
          </Tabs.LINK>
        </TabsWrapper>
      </PageHeaderArea>

      {/* Tab content */}
      <PageContent theme={theme}>
        {activeTab === 0 && <CommandCenterTab onNavigate={handleNavigateToTab} />}
        {activeTab === 1 && <StateTaxAccountsTab />}
        {activeTab === 2 && <LocalTaxAccountsTab />}
        {activeTab === 3 && <ForeignQualificationTab />}
      </PageContent>
    </ContentContainer>
  );
};
