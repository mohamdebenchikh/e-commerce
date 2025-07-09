import { useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData, type Product, type Category } from '@/types';
import { Plus, Image, Star, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import type { Column } from '@/components/data-table/data-table-context';

interface ProductsIndexProps {
    products: {
        data: Product[];
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
        status?: string;
        category?: string;
    };
    categories: Category[];
}





export default function ProductsIndex({ products, filters }: ProductsIndexProps) {
    const { locale } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('products'), href: route('admin.products.index') },
    ];

    // Define columns for the data table
    const columns: Column[] = [
        {
            id: "product",
            header: trans('product'),
            accessorKey: "name",
            filterType: "text",
            render: (_value: string, row: Product) => (
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        {row.image ? (
                            <img
                                src={row.image}
                                alt={row.name}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        {row.is_featured && (
                            <div className="absolute -top-1 -right-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate max-w-[200px]" title={row.name}>
                            {row.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5" title={row.description}>
                            {row.description}
                        </div>
                        <div className="mt-1">
                            <span className="font-medium text-sm">
                                {new Intl.NumberFormat(locale, {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(row.price)} {trans('currency_symbol')}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "stock_status",
            header: trans('stock'),
            accessorKey: "stock_quantity",
            enableSorting: false,
            enableFiltering: false,
            render: (value: number) => {
                const inStock = value > 0;
                return (
                    <Badge
                        variant={inStock ? "default" : "destructive"}
                        className={inStock ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                    >
                        {inStock ? trans('in_stock') : trans('out_of_stock')}
                    </Badge>
                );
            },
        },
        {
            id: "status",
            header: trans('status'),
            accessorKey: "status",
            render: (value: string) => {
                switch (value) {
                    case 'published':
                        return <Badge variant="default">{trans('published')}</Badge>;
                    case 'draft':
                        return <Badge variant="secondary">{trans('draft')}</Badge>;
                    default:
                        return <Badge variant="outline">{value}</Badge>;
                }
            },
        },
        {
            id: "created_at",
            header: trans('created_at'),
            accessorKey: "created_at",
            enableSorting: false,
            enableFiltering: false,
            render: (value: string) => {
                const date = new Date(value);
                return (
                    <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            id: "updated_at",
            header: trans('last_update'),
            accessorKey: "updated_at",
            enableSorting: false,
            enableFiltering: false,
            render: (value: string) => {
                const date = new Date(value);
                return (
                    <div className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "",
            accessorKey: "id",
            enableSorting: false,
            enableFiltering: false,
            render: (_value: number, row: Product) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{trans('open_menu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.visit(route('admin.products.show', row.id))}>
                            <Eye className="mr-2 h-4 w-4" />
                            {trans('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.visit(route('admin.products.edit', row.id))}>
                            <Edit className="mr-2 h-4 w-4" />
                            {trans('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                router.delete(route('admin.products.destroy', row.id), {
                                    onSuccess: () => {
                                        // Handle success if needed
                                    },
                                    onError: () => {
                                        // Handle error if needed
                                    }
                                });
                            }}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {trans('delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // Server-side handlers
    const handlePaginate = useCallback((page: number) => {
        router.get(route('admin.products.index'), {
            ...filters,
            page: page,
        }, {
            preserveState: true,
            replace: true
        });
    }, [filters]);

    const handleSearch = useCallback((searchTerm: string) => {
        router.get(route('admin.products.index'), {
            ...filters,
            search: searchTerm,
            page: 1, // Reset to first page when searching
        }, {
            preserveState: true,
            replace: true
        });
    }, [filters]);

    const handleSort = useCallback((column: string, direction: "asc" | "desc") => {
        router.get(route('admin.products.index'), {
            ...filters,
            sort_by: column,
            sort_order: direction,
            page: 1, // Reset to first page when sorting
        }, {
            preserveState: true,
            replace: true
        });
    }, [filters]);

    const handleFilter = useCallback((filterList: Filter[]) => {
        // Convert filters to query parameters
        const filterParams: Record<string, string> = {};

        filterList.forEach(filter => {
            const column = columns.find(col => col.id === filter.columnId);
            if (column) {
                // Map column IDs to backend parameter names
                switch (filter.columnId) {
                    case 'product':
                        filterParams.search = filter.value;
                        break;
                    default:
                        filterParams[filter.columnId] = filter.value;
                }
            }
        });

        router.get(route('admin.products.index'), {
            ...filters,
            ...filterParams,
            page: 1, // Reset to first page when filtering
        }, {
            preserveState: true,
            replace: true
        });
    }, [filters, columns]);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('product_management')} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Heading
                        title={trans('product_management')}
                        description={trans('showing_results', {
                            from: products.from,
                            to: products.to,
                            total: products.total
                        })}
                    />
                    <Button asChild>
                        <Link href={route('admin.products.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {trans('create_product')}
                        </Link>
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    data={products.data}
                    columns={columns}
                    total={products.total}
                    perPage={products.per_page}
                    serverSide={true}
                    onPaginate={handlePaginate}
                    onSearch={handleSearch}
                    onSort={handleSort}
                />
            </div>
        </AdminLayout>
    );
}
