import React, { useState, useCallback, useEffect, useRef } from 'react';
import { EnhancedImageDropzone } from './enhanced-image-dropzone';
import { ImagePreview, type ImagePreviewItem } from './image-preview';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { trans } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { type UploadedImage } from '@/hooks/use-image-upload';

interface ProductImageManagerProps {
    onMainImageChange: (file: File | null) => void;
    onAdditionalImagesChange: (files: File[]) => void;
    mainImageError?: string;
    additionalImagesError?: string;
    className?: string;
    maxImages?: number;
    maxFileSize?: number; // in bytes
    required?: boolean;
    existingMainImage?: string;
    existingAdditionalImages?: string[];
}

export function ProductImageManager({
    onMainImageChange,
    onAdditionalImagesChange,
    mainImageError,
    additionalImagesError,
    className,
    maxImages = 10,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    required = true,
    existingMainImage,
    existingAdditionalImages
}: ProductImageManagerProps) {
    // Initialize images with existing images
    const getInitialImages = useCallback((): ImagePreviewItem[] => {
        const existingImages: ImagePreviewItem[] = [];

        // Add existing main image
        if (existingMainImage) {
            existingImages.push({
                id: 'existing-main',
                file: null,
                url: existingMainImage,
                name: 'Main Image',
                isMain: true,
                isExisting: true
            });
        }

        // Add existing additional images
        if (existingAdditionalImages && existingAdditionalImages.length > 0) {
            existingAdditionalImages.forEach((imageUrl, index) => {
                existingImages.push({
                    id: `existing-additional-${index}`,
                    file: null,
                    url: imageUrl,
                    name: `Additional Image ${index + 1}`,
                    isMain: false,
                    isExisting: true
                });
            });
        }

        return existingImages;
    }, [existingMainImage, existingAdditionalImages]);

    const [images, setImages] = useState<ImagePreviewItem[]>(getInitialImages);
    const [hasMainImage, setHasMainImage] = useState(() => getInitialImages().some(img => img.isMain));

    // Use refs to store the latest callback functions
    const onMainImageChangeRef = useRef(onMainImageChange);
    const onAdditionalImagesChangeRef = useRef(onAdditionalImagesChange);

    // Use ref to track images for cleanup
    const imagesRef = useRef<ImagePreviewItem[]>([]);

    // Update refs when callbacks change
    useEffect(() => {
        onMainImageChangeRef.current = onMainImageChange;
    }, [onMainImageChange]);

    useEffect(() => {
        onAdditionalImagesChangeRef.current = onAdditionalImagesChange;
    }, [onAdditionalImagesChange]);

    // Update parent components when images change
    useEffect(() => {
        const mainImage = images.find(img => img.isMain);
        const additionalImages = images.filter(img => !img.isMain);

        // Pass uploaded image URLs to parent instead of files
        const mainImageUrl = mainImage && !mainImage.isExisting ? mainImage.url : null;
        const additionalImageUrls = additionalImages
            .filter(img => !img.isExisting)
            .map(img => img.url)
            .filter(Boolean);

        // For backward compatibility, we still call the file callbacks but with null
        // The parent should be updated to handle URLs instead
        onMainImageChangeRef.current(mainImageUrl as any);
        onAdditionalImagesChangeRef.current(additionalImageUrls as any);

        setHasMainImage(!!mainImage);

        // Update ref for cleanup
        imagesRef.current = images;
    }, [images]);

    const handleImagesUploaded = useCallback((uploadedImages: UploadedImage[]) => {
        setImages(prev => {
            const newImages: ImagePreviewItem[] = uploadedImages.map((uploadedImage, index) => ({
                id: `uploaded-${Date.now()}-${index}`,
                file: null, // No file needed since it's already uploaded
                url: uploadedImage.url,
                name: uploadedImage.original_name,
                isExisting: false, // These are newly uploaded
                isMain: prev.length === 0 && index === 0, // First image becomes main if no images exist
                uploadedData: uploadedImage // Store the full upload data
            }));

            const updated = [...prev, ...newImages];
            // If we don't have a main image yet, make the first one main
            if (!prev.some(img => img.isMain) && updated.length > 0) {
                updated[0].isMain = true;
            }
            return updated;
        });
    }, []);

    const handleRemoveImage = useCallback((id: string) => {
        setImages(prev => {
            const updated = prev.filter(img => img.id !== id);
            const removedImage = prev.find(img => img.id === id);
            
            // If we removed the main image, make the first remaining image main
            if (removedImage?.isMain && updated.length > 0) {
                updated[0].isMain = true;
            }
            
            // Clean up object URL
            if (removedImage?.url.startsWith('blob:')) {
                URL.revokeObjectURL(removedImage.url);
            }
            
            return updated;
        });
    }, []);

    const handleSetMainImage = useCallback((id: string) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isMain: img.id === id
        })));
    }, []);

    const handlePreviewImage = useCallback((image: ImagePreviewItem) => {
        // Open image in new tab for preview
        window.open(image.url, '_blank');
    }, []);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            // Cleanup using ref to get latest images
            imagesRef.current.forEach(image => {
                if (image.url.startsWith('blob:')) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, []); // Only run on mount/unmount

    const canAddMore = images.length < maxImages;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Instructions */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    <Label className="text-base font-medium">
                        {trans('product_images')}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                    {trans('upload_product_images_description')}
                </p>
            </div>

            {/* Main Image Requirement Alert */}
            {required && !hasMainImage && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {trans('main_image_required')}
                    </AlertDescription>
                </Alert>
            )}

            {/* Enhanced Dropzone with Direct Upload */}
            {canAddMore && (
                <EnhancedImageDropzone
                    onImagesUploaded={handleImagesUploaded}
                    maxFiles={maxImages - images.length}
                    folder="products"
                    multiple={true}
                    className="min-h-[200px]"
                />
            )}

            {/* Max images reached message */}
            {!canAddMore && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {trans('max_images_reached_message', { max: maxImages })}
                    </AlertDescription>
                </Alert>
            )}

            {/* Image Preview */}
            <ImagePreview
                images={images}
                onRemove={handleRemoveImage}
                onSetMain={handleSetMainImage}
                onPreview={handlePreviewImage}
                showMainToggle={true}
                maxImages={maxImages}
            />

            {/* Error Messages */}
            {mainImageError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{mainImageError}</AlertDescription>
                </Alert>
            )}

            {additionalImagesError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{additionalImagesError}</AlertDescription>
                </Alert>
            )}

            {/* Tips */}
            {images.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• {trans('click_star_to_set_main_image')}</p>
                    <p>• {trans('main_image_will_be_displayed_first')}</p>
                    <p>• {trans('drag_drop_to_add_more_images')}</p>
                </div>
            )}
        </div>
    );
}
