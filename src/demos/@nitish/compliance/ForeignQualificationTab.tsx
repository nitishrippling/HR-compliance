import React, { useState } from 'react';
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
  StatusRow,
  StatusLabel,
  StatusDetail,
  DueDate,
  CellTextBold,
  CellTextMono,
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
  { state: 'WA', sosRegistrationNumber: 'Pending', createdBy: 'Rippling', status: 'action-required', statusDetail: 'Certificate of Good Standing expired', dueDate: 'Due Mar 5, 2026', actionRequired: true },
  { state: 'TX', sosRegistrationNumber: 'Pending', createdBy: 'Rippling', status: 'pending', statusDetail: 'Filed Feb 3, 2026' },
  { state: 'CA', sosRegistrationNumber: 'C4821456', createdBy: 'Rippling', status: 'complete', statusDetail: 'Registration active' },
  { state: 'NY', sosRegistrationNumber: 'NY-6789012', createdBy: 'Client', status: 'complete', statusDetail: 'Registration active' },
  { state: 'IL', sosRegistrationNumber: 'LLC-00123456', createdBy: 'Rippling', status: 'complete', statusDetail: 'Registration active' },
  { state: 'FL', sosRegistrationNumber: 'L26000012345', createdBy: 'Rippling', status: 'complete', statusDetail: 'Registration active' },
];

const statusOrder = { 'action-required': 0, pending: 1, complete: 2 };

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'error'; label: string }> = {
  'action-required': { dotStatus: 'error', label: 'Action Required' },
  pending: { dotStatus: 'warning', label: 'Pending' },
  complete: { dotStatus: 'success', label: 'Complete' },
};

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const ForeignQualificationTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = qualifications
    .filter(
      q =>
        q.state.toLowerCase().includes(search.toLowerCase()) ||
        q.sosRegistrationNumber.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div>
      <SearchRow>
        <SectionTitle>All Foreign Qualifications</SectionTitle>
        <div style={{ width: 256 }}>
          <Input.Text
            id="search-foreign-qual"
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
                <StyledTh>SoS Registration #</StyledTh>
                <StyledTh>Created By</StyledTh>
                <StyledTh>Status</StyledTh>
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
                        <StatusRow>
                          <StatusDot status={sc.dotStatus} />
                          <StatusLabel>{sc.label}</StatusLabel>
                        </StatusRow>
                        <StatusDetail>{q.statusDetail}</StatusDetail>
                        {q.dueDate && <DueDate>{q.dueDate}</DueDate>}
                      </StatusCell>
                    </StyledTd>
                    <StyledTd>
                      {q.actionRequired && (
                        <ActionButtonWrapper>
                          <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                            Take Action
                          </Button>
                        </ActionButtonWrapper>
                      )}
                    </StyledTd>
                  </StyledTr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <EmptyRow colSpan={5}>No qualifications match your search.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
