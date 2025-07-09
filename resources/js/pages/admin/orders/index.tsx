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
import { Order, type BreadcrumbItem, type SharedData } from '@/types';
import { Eye, Edit, Trash2, Plus, Search, MoreHorizontal, Package, Truck, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

interface OrdersIndexProps {
    orders: {
        data: Order[];
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
        status: string;
    };
    statuses: Record<string, string>;
}

export default function OrdersIndex({ orders, filters, statuses }: OrdersIndexProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('orders'), href: route('admin.orders.index') },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.orders.index'), { 
            search: value, 
            per_page: perPage,
            status: statusFilter
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(route('admin.orders.index'), { 
            search, 
            per_page: newPerPage,
            status: statusFilter
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(route('admin.orders.index'), { 
            search, 
            per_page: perPage,
            status: value === 'all' ? '' : value
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.orders.index'), {
            ...filters,
            sort_by: column,
            sort_order: newSortOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (order: Order) => {
        router.delete(route('admin.orders.destroy', order.id), {
            onSuccess: () => {
                toast.success(trans('order_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete order');
            }
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return Clock;
            case 'confirmed': return Package;
            case 'shipped': return Truck;
            case 'delivered': return CheckCircle;
            case 'cancelled': return X;
            default: return Clock;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'confirmed': return 'default';
            case 'shipped': return 'default';
            case 'delivered': return 'success' as any;
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('order_management')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('order_management')}</h1>
                        <p className="text-muted-foreground">
                            {trans('showing_results', {
                                from: orders.from,
                                to: orders.to,
                                total: orders.total
                            })}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.orders.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {trans('create_order')}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>{trans('filters')}</CardTitle>
                        <CardDescription>
                            {trans('search_and_filter_orders')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={trans('search_orders')}
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{trans('all_statuses')}</SelectItem>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                {/* Orders Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('id')}
                                    >
                                        {trans('order_id')}
                                    </TableHead>
                                    <TableHead>{trans('client_name')}</TableHead>
                                    <TableHead>{trans('product')}</TableHead>
                                    <TableHead>{trans('user')}</TableHead>
                                    <TableHead>{trans('sale_price')}</TableHead>
                                    <TableHead>{trans('profit')}</TableHead>
                                    <TableHead>{trans('status')}</TableHead>
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
                                {orders.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                            {trans('no_orders_found')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.data.map((order) => {
                                        const StatusIcon = getStatusIcon(order.status);
                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #{order.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{order.client_name}</div>
                                                        <div className="text-sm text-muted-foreground">{order.client_phone}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.product?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {order.user?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {order.sale_price.toFixed(2)} MAD
                                                </TableCell>
                                                <TableCell>
                                                    {order.user_profit.toFixed(2)} MAD
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1 w-fit">
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statuses[order.status] || order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(order.created_at).toLocaleDateString(locale)}
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
                                                                <Link href={route('admin.orders.show', order.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    {trans('view_order')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('admin.orders.edit', order.id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    {trans('edit_order')}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        {trans('delete_order')}
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>{trans('delete_order')}</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {trans('delete_order_confirmation')}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>{trans('cancel')}</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(order)}>
                                                                            {trans('delete')}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {trans('showing_results', {
                                from: orders.from,
                                to: orders.to,
                                total: orders.total
                            })}
                        </div>
                        <div className="flex gap-2">
                            {orders.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.orders.index'), {
                                        ...filters,
                                        page: orders.current_page - 1
                                    })}
                                >
                                    {trans('previous')}
                                </Button>
                            )}
                            {orders.current_page < orders.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.orders.index'), {
                                        ...filters,
                                        page: orders.current_page + 1
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
