import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Package, Star, Eye } from 'lucide-react';
import { trans } from '@/lib/utils';
import { Product } from '@/types';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    isInUserList?: boolean;
    showAddToList?: boolean;
}

export default function ProductCard({ 
    product, 
    isInUserList = false, 
    showAddToList = true 
}: ProductCardProps) {
    const handleAddToList = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        router.post(route('products.add-to-list', product.id), {}, {
            onSuccess: () => {
                toast.success(trans('Product added to your list successfully'));
            },
            onError: (errors) => {
                toast.error(errors.message || trans('Failed to add product to list'));
            }
        });
    };

    const handleRemoveFromList = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        router.delete(route('products.remove-from-list', product.id), {
            onSuccess: () => {
                toast.success(trans('Product removed from your list successfully'));
            },
            onError: (errors) => {
                toast.error(errors.message || trans('Failed to remove product from list'));
            }
        });
    };

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link href={route('products.show', product.id)}>
                <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <Package className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                                {trans('Featured')}
                            </Badge>
                        )}
                        {!product.is_in_stock && (
                            <Badge variant="destructive" className="text-xs">
                                {trans('Out of Stock')}
                            </Badge>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.visit(route('products.show', product.id));
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <CardContent className="p-4">
                    {/* Product Name */}
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Categories */}
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {product.categories.slice(0, 2).map((category) => (
                                <Badge key={category.id} variant="outline" className="text-xs">
                                    {category.name}
                                </Badge>
                            ))}
                            {product.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{product.categories.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {product.description}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                                {product.formatted_price}
                            </span>
                        </div>
                        
                        {/* Stock Status */}
                        <div className="text-xs text-muted-foreground">
                            {product.is_in_stock ? (
                                <span className="text-green-600">
                                    {trans('In Stock')} ({product.stock_quantity})
                                </span>
                            ) : (
                                <span className="text-red-600">
                                    {trans('Out of Stock')}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Link>

            {/* Card Footer with Actions */}
            {showAddToList && (
                <CardFooter className="p-4 pt-0">
                    <div className="flex w-full gap-2">
                        {isInUserList ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={handleRemoveFromList}
                            >
                                <Heart className="h-4 w-4 mr-2 fill-current" />
                                {trans('Remove from List')}
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={handleAddToList}
                                disabled={!product.is_in_stock}
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                {trans('Add to List')}
                            </Button>
                        )}
                        
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href={route('products.show', product.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {trans('View')}
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
