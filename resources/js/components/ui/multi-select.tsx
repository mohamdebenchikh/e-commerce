import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: (string | number)[];
  onValueChange?: (value: (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxDisplayed?: number;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = 'Select items...',
  searchPlaceholder = 'Search...',
  emptyText = 'No items found',
  maxDisplayed = 3,
  disabled = false,
  className,
  variant = 'outline',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter(option => value.includes(option.value));
  const filteredOptions = options.filter(option =>
    option.label && option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string | number) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onValueChange?.(newValue);
  };

  const handleRemove = (optionValue: string | number, event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
    onValueChange?.(newValue);
  };

  const handleClear = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    onValueChange?.([]);
  };

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const displayedOptions = selectedOptions.slice(0, maxDisplayed);
  const remainingCount = selectedOptions.length - maxDisplayed;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between min-h-10 h-auto px-3 py-2',
            selectedOptions.length > 0 ? 'text-left' : 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs px-2 py-1 gap-1"
                  >
                    {option.label}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(option.value, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRemove(option.value, e);
                        }
                      }}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 cursor-pointer"
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 ml-2">
            {selectedOptions.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
                className="hover:bg-muted-foreground/20 rounded-full p-1 cursor-pointer"
                aria-label="Clear all selections"
              >
                <X className="h-4 w-4" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-64 overflow-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent',
                    option.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className={cn(
                    'flex-1',
                    option.disabled && 'text-muted-foreground'
                  )}>
                    {option.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
