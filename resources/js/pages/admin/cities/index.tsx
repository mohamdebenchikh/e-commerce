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
import { type BreadcrumbItem, type SharedData, type City } from '@/types';
import { Eye, Edit, Trash2, Plus, Search, MoreHorizontal, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface CitiesIndexProps {
    cities: {
        data: City[];
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

export default function CitiesIndex({ cities, filters }: CitiesIndexProps) {
    const { locale } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('cities'), href: route('admin.cities.index') },
    ];

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.cities.index'), { 
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
        router.get(route('admin.cities.index'), { 
            search, 
            per_page: newPerPage 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleSort = (column: string) => {
        const newSortOrder = filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.cities.index'), {
            ...filters,
            sort_by: column,
            sort_order: newSortOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (city: City) => {
        router.delete(route('admin.cities.destroy', city.id), {
            onSuccess: () => {
                toast.success(trans('city_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete city');
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(locale, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('city_management')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('city_management')}</h1>
                        <p className="text-muted-foreground">
                            {trans('showing_results', {
                                from: cities.from,
                                to: cities.to,
                                total: cities.total
                            })}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.cities.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {trans('create_city')}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>{trans('filters')}</CardTitle>
                        <CardDescription>
                            {trans('search_and_filter_cities')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={trans('search_cities')}
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

                {/* Cities Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('ar_name')}
                                    >
                                        {trans('name')}
                                    </TableHead>
                                    <TableHead>{trans('ar_name')}</TableHead>
                                    <TableHead>{trans('en_name')}</TableHead>
                                    <TableHead>{trans('fr_name')}</TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('shipping_cost')}
                                    >
                                        {trans('shipping_cost')}
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
                                {cities.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <MapPin className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">{trans('no_cities_found')}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cities.data.map((city) => (
                                        <TableRow key={city.id}>
                                            <TableCell className="font-medium">
                                                {city.name}
                                            </TableCell>
                                            <TableCell>{city.ar_name}</TableCell>
                                            <TableCell>{city.en_name}</TableCell>
                                            <TableCell>{city.fr_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {formatCurrency(city.shipping_cost)} {trans('currency_symbol')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(city.created_at).toLocaleDateString(locale)}
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
                                                            <Link href={route('admin.cities.show', city.id)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {trans('view_city')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.cities.edit', city.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                {trans('edit_city')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    {trans('delete_city')}
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{trans('delete_city')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        {trans('delete_city_confirmation')}
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>{trans('cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(city)}>
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
                {cities.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {trans('showing_results', {
                                from: cities.from,
                                to: cities.to,
                                total: cities.total
                            })}
                        </div>
                        <div className="flex gap-2">
                            {cities.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.cities.index'), {
                                        ...filters,
                                        page: cities.current_page - 1
                                    })}
                                >
                                    {trans('previous')}
                                </Button>
                            )}
                            {cities.current_page < cities.last_page && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.get(route('admin.cities.index'), {
                                        ...filters,
                                        page: cities.current_page + 1
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
