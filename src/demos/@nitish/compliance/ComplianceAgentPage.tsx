import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { getStateColor } from '@rippling/pebble/theme';
import Page from '@rippling/pebble/Page';
import Tabs from '@rippling/pebble/Tabs';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';
import { SubTabs } from './shared-styles';
import { WorkforceTab } from './WorkforceTab';
import { RegistrationsTab } from './RegistrationsTab';
import { FilingsV3Tab } from './FilingsV3Tab';
import { OthersV3Tab } from './OthersV3Tab';
import { AgentRegistrationDrawer } from './AgentRegistrationDrawer';

/* ═══════════════════════════════════════════════════════
   OVERVIEW DATA (same as V5 + agent metadata)
   ═══════════════════════════════════════════════════════ */

interface RegistrationAction {
  task: string;
  category: string;
  dueDate: string;
  risk: string;
  isCharged?: boolean;
  hasAgent: boolean;
  tabIndex: number;
  subTabIndex?: number;
}

const REGISTRATION_ACTIONS: RegistrationAction[] = [
  {
    task: 'Texas Withholding Registration',
    category: 'State Tax',
    dueDate: 'Feb 28, 2026',
    risk: '$250 fine already charged',
    isCharged: true,
    hasAgent: true,
    tabIndex: 1,
    subTabIndex: 0,
  },
  {
    task: 'Ohio Municipal Tax Setup',
    category: 'Local Tax',
    dueDate: 'Mar 1, 2026',
    risk: '2 days left before $250 fee',
    hasAgent: false,
    tabIndex: 1,
    subTabIndex: 1,
  },
  {
    task: 'Upload Certificate of Incorporation',
    category: 'Foreign Qualification',
    dueDate: 'Mar 5, 2026',
    risk: '6 days left before $250 fee',
    hasAgent: false,
    tabIndex: 1,
    subTabIndex: 2,
  },
];

const WORKFORCE_OVERDUE = [
  { issue: 'Sick leave violation', employee: 'Deann Aaron', deadline: 'Jun 11, 2022', issueType: 'Leave Law', tabIndex: 3 },
  { issue: 'Sick leave violation', employee: 'Eric Abernathy', deadline: 'Jun 8, 2022', issueType: 'Leave Law', tabIndex: 3 },
  { issue: 'I-9 re-verification', employee: 'Sarah Chen', deadline: 'Jun 1, 2022', issueType: 'I-9 Compliance', tabIndex: 3 },
];

const IMPACT_METRICS = [
  { value: '62+', label: 'Hours saved' },
  { value: '18', label: 'State registrations done' },
  { value: '5', label: 'Local registrations done' },
  { value: '6', label: 'Foreign qualifications done' },
  { value: '4', label: 'Filings submitted' },
];

