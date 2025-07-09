import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './editor-toolbar';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: string;
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  editable = true,
  minHeight = '200px'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable code block and code mark
        codeBlock: false,
        code: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-primary/80',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm mx-auto focus:outline-none',
          'prose-headings:font-semibold prose-headings:text-foreground',
          'prose-p:text-foreground prose-p:leading-relaxed',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-foreground prose-strong:font-semibold',
          'prose-em:text-foreground',
          'prose-blockquote:text-foreground prose-blockquote:border-l-primary',
          'prose-hr:border-border',
          'prose-ul:text-foreground prose-ol:text-foreground',
          'prose-li:text-foreground',
          'max-w-none w-full px-4 py-3'
        ),
        style: `min-height: ${minHeight}`,
        'data-placeholder': placeholder,
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      {editable && <EditorToolbar editor={editor} />}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
        {editor.isEmpty && (
          <div className="absolute top-3 left-4 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
