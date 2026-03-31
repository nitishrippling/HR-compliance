import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';

interface HomePageProps {
  onNavigateToHR: () => void;
}

/* ─────────────────── Outer layout ─────────────────── */

const PageWrapper = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-height: 100%;
  padding: ${({ theme }) => (theme as StyledTheme).space1000}
    ${({ theme }) => (theme as StyledTheme).space1200};
`;

const Greeting = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space800};
`;

/* ─────────────────── Tasks card ─────────────────── */

const TasksCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const TasksCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const TasksCardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const TasksCardBody = styled.div`
  display: flex;
  align-items: stretch;
`;

const TasksSection = styled.div`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:last-child {
    border-right: none;
  }
`;

const TasksBigNumber = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 700;
  line-height: 1;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TasksLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TaskBreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const TaskBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TaskDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const TaskBreakdownLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  flex: 1;
`;

const TaskBreakdownCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ProgressBarContainer = styled.div`
  height: 6px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  overflow: hidden;
  display: flex;
`;

const ProgressSegment = styled.div<{ width: string; color: string }>`
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  transition: width 0.3s ease;
`;

/* ─────────────────── Search + Apps ─────────────────── */

const AppsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const AppsTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SearchInput = styled.div`
  width: 240px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
`;

const SearchInputText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

/* ─────────────────── App icons grid ─────────────────── */

const AppIconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 88px);
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const AppIconWrapper = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};

  &:hover > div:first-of-type {
    opacity: 0.85;
    transform: scale(1.04);
  }
`;

const AppIconSquare = styled.div<{ bgColor?: string }>`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background-color: ${({ bgColor, theme }) =>
    bgColor || (theme as StyledTheme).colorPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease, transform 0.15s ease;
  flex-shrink: 0;
`;

const AppIconLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  text-align: center;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ─────────────────── App data ─────────────────── */

interface AppIconDef {
  id: string;
  label: string;
  icon: string;
  bgColor?: string;
  isHR?: boolean;
}

const RIPPLING_APPS: AppIconDef[] = [
  {
    id: 'add',
    label: 'Add New App',
    icon: Icon.TYPES.ADD_CIRCLE_OUTLINE,
    bgColor: 'transparent',
  },
  {
    id: 'workflow',
    label: 'Workflow Studio',
    icon: Icon.TYPES.THUNDERBOLT_OUTLINE,
  },
  {
    id: 'approvals',
    label: 'Approvals',
    icon: Icon.TYPES.APPROVE_REJECT_SHIELD_OUTLINE,
  },
  {
    id: 'catalog',
    label: 'Catalog',
    icon: Icon.TYPES.APPS_OUTLINE,
  },
  {
    id: 'activity',
    label: 'Activity Log',
    icon: Icon.TYPES.DOCUMENT_OUTLINE,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Icon.TYPES.LOCK_FILLED,
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: Icon.TYPES.DOLLAR_CIRCLE_OUTLINE,
  },
  {
    id: 'app-studio',
    label: 'App Studio',
    icon: Icon.TYPES.CUSTOM_APPS_OUTLINE,
  },
  {
    id: 'hr',
    label: 'HR services',
    icon: Icon.TYPES.SHIELD_OUTLINE,
    isHR: true,
  },
];

