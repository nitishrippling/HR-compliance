import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Tabs from '@rippling/pebble/Tabs';
import { OptionA } from './OptionA';
import { OptionB } from './OptionB';
import { OptionD } from './OptionD';
import { OptionE } from './OptionE';
import { OptionF } from './OptionF';
import { OptionG } from './OptionG';
import { OptionH } from './OptionH';
import { OptionI1 } from './OptionI1';
import { OptionI2 } from './OptionI2';
import { OptionI3 } from './OptionI3';

const TABS = [
  { key: 'A', title: 'A · Mini Tables', description: 'Compact data tables per group with columns tailored to each module type.' },
  { key: 'B', title: 'B · Structured Rows', description: 'List rows with consistent metadata positions — task, action, entity, timing, urgency.' },
  { key: 'D', title: 'D · Action First', description: 'Lead with the action the user needs to take, not the problem name.' },
  { key: 'E', title: 'E · Condensed', description: 'Ultra-compact single-line rows with inline metadata chips for maximum density.' },
  { key: 'F', title: 'F · Split Layout', description: 'Left side = task context, right side = timing and consequences, separated by a divider.' },
  { key: 'G', title: 'G · Rich Table', description: 'Table with multi-line cells — bold primary value + muted secondary detail in each cell.' },
  { key: 'H', title: 'H · WF Summary', description: 'Workforce collapsed into a single summary row with aggregate stats. Registrations & Filings still show individual items with full detail.' },
  { key: 'I1', title: 'I-1 · Cards', description: 'Simplified view — three horizontal summary cards with aggregate counts and urgency stats. No individual tasks. Rippling impact below.' },
  { key: 'I2', title: 'I-2 · Rows', description: 'Ultra-minimal — each module is a single stacked row with total count, action count, and a chevron. Entire overview fits in ~100px. Rippling impact below.' },
  { key: 'I3', title: 'I-3 · Progress', description: 'Summary cards with segmented progress bars showing completed / in-progress / on-track / action-needed breakdown. Visual health indicator per module. Rippling impact below.' },
];

const TAB_COMPONENTS: Record<string, React.FC> = {
  A: OptionA,
  B: OptionB,
  D: OptionD,
  E: OptionE,
  F: OptionF,
  G: OptionG,
  H: OptionH,
  I1: OptionI1,
  I2: OptionI2,
  I3: OptionI3,
};

const Page = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
`;

const Header = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space600} ${({ theme }) => (theme as StyledTheme).space800};
  padding-bottom: 0;
`;

const Title = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const Subtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
  max-width: 720px;
`;

const TabsWrapper = styled.div`
  margin-top: ${({ theme }) => (theme as StyledTheme).space200};
`;

const Content = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const OptionDescription = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  max-width: 960px;
`;

const OverviewExplorationsDemo: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [activeTab, setActiveTab] = useState(0);
  const currentKey = TABS[activeTab].key;
  const ActiveComponent = TAB_COMPONENTS[currentKey];

  return (
    <Page theme={theme}>
      <Header theme={theme}>
        <Title theme={theme}>Overview Task Explorations</Title>
        <Subtitle theme={theme}>
          10 design approaches for representing action items in the Compliance 360 Overview tab. 
          Same data, different visual treatment — compare and evaluate.
        </Subtitle>
        <TabsWrapper theme={theme}>
          <Tabs activeIndex={activeTab} onChange={(index) => setActiveTab(Number(index))}>
            {TABS.map(tab => (
              <Tabs.Tab key={tab.key} title={tab.title} />
            ))}
          </Tabs>
        </TabsWrapper>
      </Header>
      <Content theme={theme}>
        <OptionDescription theme={theme}>
          {TABS[activeTab].description}
        </OptionDescription>
        <ActiveComponent />
      </Content>
    </Page>
  );
};

export default OverviewExplorationsDemo;
