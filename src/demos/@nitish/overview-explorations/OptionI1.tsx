import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import { StatusDot } from './shared';
import { MODULE_SUMMARIES, IMPACT_METRICS } from './data';

/**
 * Option I-1: Three Horizontal Summary Cards + Rippling Impact
 *
 * Ultra-simplified overview — each module is a single card showing aggregate
 * counts and urgency. No individual tasks listed. Below the cards sits
 * the Rippling impact metrics banner.
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
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
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

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const CardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const CardDescription = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  padding-top: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatValue = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
`;

const StatLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ActionStat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ActionStatValue = styled.span<{ status: 'error' | 'warning' }>`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  font-weight: 700;
  color: ${({ status, theme }) =>
    status === 'error' ? (theme as StyledTheme).colorError : (theme as StyledTheme).colorWarning};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

const ViewAllText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

/* ── Impact section ── */

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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: 0;
`;

const IMPACT_ICON_MAP: Record<string, string> = {
  CLOCK_OUTLINE: Icon.TYPES.CLOCK_OUTLINE,
  DOCUMENT_OUTLINE: Icon.TYPES.DOCUMENT_OUTLINE,
};

export const OptionI1: React.FC = () => {
  const { theme } = usePebbleTheme();

  return (
    <Container theme={theme}>
      <CardsGrid theme={theme}>
        {MODULE_SUMMARIES.map(mod => (
          <Card key={mod.module} theme={theme}>
            <CardHeader theme={theme}>
              <CardIconWrapper theme={theme}>
                <Icon
                  type={MODULE_ICONS[mod.module] || Icon.TYPES.DOCUMENT_OUTLINE}
                  size={20}
                  color={(theme as StyledTheme).colorOnSurfaceVariant}
                />
              </CardIconWrapper>
              <CardFooter theme={theme}>
                <ViewAllText theme={theme}>View all</ViewAllText>
                <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
              </CardFooter>
            </CardHeader>

            <CardBody theme={theme}>
              <CardTitle theme={theme}>{mod.title}</CardTitle>
              <CardDescription theme={theme}>{mod.description}</CardDescription>
            </CardBody>

            <StatsRow theme={theme}>
              <Stat>
                <StatValue theme={theme}>{mod.totalCount}</StatValue>
                <StatLabel theme={theme}>{mod.module === 'Workforce' ? 'open issues' : 'total'}</StatLabel>
              </Stat>
              <Stat>
                <ActionStat theme={theme}>
                  <StatusDot theme={theme} status={mod.actionStatus} />
                  <ActionStatValue theme={theme} status={mod.actionStatus}>{mod.actionCount}</ActionStatValue>
                </ActionStat>
                <StatLabel theme={theme}>{mod.actionLabel.replace(`${mod.actionCount} `, '')}</StatLabel>
              </Stat>
            </StatsRow>
          </Card>
        ))}
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
