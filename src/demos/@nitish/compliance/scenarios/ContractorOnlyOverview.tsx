import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow, SectionHeaderStatsRow,
  SectionName, ViewAllLink, StatGroup, StatLabel, StatValue,
  ActionTable, TableColGroup, ActionTr, ActionTd, TaskName, CategoryText, DueDateText, PenaltyText, ChevronCell,
} from './shared-overview-styles';

const ContractorOnlyOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* Only Filings — 1099 obligations */}
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
              <StatValue theme={theme} variant="error">2</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">3</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>1099-NEC Filing (2025 Tax Year)</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>Federal</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 31, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>$60-$310/form IRS penalty</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>CA 1099 State Filing</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>State</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 31, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>State reporting requirement</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>
    </TabContent>
  );
};

export default ContractorOnlyOverview;
