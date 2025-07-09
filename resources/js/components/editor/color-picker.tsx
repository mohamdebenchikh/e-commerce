import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  editor: Editor;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  isHighlight?: boolean;
}

const PRESET_COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
  '#7F1D1D', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2',
  '#92400E', '#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7',
  '#365314', '#65A30D', '#84CC16', '#A3E635', '#BEF264', '#D9F99D', '#ECFCCB',
  '#064E3B', '#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5',
  '#0C4A6E', '#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE',
  '#3730A3', '#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF',
  '#581C87', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE',
  '#86198F', '#C026D3', '#D946EF', '#E879F9', '#F0ABFC', '#F8BBD9', '#FCE7F3',
];

export function ColorPicker({ 
  editor, 
  isOpen, 
  onOpenChange, 
  trigger, 
  isHighlight = false 
}: ColorPickerProps) {
  const [customColor, setCustomColor] = React.useState('#000000');

  const applyColor = (color: string) => {
    if (isHighlight) {
      if (color === 'transparent' || color === '') {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color }).run();
      }
    } else {
      if (color === 'transparent' || color === '') {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().setColor(color).run();
      }
    }
    onOpenChange(false);
  };

  const getCurrentColor = () => {
    if (isHighlight) {
      const highlight = editor.getAttributes('highlight');
      return highlight.color || 'transparent';
    } else {
      const textStyle = editor.getAttributes('textStyle');
      return textStyle.color || '#000000';
    }
  };

  const currentColor = getCurrentColor();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">
              {isHighlight ? 'Highlight Color' : 'Text Color'}
            </Label>
          </div>

          {/* Current Color Display */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ 
                backgroundColor: currentColor === 'transparent' ? '#ffffff' : currentColor,
                backgroundImage: currentColor === 'transparent' 
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                  : 'none',
                backgroundSize: currentColor === 'transparent' ? '8px 8px' : 'auto',
                backgroundPosition: currentColor === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
              }}
            />
            <span className="text-sm text-muted-foreground">
              Current: {currentColor === 'transparent' ? 'None' : currentColor}
            </span>
          </div>

          {/* Remove Color Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyColor('transparent')}
            className="w-full"
          >
            Remove {isHighlight ? 'Highlight' : 'Color'}
          </Button>

          {/* Preset Colors */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Preset Colors
            </Label>
            <div className="grid grid-cols-7 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => applyColor(color)}
                  className={cn(
                    "w-6 h-6 rounded border border-border hover:scale-110 transition-transform",
                    currentColor === color && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Custom Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 h-8 text-xs"
              />
              <Button
                size="sm"
                onClick={() => applyColor(customColor)}
                className="h-8 px-3"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
