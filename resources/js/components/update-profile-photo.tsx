import { useState, useRef } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { SharedData } from '@/types';
import { trans } from '@/lib/utils';
import { toast } from 'sonner';

interface UpdateProfilePhotoProps {
    className?: string;
}

export default function UpdateProfilePhoto({ className }: UpdateProfilePhotoProps) {
    const { auth } = usePage<SharedData>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { setData, post, processing } = useForm<{
        photo: File | null;
    }>({
        photo: null,
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error(trans('profile_photo_invalid_type'));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(trans('profile_photo_too_large'));
                return;
            }

            setSelectedFile(file);
            setData('photo', file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            setIsDialogOpen(true);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        console.log('Starting upload for file:', selectedFile.name, 'Size:', selectedFile.size);

        post(route('profile.photo.update'), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                console.log('Upload success:', page);
                toast.success(trans('profile_photo_updated_success'));
                setIsDialogOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                const errorMessage = errors.photo || trans('profile_photo_update_error');
                setUploadError(errorMessage);
                toast.error(errorMessage);
            },
            onFinish: () => {
                console.log('Upload finished');
            },
        });
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getInitials = () => {
        const firstName = auth.user?.first_name || '';
        const lastName = auth.user?.last_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

   

    return (
        <>
            <div className={`relative group ${className}`}>
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
                    <AvatarImage 
                        src={auth.user.photo || undefined} 
                        alt={`${auth.user?.first_name} ${auth.user?.last_name}`}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-lg md:text-xl font-semibold bg-primary text-primary-foreground">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-110"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">{trans('profile_change_photo')}</span>
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{trans('profile_update_photo_title')}</DialogTitle>
                        <DialogDescription>
                            {trans('profile_update_photo_description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center space-y-4 py-4">
                        {previewUrl && (
                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-border">
                                    <AvatarImage 
                                        src={previewUrl} 
                                        alt="Preview"
                                        className="object-cover"
                                    />
                                </Avatar>
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                {selectedFile?.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {selectedFile && `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                            </p>
                        </div>

                        {uploadError && (
                            <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-sm font-medium">{uploadError}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            <X className="h-4 w-4 mr-2" />
                            {trans('cancel')}
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={processing || !selectedFile}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {processing ? (
                                <>
                                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                                    {trans('uploading')}
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    {trans('profile_update_photo')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
