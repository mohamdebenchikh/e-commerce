import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData, type Category } from '@/types';
import { Eye, Edit, Trash2, Plus, Search, MoreHorizontal, FolderOpen, Image } from 'lucide-react';
import { toast } from 'sonner';

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        per_page: number;
        sort_by: string;
        sort_order: string;
    };
}

export default function CategoriesIndex({ categories, filters }: CategoriesIndexProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('categories'), href: route('admin.categories.index') },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.categories.index'), { 
            search: value, 
            per_page: perPage 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(route('admin.categories.index'), { 
            search, 
            per_page: newPerPage 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.categories.index'), {
            ...filters,
            sort_by: column,
            sort_order: newSortOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (category: Category) => {
        router.delete(route('admin.categories.destroy', category.id), {
            onSuccess: () => {
                toast.success(trans('category_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete category');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('category_management')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('category_management')}</h1>
                        <p className="text-muted-foreground">
                            {trans('showing_results', {
                                from: categories.from,
                                to: categories.to,
                                total: categories.total
                            })}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {trans('create_category')}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>{trans('filters')}</CardTitle>
                        <CardDescription>
                            {trans('search_and_filter_categories')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={trans('search_categories')}
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 {trans('per_page')}</SelectItem>
                                    <SelectItem value="25">25 {trans('per_page')}</SelectItem>
                                    <SelectItem value="50">50 {trans('per_page')}</SelectItem>
                                    <SelectItem value="100">100 {trans('per_page')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{trans('image')}</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('ar_name')}
                                    >
                                        {trans('name')}
                                    </TableHead>
                                    <TableHead>{trans('ar_name')}</TableHead>
                                    <TableHead>{trans('en_name')}</TableHead>
                                    <TableHead>{trans('fr_name')}</TableHead>
                                    <TableHead>{trans('status')}</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('sort_order')}
                                    >
                                        {trans('sort_order')}
                                    </TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        {trans('created_at')}
                                    </TableHead>
                                    <TableHead className="text-right">{trans('actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">{trans('no_categories_found')}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.data.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                {category.image ? (
                                                    <img 
                                                        src={category.image} 
                                                        alt={category.name}
                                                        className="w-10 h-10 rounded-md object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                                                        <Image className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>{category.ar_name}</TableCell>
                                            <TableCell>{category.en_name}</TableCell>
                                            <TableCell>{category.fr_name}</TableCell>
                                            <TableCell>
                                                <Badge variant={category.is_active ? "default" : "secondary"}>
                                                    {category.is_active ? trans('active') : trans('inactive')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {category.sort_order}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(category.created_at).toLocaleDateString(locale)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.categories.show', category.id)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {trans('view_category')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.categories.edit', category.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                {trans('edit_category')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    {trans('delete_category')}
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{trans('delete_category')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {trans('delete_category_confirmation')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{trans('cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(category)}>
                                                                        {trans('delete')}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {categories.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {trans('showing_results', {
                                from: categories.from,
                                to: categories.to,
                                total: categories.total
                            })}
                        </div>
                        <div className="flex gap-2">
                            {categories.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.categories.index'), {
                                        ...filters,
                                        page: categories.current_page - 1
                                    })}
                                >
                                    {trans('previous')}
                                </Button>
                            )}
                            {categories.current_page < categories.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.categories.index'), {
                                        ...filters,
                                        page: categories.current_page + 1
                                    })}
                                >
                                    {trans('next')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
