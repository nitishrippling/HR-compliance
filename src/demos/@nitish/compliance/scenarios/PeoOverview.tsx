import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow, SectionHeaderStatsRow,
  SectionName, ViewAllLink, StatGroup, StatLabel, StatValue,
  ActionTable, TableColGroup, ActionTr, ActionTd, TaskName, CategoryText, DueDateText, PenaltyText, ChevronCell,
  ImpactCard, ImpactTitleRow, ImpactTitleText, ImpactSubtitle, ImpactStatsRow, ImpactStat, ImpactStatValue, ImpactStatLabel,
  Banner,
} from './shared-overview-styles';

const PeoOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      <Banner theme={theme}>
        <Icon type={Icon.TYPES.SHIELD_OUTLINE} size={18} color={(theme as StyledTheme).colorOnPrimaryContainer} />
        Your compliance is managed under Rippling PEO. Items below that require your attention are highlighted.
      </Banner>

      {/* Workforce — customer still responsible for I-9, workplace safety */}
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
              <StatValue theme={theme}>3</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Overdue</StatLabel>
              <StatValue theme={theme} variant="error">1</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Resolved</StatLabel>
              <StatValue theme={theme} variant="success">12</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
      </SectionCard>

      {/* Registrations — mostly managed by Rippling */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations &middot; Managed by Rippling</SectionName>
            <ViewAllLink theme={theme}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Active</StatLabel>
              <StatValue theme={theme}>12</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Needs your input</StatLabel>
              <StatValue theme={theme} variant="error">1</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">24</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>Sign TX registration authorization</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>State Tax</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 10, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>Signature required</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* Filings — filed by Rippling */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Filings &middot; Filed by Rippling</SectionName>
            <ViewAllLink theme={theme}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Filed this quarter</StatLabel>
              <StatValue theme={theme}>8</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Needs your review</StatLabel>
              <StatValue theme={theme} variant="error">1</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed (YTD)</StatLabel>
              <StatValue theme={theme} variant="success">31</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>Review and approve Q4 W-2 corrections</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>Federal</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 20, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>Review required</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* Impact — much more prominent for PEO */}
      <ImpactCard theme={theme}>
        <ImpactTitleRow theme={theme}>
          <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
          <ImpactSubtitle theme={theme}>
            Full compliance managed under Rippling PEO
          </ImpactSubtitle>
        </ImpactTitleRow>
        <ImpactStatsRow theme={theme}>
          {[
            { value: '240+', label: 'Hours saved on compliance' },
            { value: '24', label: 'Registrations managed' },
            { value: '31', label: 'Filings submitted by Rippling' },
            { value: '$0', label: 'Penalties incurred' },
            { value: '100%', label: 'On-time filing rate' },
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

export default PeoOverview;
