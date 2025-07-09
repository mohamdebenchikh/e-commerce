# Rich Text Editor Components

A comprehensive rich text editor built with Tiptap and Tailwind CSS for Laravel Inertia applications.

## Components

### RichTextEditor
The main editor component with full editing capabilities.

```tsx
import { RichTextEditor } from '@/components/editor';

<RichTextEditor
  content={content}
  onChange={(html) => setContent(html)}
  placeholder="Start typing..."
  minHeight="300px"
  className="w-full"
/>
```

### RichTextViewer
A read-only component for displaying rich text content.

```tsx
import { RichTextViewer } from '@/components/editor';

<RichTextViewer 
  content={htmlContent}
  className="prose-sm"
/>
```

## Features

### Text Formatting
- **Bold**, *Italic*, <u>Underline</u>, ~~Strikethrough~~
- Headings (H1, H2, H3)

### Text Alignment
- Left align
- Center align
- Right align

### Lists and Structure
- Bullet lists
- Numbered lists
- Blockquotes
- Horizontal rules

### Links
- Insert links with custom text and target options

### Advanced Features
- Undo/Redo functionality
- Responsive toolbar
- RTL/LTR support via Tailwind Typography

### Removed Features (for Product Details)
- Code blocks and inline code
- Image insertion and upload
- Table creation and editing
- Text colors and highlighting

## Installation

1. Install required Tiptap extensions:
```bash
npm install @tiptap/extension-text-align @tiptap/extension-link @tiptap/extension-image @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight
```

2. Ensure you have Tailwind Typography installed:
```bash
npm install @tailwindcss/typography
```

3. Add the editor styles to your CSS (already included in app.css).

## Image Upload

The editor supports image uploads through a dedicated endpoint:

- **Endpoint**: `POST /api/upload-image`
- **Controller**: `App\Http\Controllers\Api\ImageUploadController`
- **Storage**: Images are stored in `storage/app/public/editor-images/`
- **Max Size**: 2MB
- **Formats**: JPEG, PNG, JPG, GIF, WebP

Make sure to run `php artisan storage:link` to create the symbolic link for public storage.

## Styling

The editor uses Tailwind Typography classes and custom CSS for optimal appearance:

- Responsive typography scaling
- Dark/light mode support
- Consistent with your design system
- Table styling with borders and hover effects
- Syntax highlighting for code blocks

## Usage in Forms

### With React Hook Form
```tsx
import { useForm } from 'react-hook-form';
import { RichTextEditor } from '@/components/editor';

const { control, setValue, watch } = useForm();
const content = watch('details');

<RichTextEditor
  content={content}
  onChange={(html) => setValue('details', html)}
  placeholder="Enter product details..."
/>
```

### With Inertia Forms
```tsx
import { useForm } from '@inertiajs/react';
import { RichTextEditor } from '@/components/editor';

const { data, setData } = useForm({ details: '' });

<RichTextEditor
  content={data.details}
  onChange={(html) => setData('details', html)}
  placeholder="Enter product details..."
/>
```

## Customization

### Toolbar Customization
Modify `EditorToolbar.tsx` to add/remove buttons or change the layout.

### Extension Configuration
Modify `RichTextEditor.tsx` to configure extensions or add new ones.

### Styling
Override CSS classes in your global styles or pass custom className props.

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

- Lazy loading of editor components
- Optimized bundle size with tree shaking
- Efficient re-rendering with React.memo where appropriate
- Image optimization and compression

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- ARIA labels on toolbar buttons
- Focus management
- High contrast mode support
