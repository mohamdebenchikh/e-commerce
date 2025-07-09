import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import {EnhancedImageDropzone} from '@/components/admin/enhanced-image-dropzone';

interface SimpleProductFormData {
    name: string;
    sku: string;
    description: string;
    price: string;
    image: string;
    [key: string]: string | number | boolean | File | File[] | number[] | null;
}

export default function CreateProduct() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('products'), href: route('admin.products.index') },
        { title: trans('create_product'), href: route('admin.products.create') },
    ];

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<SimpleProductFormData>({
        name: '',
        sku: '',
        description: '',
        price: '',
        image: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Basic validation before submit
        if (!data.image) {
            toast.error('Please upload a product image');
            return;
        }

        post(route('admin.products.store'), {
            onSuccess: () => {
                toast.success('Product created successfully! Redirecting to edit page...');
            },
            onError: () => {
                toast.error('Failed to create product');
            }
        });
    };

    const handleCancel = () => {
        window.location.href = route('admin.products.index');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('create_product')} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <Heading title={trans('create_product')} description="Create a new product with essential information. Products are saved as drafts by default." />

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Basic Product Information</CardTitle>
                        <CardDescription>
                            Fill in the required fields to create your product. The product will be saved as a draft, and you'll be able to add categories, additional images, and other details on the next page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU *</Label>
                                    <Input
                                        id="sku"
                                        type="text"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        placeholder="Enter product SKU"
                                        className={errors.sku ? 'border-red-500' : ''}
                                    />
                                    {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product description"
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            {/* Main Image */}
                            <div className="space-y-2">
                                <Label>Product Image *</Label>
                                {!uploadedImage ? (
                                    <EnhancedImageDropzone
                                        onImagesUploaded={(images) => {
                                            const imageUrl = images[0]?.url || '';
                                            setData('image', imageUrl);
                                            setUploadedImage(imageUrl);
                                        }}
                                        maxFiles={1}
                                        multiple={false}
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        <div className="relative inline-block">
                                            <img
                                                src={uploadedImage}
                                                alt="Product preview"
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2"
                                                onClick={() => {
                                                    setUploadedImage(null);
                                                    setData('image', '');
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Image uploaded successfully. Click × to remove and upload a different image.
                                        </p>
                                    </div>
                                )}
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.price ? 'border-red-500' : ''}
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

