import React, { useEffect, useState } from 'react';
import axios, {  AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Plus, Loader2 } from 'lucide-react';
import { trans } from '@/lib/utils';
import { toast } from 'sonner';
import { type Tag } from '@/types';

interface CreateTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTagCreated: (tag: Tag) => void;
}

interface TagFormData {
    name: string;
    [key:string]:string
}

export function CreateTagDialog({ open, onOpenChange, onTagCreated }: CreateTagDialogProps) {
    const [data, setData] = useState<TagFormData>({
        name: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Partial<TagFormData>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('admin.tags.store'), data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.data.success) {
                const createdTag: Tag = response.data.tag;
                toast.success(trans('tag_created_successfully'));
                onTagCreated(createdTag);
                handleClose();
            }
        } catch (error ) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 422) {
                // Validation errors
                const responseData = axiosError.response.data as { errors?: Partial<TagFormData> };
                setErrors(responseData.errors || {});
                toast.error('Please check the form for errors');
            } else {
                toast.error('Failed to create tag. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setData({
            name: '',
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        {trans('create_tag')}
                    </DialogTitle>
                    <DialogDescription>
                        {trans('create_new_tag_description')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tag-name">{trans('tag_name')} *</Label>
                        <Input
                            id="tag-name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={trans('enter_tag_name')}
                            disabled={processing}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            {trans('cancel')}
                        </Button>
                        <Button type="submit" disabled={processing || !data.name.trim()}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {trans('creating')}
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {trans('create_tag')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
