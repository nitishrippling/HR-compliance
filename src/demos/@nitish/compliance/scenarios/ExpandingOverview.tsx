import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow, SectionHeaderStatsRow,
  SectionName, ViewAllLink, StatGroup, StatLabel, StatValue,
  ActionTable, TableColGroup, ActionTr, ActionTd, TaskName, CategoryText, DueDateText, PenaltyText, ChevronCell,
  ImpactCard, ImpactTitleRow, ImpactTitleText, ImpactSubtitle, ImpactStatsRow, ImpactStat, ImpactStatValue, ImpactStatLabel,
} from './shared-overview-styles';

const REG_ACTIONS = [
  { task: 'Texas Withholding Registration', category: 'State Tax', date: 'Feb 28, 2026', penalty: '$250 fine already charged', charged: true },
  { task: 'Ohio Municipal Tax Setup', category: 'Local Tax', date: 'Mar 1, 2026', penalty: '2 days left before $250 fee', charged: false },
  { task: 'Colorado SIT Registration', category: 'State Tax', date: 'Mar 8, 2026', penalty: '9 days left before $250 fee', charged: false },
  { task: 'Georgia Withholding Registration', category: 'State Tax', date: 'Mar 12, 2026', penalty: '13 days left before $250 fee', charged: false },
  { task: 'Washington State SUI', category: 'State Tax', date: 'Mar 15, 2026', penalty: '16 days left before $250 fee', charged: false },
  { task: 'FL Foreign Qualification', category: 'Foreign Qualification', date: 'Mar 20, 2026', penalty: '21 days left before $250 fee', charged: false },
];

const FILING_ACTIONS = [
  { subject: '941-X Amendment (Q3 2025)', category: 'Federal', date: 'Mar 15, 2026', risk: '0.5%/mo failure-to-pay penalty' },
  { subject: 'EEO-1 Component 1 Report', category: 'Federal', date: 'Mar 31, 2026', risk: 'EEOC enforcement action risk' },
  { subject: 'Q1 CA Withholding Return', category: 'State', date: 'Apr 30, 2026', risk: '15% late penalty (CA EDD)' },
  { subject: 'Q1 CO Withholding Return', category: 'State', date: 'Apr 30, 2026', risk: '10% late penalty (CO DOR)' },
];

const ExpandingOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* Workforce */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Workforce</SectionName>
            <ViewAllLink theme={theme}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Open issues</StatLabel>
              <StatValue theme={theme}>36</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Overdue</StatLabel>
              <StatValue theme={theme} variant="error">8</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Resolved</StatLabel>
              <StatValue theme={theme} variant="success">22</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Avg. resolution</StatLabel>
              <StatValue theme={theme}>5.4</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
      </SectionCard>

      {/* Registrations — high volume */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations</SectionName>
            <ViewAllLink theme={theme}>
              View all 12 items
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Action required</StatLabel>
              <StatValue theme={theme} variant="error">6</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>6</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">18</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {REG_ACTIONS.map((item, i) => (
                <ActionTr key={i} theme={theme}>
                  <ActionTd theme={theme}>
                    <TaskName theme={theme}>{item.task}</TaskName>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <CategoryText theme={theme}>{item.category}</CategoryText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <DueDateText theme={theme}>Due {item.date}</DueDateText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <PenaltyText theme={theme} isCharged={item.charged}>
                      {item.penalty}
                    </PenaltyText>
                  </ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* Filings — also more volume */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Filings</SectionName>
            <ViewAllLink theme={theme}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Action required</StatLabel>
              <StatValue theme={theme} variant="error">4</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>2</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">7</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              {FILING_ACTIONS.map((item, i) => (
                <ActionTr key={i} theme={theme}>
                  <ActionTd theme={theme}>
                    <TaskName theme={theme}>{item.subject}</TaskName>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <CategoryText theme={theme}>{item.category}</CategoryText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <DueDateText theme={theme}>Due {item.date}</DueDateText>
                  </ActionTd>
                  <ActionTd theme={theme}>
                    <PenaltyText theme={theme}>{item.risk}</PenaltyText>
                  </ActionTd>
                  <ChevronCell theme={theme}>
                    <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                  </ChevronCell>
                </ActionTr>
              ))}
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* Impact */}
      <ImpactCard theme={theme}>
        <ImpactTitleRow theme={theme}>
          <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
          <ImpactSubtitle theme={theme}>
            Registrations &amp; filings managed by Rippling
          </ImpactSubtitle>
        </ImpactTitleRow>
        <ImpactStatsRow theme={theme}>
          {[
            { value: '62+', label: 'Hours saved on registrations' },
            { value: '18', label: 'State registrations completed' },
            { value: '5', label: 'Local registrations completed' },
            { value: '7', label: 'Filings submitted by Rippling' },
            { value: '100%', label: 'On-time filing rate (YTD)' },
          ].map(m => (
            <ImpactStat key={m.label}>
              <ImpactStatValue theme={theme}>{m.value}</ImpactStatValue>
              <ImpactStatLabel theme={theme}>{m.label}</ImpactStatLabel>
            </ImpactStat>
          ))}
        </ImpactStatsRow>
      </ImpactCard>
    </TabContent>
  );
};

export default ExpandingOverview;
