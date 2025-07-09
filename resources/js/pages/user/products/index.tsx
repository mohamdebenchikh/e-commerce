import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, } from '@/components/ui/card';
import ProductCard from '@/components/user/product-card';
import { trans } from '@/lib/utils';
import { SharedData, Product, Category } from '@/types';
import { 
    Search, 
    Package, 
    Heart,
    SlidersHorizontal,
    X
} from 'lucide-react';

interface ProductsIndexProps {
    products: {
        data: Product[];
        links?: any[];
        meta?: any;
    };
    categories: Category[];
    userProductIds: number[];
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        sort_by?: string;
        sort_order?: string;
        per_page?: number;
    };
}

export default function ProductsIndex({
    products,
    categories = [],
    userProductIds = [],
    filters = {}
}: ProductsIndexProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Ensure products has the right structure
    const safeProducts = {
        data: products?.data || [],
        links: products?.links || [],
        meta: products?.meta || { total: 0 }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('products.index'), { 
            ...filters,
            search: value,
            page: 1 // Reset to first page
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('products.index'), { 
            ...filters,
            [key]: value,
            page: 1 // Reset to first page
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const clearFilters = () => {
        router.get(route('products.index'), {}, { 
            preserveState: true,
            replace: true 
        });
    };

    const hasActiveFilters = filters.category || filters.min_price || filters.max_price || filters.search;

    return (
        <AppLayout>
            <Head title={trans('Products')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {trans('Products')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {trans('Browse and add products to your list')} ({safeProducts.meta.total} {trans('products')})
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('products.my-list')}>
                                <Heart className="h-4 w-4 mr-2" />
                                {trans('My List')} ({userProductIds.length})
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={trans('Search products...')}
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
                                <Button onClick={() => handleSearch(search)}>
                                    {trans('Search')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    {trans('Filters')}
                                </Button>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            {trans('Category')}
                                        </label>
                                        <Select
                                            value={filters.category || ''}
                                            onValueChange={(value) => handleFilterChange('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={trans('All Categories')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">{trans('All Categories')}</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            {trans('Min Price')}
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={filters.min_price || ''}
                                            onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            {trans('Max Price')}
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="1000"
                                            value={filters.max_price || ''}
                                            onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                        />
                                    </div>

                                    {/* Sort */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            {trans('Sort By')}
                                        </label>
                                        <Select
                                            value={`${filters.sort_by || 'created_at'}_${filters.sort_order || 'desc'}`}
                                            onValueChange={(value) => {
                                                const [sortBy, sortOrder] = value.split('_');
                                                router.get(route('products.index'), { 
                                                    ...filters,
                                                    sort_by: sortBy,
                                                    sort_order: sortOrder,
                                                    page: 1
                                                }, { 
                                                    preserveState: true,
                                                    replace: true 
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="created_at_desc">{trans('Newest First')}</SelectItem>
                                                <SelectItem value="created_at_asc">{trans('Oldest First')}</SelectItem>
                                                <SelectItem value="name_asc">{trans('Name A-Z')}</SelectItem>
                                                <SelectItem value="name_desc">{trans('Name Z-A')}</SelectItem>
                                                <SelectItem value="price_asc">{trans('Price Low to High')}</SelectItem>
                                                <SelectItem value="price_desc">{trans('Price High to Low')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Clear Filters */}
                                    {hasActiveFilters && (
                                        <div className="flex items-end">
                                            <Button variant="outline" onClick={clearFilters} className="w-full">
                                                <X className="h-4 w-4 mr-2" />
                                                {trans('Clear Filters')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {safeProducts.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{trans('No products found')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {trans('Try adjusting your search or filters')}
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={clearFilters}>
                                    {trans('Clear Filters')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {safeProducts.data.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isInUserList={userProductIds.includes(product.id)}
                            />
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
