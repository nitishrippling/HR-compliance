import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { MODULE_SUMMARIES, IMPACT_METRICS } from './data';

/**
 * Option I-3: Summary Cards with Progress/Health Indicator
 *
 * Three horizontal cards like I-1 but each includes a segmented progress bar
 * showing the breakdown of completed / in-progress / action-needed items.
 * Gives an instant visual read of each area's health without listing tasks.
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space500};
  cursor: pointer;
  transition: background-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CardIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ChevronLink = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ViewAllText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CardDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: -${({ theme }) => (theme as StyledTheme).space200};
`;

/* ── Progress bar ── */

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  overflow: hidden;
  display: flex;
`;

const ProgressSegment = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ color }) => color};
  transition: width 300ms ease;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LegendDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const LegendValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

/* ── Impact section ── */

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0;
`;

const ImpactSection = styled.div`
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

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ImpactCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space500};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  text-align: center;
`;

const ImpactIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ImpactValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const ImpactLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.3;
`;

const IMPACT_ICON_MAP: Record<string, string> = {
  CLOCK_OUTLINE: Icon.TYPES.CLOCK_OUTLINE,
  DOCUMENT_OUTLINE: Icon.TYPES.DOCUMENT_OUTLINE,
};

export const OptionI3: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <Container theme={theme}>
      <CardsGrid theme={theme}>
        {MODULE_SUMMARIES.map(mod => {
          const total = mod.completedCount + mod.inProgressCount + mod.onTrackCount + mod.actionCount;
          const completedPct = total > 0 ? (mod.completedCount / total) * 100 : 0;
          const inProgressPct = total > 0 ? (mod.inProgressCount / total) * 100 : 0;
          const onTrackPct = total > 0 ? (mod.onTrackCount / total) * 100 : 0;
          const actionPct = total > 0 ? (mod.actionCount / total) * 100 : 0;

          return (
            <Card key={mod.module} theme={theme}>
              <CardTop theme={theme}>
                <CardIconWrapper theme={theme}>
                  <Icon
                    type={MODULE_ICONS[mod.module] || Icon.TYPES.DOCUMENT_OUTLINE}
                    size={20}
                    color={(theme as StyledTheme).colorOnSurfaceVariant}
                  />
                </CardIconWrapper>
                <ChevronLink theme={theme}>
                  <ViewAllText theme={theme}>View all</ViewAllText>
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                </ChevronLink>
              </CardTop>

              <CardTitle theme={theme}>{mod.title}</CardTitle>
              <CardDescription theme={theme}>{mod.description}</CardDescription>

              <ProgressSection theme={theme}>
                <ProgressBarTrack theme={theme}>
                  <ProgressSegment width={completedPct} color={(theme as StyledTheme).colorSuccess} />
                  <ProgressSegment width={inProgressPct} color={(theme as StyledTheme).colorPrimary} />
                  <ProgressSegment width={onTrackPct} color={(theme as StyledTheme).colorSurfaceContainerHigh} />
                  <ProgressSegment width={actionPct} color={(theme as StyledTheme).colorError} />
                </ProgressBarTrack>

                <LegendRow theme={theme}>
                  {mod.completedCount > 0 && (
                    <LegendItem theme={theme}>
                      <LegendDot theme={theme} color={(theme as StyledTheme).colorSuccess} />
                      <LegendValue theme={theme}>{mod.completedCount}</LegendValue>
                      <LegendLabel theme={theme}>Completed</LegendLabel>
                    </LegendItem>
                  )}
                  {mod.inProgressCount > 0 && (
                    <LegendItem theme={theme}>
                      <LegendDot theme={theme} color={(theme as StyledTheme).colorPrimary} />
                      <LegendValue theme={theme}>{mod.inProgressCount}</LegendValue>
                      <LegendLabel theme={theme}>In progress</LegendLabel>
                    </LegendItem>
                  )}
                  {mod.onTrackCount > 0 && (
                    <LegendItem theme={theme}>
                      <LegendDot theme={theme} color={(theme as StyledTheme).colorSurfaceContainerHigh} />
                      <LegendValue theme={theme}>{mod.onTrackCount}</LegendValue>
                      <LegendLabel theme={theme}>On track</LegendLabel>
                    </LegendItem>
                  )}
                  {mod.actionCount > 0 && (
                    <LegendItem theme={theme}>
                      <LegendDot theme={theme} color={(theme as StyledTheme).colorError} />
                      <LegendValue theme={theme}>{mod.actionCount}</LegendValue>
                      <LegendLabel theme={theme}>{mod.actionLabel.replace(`${mod.actionCount} `, '')}</LegendLabel>
                    </LegendItem>
                  )}
                </LegendRow>
              </ProgressSection>
            </Card>
          );
        })}
      </CardsGrid>

      <Divider theme={theme} />

      <ImpactSection theme={theme}>
        <ImpactHeader theme={theme}>
          <ImpactTitle theme={theme}>Rippling's impact</ImpactTitle>
          <ImpactSubtitle theme={theme}>· Registrations & filings managed by Rippling</ImpactSubtitle>
        </ImpactHeader>
        <ImpactGrid theme={theme}>
          {IMPACT_METRICS.map(m => (
            <ImpactCard key={m.label} theme={theme}>
              <ImpactIconWrapper theme={theme}>
                <Icon
                  type={IMPACT_ICON_MAP[m.icon] || Icon.TYPES.DOCUMENT_OUTLINE}
                  size={18}
                  color={(theme as StyledTheme).colorOnSurfaceVariant}
                />
              </ImpactIconWrapper>
              <ImpactValue theme={theme}>{m.value}</ImpactValue>
              <ImpactLabel theme={theme}>{m.label}</ImpactLabel>
            </ImpactCard>
          ))}
        </ImpactGrid>
      </ImpactSection>
    </Container>
  );
};
