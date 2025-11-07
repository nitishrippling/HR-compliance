# AI Prompting Guide for Pebble Playground

This guide helps AI assistants understand how to work effectively with Pebble components.

## Core Principles

1. **Always use theme tokens** - Never hardcode colors, spacing, or typography
2. **Import from @rippling/pebble** - All components come from the published package
3. **TypeScript is mandatory** - Helps catch errors and improves AI understanding
4. **Self-contained demos** - Each demo should work independently

## Quick Component Reference

### Button

```typescript
import Button from '@rippling/pebble/Button';

// Available Sizes
Button.SIZES.XS  // Extra small
Button.SIZES.S   // Small
Button.SIZES.M   // Medium (default)
Button.SIZES.L   // Large

// Available Appearances
Button.APPEARANCES.PRIMARY      // Blue, high emphasis
Button.APPEARANCES.ACCENT       // Secondary color
Button.APPEARANCES.DESTRUCTIVE  // Red, for dangerous actions
Button.APPEARANCES.SUCCESS      // Green, for positive actions
Button.APPEARANCES.OUTLINE      // Border only
Button.APPEARANCES.GHOST        // No background

// Usage
<Button 
  size={Button.SIZES.M}
  appearance={Button.APPEARANCES.PRIMARY}
  onClick={() => console.log('clicked')}
>
  Click Me
</Button>

// Icon Button
<Button.Icon
  icon={Icon.TYPES.SETTINGS_OUTLINE}
  aria-label="Settings"
  size={Button.SIZES.M}
  appearance={Button.APPEARANCES.GHOST}
  onClick={() => {}}
/>
```

### Modal

```typescript
import Modal from '@rippling/pebble/Modal';
import ModalFooter from '@rippling/pebble/Modal/ModalFooter';
import ModalCloseButton from '@rippling/pebble/Modal/ModalCloseButton';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal 
  isVisible={isOpen}
  onCancel={() => setIsOpen(false)}
  title="Modal Title"
>
  <div style={{ padding: '1rem' }}>
    <p>Modal content goes here</p>
  </div>
  
  <ModalFooter>
    <ModalCloseButton>Cancel</ModalCloseButton>
    <Button 
      appearance={Button.APPEARANCES.PRIMARY}
      onClick={() => setIsOpen(false)}
    >
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

### Drawer

```typescript
import Drawer from '@rippling/pebble/Drawer';

const [isOpen, setIsOpen] = useState(false);

<Drawer
  isVisible={isOpen}
  onCancel={() => setIsOpen(false)}
  title="Drawer Title"
  isCompact={false}  // Set to true for narrower drawer
>
  <div style={{ padding: '1rem' }}>
    Drawer content
  </div>
  
  <Drawer.Footer>
    <Drawer.CloseButton>Cancel</Drawer.CloseButton>
    <Button appearance={Button.APPEARANCES.PRIMARY}>
      Save
    </Button>
  </Drawer.Footer>
</Drawer>
```

### Select

```typescript
import Select from '@rippling/pebble/Inputs/Select';

const [value, setValue] = useState<string | undefined>(undefined);

<Select
  id="my-select"
  isRequired={false}
  placeholder="Select an option"
  list={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ]}
  value={value}
  onChange={(value) => setValue(value as string)}
/>
```

### Dropdown

```typescript
import Dropdown from '@rippling/pebble/Dropdown';

<Dropdown
  list={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' },
  ]}
  onChange={(value) => console.log(value)}
  shouldAutoClose
>
  <Button appearance={Button.APPEARANCES.GHOST}>
    Actions
  </Button>
</Dropdown>
```

### Input (Text)

```typescript
import Input from '@rippling/pebble/Inputs';

const [value, setValue] = useState('');

<Input.Text
  id="my-input"
  label="Email Address"
  placeholder="Enter your email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  isRequired={true}
/>
```

### Icon

```typescript
import Icon from '@rippling/pebble/Icon';

<Icon 
  type={Icon.TYPES.CHECK}
  color={theme.colorSuccess}
  size={20}
/>

// Common icon types:
Icon.TYPES.CHECK
Icon.TYPES.CLEAR
Icon.TYPES.SETTINGS_OUTLINE
Icon.TYPES.SUN_OUTLINE
Icon.TYPES.OVERNIGHT_OUTLINE
Icon.TYPES.CARET_DOWN
Icon.TYPES.CARET_UP
Icon.TYPES.CHEVRON_RIGHT
Icon.TYPES.SEARCH_OUTLINE
```

## Theme System

### Accessing Theme

```typescript
import { useTheme } from '@rippling/pebble/theme';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return <div style={{ color: theme.colorOnSurface }}>
    Content
  </div>;
};
```

### Common Theme Tokens

#### Colors - Background
```typescript
theme.colorSurface         // Base background (white in light, dark in dark mode)
theme.colorSurfaceBright   // Elevated surface (cards, panels)
theme.colorSurfaceDim      // Subtle background
```

#### Colors - Text
```typescript
theme.colorOnSurface          // Primary text
theme.colorOnSurfaceVariant   // Secondary/muted text
theme.colorOnPrimary          // Text on primary color
```

#### Colors - Semantic
```typescript
theme.colorPrimary      // Primary brand color
theme.colorSecondary    // Secondary accent
theme.colorSuccess      // Green for success states
theme.colorError        // Red for errors
theme.colorWarning      // Yellow for warnings
theme.colorInfo         // Blue for informational
```

#### Colors - Borders
```typescript
theme.colorOutline         // Standard borders
theme.colorOutlineVariant  // Subtle borders
```

#### Typography
```typescript
theme.typestyleDisplayLarge700    // 57px, Bold
theme.typestyleHeadingLarge700    // 32px, Bold
theme.typestyleBodyLarge500       // 16px, Medium
theme.typestyleBodyMedium400      // 14px, Regular
theme.typestyleLabelLarge600      // 14px, Semibold
```

#### Spacing
```typescript
theme.space0      // 0px
theme.space50     // 2px
theme.space100    // 4px
theme.space200    // 8px
theme.space300    // 12px
theme.space400    // 16px
theme.space500    // 20px
theme.space600    // 24px
```

#### Border Radius
```typescript
theme.shapeCornerXs     // 2px   - Extra small radius
theme.shapeCornerSm     // 4px   - Small radius (badges)
theme.shapeCornerMd     // 6px   - Medium-small radius
theme.shapeCornerLg     // 8px   - Standard radius (buttons, inputs)
theme.shapeCornerXl     // 10px  - Large radius
theme.shapeCorner2xl    // 12px  - Extra large radius (cards)
theme.shapeCorner3xl    // 16px  - 3XL radius (modals, large panels)
theme.shapeCorner4xl    // 24px  - 4XL radius (special cards)
theme.shapeCornerFull   // 9999px - Fully rounded (pills, avatars)
```

## Animation Constants

For consistent animations, use the provided constants:

```typescript
import { DURATION, EASING, SCALE } from '../utils/animation-constants';

