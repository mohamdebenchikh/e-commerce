import { useState, useCallback } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { toast } from 'sonner';

export interface UploadedImage {
    path: string;
    url: string;
    filename: string;
    original_name: string;
    size: number;
    mime_type: string;
}

export interface UploadProgress {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    url?: string;
    error?: string;
}

interface UseImageUploadOptions {
    folder?: string;
    maxFileSize?: number; // in bytes
    allowedTypes?: string[];
    onUploadComplete?: (image: UploadedImage) => void;
    onUploadError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
    const {
        folder = 'products',
        maxFileSize = 5 * 1024 * 1024, // 5MB
        allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
        onUploadComplete,
        onUploadError
    } = options;

    const [uploads, setUploads] = useState<UploadProgress[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const validateFile = useCallback((file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
        }

        if (file.size > maxFileSize) {
            return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`;
        }

        return null;
    }, [allowedTypes, maxFileSize]);

    const uploadSingle = useCallback(async (file: File): Promise<UploadedImage | null> => {
        const validationError = validateFile(file);
        if (validationError) {
            toast.error(validationError);
            onUploadError?.(validationError);
            return null;
        }

        const uploadId = `${Date.now()}-${Math.random()}`;
        
        // Add to uploads state
        setUploads(prev => [...prev, {
            id: uploadId,
            file,
            progress: 0,
            status: 'uploading'
        }]);

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', folder);

            const response = await axios.post(route('admin.images.upload'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const progress = progressEvent.total 
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    
                    setUploads(prev => prev.map(upload => 
                        upload.id === uploadId 
                            ? { ...upload, progress }
                            : upload
                    ));
                }
            });

            if (response.data.success) {
                const uploadedImage = response.data.data;
                
                // Update upload status
                setUploads(prev => prev.map(upload => 
                    upload.id === uploadId 
                        ? { ...upload, status: 'completed', progress: 100, url: uploadedImage.url }
                        : upload
                ));

                onUploadComplete?.(uploadedImage);
                toast.success('Image uploaded successfully');
                
                return uploadedImage;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
            
            // Update upload status
            setUploads(prev => prev.map(upload => 
                upload.id === uploadId 
                    ? { ...upload, status: 'error', error: errorMessage }
                    : upload
            ));

            toast.error(errorMessage);
            onUploadError?.(errorMessage);
            
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [validateFile, folder, onUploadComplete, onUploadError]);

    const uploadMultiple = useCallback(async (files: File[]): Promise<UploadedImage[]> => {
        const validFiles: File[] = [];
        
        // Validate all files first
        for (const file of files) {
            const validationError = validateFile(file);
            if (validationError) {
                toast.error(`${file.name}: ${validationError}`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) {
            return [];
        }

        setIsUploading(true);
        const uploadedImages: UploadedImage[] = [];

        try {
            // Upload files one by one to show individual progress
            for (const file of validFiles) {
                const result = await uploadSingle(file);
                if (result) {
                    uploadedImages.push(result);
                }
            }

            return uploadedImages;
        } finally {
            setIsUploading(false);
        }
    }, [uploadSingle, validateFile]);

    const deleteImage = useCallback(async (path: string): Promise<boolean> => {
        try {
            const response = await axios.delete(route('admin.images.delete'), {
                data: { path }
            });

            if (response.data.success) {
                toast.success('Image deleted successfully');
                return true;
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
            toast.error(errorMessage);
            return false;
        }
    }, []);

    const deleteMultipleImages = useCallback(async (paths: string[]): Promise<boolean> => {
        try {
            const response = await axios.delete(route('admin.images.delete-multiple'), {
                data: { paths }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                return true;
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
            toast.error(errorMessage);
            return false;
        }
    }, []);

    const clearUploads = useCallback(() => {
        setUploads([]);
    }, []);

    const removeUpload = useCallback((id: string) => {
        setUploads(prev => prev.filter(upload => upload.id !== id));
    }, []);

    return {
        uploads,
        isUploading,
        uploadSingle,
        uploadMultiple,
        deleteImage,
        deleteMultipleImages,
        clearUploads,
        removeUpload
    };
}
