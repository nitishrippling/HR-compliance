import React, { useState } from 'react';
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import {
  SectionTitle,
  SectionDescription,
  TableCard,
  StyledTable,
  StyledTHead,
  StyledTh,
  StyledTr,
  StyledTd,
  CellText,
  CellTextBold,
  EmptyRow,
} from './shared-styles';

interface Poster {
  state: string;
  posterSet: string;
  postersDistributed: number;
  employees: number;
}

const posters: Poster[] = [
  { state: 'CA', posterSet: 'California All-In-One Labor Law Poster', postersDistributed: 12, employees: 45 },
  { state: 'NY', posterSet: 'New York All-In-One Labor Law Poster', postersDistributed: 8, employees: 32 },
  { state: 'TX', posterSet: 'Texas All-In-One Labor Law Poster', postersDistributed: 6, employees: 28 },
  { state: 'FL', posterSet: 'Florida All-In-One Labor Law Poster', postersDistributed: 4, employees: 15 },
  { state: 'IL', posterSet: 'Illinois All-In-One Labor Law Poster', postersDistributed: 5, employees: 18 },
  { state: 'OH', posterSet: 'Ohio All-In-One Labor Law Poster', postersDistributed: 3, employees: 12 },
  { state: 'WA', posterSet: 'Washington All-In-One Labor Law Poster', postersDistributed: 2, employees: 9 },
  { state: 'NC', posterSet: 'North Carolina All-In-One Labor Law Poster', postersDistributed: 3, employees: 14 },
];

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const TitleBlock = styled.div``;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const WorkplacePostersTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = posters
    .filter(
      p =>
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.posterSet.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => b.employees - a.employees);

  const totalDistributed = posters.reduce((sum, p) => sum + p.postersDistributed, 0);

  return (
    <div>
      <SearchRow>
        <TitleBlock>
          <SectionTitle>All workplace posters</SectionTitle>
          <SectionDescription style={{ marginTop: 2 }}>
            {totalDistributed} posters distributed across {posters.length} states
          </SectionDescription>
        </TitleBlock>
        <div style={{ width: 256 }}>
          <Input.Text
            id="search-posters"
            size={Input.Text.SIZES.S}
            placeholder="Search posters..."
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
                <StyledTh>Poster Set</StyledTh>
                <StyledTh>Posters Distributed</StyledTh>
                <StyledTh>Employees</StyledTh>
                <StyledTh style={{ textAlign: 'right' }}>Actions</StyledTh>
              </tr>
            </StyledTHead>
            <tbody>
              {filtered.map((poster, index) => (
                <StyledTr key={index}>
                  <StyledTd>
                    <CellTextBold>{poster.state}</CellTextBold>
                  </StyledTd>
                  <StyledTd>
                    <CellText style={{ fontWeight: 500 }}>{poster.posterSet}</CellText>
                  </StyledTd>
                  <StyledTd>
                    <CellTextBold>{poster.postersDistributed}</CellTextBold>
                  </StyledTd>
                  <StyledTd>
                    <CellText>{poster.employees}</CellText>
                  </StyledTd>
                  <StyledTd>
                    <ActionButtons>
                      <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                        View
                      </Button>
                      <Button size={Button.SIZES.XS} appearance={Button.APPEARANCES.GHOST}>
                        Download
                      </Button>
                    </ActionButtons>
                  </StyledTd>
                </StyledTr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <EmptyRow colSpan={5}>No posters match your search.</EmptyRow>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      </TableCard>
    </div>
  );
};
