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
import { User, type BreadcrumbItem, type SharedData } from '@/types';
import { Eye, Edit, Trash2, Plus, Search, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface UsersIndexProps {
    users: {
        data: User[];
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

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('users'), href: route('admin.users.index') },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.users.index'), { 
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
        router.get(route('admin.users.index'), { 
            search, 
            per_page: newPerPage 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.users.index'), {
            ...filters,
            sort_by: column,
            sort_order: newSortOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (user: User) => {
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                toast.success(trans('user_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    };

    const handleToggleStatus = (user: User) => {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
            onSuccess: () => {
                const message = user.active ? trans('user_deactivated_successfully') : trans('user_activated_successfully');
                toast.success(message);
            },
            onError: () => {
                toast.error('Failed to update user status');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('user_management')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('user_management')}</h1>
                        <p className="text-muted-foreground">
                            {trans('showing_results', {
                                from: users.from,
                                to: users.to,
                                total: users.total
                            })}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.users.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {trans('create_user')}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>{trans('filters')}</CardTitle>
                        <CardDescription>
                            {trans('search_and_filter_users')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={trans('search_users')}
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

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('first_name')}
                                    >
                                        {trans('name')}
                                    </TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('email')}
                                    >
                                        {trans('email')}
                                    </TableHead>
                                    <TableHead>{trans('phone')}</TableHead>
                                    <TableHead>{trans('country')}</TableHead>
                                    <TableHead>{trans('user_status')}</TableHead>
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
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            {trans('no_users_found')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.first_name} {user.last_name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>{user.country}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.active ? 'default' : 'secondary'}>
                                                    {user.active ? trans('active') : trans('inactive')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString(locale)}
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
                                                            <Link href={route('admin.users.show', user.id)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {trans('view_user')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.users.edit', user.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                {trans('edit_user')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                            {user.active ? (
                                                                <>
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    {trans('deactivate_user')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    {trans('activate_user')}
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    {trans('delete_user')}
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{trans('delete_user')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {trans('delete_user_confirmation')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{trans('cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(user)}>
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
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {trans('showing_results', {
                                from: users.from,
                                to: users.to,
                                total: users.total
                            })}
                        </div>
                        <div className="flex gap-2">
                            {users.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index'), {
                                        ...filters,
                                        page: users.current_page - 1
                                    })}
                                >
                                    {trans('previous')}
                                </Button>
                            )}
                            {users.current_page < users.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index'), {
                                        ...filters,
                                        page: users.current_page + 1
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
