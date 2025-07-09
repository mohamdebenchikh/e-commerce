# MultiSelect Component

A flexible and feature-rich multi-select component built with React and Radix UI primitives.

## Features

- ✅ **Multiple Selection**: Select multiple options with checkboxes
- ✅ **Search Functionality**: Built-in search to filter options
- ✅ **Badge Display**: Selected items shown as removable badges
- ✅ **Overflow Handling**: Shows "+X more" when too many items selected
- ✅ **Disabled Options**: Support for disabled options
- ✅ **Clear All**: Quick clear button when items are selected
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Customizable**: Multiple variants and styling options

## Basic Usage

```tsx
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';

const options: MultiSelectOption[] = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3', disabled: true },
];

const [selected, setSelected] = useState<(string | number)[]>([]);

<MultiSelect
  options={options}
  value={selected}
  onValueChange={setSelected}
  placeholder="Select options..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MultiSelectOption[]` | Required | Array of options to display |
| `value` | `(string \| number)[]` | `[]` | Currently selected values |
| `onValueChange` | `(value: (string \| number)[]) => void` | - | Callback when selection changes |
| `placeholder` | `string` | `'Select items...'` | Placeholder text when nothing selected |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder for search input |
| `emptyText` | `string` | `'No items found'` | Text shown when no options match search |
| `maxDisplayed` | `number` | `3` | Maximum badges to show before "+X more" |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `className` | `string` | - | Additional CSS classes |
| `variant` | `'default' \| 'secondary' \| 'outline'` | `'outline'` | Button variant style |

## MultiSelectOption Interface

```tsx
interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

## Examples

### Basic Example
```tsx
<MultiSelect
  options={categories}
  value={selectedCategories}
  onValueChange={setSelectedCategories}
  placeholder="Select categories..."
/>
```

### With Search and Custom Display
```tsx
<MultiSelect
  options={tags}
  value={selectedTags}
  onValueChange={setSelectedTags}
  placeholder="Add tags..."
  searchPlaceholder="Search tags..."
  emptyText="No tags available"
  maxDisplayed={5}
  variant="secondary"
/>
```

### With Disabled Options
```tsx
const options = [
  { value: 1, label: 'Available Option' },
  { value: 2, label: 'Disabled Option', disabled: true },
  { value: 3, label: 'Another Available Option' },
];

<MultiSelect
  options={options}
  value={selected}
  onValueChange={setSelected}
  placeholder="Choose options..."
/>
```

### In Forms (React Hook Form)
```tsx
import { useForm, Controller } from 'react-hook-form';

const { control } = useForm();

<Controller
  name="categories"
  control={control}
  render={({ field }) => (
    <MultiSelect
      options={categoryOptions}
      value={field.value || []}
      onValueChange={field.onChange}
      placeholder="Select categories..."
    />
  )}
/>
```

### In Forms (Inertia.js)
```tsx
import { useForm } from '@inertiajs/react';

const { data, setData } = useForm({
  category_ids: [],
});

<MultiSelect
  options={categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    disabled: !cat.active
  }))}
  value={data.category_ids}
  onValueChange={(values) => setData('category_ids', values as number[])}
  placeholder="Select categories..."
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized through:

1. **Variant Prop**: Changes the overall button style
   - `default`: Default button styling
   - `secondary`: Secondary button styling  
   - `outline`: Outlined button styling

2. **Custom Classes**: Pass additional classes via `className` prop

3. **CSS Variables**: Override component-specific styles

## Accessibility

- ✅ **Keyboard Navigation**: Arrow keys, Enter, Escape
- ✅ **Screen Reader Support**: Proper ARIA labels and roles
- ✅ **Focus Management**: Logical focus flow
- ✅ **High Contrast**: Works with high contrast modes

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

- Efficient filtering with debounced search
- Virtualization for large option lists (if needed)
- Optimized re-renders with React.memo patterns

## Integration Examples

### Admin Product Categories
```tsx
// In admin product create/edit forms
<MultiSelect
  options={categories.map(category => ({
    value: category.id,
    label: category.name,
    disabled: !category.active
  }))}
  value={data.category_ids}
  onValueChange={(values) => setData('category_ids', values as number[])}
  placeholder={trans('select_categories')}
  searchPlaceholder={trans('search_categories')}
  emptyText={trans('no_categories_found')}
  maxDisplayed={5}
/>
```

### User Preferences
```tsx
// For user preference selection
<MultiSelect
  options={notificationTypes}
  value={userPreferences.notifications}
  onValueChange={(values) => updatePreferences({ notifications: values })}
  placeholder="Choose notification types..."
  maxDisplayed={4}
/>
```

### Filter Components
```tsx
// In search/filter interfaces
<MultiSelect
  options={filterOptions}
  value={activeFilters}
  onValueChange={setActiveFilters}
  placeholder="Apply filters..."
  variant="outline"
  maxDisplayed={2}
/>
```

## Demo

Visit `/demo/multi-select` to see the component in action with various configurations and examples.

## Dependencies

- React 18+
- Radix UI Primitives (@radix-ui/react-popover)
- Lucide React (for icons)
- Tailwind CSS
- class-variance-authority (for styling variants)
