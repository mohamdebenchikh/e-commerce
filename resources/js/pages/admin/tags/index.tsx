import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Plus, Search, Trash2, Tag } from 'lucide-react';
import { trans } from '@/lib/utils';
import { toast } from 'sonner';
import { CreateTagDialog } from '@/components/admin/create-tag-dialog';

interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

interface TagsIndexProps {
    tags: {
        data: Tag[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        per_page: number;
        sort_by: string;
        sort_order: string;
    };
}

export default function TagsIndex({ tags, filters }: TagsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.tags.index'), { search }, { preserveState: true });
    };



    const handleDeleteTag = async () => {
        if (!selectedTag) return;

        setIsLoading(true);

        try {
            const response = await fetch(route('admin.tags.destroy', selectedTag.id), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setShowDeleteDialog(false);
                setSelectedTag(null);
                router.reload();
            } else {
                toast.error(data.message || 'An error occurred');
            }
        } catch (error) {
            console.log(error)
            toast.error('An error occurred while deleting the tag');
        } finally {
            setIsLoading(false);
        }
    };



    const openDeleteDialog = (tag: Tag) => {
        setSelectedTag(tag);
        setShowDeleteDialog(true);
    };

    const handleTagCreated = () => {
        // Refresh the page to show the new tag
        router.reload();
        toast.success(trans('tag_created_successfully'));
    };

    return (
        <AdminLayout>
            <Head title={trans('tag_management')} />

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {trans('tag_management')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {trans('search_and_filter_tags')}
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        {trans('create_tag')}
                    </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder={trans('search_tags')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>

                {/* Tags Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{trans('tag_name')}</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>{trans('created_at')}</TableHead>
                                <TableHead>{trans('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tags.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <div className="flex flex-col items-center">
                                            <Tag className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500">{trans('no_tags_found')}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.data.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>
                                            <span className="font-medium">{tag.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{tag.slug}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(tag.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(tag)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>



            {/* Delete Tag Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{trans('delete_tag')}</DialogTitle>
                        <DialogDescription>
                            {trans('delete_tag_confirmation')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            {trans('cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTag} disabled={isLoading}>
                            {isLoading ? trans('deleting') : trans('delete_tag')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Tag Dialog */}
            <CreateTagDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onTagCreated={handleTagCreated}
            />
        </AdminLayout>
    );
}