/* ─────────────────── Component ─────────────────── */

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToHR }) => {
  const { theme } = usePebbleTheme();

  const taskBreakdownItems = [
    { label: 'Overdue', count: 0, color: theme.colorError },
    { label: 'Due within 7 days', count: 0, color: theme.colorWarning },
    { label: 'Due later', count: 25, color: theme.colorSuccess },
  ];

  const viewedItems = [
    { label: 'Not viewed', count: 25, color: theme.colorPrimary },
    { label: 'Viewed', count: 0, color: theme.colorOutlineVariant },
  ];

  const totalDue = taskBreakdownItems.reduce((sum, i) => sum + i.count, 0) || 25;
  const totalViewed = viewedItems.reduce((sum, i) => sum + i.count, 0) || 25;

  return (
    <PageWrapper theme={theme}>
      <Greeting theme={theme}>Hello, John</Greeting>

      {/* Tasks card */}
      <TasksCard theme={theme}>
        <TasksCardHeader theme={theme}>
          <TasksCardTitle theme={theme}>Your Tasks</TasksCardTitle>
          <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.S}>
            View Tasks
          </Button>
        </TasksCardHeader>

        <TasksCardBody>
          {/* Pending count */}
          <TasksSection theme={theme}>
            <TasksBigNumber theme={theme}>25</TasksBigNumber>
            <TasksLabel theme={theme}>Pending to-dos</TasksLabel>
          </TasksSection>

          {/* Due breakdown */}
          <TasksSection theme={theme}>
            <TaskBreakdownList theme={theme}>
              {taskBreakdownItems.map(item => (
                <TaskBreakdownRow key={item.label}>
                  <TaskDot color={item.color} />
                  <TaskBreakdownLabel theme={theme}>{item.label}</TaskBreakdownLabel>
                  <TaskBreakdownCount theme={theme}>{item.count}</TaskBreakdownCount>
                </TaskBreakdownRow>
              ))}
            </TaskBreakdownList>
            <ProgressBarContainer theme={theme}>
              {taskBreakdownItems.map(item => (
                <ProgressSegment
                  key={item.label}
                  width={`${(item.count / totalDue) * 100}%`}
                  color={item.color}
                />
              ))}
            </ProgressBarContainer>
          </TasksSection>

          {/* Viewed status */}
          <TasksSection theme={theme}>
            <TaskBreakdownList theme={theme}>
              {viewedItems.map(item => (
                <TaskBreakdownRow key={item.label}>
                  <TaskDot color={item.color} />
                  <TaskBreakdownLabel theme={theme}>{item.label}</TaskBreakdownLabel>
                  <TaskBreakdownCount theme={theme}>{item.count}</TaskBreakdownCount>
                </TaskBreakdownRow>
              ))}
            </TaskBreakdownList>
            <ProgressBarContainer theme={theme}>
              {viewedItems.map(item => (
                <ProgressSegment
                  key={item.label}
                  width={`${(item.count / totalViewed) * 100}%`}
                  color={item.color}
                />
              ))}
            </ProgressBarContainer>
          </TasksSection>
        </TasksCardBody>
      </TasksCard>

      {/* Apps header with search */}
      <AppsHeaderRow theme={theme}>
        <AppsTitle theme={theme}>Rippling apps</AppsTitle>
        <SearchInput theme={theme}>
          <Icon
            type={Icon.TYPES.SEARCH_OUTLINE}
            size={16}
            color={theme.colorOnSurfaceVariant}
          />
          <SearchInputText theme={theme}>Search apps</SearchInputText>
        </SearchInput>
      </AppsHeaderRow>

      {/* App icons */}
      <AppIconsGrid theme={theme}>
        {RIPPLING_APPS.map(app => {
          const isAddApp = app.id === 'add';
          return (
            <AppIconWrapper
              key={app.id}
              theme={theme}
              onClick={app.isHR ? onNavigateToHR : undefined}
              aria-label={app.label}
            >
              <AppIconSquare
                theme={theme}
                bgColor={
                  isAddApp
                    ? 'transparent'
                    : undefined
                }
                style={
                  isAddApp
                    ? {
                        border: `2px dashed ${theme.colorOutlineVariant}`,
                        backgroundColor: 'transparent',
                      }
                    : undefined
                }
              >
                <Icon
                  type={app.icon}
                  size={32}
                  color={isAddApp ? theme.colorOnSurfaceVariant : theme.colorOnPrimary}
                />
              </AppIconSquare>
              <AppIconLabel theme={theme}>{app.label}</AppIconLabel>
            </AppIconWrapper>
          );
        })}
      </AppIconsGrid>
    </PageWrapper>
  );
};
