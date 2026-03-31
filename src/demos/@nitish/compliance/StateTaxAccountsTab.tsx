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

interface TaxAccount {
  type: 'Withholding' | 'SUI' | 'Unemployment';
  state: string;
  agencyName: string;
  accountNumber: string;
  createdBy: 'Rippling' | 'Client';
  suiRate?: string;
  status: 'completed' | 'in-progress' | 'blocked';
  statusDetail: string;
  dueDate?: string;
  actionRequired?: boolean;
}

const accounts: TaxAccount[] = [
  { type: 'Withholding', state: 'TX', agencyName: 'Texas Workforce Commission', accountNumber: 'Pending', createdBy: 'Rippling', status: 'blocked', statusDetail: 'Your action required', dueDate: 'Due Feb 28, 2026', actionRequired: true },
  { type: 'SUI', state: 'NJ', agencyName: 'NJ Department of Labor', accountNumber: 'Pending', createdBy: 'Rippling', status: 'blocked', statusDetail: 'Waiting on NJ Department of Labor' },
  { type: 'Withholding', state: 'OH', agencyName: 'Ohio Dept of Taxation', accountNumber: 'Pending', createdBy: 'Rippling', status: 'in-progress', statusDetail: 'Submitted Feb 12, 2026' },
  { type: 'Withholding', state: 'CA', agencyName: 'California EDD', accountNumber: 'CA-998877', createdBy: 'Rippling', status: 'completed', statusDetail: 'Account active' },
  { type: 'Withholding', state: 'NC', agencyName: 'NC Dept of Revenue', accountNumber: 'NC-88776655', createdBy: 'Rippling', status: 'completed', statusDetail: 'Account active' },
  { type: 'SUI', state: 'FL', agencyName: 'Florida Dept of Revenue', accountNumber: '1234567', createdBy: 'Rippling', suiRate: '2.7%', status: 'completed', statusDetail: 'Account active' },
  { type: 'Withholding', state: 'NY', agencyName: 'NY Dept of Taxation', accountNumber: 'NY-44332211', createdBy: 'Client', status: 'completed', statusDetail: 'Account active' },
  { type: 'SUI', state: 'TX', agencyName: 'Texas Workforce Commission', accountNumber: 'TX-9988776', createdBy: 'Rippling', suiRate: '1.82%', status: 'completed', statusDetail: 'Account active' },
];

const statusOrder = { blocked: 0, 'in-progress': 1, completed: 2 };

const typeVariant: Record<string, 'primary' | 'amber'> = {
  Withholding: 'primary',
  SUI: 'amber',
  Unemployment: 'amber',
};

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'error'; label: string }> = {
  blocked: { dotStatus: 'error', label: 'Blocked' },
  'in-progress': { dotStatus: 'warning', label: 'In progress' },
  completed: { dotStatus: 'success', label: 'Completed' },
};

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

export const StateTaxAccountsTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = accounts
    .filter(
      a =>
        a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        a.state.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div>
      <SearchRow>
        <SectionTitle>All state tax accounts</SectionTitle>
        <div style={{ width: 256 }}>
          <Input.Text
            id="search-state-tax"
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
                <StyledTh>State</StyledTh>
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
                    <StyledTd>
                      <CellTextBold>{account.state}</CellTextBold>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellText>
                        {account.agencyName}
                        {account.suiRate && <CellTextMuted> · SUI {account.suiRate}</CellTextMuted>}
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
                  <EmptyRow colSpan={8}>No accounts match your search.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
