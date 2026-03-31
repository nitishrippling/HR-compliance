import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow, SectionHeaderStatsRow,
  SectionName, ViewAllLink, StatGroup, StatLabel, StatValue,
  ActionTable, TableColGroup, ActionTr, ActionTd, TaskName, CategoryText, DueDateText, PenaltyText, ChevronCell,
  EmptyCardBody, EmptyCardText, EmptyCardCta,
  ImpactCard, ImpactTitleRow, ImpactTitleText, ImpactSubtitle, ImpactStatsRow, ImpactStat, ImpactStatValue, ImpactStatLabel,
} from './shared-overview-styles';

const HrisOnlyOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* Workforce — still fully relevant */}
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
              <StatValue theme={theme}>8</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Overdue</StatLabel>
              <StatValue theme={theme} variant="error">2</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Resolved</StatLabel>
              <StatValue theme={theme} variant="success">14</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Avg. resolution</StatLabel>
              <StatValue theme={theme}>3.8</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
      </SectionCard>

      {/* Registrations — empty, payroll not enabled */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations</SectionName>
          </SectionHeaderTopRow>
        </SectionHeader>
        <EmptyCardBody theme={theme}>
          <EmptyCardText theme={theme}>
            Tax registrations are managed through Payroll.{' '}
            <EmptyCardCta theme={theme}>Enable Payroll</EmptyCardCta>{' '}
            to track and manage state &amp; local tax registrations.
          </EmptyCardText>
        </EmptyCardBody>
      </SectionCard>

      {/* Filings — only non-payroll filings */}
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
              <StatValue theme={theme} variant="success">1</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>

        <div>
          <ActionTable>
            <TableColGroup />
            <tbody>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>EEO-1 Component 1 Report</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>Federal</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 31, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>EEOC enforcement action risk</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
              <ActionTr theme={theme}>
                <ActionTd theme={theme}>
                  <TaskName theme={theme}>ACA 1095-C Reporting</TaskName>
                </ActionTd>
                <ActionTd theme={theme}>
                  <CategoryText theme={theme}>Federal</CategoryText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <DueDateText theme={theme}>Due Mar 31, 2026</DueDateText>
                </ActionTd>
                <ActionTd theme={theme}>
                  <PenaltyText theme={theme}>$310/employee IRS penalty</PenaltyText>
                </ActionTd>
                <ChevronCell theme={theme}>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} color={(theme as StyledTheme).colorOnSurfaceVariant} />
                </ChevronCell>
              </ActionTr>
            </tbody>
          </ActionTable>
        </div>
      </SectionCard>

      {/* Impact — minimal */}
      <ImpactCard theme={theme}>
        <ImpactTitleRow theme={theme}>
          <ImpactTitleText theme={theme}>Rippling's impact</ImpactTitleText>
          <ImpactSubtitle theme={theme}>
            Workforce compliance managed by Rippling
          </ImpactSubtitle>
        </ImpactTitleRow>
        <ImpactStatsRow theme={theme}>
          {[
            { value: '14', label: 'Workforce issues resolved' },
            { value: '1', label: 'Filing completed' },
            { value: '100%', label: 'I-9 compliance rate' },
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

export default HrisOnlyOverview;
