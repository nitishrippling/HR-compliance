import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow, SectionHeaderStatsRow,
  SectionName, ViewAllLink, StatGroup, StatLabel, StatValue, SuccessText,
  ImpactCard, ImpactTitleRow, ImpactTitleText, ImpactSubtitle, ImpactStatsRow, ImpactStat, ImpactStatValue, ImpactStatLabel,
} from './shared-overview-styles';

const AllGreenOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* Workforce — all clear */}
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
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Overdue</StatLabel>
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Resolved</StatLabel>
              <StatValue theme={theme} variant="success">32</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Avg. resolution</StatLabel>
              <StatValue theme={theme}>2.1</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
      </SectionCard>

      {/* Registrations — all complete */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations</SectionName>
            <ViewAllLink theme={theme}>
              View all
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={12} color={(theme as StyledTheme).colorOnSurface} />
            </ViewAllLink>
          </SectionHeaderTopRow>
          <SectionHeaderStatsRow theme={theme}>
            <StatGroup>
              <StatLabel theme={theme}>Action required</StatLabel>
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">25</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
        <SuccessText theme={theme}>All registrations are up to date</SuccessText>
      </SectionCard>

      {/* Filings — all current */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
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
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>In progress</StatLabel>
              <StatValue theme={theme}>0</StatValue>
            </StatGroup>
            <StatGroup>
              <StatLabel theme={theme}>Completed</StatLabel>
              <StatValue theme={theme} variant="success">12</StatValue>
            </StatGroup>
          </SectionHeaderStatsRow>
        </SectionHeader>
        <SuccessText theme={theme}>All filings are current</SuccessText>
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
            { value: '120+', label: 'Hours saved on registrations' },
            { value: '25', label: 'Registrations completed' },
            { value: '12', label: 'Filings submitted' },
            { value: '$0', label: 'Penalties incurred' },
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

export default AllGreenOverview;
