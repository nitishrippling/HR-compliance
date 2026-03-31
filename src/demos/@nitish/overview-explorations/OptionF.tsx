import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, GroupBlock, GroupHeader, GroupLeft, GroupName, GroupDesc,
  GroupCount, GroupViewAll, Divider, StatusDot, UrgencyBadge,
  CurationFooter, CurationLink, PenaltyText,
} from './shared';
import {
  groupByModule, sortedItems, MODULE_META, relativeTime, urgencyDotColor, urgencyLabel,
} from './data';

/**
 * Option F: Split Left/Right Layout
 *
 * Each row is visually divided into two zones:
 * LEFT: Task name, action, entity/context (what do I need to deal with?)
 * RIGHT: Due date, urgency badge, penalty (how urgent is it and what are the stakes?)
 *
 * This creates a clear spatial separation between context and consequences.
 */

const RowList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: stretch;
  cursor: pointer;
  transition: background-color 120ms ease;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
  & + & { border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant}; }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  min-width: 0;
`;

const VerticalDivider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

const RightPanel = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
`;

const DotWrapper = styled.div`
  padding-top: 5px;
  flex-shrink: 0;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const TaskName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const ActionText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const EntityText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const RightRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const DueText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

export const OptionF: React.FC = () => {
  const { theme } = usePebbleTheme();
  const grouped = groupByModule(sortedItems);

  return (
    <TabContent theme={theme}>
      {grouped.map((group, idx) => {
        const meta = MODULE_META[group.module];
        return (
          <React.Fragment key={group.module}>
            {idx > 0 && <Divider theme={theme} />}
            <GroupBlock theme={theme}>
              <GroupHeader theme={theme}>
                <GroupLeft theme={theme}>
                  <GroupName theme={theme}>{group.module}</GroupName>
                  <GroupDesc theme={theme}>{meta.description}</GroupDesc>
                  <GroupCount theme={theme}>{meta.countLabel}</GroupCount>
                </GroupLeft>
                <GroupViewAll theme={theme}>
                  View all
                  <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                </GroupViewAll>
              </GroupHeader>

              <RowList theme={theme}>
                {group.items.map((item, i) => (
                  <Row key={i} theme={theme}>
                    <LeftPanel theme={theme}>
                      <DotWrapper>
                        <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                      </DotWrapper>
                      <LeftContent>
                        <TaskName theme={theme}>{item.task}</TaskName>
                        <div>
                          <ActionText theme={theme}>{item.action}</ActionText>
                          <EntityText theme={theme}> · {item.entity}</EntityText>
                        </div>
                      </LeftContent>
                    </LeftPanel>
                    <VerticalDivider theme={theme} />
                    <RightPanel theme={theme}>
                      <RightRow theme={theme}>
                        <DueText theme={theme}>{relativeTime(item)}</DueText>
                        <UrgencyBadge theme={theme} urgency={item.urgency}>{urgencyLabel(item)}</UrgencyBadge>
                      </RightRow>
                      {item.penalty && (
                        <PenaltyText theme={theme}>⚠ {item.penalty}</PenaltyText>
                      )}
                    </RightPanel>
                  </Row>
                ))}
                {meta.curationNote && (
                  <CurationFooter theme={theme}>
                    <span>{meta.curationNote}</span>
                    <CurationLink theme={theme}>
                      View all {meta.totalCount}
                      <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={14} color={(theme as StyledTheme).colorPrimary} />
                    </CurationLink>
                  </CurationFooter>
                )}
              </RowList>
            </GroupBlock>
          </React.Fragment>
        );
      })}
    </TabContent>
  );
};
