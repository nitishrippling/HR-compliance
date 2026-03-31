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
  TypeBadge,
  CreatedByBadge,
  StatusDot,
  StatusCell,
  StatusLabel,
  DueDate,
  CellText,
  CellTextBold,
  CellTextMono,
  CellTextMuted,
  EmptyRow,
  ActionButtonWrapper,
} from './shared-styles';

interface LocalTaxAccount {
  type: 'Municipal' | 'County' | 'School District';
  locality: string;
  state: string;
  agencyName: string;
  accountNumber: string;
  createdBy: 'Rippling' | 'Client';
  taxRate?: string;
  status: 'completed' | 'in-progress' | 'blocked';
  statusDetail: string;
  dueDate?: string;
  actionRequired?: boolean;
}

const accounts: LocalTaxAccount[] = [
  { type: 'Municipal', locality: 'Philadelphia', state: 'PA', agencyName: 'Philadelphia Revenue Dept', accountNumber: 'Pending', createdBy: 'Rippling', status: 'blocked', statusDetail: 'Employer signature needed', dueDate: 'Due Mar 7, 2026', actionRequired: true },
  { type: 'School District', locality: 'Lakota', state: 'OH', agencyName: 'Lakota School District Tax Office', accountNumber: 'Pending', createdBy: 'Rippling', status: 'in-progress', statusDetail: 'Submitted Feb 15, 2026' },
  { type: 'Municipal', locality: 'Westerville', state: 'OH', agencyName: 'Westerville Income Tax Dept', accountNumber: 'WV-001234', createdBy: 'Rippling', taxRate: '2.0%', status: 'completed', statusDetail: 'Account active' },
  { type: 'Municipal', locality: 'Columbus', state: 'OH', agencyName: 'Columbus Income Tax Division', accountNumber: 'COL-998877', createdBy: 'Rippling', taxRate: '2.5%', status: 'completed', statusDetail: 'Account active' },
  { type: 'County', locality: 'Marion County', state: 'IN', agencyName: 'Marion County Tax Office', accountNumber: 'MC-554433', createdBy: 'Client', taxRate: '1.77%', status: 'completed', statusDetail: 'Account active' },
];

const statusOrder = { blocked: 0, 'in-progress': 1, completed: 2 };

const typeVariant: Record<string, 'primary' | 'sky' | 'amber'> = {
  Municipal: 'primary',
  County: 'sky',
  'School District': 'amber',
};

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'error'; label: string }> = {
  blocked: { dotStatus: 'error', label: 'Blocked on you' },
  'in-progress': { dotStatus: 'warning', label: 'In progress' },
  completed: { dotStatus: 'success', label: 'Active' },
};

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const LocalTaxAccountsV3: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return accounts
      .filter(a =>
        a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        a.locality.toLowerCase().includes(search.toLowerCase()) ||
        a.state.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [search]);

  return (
    <div>
      <SearchRow>
        <SectionTitle>All local tax accounts</SectionTitle>
        <div style={{ width: 220 }}>
          <Input.Text
            id="search-local-tax-v3"
            size={Input.Text.SIZES.S}
            placeholder="Search accounts..."
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
                <StyledTh>Type</StyledTh>
                <StyledTh>Locality</StyledTh>
                <StyledTh>Agency name</StyledTh>
                <StyledTh>Account #</StyledTh>
                <StyledTh>Created by</StyledTh>
                <StyledTh>Status</StyledTh>
                <StyledTh>Details</StyledTh>
                <StyledTh style={{ width: 40 }}>&nbsp;</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {filtered.map((account, index) => {
                const sc = statusMap[account.status];
                return (
                  <StyledTr key={index}>
                    <StyledTd>
                      <TypeBadge variant={typeVariant[account.type]}>{account.type}</TypeBadge>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellTextBold>{account.locality}</CellTextBold>
                      <CellTextMuted>, {account.state}</CellTextMuted>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellText>
                        {account.agencyName}
                        {account.taxRate && <CellTextMuted> · {account.taxRate}</CellTextMuted>}
                      </CellText>
                    </StyledTd>
                    <StyledTd>
                      <CellTextMono>{account.accountNumber}</CellTextMono>
                    </StyledTd>
                    <StyledTd>
                      <CreatedByBadge isRippling={account.createdBy === 'Rippling'}>
                        {account.createdBy}
                      </CreatedByBadge>
                    </StyledTd>
                    <StyledTd>
                      <StatusCell>
                        <StatusDot status={sc.dotStatus} />
                        <StatusLabel>{sc.label}</StatusLabel>
                      </StatusCell>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellTextMuted>{account.statusDetail}</CellTextMuted>
                      {account.dueDate && <> · <DueDate>{account.dueDate}</DueDate></>}
                    </StyledTd>
                    <StyledTd>
                      {account.actionRequired && (
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
                  <EmptyRow colSpan={8}>No accounts match your filters.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
