# Styled Components Refactoring Guide

## Problem

Across the codebase, there are **558+ instances** of repetitive styling patterns:
- `(theme as StyledTheme)` type casting repeated everywhere
- Repeated flex container patterns (`display: flex`, `align-items: center`, `gap`)
- Repeated typography patterns
- Repeated surface card patterns (background, border, border-radius, padding)

## Solution

Use the **`t()` helper function** from `@/utils/theme` to replace `(theme as StyledTheme)` with `t(theme)`.

This simple change eliminates repetitive type casting while maintaining the same functionality.

## Migration Pattern

### Before
```typescript
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;
```

### After
```typescript
import { t } from '@/utils/theme';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => t(theme).space400};
  padding: ${({ theme }) => t(theme).space600};
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ theme }) => t(theme).shapeCorner2xl};
`;

const Title = styled.h2`
  ${({ theme }) => t(theme).typestyleV2TitleLarge};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0;
`;
```

## Files to Refactor

### High Priority (Most Repetitive)
1. `src/demos/@dvora/EmployeeProfile/layouts/PageLayoutEditor.tsx` - ~50+ instances
2. `src/demos/@dvora/EmployeeProfile/employee-profile-demo.tsx` - ~30+ instances
3. `src/demos/@dvora/EmployeeProfile/layouts/CompositionSelector.tsx` - ~25+ instances
4. `src/demos/index-page.tsx` - ~40+ instances
5. `src/demos/@dvora/CompositionManager/*.tsx` - Multiple files

### Medium Priority
- Other demo files in `src/demos/@dvora/` and `src/demos/@paul/`
- `src/demos/getting-started-page.tsx`
- `src/demos/doc-viewer-page.tsx`

## Refactoring Steps

1. **Import the helper**
   ```typescript
   import { t } from '@/utils/theme';
   ```

2. **Replace theme casting**
   - `(theme as StyledTheme)` → `t(theme)`
   - `(theme as any)` → `t(theme)`

3. **Find and replace**
   - Use your editor's find/replace to change all instances
   - Pattern: `(theme as StyledTheme)` → `t(theme)`
   - Pattern: `(theme as any)` → `t(theme)`

## Benefits

- **DRY**: Eliminates 558+ instances of repetitive `(theme as StyledTheme)` casting
- **Readability**: Shorter, cleaner code - `t(theme)` vs `(theme as StyledTheme)`
- **Consistency**: Single pattern for theme access across all styled components
- **Type Safety**: Maintains TypeScript type safety with cleaner syntax

## Notes

- Use `t(theme)` instead of `(theme as StyledTheme)` for all theme access in styled components
- The `t()` helper is available from `@/utils/theme`
- This is a simple find/replace refactoring - no structural changes needed

