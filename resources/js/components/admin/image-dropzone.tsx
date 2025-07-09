import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trans } from '@/lib/utils';

interface ImageDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    maxSize?: number; // in bytes
    className?: string;
    disabled?: boolean;
    multiple?: boolean;
    children?: React.ReactNode;
}

export function ImageDropzone({
    onFilesSelected,
    accept = {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024, // 5MB
    className,
    disabled = false,
    multiple = true,
    children
}: ImageDropzoneProps) {
    const [error, setError] = useState<string | null>(null);
    const onFilesSelectedRef = useRef(onFilesSelected);

    // Update ref when callback changes
    useEffect(() => {
        onFilesSelectedRef.current = onFilesSelected;
    }, [onFilesSelected]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);

        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                setError(trans('file_too_large', { size: Math.round(maxSize / 1024 / 1024) }));
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                setError(trans('invalid_file_type'));
            } else if (rejection.errors[0]?.code === 'too-many-files') {
                setError(trans('too_many_files', { max: maxFiles }));
            } else {
                setError(trans('file_upload_error'));
            }
            return;
        }

        // Validate file types manually as an extra check
        const invalidFiles = acceptedFiles.filter(file => {
            return !file.type.startsWith('image/');
        });

        if (invalidFiles.length > 0) {
            setError(trans('only_images_allowed'));
            return;
        }

        onFilesSelectedRef.current(acceptedFiles);
    }, [maxSize, maxFiles]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxFiles: multiple ? maxFiles : 1,
        maxSize,
        disabled,
        multiple
    });

    return (
        <div className="space-y-2">
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                    "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isDragActive && !isDragReject && "border-primary bg-primary/5",
                    isDragReject && "border-destructive bg-destructive/5",
                    disabled && "opacity-50 cursor-not-allowed",
                    error && "border-destructive",
                    className
                )}
            >
                <input {...getInputProps()} />
                
                {children ? (
                    children
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            isDragActive && !isDragReject ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                            {isDragActive ? (
                                <Upload className="w-6 h-6" />
                            ) : (
                                <ImageIcon className="w-6 h-6" />
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                {isDragActive
                                    ? trans('drop_images_here')
                                    : trans('drag_drop_images_or_click')
                                }
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {trans('supported_formats')}: JPEG, PNG, GIF, WebP
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {trans('max_file_size')}: {Math.round(maxSize / 1024 / 1024)}MB
                            </p>
                            {multiple && (
                                <p className="text-xs text-muted-foreground">
                                    {trans('max_files')}: {maxFiles}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
