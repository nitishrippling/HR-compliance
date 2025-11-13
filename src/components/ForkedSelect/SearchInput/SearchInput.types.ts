import type { TextProps } from '@rippling/pebble/Text';
import type { TextRefObject } from '../BaseSelect/BaseSelect.types';

export type SearchInputProps = Omit<TextProps, 'isDisabled' | 'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'placeholder' | 'theme' | 'value'> & {
  isLoading?: boolean;
  innerRef: React.RefObject<TextRefObject>;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  theme?: any;
  value?: string;
};
