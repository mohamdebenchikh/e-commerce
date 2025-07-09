import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData, type Product } from '@/types';
import { ArrowLeft, Edit, Trash2, Package, Calendar, DollarSign, Hash, Image, Star, Archive, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ShowProductProps {
    product: Product;
}

export default function ShowProduct({ product }: ShowProductProps) {
    const { locale } = usePage<SharedData>().props;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('products'), href: route('admin.products.index') },
        { title: trans('view_product'), href: route('admin.products.show', product.id) },
    ];

    const handleDelete = () => {
        router.delete(route('admin.products.destroy', product.id), {
            onSuccess: () => {
                toast.success(trans('product_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete product');
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="default">{trans('published')}</Badge>;
            case 'draft':
                return <Badge variant="secondary">{trans('draft')}</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.products.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <Package className="h-8 w-8" />
                                {product.name}
                                {product.is_featured && (
                                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                                )}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span>{trans('created_on')} {new Date(product.created_at).toLocaleDateString(locale)}</span>
                                {getStatusBadge(product.status)}
                                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                                    {product.stock_quantity > 0 ? trans('in_stock') : trans('out_of_stock')}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('admin.products.edit', product.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {trans('edit')}
                            </Link>
                        </Button>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {trans('delete')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{trans('delete_product')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {trans('delete_product_confirmation')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{trans('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        {trans('delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                {trans('product_images')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_visual_gallery')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Main Image */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">{trans('main_image')}</h4>
                                    {product.image ? (
                                        <img 
                                            src={`/storage/${product.image}`} 
                                            alt={product.name}
                                            className="w-full max-w-md mx-auto rounded-lg border object-cover"
                                        />
                                    ) : (
                                        <div className="w-full max-w-md mx-auto h-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Image className="h-12 w-12 mx-auto text-muted-foreground" />
                                                <p className="text-muted-foreground mt-2">{trans('no_main_image')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Images */}
                                {product.images && product.images.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">{trans('additional_images')}</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.images.map((image, index) => (
                                                <img 
                                                    key={index}
                                                    src={`/storage/${image.url}`} 
                                                    alt={`${product.name} ${index + 1}`} 
                                                    className="w-full h-20 object-cover rounded-md border"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {trans('basic_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_basic_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('product_name')}</dt>
                                        <dd className="text-lg font-medium">{product.name}</dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('sku')}</dt>
                                        <dd className="text-lg font-mono">{product.sku}</dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('price')}</dt>
                                        <dd className="text-lg font-medium text-green-600">
                                            {formatCurrency(product.price)} {trans('currency_symbol')}
                                        </dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('stock_quantity')}</dt>
                                        <dd className="text-lg font-medium">
                                            <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                                                {product.stock_quantity} {trans('units')}
                                            </Badge>
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description & Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {trans('description_details')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_description_and_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">{trans('description')}</h4>
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <p className="whitespace-pre-wrap">{product.description}</p>
                                </div>
                            </div>
                            
                            {product.details && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{trans('details')}</h4>
                                    <div className="p-3 border rounded-lg bg-muted/50">
                                        <p className="whitespace-pre-wrap">{product.details}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                {trans('categories')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_categories')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {product.categories && product.categories.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map((category) => (
                                        <Badge key={category.id} variant="outline">
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">{trans('no_categories_assigned')}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Archive className="h-5 w-5" />
                                {trans('product_settings')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_configuration_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('status')}</dt>
                                        <dd className="text-lg font-medium">
                                            {getStatusBadge(product.status)}
                                        </dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('featured')}</dt>
                                        <dd className="text-lg font-medium">
                                            {product.is_featured ? (
                                                <Badge variant="default" className="flex items-center gap-1">
                                                    <Star className="h-3 w-3" />
                                                    {trans('featured')}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">{trans('not_featured')}</Badge>
                                            )}
                                        </dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('slug')}</dt>
                                        <dd className="text-lg font-mono text-muted-foreground">{product.slug}</dd>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {trans('system_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('product_system_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        {trans('product_id')}
                                    </dt>
                                    <dd className="text-sm font-mono">#{product.id}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('created_at')}</dt>
                                    <dd className="text-sm">{new Date(product.created_at).toLocaleDateString(locale)}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('updated_at')}</dt>
                                    <dd className="text-sm">{new Date(product.updated_at).toLocaleDateString(locale)}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
