import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
  if (!content) {
    return null;
  }

  return (
    <div 
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:text-foreground prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-em:text-foreground',
        'prose-blockquote:text-foreground prose-blockquote:border-l-primary',
        'prose-hr:border-border',
        'prose-ul:text-foreground prose-ol:text-foreground',
        'prose-li:text-foreground',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