/* ═══════════════════════════════════════════════════════
   LAYOUT SHELL
   ═══════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════
   OVERVIEW — SUMMARY CARDS
   ═══════════════════════════════════════════════════════ */

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const SummaryCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  cursor: pointer;
  transition: background-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active {
    background-color: ${({ theme }) =>
      getStateColor((theme as StyledTheme).colorSurfaceBright, 'hover')};
  }
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CardNumber = styled.span<{ variant?: 'error' | 'success' | 'default' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 600;
  color: ${({ variant, theme }) => {
    const t = theme as StyledTheme;
    if (variant === 'error') return t.colorError;
    if (variant === 'success') return t.colorSuccess;
    return t.colorOnSurface;
  }};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

/* ═══════════════════════════════════════════════════════
   OVERVIEW — ACTION TABLE
   ═══════════════════════════════════════════════════════ */

const SectionCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const SectionName = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
  font-weight: 600;
`;

const ViewAllLink = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: none;
  border: none;
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  white-space: nowrap;
  &:hover { text-decoration: underline; }
`;

const COL_WIDTHS = { subject: '28%', category: '16%', dueDate: '16%', risk: '28%', agent: '80px', chevron: '32px' };

const TableColGroup = () => (
  <colgroup>
    <col style={{ width: COL_WIDTHS.subject }} />
    <col style={{ width: COL_WIDTHS.category }} />
    <col style={{ width: COL_WIDTHS.dueDate }} />
    <col style={{ width: COL_WIDTHS.risk }} />
    <col style={{ width: COL_WIDTHS.agent }} />
    <col style={{ width: COL_WIDTHS.chevron }} />
  </colgroup>
);

const ActionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const ActionTr = styled.tr<{ highlighted?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  cursor: pointer;
  transition: background-color 120ms ease;
  background-color: ${({ highlighted, theme }) =>
    highlighted ? (theme as StyledTheme).colorPrimaryContainer : 'transparent'};
  &:last-child { border-bottom: none; }
  &:hover {
    background-color: ${({ highlighted, theme }) =>
      highlighted
        ? getStateColor((theme as StyledTheme).colorPrimaryContainer, 'hover')
        : (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const ActionTd = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  vertical-align: middle;
`;

const CellText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const CellTextBold = styled(CellText)`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const RiskText = styled.span<{ isCharged?: boolean }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ isCharged }) => (isCharged ? 'rgb(183,28,28)' : 'rgb(100,100,100)')};
  font-weight: ${({ isCharged }) => (isCharged ? 500 : 400)};
`;

const AgentCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  white-space: nowrap;
`;

const AgentBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
`;

const ChevronCell = styled.td`
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  vertical-align: middle;
  width: 32px;
`;

/* ═══════════════════════════════════════════════════════
   OVERVIEW — IMPACT
   ═══════════════════════════════════════════════════════ */

const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactTitleText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ImpactStatsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space1600};
  flex-wrap: wrap;
`;

const ImpactStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ImpactStatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  font-weight: 600;
`;

const ImpactStatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ═══════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

const TAB_NAMES = ['Overview', 'Registrations', 'Filings', 'Workforce', 'Posters & Mails'];

const SUB_TABS: Record<number, string[]> = {
  1: ['State tax accounts', 'Local tax accounts', 'Foreign qualification'],
  2: ['Current', 'Historical'],
  3: ['Current', 'Historical'],
};

const REG_SUB_TAB_COUNTS = [1, 1, 1];

export const ComplianceAgentPage: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [subTabIndices, setSubTabIndices] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [agentDrawerOpen, setAgentDrawerOpen] = useState(false);

  const currentSubTabs = SUB_TABS[activeTab];
  const activeSubTab = subTabIndices[activeTab] ?? 0;
  const subTabBadges = activeTab === 1 ? REG_SUB_TAB_COUNTS : undefined;

  const regCount = REGISTRATION_ACTIONS.length;
  const filCount = 0;
  const wfCount = 24;

  function handleSubTabChange(idx: number) {
    setSubTabIndices(prev => ({ ...prev, [activeTab]: idx }));
  }

  function handleNavigateToModule(tabIndex: number, subTabIndex?: number) {
    setActiveTab(tabIndex);
    if (subTabIndex !== undefined) {
      setSubTabIndices(prev => ({ ...prev, [tabIndex]: subTabIndex }));
    }
  }

  function handleRowClick(item: RegistrationAction) {
    if (item.hasAgent) {
      setAgentDrawerOpen(true);
    } else {
      handleNavigateToModule(item.tabIndex, item.subTabIndex);
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
              <Tabs.Tab key={`ca-tab-${i}`} title={name} />
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
            badges={subTabBadges}
          />
        </SubTabsBar>
      )}

      <ContentArea theme={theme}>
        {/* ── Overview Tab ── */}
        {activeTab === 0 && (
          <TabContent theme={theme}>
            {/* Summary Cards */}
            <SummaryRow theme={theme}>
              <SummaryCard theme={theme} onClick={() => handleNavigateToModule(1)}>
                <CardTitleRow theme={theme}>
                  <CardTitle theme={theme}>Registrations</CardTitle>
                  <AgentBadge theme={theme}>
                    <Icon type={Icon.TYPES.RIPPLING_AI} size={11} color={(theme as StyledTheme).colorPrimary} />
                    Agent ready
                  </AgentBadge>
                </CardTitleRow>
                <CardNumber theme={theme} variant={regCount > 0 ? 'error' : 'success'}>
                  {regCount}
                </CardNumber>
                <CardFooter theme={theme}>
                  <Label
                    size={Label.SIZES.M}
                    appearance={regCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
                  >
                    {regCount > 0 ? 'Action required' : 'All caught up'}
                  </Label>
                </CardFooter>
              </SummaryCard>

              <SummaryCard theme={theme} onClick={() => handleNavigateToModule(2)}>
                <CardTitleRow theme={theme}>
                  <CardTitle theme={theme}>Filings</CardTitle>
                </CardTitleRow>
                <CardNumber theme={theme} variant={filCount > 0 ? 'error' : 'success'}>
                  {filCount}
                </CardNumber>
                <CardFooter theme={theme}>
                  <Label
                    size={Label.SIZES.M}
                    appearance={filCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
                  >
                    {filCount > 0 ? 'Action required' : 'All caught up'}
                  </Label>
                </CardFooter>
              </SummaryCard>

              <SummaryCard theme={theme} onClick={() => handleNavigateToModule(3)}>
                <CardTitleRow theme={theme}>
                  <CardTitle theme={theme}>Workforce</CardTitle>
                </CardTitleRow>
                <CardNumber theme={theme} variant={wfCount > 0 ? 'error' : 'success'}>
                  {wfCount}
                </CardNumber>
                <CardFooter theme={theme}>
                  <Label
                    size={Label.SIZES.M}
                    appearance={wfCount > 0 ? Label.APPEARANCES.ERROR : Label.APPEARANCES.SUCCESS}
                  >
                    {wfCount > 0 ? 'Outstanding issues' : 'All caught up'}
                  </Label>
                </CardFooter>
              </SummaryCard>
            </SummaryRow>

            {/* Registrations table */}
            {regCount > 0 && (
              <SectionCard theme={theme}>
                <SectionHeader theme={theme}>
                  <SectionName theme={theme}>Registrations</SectionName>
                  <ViewAllLink theme={theme} onClick={() => handleNavigateToModule(1)}>
                    View all
                    <Icon
                      type={Icon.TYPES.CHEVRON_RIGHT}
                      size={12}
                      color={(theme as StyledTheme).colorOnSurface}
                    />
                  </ViewAllLink>
                </SectionHeader>
                <ActionTable>
                  <TableColGroup />
                  <tbody>
                    {REGISTRATION_ACTIONS.map((item, i) => (
                      <ActionTr
                        key={i}
                        theme={theme}
                        highlighted={item.hasAgent}
                        onClick={() => handleRowClick(item)}
                      >
                        <ActionTd theme={theme}>
                          <CellTextBold theme={theme}>
                            {item.task}
                            {item.hasAgent && (
                              <Icon
                                type={Icon.TYPES.RIPPLING_AI}
                                size={14}
                                color={(theme as StyledTheme).colorPrimary}
                              />
                            )}
                          </CellTextBold>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <CellText theme={theme}>{item.category}</CellText>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <CellText theme={theme}>Due {item.dueDate}</CellText>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <RiskText theme={theme} isCharged={item.isCharged}>
                            {item.risk}
                          </RiskText>
                        </ActionTd>
                        <AgentCell theme={theme}>
                          {item.hasAgent && (
                            <AgentBadge theme={theme}>
                              <Icon
                                type={Icon.TYPES.RIPPLING_AI}
                                size={11}
                                color={(theme as StyledTheme).colorPrimary}
                              />
                              Agent
                            </AgentBadge>
                          )}
                        </AgentCell>
                        <ChevronCell theme={theme}>
                          <Icon
                            type={Icon.TYPES.CHEVRON_RIGHT}
                            size={16}
                            color={(theme as StyledTheme).colorOnSurfaceVariant}
                          />
                        </ChevronCell>
                      </ActionTr>
                    ))}
                  </tbody>
                </ActionTable>
              </SectionCard>
            )}

            {/* Workforce table */}
            {WORKFORCE_OVERDUE.length > 0 && (
              <SectionCard theme={theme}>
                <SectionHeader theme={theme}>
                  <SectionName theme={theme}>Workforce</SectionName>
                  <ViewAllLink theme={theme} onClick={() => handleNavigateToModule(3)}>
                    View all
                    <Icon
                      type={Icon.TYPES.CHEVRON_RIGHT}
                      size={12}
                      color={(theme as StyledTheme).colorOnSurface}
                    />
                  </ViewAllLink>
                </SectionHeader>
                <ActionTable>
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '32px' }} />
                  </colgroup>
                  <tbody>
                    {WORKFORCE_OVERDUE.map((item, i) => (
                      <ActionTr key={i} theme={theme} onClick={() => handleNavigateToModule(item.tabIndex)}>
                        <ActionTd theme={theme}>
                          <CellTextBold theme={theme}>{item.issue}</CellTextBold>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <CellText theme={theme}>{item.employee}</CellText>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <CellText theme={theme}>Due {item.deadline}</CellText>
                        </ActionTd>
                        <ActionTd theme={theme}>
                          <CellText theme={theme}>{item.issueType}</CellText>
                        </ActionTd>
                        <ChevronCell theme={theme}>
                          <Icon
                            type={Icon.TYPES.CHEVRON_RIGHT}
                            size={16}
                            color={(theme as StyledTheme).colorOnSurfaceVariant}
                          />
                        </ChevronCell>
                      </ActionTr>
                    ))}
                  </tbody>
                </ActionTable>
              </SectionCard>
            )}

            {/* Impact */}
            <ImpactCard theme={theme}>
              <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
              <ImpactStatsRow theme={theme}>
                {IMPACT_METRICS.map(m => (
                  <ImpactStat key={m.label}>
                    <ImpactStatValue theme={theme}>{m.value}</ImpactStatValue>
                    <ImpactStatLabel theme={theme}>{m.label}</ImpactStatLabel>
                  </ImpactStat>
                ))}
              </ImpactStatsRow>
            </ImpactCard>
          </TabContent>
        )}

        {activeTab === 1 && <RegistrationsTab activeSubTab={activeSubTab} />}
        {activeTab === 2 && <FilingsV3Tab activeSubTab={activeSubTab} />}
        {activeTab === 3 && <WorkforceTab activeSubTab={activeSubTab} />}
        {activeTab === 4 && <OthersV3Tab />}
      </ContentArea>

      {/* Agent drawer */}
      <AgentRegistrationDrawer
        open={agentDrawerOpen}
        onClose={() => setAgentDrawerOpen(false)}
      />
    </PageWrapper>
  );
};
