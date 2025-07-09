import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trans } from '@/lib/utils';
import { SharedData, Product } from '@/types';
import { 
    Heart, 
    Package, 
    ArrowLeft, 
    Star, 
    Share2,
    Eye,
    ShoppingCart,
    Info,
    Tag,
    Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { RichTextViewer } from '@/components/editor';

interface ProductShowProps {
    product: Product;
    isInUserList: boolean;
}

export default function ProductShow({ product, isInUserList }: ProductShowProps) {
    const { locale } = usePage<SharedData>().props;
    const [selectedImage, setSelectedImage] = useState(0);

    const handleAddToList = () => {
        router.post(route('products.add-to-list', product.id), {}, {
            onSuccess: () => {
                toast.success(trans('Product added to your list successfully'));
            },
            onError: (errors) => {
                toast.error(errors.message || trans('Failed to add product to list'));
            }
        });
    };

    const handleRemoveFromList = () => {
        router.delete(route('products.remove-from-list', product.id), {
            onSuccess: () => {
                toast.success(trans('Product removed from your list successfully'));
            },
            onError: (errors) => {
                toast.error(errors.message || trans('Failed to remove product from list'));
            }
        });
    };

    const productImages = product.images && product.images.length > 0 
        ? product.images.map(img => img.image_path)
        : product.image 
        ? [product.image] 
        : [];

    return (
        <AppLayout>
            <Head title={product.name} />
            
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href={route('products.index')} className="hover:text-foreground">
                        {trans('Products')}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </div>

                {/* Back Button */}
                <div className="mb-6">
                    <Button variant="outline" asChild>
                        <Link href={route('products.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {trans('Back to Products')}
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                            {productImages.length > 0 ? (
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-24 w-24 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                                            selectedImage === index 
                                                ? 'border-primary' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {product.name}
                                </h1>
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Categories */}
                            {product.categories && product.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.categories.map((category) => (
                                        <Badge key={category.id} variant="secondary">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {product.is_featured && (
                                    <Badge variant="default">
                                        <Star className="h-3 w-3 mr-1" />
                                        {trans('Featured')}
                                    </Badge>
                                )}
                                <Badge variant={product.is_in_stock ? "outline" : "destructive"}>
                                    {product.is_in_stock ? (
                                        <>
                                            <Package className="h-3 w-3 mr-1" />
                                            {trans('In Stock')} ({product.stock_quantity})
                                        </>
                                    ) : (
                                        <>
                                            <Package className="h-3 w-3 mr-1" />
                                            {trans('Out of Stock')}
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-2">
                                {product.formatted_price}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {trans('Price includes all applicable taxes')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {isInUserList ? (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleRemoveFromList}
                                    className="flex-1"
                                >
                                    <Heart className="h-5 w-5 mr-2 fill-current" />
                                    {trans('Remove from List')}
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={handleAddToList}
                                    disabled={!product.is_in_stock}
                                    className="flex-1"
                                >
                                    <Heart className="h-5 w-5 mr-2" />
                                    {trans('Add to List')}
                                </Button>
                            )}
                        </div>

                        {/* Product Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    {trans('Product Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* SKU */}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{trans('SKU')}:</span>
                                    <span className="font-medium">{product.sku}</span>
                                </div>

                                {/* Stock */}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{trans('Stock Quantity')}:</span>
                                    <span className="font-medium">{product.stock_quantity}</span>
                                </div>

                                {/* Status */}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{trans('Status')}:</span>
                                    <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                                        {trans(product.status)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Description & Details */}
                <div className="mt-12 space-y-8">
                    {/* Description */}
                    {product.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{trans('Description')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Details */}
                    {product.details && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{trans('Additional Details')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RichTextViewer
                                    content={product.details}
                                    className="text-muted-foreground"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
