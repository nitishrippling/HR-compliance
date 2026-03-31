import React from 'react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, SectionCard, SectionHeader, SectionHeaderTopRow,
  SectionName, EmptyCardBody, EmptyCardText, EmptyCardCta,
} from './shared-overview-styles';

const OnboardingOverview: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <TabContent theme={theme}>
      {/* Workforce — no employees yet */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Workforce</SectionName>
          </SectionHeaderTopRow>
        </SectionHeader>
        <EmptyCardBody theme={theme}>
          <Icon type={Icon.TYPES.USERS_OUTLINE} size={32} color={(theme as StyledTheme).colorOnSurfaceVariant} />
          <EmptyCardText theme={theme} style={{ marginTop: 12 }}>
            Add employees to start tracking workforce compliance.{' '}
            <EmptyCardCta theme={theme}>Add your first employee</EmptyCardCta>
          </EmptyCardText>
        </EmptyCardBody>
      </SectionCard>

      {/* Registrations — pending company setup */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Registrations</SectionName>
          </SectionHeaderTopRow>
        </SectionHeader>
        <EmptyCardBody theme={theme}>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={32} color={(theme as StyledTheme).colorOnSurfaceVariant} />
          <EmptyCardText theme={theme} style={{ marginTop: 12 }}>
            Complete your company setup to determine required state &amp; local registrations.{' '}
            <EmptyCardCta theme={theme}>Complete setup</EmptyCardCta>
          </EmptyCardText>
        </EmptyCardBody>
      </SectionCard>

      {/* Filings — no filings yet */}
      <SectionCard theme={theme}>
        <SectionHeader theme={theme} style={{ borderBottom: 'none' }}>
          <SectionHeaderTopRow>
            <SectionName theme={theme}>Filings</SectionName>
          </SectionHeaderTopRow>
        </SectionHeader>
        <EmptyCardBody theme={theme}>
          <Icon type={Icon.TYPES.CALENDAR_OUTLINE} size={32} color={(theme as StyledTheme).colorOnSurfaceVariant} />
          <EmptyCardText theme={theme} style={{ marginTop: 12 }}>
            No filings due yet. Filing obligations will appear once payroll is active and employees are onboarded.
          </EmptyCardText>
        </EmptyCardBody>
      </SectionCard>
    </TabContent>
  );
};

export default OnboardingOverview;
