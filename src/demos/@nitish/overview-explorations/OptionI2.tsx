import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { StatusDot } from './shared';
import { MODULE_SUMMARIES, IMPACT_METRICS } from './data';

/**
 * Option I-2: Stacked Single-Line Summary Rows + Rippling Impact
 *
 * Even more minimal — each module is a single horizontal row inside a bordered
 * container. The entire module summary section fits in ~100px vertical space.
 * Below sits a compact Rippling impact banner.
 */

const MODULE_ICONS: Record<string, string> = {
  Workforce: Icon.TYPES.USERS_OUTLINE,
  Registrations: Icon.TYPES.DOCUMENT_OUTLINE,
  Filings: Icon.TYPES.CLIPBOARD_LIST_OUTLINE,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  max-width: 960px;
`;

const RowList = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => (theme as StyledTheme).space500} ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const RowIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: ${({ theme }) => (theme as StyledTheme).space400};
`;

const RowTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
  min-width: 120px;
`;

const RowDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  flex: 1;
  min-width: 0;
`;

const RowStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  margin-left: auto;
  flex-shrink: 0;
`;

const TotalStat = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const ActionStat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  white-space: nowrap;
`;

const ActionText = styled.span<{ status: 'error' | 'warning' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  font-weight: 600;
  color: ${({ status, theme }) =>
    status === 'error' ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorWarning};
`;

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => (theme as StyledTheme).space400};
  flex-shrink: 0;
`;

/* ── Impact section ── */

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0;
`;

const ImpactBanner = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ImpactTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ImpactSubtitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ImpactStatsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space800};
  flex-wrap: wrap;
`;

const ImpactStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ImpactStatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  font-weight: 600;
`;

const ImpactStatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const OptionI2: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <Container theme={theme}>
      <RowList theme={theme}>
        {MODULE_SUMMARIES.map(mod => (
          <Row key={mod.module} theme={theme}>
            <RowIconWrapper theme={theme}>
              <Icon
                type={MODULE_ICONS[mod.module] || Icon.TYPES.DOCUMENT_OUTLINE}
                size={18}
                color={(theme as StyledTheme).colorOnSurfaceVariant}
              />
            </RowIconWrapper>
            <RowTitle theme={theme}>{mod.title}</RowTitle>
            <RowDescription theme={theme}>{mod.description}</RowDescription>
            <RowStats theme={theme}>
              <TotalStat theme={theme}>{mod.totalLabel}</TotalStat>
              <ActionStat theme={theme}>
                <StatusDot theme={theme} status={mod.actionStatus} />
                <ActionText theme={theme} status={mod.actionStatus}>{mod.actionLabel}</ActionText>
              </ActionStat>
            </RowStats>
            <ChevronWrapper theme={theme}>
              <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={18} color={(theme as StyledTheme).colorOnSurfaceVariant} />
            </ChevronWrapper>
          </Row>
        ))}
      </RowList>

      <Divider theme={theme} />

      <ImpactBanner theme={theme}>
        <ImpactHeader theme={theme}>
          <ImpactTitle theme={theme}>Rippling's impact</ImpactTitle>
          <ImpactSubtitle theme={theme}>· Registrations & filings managed by Rippling</ImpactSubtitle>
        </ImpactHeader>
        <ImpactStatsRow theme={theme}>
          {IMPACT_METRICS.map(m => (
            <ImpactStat key={m.label}>
              <ImpactStatValue theme={theme}>{m.value}</ImpactStatValue>
              <ImpactStatLabel theme={theme}>{m.label}</ImpactStatLabel>
            </ImpactStat>
          ))}
        </ImpactStatsRow>
      </ImpactBanner>
    </Container>
  );
};
