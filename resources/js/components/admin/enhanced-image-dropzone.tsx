import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { trans } from '@/lib/utils';
import { 
    Upload, 
    Image as ImageIcon, 
    X, 
    CheckCircle, 
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useImageUpload, type UploadedImage, type UploadProgress } from '@/hooks/use-image-upload';

interface EnhancedImageDropzoneProps {
    onImagesUploaded: (images: UploadedImage[]) => void;
    maxFiles?: number;
    folder?: string;
    className?: string;
    multiple?: boolean;
    disabled?: boolean;
}

export function EnhancedImageDropzone({
    onImagesUploaded,
    maxFiles = 10,
    folder = 'products',
    className,
    multiple = true,
    disabled = false
}: EnhancedImageDropzoneProps) {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    const {
        uploads,
        isUploading,
        uploadSingle,
        uploadMultiple,
        clearUploads,
        removeUpload
    } = useImageUpload({
        folder,
        onUploadComplete: (image) => {
            setUploadedImages(prev => {
                const newImages = [...prev, image];
                onImagesUploaded(newImages);
                return newImages;
            });
        }
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (disabled) return;

        const filesToUpload = multiple 
            ? acceptedFiles.slice(0, maxFiles - uploadedImages.length)
            : acceptedFiles.slice(0, 1);

        if (filesToUpload.length === 0) return;

        if (multiple) {
            await uploadMultiple(filesToUpload);
        } else {
            await uploadSingle(filesToUpload[0]);
        }
    }, [disabled, multiple, maxFiles, uploadedImages.length, uploadMultiple, uploadSingle]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple,
        disabled: disabled || isUploading,
        maxFiles: multiple ? maxFiles : 1
    });

    const removeUploadedImage = useCallback((index: number) => {
        setUploadedImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            onImagesUploaded(newImages);
            return newImages;
        });
    }, [onImagesUploaded]);

    const getStatusIcon = (status: UploadProgress['status']) => {
        switch (status) {
            case 'uploading':
                return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: UploadProgress['status']) => {
        switch (status) {
            case 'uploading':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                    isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50',
                    (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm">
                        {isDragActive ? (
                            <p>{trans('drop_images_here')}</p>
                        ) : (
                            <div>
                                <p className="font-medium">
                                    {trans('drag_drop_images_or')} <span className="text-primary">{trans('browse')}</span>
                                </p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {trans('supported_formats')}: JPEG, PNG, GIF, WebP (max 5MB each)
                                </p>
                                {multiple && (
                                    <p className="text-muted-foreground text-xs">
                                        {trans('max_files')}: {maxFiles}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Progress */}
            {uploads.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{trans('uploading_images')}</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearUploads}
                            className="h-6 px-2 text-xs"
                        >
                            {trans('clear')}
                        </Button>
                    </div>
                    {uploads.map((upload) => (
                        <div key={upload.id} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                {getStatusIcon(upload.status)}
                                <span className="flex-1 truncate">{upload.file.name}</span>
                                <Badge variant="outline" className={cn('text-xs', getStatusColor(upload.status))}>
                                    {upload.status}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeUpload(upload.id)}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                            {upload.status === 'uploading' && (
                                <Progress value={upload.progress} className="h-2" />
                            )}
                            {upload.status === 'error' && upload.error && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        {upload.error}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">{trans('uploaded_images')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.url}
                                    alt={image.original_name}
                                    className="w-full h-20 object-cover rounded-md border"
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeUploadedImage(index)}
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute bottom-1 left-1 right-1">
                                    <div className="bg-black/50 text-white text-xs px-1 py-0.5 rounded truncate">
                                        {image.original_name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
