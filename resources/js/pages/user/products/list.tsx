import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/user/product-card';
import { trans } from '@/lib/utils';
import { SharedData, Product } from '@/types';
import { 
    Search, 
    Heart, 
    Package, 
    ArrowLeft,
    Trash2,
    Eye,
    Grid3X3,
    List as ListIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductListProps {
    products: {
        data: Product[];
        links?: any[];
        meta?: any;
    };
    filters: {
        search?: string;
        sort_by?: string;
        sort_order?: string;
        per_page?: number;
    };
}

export default function ProductList({ products, filters = {} }: ProductListProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Ensure products has the right structure
    const safeProducts = {
        data: products?.data || [],
        links: products?.links || [],
        meta: products?.meta || { total: 0 }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('products.my-list'), { 
            ...filters,
            search: value,
            page: 1 // Reset to first page
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('_');
        router.get(route('products.my-list'), { 
            ...filters,
            sort_by: sortBy,
            sort_order: sortOrder,
            page: 1
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleRemoveFromList = (productId: number) => {
        router.delete(route('products.remove-from-list', productId), {
            onSuccess: () => {
                toast.success(trans('Product removed from your list successfully'));
            },
            onError: (errors) => {
                toast.error(errors.message || trans('Failed to remove product from list'));
            }
        });
    };

    const clearAllProducts = () => {
        if (confirm(trans('Are you sure you want to remove all products from your list?'))) {
            // We'll need to implement a bulk remove endpoint or remove one by one
            safeProducts.data.forEach(product => {
                router.delete(route('products.remove-from-list', product.id), {
                    preserveState: true,
                    preserveScroll: true,
                });
            });
        }
    };

    return (
        <AppLayout>
            <Head title={trans('My Product List')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {trans('My Product List')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {trans('Manage your selected products')} ({safeProducts.meta.total} {trans('products')})
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('products.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {trans('Browse Products')}
                            </Link>
                        </Button>

                        {safeProducts.data.length > 0 && (
                            <Button variant="destructive" onClick={clearAllProducts}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {trans('Clear All')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search and Controls */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={trans('Search in your list...')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch(search);
                                        }
                                    }}
                                    className="pl-10"
                                />
                            </div>

                            {/* Sort */}
                            <Select
                                value={`${filters.sort_by || 'user_product_list.created_at'}_${filters.sort_order || 'desc'}`}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user_product_list.created_at_desc">
                                        {trans('Recently Added')}
                                    </SelectItem>
                                    <SelectItem value="user_product_list.created_at_asc">
                                        {trans('Oldest Added')}
                                    </SelectItem>
                                    <SelectItem value="name_asc">{trans('Name A-Z')}</SelectItem>
                                    <SelectItem value="name_desc">{trans('Name Z-A')}</SelectItem>
                                    <SelectItem value="price_asc">{trans('Price Low to High')}</SelectItem>
                                    <SelectItem value="price_desc">{trans('Price High to Low')}</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Mode Toggle */}
                            <div className="flex border rounded-md">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-l-none"
                                >
                                    <ListIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products */}
                {safeProducts.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filters.search 
                                    ? trans('No products found in your list') 
                                    : trans('Your product list is empty')
                                }
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {filters.search 
                                    ? trans('Try adjusting your search terms')
                                    : trans('Start adding products to your list to see them here')
                                }
                            </p>
                            <Button asChild>
                                <Link href={route('products.index')}>
                                    <Package className="h-4 w-4 mr-2" />
                                    {trans('Browse Products')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {safeProducts.data.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isInUserList={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {safeProducts.data.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-100 flex-shrink-0">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-full">
                                                <div className="flex-1 mb-4 sm:mb-0">
                                                    <h3 className="font-semibold text-lg mb-2">
                                                        <Link 
                                                            href={route('products.show', product.id)}
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    </h3>
                                                    
                                                    {product.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                            {product.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-4">
                                                        <span className="text-lg font-bold text-primary">
                                                            {product.formatted_price}
                                                        </span>
                                                        <span className={`text-sm ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
                                                            {product.is_in_stock 
                                                                ? `${trans('In Stock')} (${product.stock_quantity})`
                                                                : trans('Out of Stock')
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('products.show', product.id)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            {trans('View')}
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleRemoveFromList(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {trans('Remove')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {safeProducts.links && Array.isArray(safeProducts.links) && safeProducts.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {safeProducts.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            router.visit(link.url);
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
