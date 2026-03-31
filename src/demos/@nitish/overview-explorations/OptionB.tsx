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
 * Option B: Structured Rows with Fixed Metadata Slots
 *
 * List-based approach (not a table), but each row has a consistent internal layout
 * with the same metadata always in the same position:
 * Left: Status dot + Task name (bold) + Action + Entity
 * Right: Relative time + Urgency badge
 * Optional penalty line below for registrations/filings.
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
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400} ${({ theme }) => (theme as StyledTheme).space600};
  cursor: pointer;
  transition: background-color 120ms ease;
  &:hover { background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow}; }
  & + & { border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant}; }
`;

const DotWrapper = styled.div`
  padding-top: 5px;
  flex-shrink: 0;
`;

const RowContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const RowMainLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const TaskName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 600;
`;

const RightMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-shrink: 0;
`;

const DueText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

const SecondaryLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
`;

const ActionText = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const EntityText = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PenaltyLine = styled.div`
  margin-top: 2px;
`;

export const OptionB: React.FC = () => {
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
                    <DotWrapper>
                      <StatusDot theme={theme} status={urgencyDotColor(item.urgency)} />
                    </DotWrapper>
                    <RowContent>
                      <RowMainLine theme={theme}>
                        <TaskName theme={theme}>{item.task}</TaskName>
                        <RightMeta theme={theme}>
                          <DueText theme={theme}>{relativeTime(item)}</DueText>
                          <UrgencyBadge theme={theme} urgency={item.urgency}>{urgencyLabel(item)}</UrgencyBadge>
                        </RightMeta>
                      </RowMainLine>
                      <SecondaryLine theme={theme}>
                        <ActionText theme={theme}>{item.action}</ActionText>
                        <EntityText theme={theme}>· {item.entity}</EntityText>
                      </SecondaryLine>
                      {item.penalty && (
                        <PenaltyLine>
                          <PenaltyText theme={theme}>⚠ {item.penalty}</PenaltyText>
                        </PenaltyLine>
                      )}
                    </RowContent>
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
