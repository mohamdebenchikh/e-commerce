import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Unlink } from 'lucide-react';

interface LinkDialogProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkDialog({ editor, open, onOpenChange }: LinkDialogProps) {
  const [url, setUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [openInNewTab, setOpenInNewTab] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);
      const linkAttrs = editor.getAttributes('link');
      
      setText(selectedText);
      setUrl(linkAttrs.href || '');
      setOpenInNewTab(linkAttrs.target === '_blank');
    }
  }, [open, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;

    const linkAttrs = {
      href: url,
      target: openInNewTab ? '_blank' : null,
      rel: openInNewTab ? 'noopener noreferrer' : null,
    };

    if (text && !editor.state.selection.empty) {
      // If we have text and something is selected, replace the selection
      editor.chain().focus().deleteSelection().insertContent(text).run();
      editor.chain().focus().setLink(linkAttrs).run();
    } else if (text) {
      // If we have text but nothing selected, insert new text with link
      editor.chain().focus().insertContent(text).setLink(linkAttrs).run();
    } else {
      // Just apply link to current selection
      editor.chain().focus().setLink(linkAttrs).run();
    }

    onOpenChange(false);
    resetForm();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setText('');
    setOpenInNewTab(false);
  };

  const isLinkActive = editor.isActive('link');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {isLinkActive ? 'Edit Link' : 'Insert Link'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text">Link Text (optional)</Label>
            <Input
              id="text"
              type="text"
              placeholder="Link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newTab"
              checked={openInNewTab}
              onCheckedChange={(checked) => setOpenInNewTab(checked as boolean)}
            />
            <Label htmlFor="newTab" className="text-sm">
              Open in new tab
            </Label>
          </div>
        </form>

        <DialogFooter className="flex justify-between">
          <div>
            {isLinkActive && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemoveLink}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Remove Link
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {isLinkActive ? 'Update' : 'Insert'} Link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
