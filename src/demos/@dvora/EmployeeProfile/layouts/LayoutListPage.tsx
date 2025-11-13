/**
 * Layout List Page
 * 
 * Displays a list of profile layouts with search functionality.
 * Clicking a layout navigates to the page layout editor.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@rippling/pebble/Button';
import Icon from '@rippling/pebble/Icon';
import TableBasic from '@rippling/pebble/TableBasic';
import Input from '@rippling/pebble/Inputs';
import Avatar from '@rippling/pebble/Avatar';
import { StyledTheme } from '@/utils/theme';
import { ProfileLayout } from '../types';
import { getLayouts } from '../api';

const Container = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Title = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplaySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

const Subtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 0 0;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
  max-width: 400px;
`;

const TableContainer = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  overflow: hidden;
`;

const LayoutName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-weight: 500;
`;

const LastModifiedCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const EditButton = styled(Button.Icon)`
  cursor: pointer;
`;

export const LayoutListPage: React.FC = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<ProfileLayout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const data = await getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Failed to load layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate('/employee-profile');
  };

  const handleLayoutClick = (layoutId: string) => {
    navigate(`/employee-profile/layouts/${layoutId}/edit`);
  };

  const filteredLayouts = layouts.filter(layout =>
    layout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Employee profile layouts</Title>
          <Subtitle>Configure your profile layout for different views.</Subtitle>
        </HeaderContent>
        <Button
          appearance={Button.APPEARANCES.OUTLINE}
          size={Button.SIZES.M}
          onClick={handleBackToProfile}
        >
          Back to profile
        </Button>
      </Header>

      <SearchContainer>
        <Input.Text
          id="search-layouts"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<Icon type={Icon.TYPES.SEARCH_OUTLINE} size={16} />}
        />
      </SearchContainer>

      <TableContainer>
        <TableBasic>
          <TableBasic.THead>
            <TableBasic.Tr>
              <TableBasic.Th>Layout name</TableBasic.Th>
              <TableBasic.Th>Last modified</TableBasic.Th>
              <TableBasic.Th align={TableBasic.ALIGNMENTS.RIGHT}>Actions</TableBasic.Th>
            </TableBasic.Tr>
          </TableBasic.THead>
          <TableBasic.TBody>
            {filteredLayouts.map(layout => (
              <TableBasic.Tr
                key={layout.id}
                onClick={() => handleLayoutClick(layout.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableBasic.Td>
                  <LayoutName>{layout.name}</LayoutName>
                </TableBasic.Td>
                <TableBasic.Td>
                  <LastModifiedCell>
                    <Avatar {...({ name: layout.lastModifiedBy, size: Avatar.SIZES._2XS } as any)} />
                    <span>{layout.lastModifiedBy}</span>
                  </LastModifiedCell>
                </TableBasic.Td>
                <TableBasic.Td align={TableBasic.ALIGNMENTS.RIGHT}>
                  <EditButton
                    appearance={Button.APPEARANCES.GHOST}
                    size={Button.SIZES.S}
                    icon={Icon.TYPES.EDIT_OUTLINE}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayoutClick(layout.id);
                    }}
                    aria-label={`Edit ${layout.name}`}
                  />
                </TableBasic.Td>
              </TableBasic.Tr>
            ))}
          </TableBasic.TBody>
        </TableBasic>
      </TableContainer>
    </Container>
  );
};

