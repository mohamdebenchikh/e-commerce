import React from 'react';
import { X, Star, StarOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trans } from '@/lib/utils';

export interface ImagePreviewItem {
    id: string;
    file?: File | null;
    url: string;
    isMain?: boolean;
    name?: string;
    isExisting?: boolean;
    uploadedData?: any; // Store uploaded image data from server
}

interface ImagePreviewProps {
    images: ImagePreviewItem[];
    onRemove: (id: string) => void;
    onSetMain: (id: string) => void;
    onPreview?: (image: ImagePreviewItem) => void;
    className?: string;
    showMainToggle?: boolean;
    maxImages?: number;
}

export function ImagePreview({
    images,
    onRemove,
    onSetMain,
    onPreview,
    className,
    showMainToggle = true,
    maxImages
}: ImagePreviewProps) {
    if (images.length === 0) {
        return null;
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                    {trans('selected_images')} ({images.length}
                    {maxImages && `/${maxImages}`})
                </h4>
                {maxImages && images.length >= maxImages && (
                    <Badge variant="secondary" className="text-xs">
                        {trans('max_images_reached')}
                    </Badge>
                )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "relative group rounded-lg overflow-hidden border-2 transition-all",
                            image.isMain 
                                ? "border-primary ring-2 ring-primary/20" 
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        {/* Image */}
                        <div className="aspect-square relative">
                            <img
                                src={image.url}
                                alt={image.name || `Image ${image.id}`}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                            
                            {/* Actions */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1">
                                    {onPreview && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onPreview(image)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    
                                    {showMainToggle && (
                                        <Button
                                            size="sm"
                                            variant={image.isMain ? "default" : "secondary"}
                                            className="h-8 w-8 p-0"
                                            onClick={() => onSetMain(image.id)}
                                            title={image.isMain ? trans('main_image') : trans('set_as_main')}
                                        >
                                            {image.isMain ? (
                                                <Star className="h-4 w-4 fill-current" />
                                            ) : (
                                                <StarOff className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                    
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 p-0"
                                        onClick={() => onRemove(image.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main image badge */}
                        {image.isMain && (
                            <div className="absolute top-2 left-2">
                                <Badge variant="default" className="text-xs">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    {trans('main')}
                                </Badge>
                            </div>
                        )}
                        
                        {/* File name */}
                        {image.name && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                                <p className="text-xs truncate" title={image.name}>
                                    {image.name}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Instructions */}
            {showMainToggle && images.length > 1 && (
                <p className="text-xs text-muted-foreground">
                    {trans('click_star_to_set_main_image')}
                </p>
            )}
        </div>
    );
}
