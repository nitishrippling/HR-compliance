import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import Dropdown from '@rippling/pebble/Dropdown';
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
  CellText,
  CellTextBold,
  EmptyRow,
} from './shared-styles';

interface Filing {
  type: 'Federal' | 'State' | 'Local';
  name: string;
  jurisdiction: string;
  createdBy: 'Rippling' | 'Client';
  dueDate: string;
  year: number;
  status: 'filed' | 'in-progress' | 'upcoming';
  statusDetail: string;
}

const filings: Filing[] = [
  { type: 'State', name: 'NY Paid Family Leave Annual Statement', jurisdiction: 'NY', createdBy: 'Rippling', dueDate: 'Mar 1, 2026', year: 2026, status: 'in-progress', statusDetail: 'Preparing filing' },
  { type: 'Federal', name: 'VETS-4212 Report', jurisdiction: 'Federal', createdBy: 'Rippling', dueDate: 'Sep 30, 2026', year: 2026, status: 'upcoming', statusDetail: 'Scheduled' },
  { type: 'Federal', name: 'EEO-1 Component 1 Report', jurisdiction: 'Federal', createdBy: 'Rippling', dueDate: 'Mar 31, 2026', year: 2026, status: 'filed', statusDetail: 'Filed Feb 17, 2026' },
  { type: 'Federal', name: 'ACA 1094-C / 1095-C', jurisdiction: 'Federal', createdBy: 'Rippling', dueDate: 'Feb 28, 2026', year: 2026, status: 'filed', statusDetail: 'Filed Feb 14, 2026' },
  { type: 'State', name: 'California Pay Data Report (SB 973)', jurisdiction: 'CA', createdBy: 'Rippling', dueDate: 'Mar 31, 2026', year: 2026, status: 'filed', statusDetail: 'Filed Feb 10, 2026' },
  { type: 'Local', name: 'Healthy SF Expenditure Report', jurisdiction: 'San Francisco, CA', createdBy: 'Client', dueDate: 'Apr 30, 2026', year: 2026, status: 'filed', statusDetail: 'Filed Feb 8, 2026' },
  { type: 'Federal', name: 'EEO-1 Component 1 Report', jurisdiction: 'Federal', createdBy: 'Rippling', dueDate: 'Mar 31, 2025', year: 2025, status: 'filed', statusDetail: 'Filed Feb 20, 2025' },
  { type: 'Federal', name: 'ACA 1094-C / 1095-C', jurisdiction: 'Federal', createdBy: 'Rippling', dueDate: 'Feb 28, 2025', year: 2025, status: 'filed', statusDetail: 'Filed Feb 10, 2025' },
];

const statusOrder = { 'in-progress': 0, upcoming: 1, filed: 2 };

const typeVariant: Record<string, 'primary' | 'amber' | 'sky'> = {
  Federal: 'primary',
  State: 'amber',
  Local: 'sky',
};

const statusMap: Record<string, { dotStatus: 'success' | 'warning' | 'neutral'; label: string }> = {
  filed: { dotStatus: 'success', label: 'Filed' },
  'in-progress': { dotStatus: 'warning', label: 'In progress' },
  upcoming: { dotStatus: 'neutral', label: 'Upcoming' },
};

const availableYears = [
  { label: '2026', value: 2026 },
  { label: '2025', value: 2025 },
  { label: '2024', value: 2024 },
];

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
`;

export const AdditionalFilingsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(2026);

  const filtered = filings
    .filter(f => f.year === selectedYear)
    .filter(
      f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div>
      <SearchRow>
        <SectionTitle>All compliance filings</SectionTitle>
        <FiltersRow>
          <Dropdown
            list={availableYears}
            value={selectedYear}
            onChange={(val: number) => setSelectedYear(val)}
            shouldAutoClose
          >
            <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.OUTLINE}>
              {selectedYear}
            </Button>
          </Dropdown>
          <div style={{ width: 256 }}>
            <Input.Text
              id="search-filings"
              size={Input.Text.SIZES.S}
              placeholder="Search filings..."
              value={search}
              onChange={(e: any) => setSearch(e?.target?.value ?? e)}
              prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
            />
          </div>
        </FiltersRow>
      </SearchRow>

      <TableCard>
        <div style={{ overflowX: 'auto' }}>
          <StyledTable>
            <StyledTHead>
              <tr>
                <StyledTh>Type</StyledTh>
                <StyledTh>Jurisdiction</StyledTh>
                <StyledTh>Filing name</StyledTh>
                <StyledTh>Due date</StyledTh>
                <StyledTh>Created by</StyledTh>
                <StyledTh>Status</StyledTh>
                <StyledTh>Details</StyledTh>
                <StyledTh style={{ width: 100, textAlign: 'right' }}>Actions</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {filtered.map((filing, index) => {
                const sc = statusMap[filing.status];
                return (
                  <StyledTr key={index}>
                    <StyledTd>
                      <TypeBadge variant={typeVariant[filing.type]}>{filing.type}</TypeBadge>
                    </StyledTd>
                    <StyledTd>
                      <CellTextBold>{filing.jurisdiction}</CellTextBold>
                    </StyledTd>
                    <StyledTd>
                      <CellText>{filing.name}</CellText>
                    </StyledTd>
                    <StyledTd>
                      <CellText>{filing.dueDate}</CellText>
                    </StyledTd>
                    <StyledTd>
                      <CreatedByBadge isRippling={filing.createdBy === 'Rippling'}>
                        {filing.createdBy}
                      </CreatedByBadge>
                    </StyledTd>
                    <StyledTd>
                      <StatusCell>
                        <StatusDot status={sc.dotStatus} />
                        <StatusLabel>{sc.label}</StatusLabel>
                      </StatusCell>
                    </StyledTd>
                    <StyledTd style={{ whiteSpace: 'nowrap' }}>
                      <CellTextMuted>{filing.statusDetail}</CellTextMuted>
                    </StyledTd>
                    <StyledTd>
                      {filing.status === 'filed' && (
                        <ActionButtons>
                          <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                            View
                          </Button>
                          <Button.Icon
                            aria-label="Download"
                            icon={Icon.TYPES.DOWNLOAD}
                            size={Button.SIZES.XS}
                            appearance={Button.APPEARANCES.GHOST}
                          />
                        </ActionButtons>
                      )}
                    </StyledTd>
                  </StyledTr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <EmptyRow colSpan={7}>No filings match your search for {selectedYear}.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
