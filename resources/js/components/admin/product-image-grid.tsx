/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
    Plus,
    X,
    Star,
    Loader2,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react';
import axios from 'axios';

interface ProductImage {
    id: number;
    url: string;
    created_at: string;
}

interface ProductImageGridProps {
    productId: number;
    mainImage?: string;
    onMainImageChange?: (imageUrl: string) => void;
    maxImages?: number;
    className?: string;
}

export function ProductImageGrid({
    productId,
    mainImage,
    onMainImageChange,
    maxImages = 10,
    className = ''
}: ProductImageGridProps) {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get all images including main image for viewer
    const allImages = mainImage ? [{ id: 0, url: mainImage, created_at: '' }, ...images] : images;

    // Fetch existing images
    const fetchImages = useCallback(async () => {
        try {
            const response = await axios.get(`/admin/products/${productId}/images`);
            if (response.data.success) {
                setImages(response.data.images);
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
            toast.error('Failed to load images');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // Handle file upload
    const handleFileUpload = useCallback(async (files: FileList) => {
        if (files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (images.length + files.length > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);
        const formData = new FormData();

        Array.from(files).forEach((file) => {
            formData.append('images[]', file);
        });

        try {
            const response = await axios.post(`/admin/products/${productId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Add new images to the list
                setImages(prev => [...prev, ...response.data.images.map((img: any) => ({
                    id: img.id,
                    url: img.url,
                    created_at: new Date().toISOString()
                }))]);

                toast.success(`${response.data.images.length} image(s) uploaded successfully`);
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.response?.data?.message || 'Failed to upload images');
        } finally {
            setUploading(false);
        }
    }, [productId, images.length, maxImages]);

    // Handle image deletion
    const handleDeleteImage = useCallback(async (imageId: number) => {
        try {
            const response = await axios.delete(`/admin/products/${productId}/images/${imageId}`);

            if (response.data.success) {
                setImages(prev => prev.filter(img => img.id !== imageId));
                toast.success('Image deleted successfully');
            }
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast.error(error.response?.data?.message || 'Failed to delete image');
        }
    }, [productId]);

    // Handle setting main image
    const handleSetMainImage = useCallback(async (imageId: number) => {
        try {
            const response = await axios.patch(`/admin/products/${productId}/images/main`, {
                image_id: imageId
            });

            if (response.data.success) {
                // Update the images list with the swapped URLs
                setImages(prev => prev.map(img =>
                    img.id === imageId
                        ? { ...img, url: response.data.data.updated_additional_image.url }
                        : img
                ));

                // Notify parent component of the new main image
                onMainImageChange?.(response.data.data.new_main_image);
                toast.success('Main image updated successfully');
            }
        } catch (error: any) {
            console.error('Update main image failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update main image');
        }
    }, [productId, onMainImageChange]);

    // Handle image viewer
    const openImageViewer = useCallback((imageIndex: number) => {
        setCurrentImageIndex(imageIndex);
        setViewerOpen(true);
    }, []);



    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
        } else {
            setCurrentImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
        }
    }, [allImages.length]);

    // Handle drag and drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    }, [handleFileUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Handle file input change
    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileUpload(e.target.files);
        }
    }, [handleFileUpload]);

    const canAddMore = images.length < maxImages;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className={`space-y-4 ${className}`}>
                {/* Shopify-style Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main Image - Large display */}
                    {mainImage && (
                        <div className="space-y-2">
                            <div className="relative rounded-lg group overflow-hidden aspect-square cursor-pointer" onClick={() => openImageViewer(0)}>
                                    <img
                                        src={mainImage}
                                        alt="Main product image"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-2">
                                            <Eye className="h-5 w-5 text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                                            <Star className="h-3 w-3 mr-1" />
                                            Main
                                        </Badge>
                                    </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Images Grid */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            {images.slice(0, 5).map((image, index) => (
                                <div key={image.id} className="relative rounded-lg group overflow-hidden aspect-square cursor-pointer">
                                   
                                        <img
                                            src={image.url}
                                            alt="Product image"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            onClick={() => openImageViewer(index + 1)}
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 rounded-full p-1">
                                                <Eye className="h-3 w-3 text-gray-700" />
                                            </div>
                                        </div>
                                        <div className="absolute top-1 right-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-6 w-6 p-0 bg-accent/90 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleSetMainImage(image.id)}>
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Set as main
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                </div>
                            ))}

                            {/* Show more images indicator */}
                            {images.length > 5 && (
                                <Card className="aspect-square cursor-pointer bg-muted/50 hover:bg-muted transition-colors" onClick={() => openImageViewer(6)}>
                                    <CardContent className="p-0 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Plus className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                +{images.length - 5} more
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Add More Images Button */}
                            {canAddMore && (
                                <Card
                                    className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <CardContent className="p-0 h-full flex items-center justify-center">
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileInputChange}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 text-muted-foreground mb-1" />
                                                    <span className="text-xs text-muted-foreground text-center">
                                                        Add
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </CardContent>
                                </Card>
                            )}
                        </div>


                    </div>

                </div>
                {/* Upload Info */}
                <div className="text-xs  text-muted-foreground text-center">
                    {images.length} of {maxImages} images
                </div>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>Product Images</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex-1 flex items-center justify-center p-4">
                        {allImages.length > 0 && (
                            <>
                                <img
                                    src={allImages[currentImageIndex]?.url}
                                    alt="Product image"
                                    className="max-w-full max-h-full object-contain"
                                />

                                {/* Navigation buttons */}
                                {allImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                            onClick={() => navigateImage('prev')}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                                            onClick={() => navigateImage('next')}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}

                                {/* Image counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
