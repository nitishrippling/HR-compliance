import styled from '@emotion/styled';
import { StyledBaseInputContainer, ReadOnlyStyles } from '@rippling/pebble/Inputs/Input.styles';
import ChipStyles from '@rippling/pebble/Chip/Chip.style';
import { BaseItemContainer } from '@rippling/pebble/MenuList/atoms/Styles/BaseItem.styles';

type StyleSelectProps = {
  computedCss?: string;
  isDisabled?: boolean;
  isMenuOpen?: boolean;
};

export const SelectContainer = styled(StyledBaseInputContainer)<StyleSelectProps>`
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
  display: block;
  height: auto;
  padding: 0;
  position: relative;
  ${props => props.computedCss};
`;

export const ReadOnlyList = styled.div`
  ${ReadOnlyStyles};

  ${BaseItemContainer} {
    margin: 0;
    padding-top: 0;
    padding-bottom: 0;
    min-height: unset;

    ${ChipStyles.Container} {
      display: none;
    }
  }
`;
const SelectAllToggleContainer = styled.div<{ theme?: any }>`
  border-bottom: ${({ theme }) => `${(theme as any)?.shapeBorderWidthXs || '1px'} solid ${(theme as any)?.colorOutlineVariant || 'rgba(0,0,0,0.1)'}`};
  margin-bottom: ${({ theme }) => (theme as any)?.space100 || '4px'};
`;

export default {
  SelectContainer,
  ReadOnlyList,
  SelectAllToggleContainer,
};