// Durations
DURATION.fast      // 150ms - Quick interactions (tooltips, dropdowns)
DURATION.standard  // 250ms - Most UI animations
DURATION.long      // 350ms - Complex transitions

// Easing
EASING.easeOut     // cubic-bezier(0.16, 1, 0.3, 1) - For entrance
EASING.easeIn      // cubic-bezier(0.4, 0, 1, 1) - For exit
EASING.easeInOut   // cubic-bezier(0.45, 0, 0.15, 1) - For transforms

// Scale values
SCALE.buttonActive // 0.97 - Button press scale
SCALE.initial      // 0.93 - Starting scale for entrances
SCALE.full         // 1.0 - Full scale

// Example usage
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(${SCALE.initial});
  }
  to {
    opacity: 1;
    transform: scale(${SCALE.full});
  }
`;

const AnimatedDiv = styled.div`
  animation: ${fadeIn} ${DURATION.fast} ${EASING.easeOut};
`;
```

## Common Patterns

### Demo Container

```typescript
const MyDemo = () => {
  const { theme } = useTheme();
  
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: theme.colorSurface,
        minHeight: '100vh',
      }}
    >
      {/* Demo content */}
    </div>
  );
};
```

### Elevated Card

```typescript
<div
  style={{
    backgroundColor: theme.colorSurfaceBright,
    borderRadius: '12px',
    padding: '2rem',
    border: `1px solid ${theme.colorOutlineVariant}`,
  }}
>
  {/* Card content */}
</div>
```

### Before/After Comparison

```typescript
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
}}>
  <div>
    <span style={{ 
      fontSize: '14px', 
      fontWeight: 600,
      color: theme.colorOnSurfaceVariant 
    }}>
      Before
    </span>
    {/* Before component */}
  </div>
  <div>
    <span style={{ 
      fontSize: '14px', 
      fontWeight: 600,
      color: theme.colorOnSurfaceVariant 
    }}>
      After
    </span>
    {/* After component */}
  </div>
</div>
```

## Common Gotchas

### ❌ Wrong
```typescript
// Don't hardcode colors
<div style={{ backgroundColor: 'white', color: '#000' }}>

// Don't use string literals for enums
<Button size="M" appearance="PRIMARY">

// Don't forget isVisible for modals
<Modal onCancel={() => {}} title="Title">

// Don't use Row/Cell for TableBasic
<TableBasic>
  <TableBasic.Row isHeader>
    <TableBasic.Cell>Name</TableBasic.Cell>
  </TableBasic.Row>
</TableBasic>
```

### ✅ Correct
```typescript
// Use theme tokens
<div style={{ 
  backgroundColor: theme.colorSurface, 
  color: theme.colorOnSurface 
}}>

// Use enum values
<Button 
  size={Button.SIZES.M} 
  appearance={Button.APPEARANCES.PRIMARY}
>

// Include isVisible prop
<Modal 
  isVisible={isOpen}
  onCancel={() => setIsOpen(false)} 
  title="Title"
>

// Use THead/TBody/Tr/Th/Td for TableBasic
<TableBasic>
  <TableBasic.THead>
    <TableBasic.Tr>
      <TableBasic.Th>Name</TableBasic.Th>
    </TableBasic.Tr>
  </TableBasic.THead>
  <TableBasic.TBody>
    <TableBasic.Tr>
      <TableBasic.Td>John Doe</TableBasic.Td>
    </TableBasic.Tr>
  </TableBasic.TBody>
</TableBasic>
```

## Accessibility

Always include:
- `aria-label` for icon-only buttons
- `id` for form inputs
- Semantic HTML elements
- Proper heading hierarchy

```typescript
// Good
<Button.Icon
  icon={Icon.TYPES.SETTINGS_OUTLINE}
  aria-label="Open settings"
  onClick={() => {}}
/>

// Bad
<Button.Icon
  icon={Icon.TYPES.SETTINGS_OUTLINE}
  onClick={() => {}}
/>
```

## Next Steps

- See [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) for complete component list
- Check [../src/demos/](../src/demos/) for working examples
- Review [../.cursorrules](../.cursorrules) for coding standards


