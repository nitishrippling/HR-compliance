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
 * Option D: Action-First Rows
 *
 * Instead of leading with the issue/problem title, the primary text is the ACTION
 * the user needs to take. The issue name and entity become secondary context.
 * This changes the cognitive flow from "understand issue → figure out action"
 * to "see what to do → understand context."
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

const MainLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ActionName = styled.span`
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

const ContextLine = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ContextTask = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const ContextEntity = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const PenaltyLine = styled.div`
  margin-top: 2px;
`;

export const OptionD: React.FC = () => {
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
                      <MainLine theme={theme}>
                        <ActionName theme={theme}>{item.action}</ActionName>
                        <RightMeta theme={theme}>
                          <DueText theme={theme}>{relativeTime(item)}</DueText>
                          <UrgencyBadge theme={theme} urgency={item.urgency}>{urgencyLabel(item)}</UrgencyBadge>
                        </RightMeta>
                      </MainLine>
                      <ContextLine theme={theme}>
                        <ContextTask theme={theme}>{item.task}</ContextTask>
                        <ContextEntity theme={theme}> · {item.entity}</ContextEntity>
                      </ContextLine>
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
