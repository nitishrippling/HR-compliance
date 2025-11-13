import { isEmpty } from 'lodash';
import styled from '@emotion/styled';
import Spinner from '@rippling/pebble/Spinner';
import Text from '@rippling/pebble/Text';
import { usePebbleTheme } from '../../utils/theme';
import Icon from '@rippling/pebble/Icon';

// types
type EmptyListJSXProps = {
  placeholder: string;
  isLoading?: boolean;
  searchQuery?: string;
};

// Styled components
const Container = styled.div<{ theme?: any }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as any)?.space200 || '8px'};
  height: ${({ theme }) => (theme as any)?.size3600 || '144px'};
`;

const SearchQueryWrapper = styled.div<{ theme?: any }>`
  display: flex;
  gap: ${({ theme }) => (theme as any)?.space100 || '4px'};
`;

const SpinnerWrapper = styled.div``;

export function EmptyListJSX({ placeholder, isLoading, searchQuery }: EmptyListJSXProps) {
  const { theme } = usePebbleTheme();
  if (isLoading) {
    return (
      <Container data-testid="empty-list-placeholder">
        <SpinnerWrapper>
          <Spinner appearance={Spinner.APPEARANCES.NEUTRAL} size={Spinner.SIZES.M} />
        </SpinnerWrapper>
        <Text typestyle={theme.typestyleBodyMedium400}>{placeholder}</Text>
      </Container>
    );
  }
  if (!isEmpty(searchQuery)) {
    return (
      <Container data-testid="empty-list-placeholder">
        <Icon type={Icon.TYPES.SEARCH_OUTLINE} color={theme.colorOnSurface} />
        <SearchQueryWrapper>
          <Text typestyle={theme.typestyleBodyMedium500}>
            <Text as="span" typestyle={theme.typestyleBodyMedium400}>
              {placeholder}
            </Text>
            <>&nbsp;</>
            {`"${searchQuery}"`}
          </Text>
        </SearchQueryWrapper>
      </Container>
    );
  }
  return (
    <Container data-testid="empty-list-placeholder">
      <Text typestyle={theme.typestyleBodyMedium400}>{placeholder}</Text>
    </Container>
  );
}
