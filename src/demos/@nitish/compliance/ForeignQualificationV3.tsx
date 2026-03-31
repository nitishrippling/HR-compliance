import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import {
  SectionTitle,
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CreatedByBadge,
  StatusDot,
  StatusCell,
  StatusLabel,
  DueDate,
  CellTextBold,
  CellTextMono,
  CellTextMuted,
  EmptyRow,
  ActionButtonWrapper,
} from './shared-styles';

interface Qualification {
  state: string;
  sosRegistrationNumber: string;
  createdBy: 'Rippling' | 'Client';
  status: 'complete' | 'pending' | 'action-required';
  statusDetail: string;
  dueDate?: string;
  actionRequired?: boolean;
}

const qualifications: Qualification[] = [
  { state: 'WA', sosRegistrationNumber: 'Pending', createdBy: 'Rippling', status: 'action-required', statusDetail: 'Certificate of Good Standing needed', dueDate: 'Due Mar 5, 2026', actionRequired: true },
  { state: 'TX', sosRegistrationNumber: 'Pending', createdBy: 'Rippling', status: 'pending', statusDetail: 'Filed Feb 3, 2026' },
  { state: 'CA', sosRegistrationNumber: 'C4821456', createdBy: 'Rippling', status: 'complete', statusDetail: 'Qualified and active' },
  { state: 'NY', sosRegistrationNumber: 'NY-6789012', createdBy: 'Client', status: 'complete', statusDetail: 'Qualified and active' },
  { state: 'IL', sosRegistrationNumber: 'LLC-00123456', createdBy: 'Rippling', status: 'complete', statusDetail: 'Qualified and active' },
  { state: 'FL', sosRegistrationNumber: 'L26000012345', createdBy: 'Rippling', status: 'complete', statusDetail: 'Qualified and active' },
];

const statusOrder = { 'action-required': 0, pending: 1, complete: 2 };

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'error'; label: string }> = {
  'action-required': { dotStatus: 'error', label: 'Blocked on you' },
  pending: { dotStatus: 'warning', label: 'In progress' },
  complete: { dotStatus: 'success', label: 'Active' },
};

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const ForeignQualificationV3: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return qualifications
      .filter(q =>
        q.state.toLowerCase().includes(search.toLowerCase()) ||
        q.sosRegistrationNumber.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [search]);

  return (
    <div>
      <SearchRow>
        <SectionTitle>All foreign qualifications</SectionTitle>
        <div style={{ width: 220 }}>
          <Input.Text
            id="search-foreign-qual-v3"
            size={Input.Text.SIZES.S}
            placeholder="Search qualifications..."
            value={search}
            onChange={(e: any) => setSearch(e?.target?.value ?? e)}
            prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
          />
        </div>
      </SearchRow>

      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <StyledTable>
            <StyledTHead>
              <tr>
                <StyledTh>State</StyledTh>
                <StyledTh>SoS registration #</StyledTh>
                <StyledTh>Created by</StyledTh>
                <StyledTh>Status</StyledTh>
                <StyledTh>Details</StyledTh>
                <StyledTh style={{ width: 40 }}>&nbsp;</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {filtered.map((q, index) => {
                const sc = statusMap[q.status];
                return (
                  <StyledTr key={index}>
                    <StyledTd>
                      <CellTextBold>{q.state}</CellTextBold>
                    </StyledTd>
                    <StyledTd>
                      <CellTextMono>{q.sosRegistrationNumber}</CellTextMono>
                    </StyledTd>
                    <StyledTd>
                      <CreatedByBadge isRippling={q.createdBy === 'Rippling'}>{q.createdBy}</CreatedByBadge>
                    </StyledTd>
                    <StyledTd>
                      <StatusCell>
                        <StatusDot status={sc.dotStatus} />
                        <StatusLabel>{sc.label}</StatusLabel>
                      </StatusCell>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellTextMuted>{q.statusDetail}</CellTextMuted>
                      {q.dueDate && <> · <DueDate>{q.dueDate}</DueDate></>}
                    </StyledTd>
                    <StyledTd>
                      {q.actionRequired && (
                        <ActionButtonWrapper>
                          <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                            Take action
                          </Button>
                        </ActionButtonWrapper>
                      )}
                    </StyledTd>
                  </StyledTr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <EmptyRow colSpan={6}>No qualifications match your filters.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
