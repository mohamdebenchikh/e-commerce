import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { trans } from '@/lib/utils';

const sampleCategories: MultiSelectOption[] = [
  { value: 1, label: 'Electronics' },
  { value: 2, label: 'Clothing & Fashion' },
  { value: 3, label: 'Home & Garden' },
  { value: 4, label: 'Sports & Outdoors' },
  { value: 5, label: 'Books & Media' },
  { value: 6, label: 'Health & Beauty' },
  { value: 7, label: 'Toys & Games' },
  { value: 8, label: 'Automotive' },
  { value: 9, label: 'Food & Beverages' },
  { value: 10, label: 'Office Supplies' },
  { value: 11, label: 'Pet Supplies' },
  { value: 12, label: 'Travel & Luggage' },
  { value: 13, label: 'Music & Instruments' },
  { value: 14, label: 'Art & Crafts' },
  { value: 15, label: 'Jewelry & Accessories', disabled: true },
];

const sampleTags: MultiSelectOption[] = [
  { value: 'new', label: 'New Arrival' },
  { value: 'sale', label: 'On Sale' },
  { value: 'featured', label: 'Featured' },
  { value: 'bestseller', label: 'Best Seller' },
  { value: 'limited', label: 'Limited Edition' },
  { value: 'eco', label: 'Eco-Friendly' },
  { value: 'premium', label: 'Premium Quality' },
  { value: 'handmade', label: 'Handmade' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'organic', label: 'Organic' },
];

export default function MultiSelectDemo() {
  const [selectedCategories, setSelectedCategories] = useState<(string | number)[]>([1, 3, 5]);
  const [selectedTags, setSelectedTags] = useState<(string | number)[]>(['new', 'featured']);
  const [selectedColors, setSelectedColors] = useState<(string | number)[]>([]);

  const colorOptions: MultiSelectOption[] = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'gray', label: 'Gray' },
  ];

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedColors([]);
  };

  return (
    <AppLayout>
      <Head title="MultiSelect Component Demo" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">MultiSelect Component Demo</h1>
          <p className="text-muted-foreground">
            Showcase of the MultiSelect component with different configurations
          </p>
        </div>

        {/* Basic Example */}
        <Card>
          <CardHeader>
            <CardTitle>Basic MultiSelect - Categories</CardTitle>
            <CardDescription>
              Select multiple categories with search functionality. Some options are disabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Categories</Label>
              <MultiSelect
                options={sampleCategories}
                value={selectedCategories}
                onValueChange={setSelectedCategories}
                placeholder="Select categories..."
                searchPlaceholder="Search categories..."
                emptyText="No categories found"
                maxDisplayed={3}
              />
            </div>
            
            {selectedCategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Categories:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((categoryId) => {
                    const category = sampleCategories.find(c => c.value === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary">
                        {category.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compact Example */}
        <Card>
          <CardHeader>
            <CardTitle>Compact MultiSelect - Tags</CardTitle>
            <CardDescription>
              Smaller options list with different styling and higher display limit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Tags</Label>
              <MultiSelect
                options={sampleTags}
                value={selectedTags}
                onValueChange={setSelectedTags}
                placeholder="Add tags..."
                searchPlaceholder="Search tags..."
                emptyText="No tags available"
                maxDisplayed={5}
                variant="outline"
              />
            </div>
            
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = sampleTags.find(t => t.value === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="outline">
                        {tag.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty State Example */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State - Colors</CardTitle>
            <CardDescription>
              Example showing the empty state and selection behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Colors</Label>
              <MultiSelect
                options={colorOptions}
                value={selectedColors}
                onValueChange={setSelectedColors}
                placeholder="Choose colors..."
                searchPlaceholder="Search colors..."
                emptyText="No colors match your search"
                maxDisplayed={4}
                variant="secondary"
              />
            </div>
            
            {selectedColors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No colors selected. Try selecting some colors from the dropdown.
              </p>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Colors:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map((colorId) => {
                    const color = colorOptions.find(c => c.value === colorId);
                    return color ? (
                      <Badge key={colorId} variant="default">
                        {color.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Summary</CardTitle>
            <CardDescription>
              Overview of all selections made above.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Categories ({selectedCategories.length})</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedCategories.length === 0 
                    ? 'None selected' 
                    : selectedCategories.map(id => 
                        sampleCategories.find(c => c.value === id)?.label
                      ).join(', ')
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tags ({selectedTags.length})</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedTags.length === 0 
                    ? 'None selected' 
                    : selectedTags.map(id => 
                        sampleTags.find(t => t.value === id)?.label
                      ).join(', ')
                  }
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Colors ({selectedColors.length})</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedColors.length === 0 
                    ? 'None selected' 
                    : selectedColors.map(id => 
                        colorOptions.find(c => c.value === id)?.label
                      ).join(', ')
                  }
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleReset} variant="outline">
                Reset All Selections
              </Button>
              <Button 
                onClick={() => {
                  setSelectedCategories([1, 2, 3]);
                  setSelectedTags(['new', 'featured', 'bestseller']);
                  setSelectedColors(['red', 'blue', 'green']);
                }}
              >
                Set Sample Selections
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              How to use the MultiSelect component in your code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';

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
  searchPlaceholder="Search..."
  emptyText="No options found"
  maxDisplayed={3}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
