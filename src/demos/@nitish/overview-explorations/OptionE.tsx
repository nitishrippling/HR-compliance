import React from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  TabContent, GroupBlock, GroupHeader, GroupLeft, GroupName, GroupDesc,
  GroupCount, GroupViewAll, Divider, StatusDot, UrgencyBadge,
  CurationFooter, CurationLink, CategoryChip,
} from './shared';
import {
  groupByModule, sortedItems, MODULE_META, relativeTime, urgencyDotColor, urgencyLabel,
} from './data';

/**
 * Option E: Condensed Single-Line Rows with Inline Metadata Chips
 *
 * Ultra-compact: each item is a single line with inline chip badges for category,
 * timing, and penalty. Maximizes density — you can see all items in a group
 * without scrolling.
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
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300} ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
  & + & { border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant}; }
`;

const TaskText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EntityText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Spacer = styled.div`
  flex: 1;
  min-width: ${({ theme }) => (theme as StyledTheme).space200};
`;

const DueChip = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
  flex-shrink: 0;
`;

const PenaltyChip = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const OptionE: React.FC = () => {
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
                    <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                    <TaskText theme={theme}>{item.task}</TaskText>
                    <EntityText theme={theme}>· {item.entity}</EntityText>
                    {item.category && <CategoryChip theme={theme}>{item.category}</CategoryChip>}
                    <Spacer theme={theme} />
                    <DueChip theme={theme}>{relativeTime(item)}</DueChip>
                    <UrgencyBadge theme={theme} urgency={item.urgency}>{urgencyLabel(item)}</UrgencyBadge>
                    {item.penalty && <PenaltyChip theme={theme}>⚠ {item.penalty}</PenaltyChip>}
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
