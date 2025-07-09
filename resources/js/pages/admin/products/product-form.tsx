import { useCallback, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { trans } from '@/lib/utils';
import { type Category, type Product, type Tag } from '@/types';
import { Package, Settings, DollarSign, Hash, Image as ImageIcon, Save, Plus, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/editor';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { ProductImageGrid } from '@/components/admin/product-image-grid';
import { CreateTagDialog } from '@/components/admin/create-tag-dialog';

interface ProductFormData {
    name: string;
    description: string;
    details: string;
    price: number;
    stock_quantity: number;
    is_featured: boolean;
    status: 'draft' | 'published';
    sku: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    category_ids: number[];
    tag_ids: number[];
    [key: string]: string | number | boolean | number[] | null;
}

interface ProductFormProps {
    product: Product; // Required - edit mode only
    categories: Category[];
    tags: Tag[];
}

export default function ProductForm({ product, categories, tags }: ProductFormProps) {
    // This form is now edit-only
    const [currentMainImage, setCurrentMainImage] = useState<string | undefined>(product.image);
    const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
    const [showCreateTagDialog, setShowCreateTagDialog] = useState(false);

    const { data, setData, put, processing, errors } = useForm<ProductFormData>({
        name: product.name,
        description: product.description,
        details: product.details || '',
        price: product.price,
        stock_quantity: product.stock_quantity,
        is_featured: product.is_featured,
        status: product.status,
        sku: product.sku,
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        seo_keywords: product.seo_keywords || '',
        category_ids: product.categories?.map(cat => cat.id) || [],
        tag_ids: product.tags?.map(tag => tag.id) || [],
    });

    // Handle main image change from the grid component
    const handleMainImageChange = useCallback((imageUrl: string) => {
        // Update the current main image state to reflect the change
        setCurrentMainImage(imageUrl);
    }, []);

    // Handle new tag creation
    const handleTagCreated = useCallback((newTag: Tag) => {
        // Add the new tag to the available tags list
        setAvailableTags(prev => [...prev, newTag]);
        // Auto-select the new tag
        setData('tag_ids', [...data.tag_ids, newTag.id]);
        // Close the dialog
        setShowCreateTagDialog(false);
    }, [data.tag_ids, setData]);

    const handleSaveChanges = () => {
        put(route('admin.products.update', product.id), {
            onSuccess: () => {
                toast.success(trans('product_updated_successfully'));
            },
            onError: () => {
                toast.error('Failed to update product');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Three Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Basic Information - Takes 2 columns */}
                <div className="xl:col-span-2 space-y-6">
                    <Accordion type="multiple" defaultValue={["basic-info", "product-details", "images", "seo"]} className="space-y-4">
                        {/* Basic Information */}
                        <AccordionItem value="basic-info">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            {trans('basic_information')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('enter_product_basic_details')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{trans('product_name')}</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder={trans('enter_product_name')}
                                                    required
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="sku">{trans('sku')}</Label>
                                                <Input
                                                    id="sku"
                                                    value={data.sku}
                                                    onChange={(e) => setData('sku', e.target.value)}
                                                    placeholder="PRD-001"
                                                    required
                                                />
                                                <InputError message={errors.sku} />
                                                <p className="text-xs text-muted-foreground">
                                                    {trans('sku_description')}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">{trans('description')}</Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder={trans('enter_product_description')}
                                                    rows={3}
                                                    required
                                                />
                                                <InputError message={errors.description} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Product Details */}
                        <AccordionItem value="product-details">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            {trans('details')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('product_details_description')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-2">
                                            <Label htmlFor="details">{trans('details')}</Label>
                                            <RichTextEditor
                                                content={data.details}
                                                onChange={(content) => setData('details', content)}
                                                placeholder={trans('enter_product_details_optional')}
                                                minHeight="300px"
                                                className="w-full"
                                            />
                                            <InputError message={errors.details} />
                                            <p className="text-xs text-muted-foreground">
                                                {trans('product_details_description')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Product Images */}
                        <AccordionItem value="images">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5" />
                                            {trans('product_images')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('upload_product_images')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="pt-0">
                                        <ProductImageGrid
                                            productId={product.id}
                                            mainImage={currentMainImage}
                                            onMainImageChange={handleMainImageChange}
                                            maxImages={10}
                                        />
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* SEO Settings */}
                        <AccordionItem value="seo">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Search className="h-5 w-5" />
                                            {trans('seo_settings')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('optimize_product_for_search_engines')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-2">
                                            <Label htmlFor="seo_title">{trans('seo_title')}</Label>
                                            <Input
                                                id="seo_title"
                                                value={data.seo_title}
                                                onChange={(e) => setData('seo_title', e.target.value)}
                                                placeholder={trans('enter_seo_title')}
                                                maxLength={255}
                                            />
                                            <InputError message={errors.seo_title} />
                                            <p className="text-xs text-muted-foreground">
                                                {trans('seo_title_description')}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seo_description">{trans('seo_description')}</Label>
                                            <Textarea
                                                id="seo_description"
                                                value={data.seo_description}
                                                onChange={(e) => setData('seo_description', e.target.value)}
                                                placeholder={trans('enter_seo_description')}
                                                rows={3}
                                                maxLength={500}
                                            />
                                            <InputError message={errors.seo_description} />
                                            <p className="text-xs text-muted-foreground">
                                                {trans('seo_description_description')}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seo_keywords">{trans('seo_keywords')}</Label>
                                            <Textarea
                                                id="seo_keywords"
                                                value={data.seo_keywords}
                                                onChange={(e) => setData('seo_keywords', e.target.value)}
                                                placeholder={trans('enter_seo_keywords')}
                                                rows={2}
                                                maxLength={1000}
                                            />
                                            <InputError message={errors.seo_keywords} />
                                            <p className="text-xs text-muted-foreground">
                                                {trans('seo_keywords_description')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Right Sidebar - Takes 1 column */}
                <div className="space-y-6">
                    <Accordion type="multiple" defaultValue={["categories", "tags", "pricing", "settings"]} className="space-y-4">
                        {/* Categories */}
                        <AccordionItem value="categories">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Hash className="h-5 w-5" />
                                            {trans('categories')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('select_product_categories')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-3">
                                            {/* MultiSelect for categories */}
                                            <div className="space-y-2">
                                                <MultiSelect
                                                    options={categories
                                                        .filter(category => category.name && category.name.trim() !== '') // Filter out categories without names
                                                        .map((category): MultiSelectOption => ({
                                                            value: category.id,
                                                            label: category.name,
                                                        }))}
                                                    value={data.category_ids}
                                                    onValueChange={(values) => setData('category_ids', values as number[])}
                                                    placeholder={trans('select_categories')}
                                                    searchPlaceholder={trans('search_categories')}
                                                    emptyText={trans('no_categories_found')}
                                                    maxDisplayed={5}
                                                    className="w-full"
                                                />
                                                <InputError message={errors.category_ids} />
                                            </div>

                                            {/* Categories status info */}
                                            <div className="pt-2 border-t">
                                                {data.category_ids.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        {trans('select_at_least_one_category')}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        {data.category_ids.length} {data.category_ids.length === 1 ? trans('category') : trans('categories')} {trans('selected')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Tags */}
                        <AccordionItem value="tags">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Hash className="h-5 w-5" />
                                            {trans('tags')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('select_product_tags')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-3">
                                            {/* MultiSelect for existing tags */}
                                            <div className="space-y-2">
                                                <MultiSelect
                                                    options={availableTags.map((tag): MultiSelectOption => ({
                                                        value: tag.id,
                                                        label: tag.name,
                                                    }))}
                                                    value={data.tag_ids}
                                                    onValueChange={(values) => setData('tag_ids', values as number[])}
                                                    placeholder={trans('select_tags')}
                                                    searchPlaceholder={trans('search_tags')}
                                                    emptyText={trans('no_tags_found')}
                                                    maxDisplayed={5}
                                                    className="w-full"
                                                />
                                                <InputError message={errors.tag_ids} />
                                            </div>

                                            {/* Add new tag button - full width */}
                                            <Button
                                                type="button"
                                                onClick={() => setShowCreateTagDialog(true)}
                                                className="w-full"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                {trans('add_new_tag')}
                                            </Button>

                                            {/* Tags status info */}
                                            <div className="pt-2 border-t">
                                                {data.tag_ids.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        {trans('no_tags_assigned')}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        {data.tag_ids.length} {data.tag_ids.length === 1 ? trans('tag') : trans('tags')} {trans('selected')}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {trans('product_tags_description')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Pricing & Inventory */}
                        <AccordionItem value="pricing">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            {trans('pricing_inventory')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('set_product_price_and_stock')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="price">{trans('price')}</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={data.price}
                                                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                                        placeholder="0.00"
                                                        required
                                                        className="pr-16"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                        {trans('currency_symbol')}
                                                    </div>
                                                </div>
                                                <InputError message={errors.price} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="stock_quantity">{trans('stock_quantity')}</Label>
                                                <Input
                                                    id="stock_quantity"
                                                    type="number"
                                                    min="0"
                                                    value={data.stock_quantity}
                                                    onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                                    placeholder="0"
                                                    required
                                                />
                                                <InputError message={errors.stock_quantity} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        {/* Settings */}
                        <AccordionItem value="settings">
                            <Card>
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <CardHeader className="p-0">
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            {trans('product_settings')}
                                        </CardTitle>
                                        <CardDescription>
                                            {trans('configure_product_settings')}
                                        </CardDescription>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status">{trans('status')}</Label>
                                                <Select value={data.status} onValueChange={(value: 'draft' | 'published') => setData('status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">{trans('draft')}</SelectItem>
                                                        <SelectItem value="published">{trans('published')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.status} />
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="is_featured"
                                                    checked={data.is_featured}
                                                    onCheckedChange={(checked) => setData('is_featured', checked)}
                                                />
                                                <Label htmlFor="is_featured">{trans('featured_product')}</Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    </Accordion>

                </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    {trans('cancel')}
                </Button>
                <Button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={processing}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? trans('updating') : trans('save_changes')}
                </Button>
            </div>

            {/* Create Tag Dialog */}
            <CreateTagDialog
                open={showCreateTagDialog}
                onOpenChange={setShowCreateTagDialog}
                onTagCreated={handleTagCreated}
            />
        </div>
    );
}
