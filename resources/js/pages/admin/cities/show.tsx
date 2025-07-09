import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData, type City } from '@/types';
import { ArrowLeft, Edit, Trash2, MapPin, DollarSign, Calendar, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ShowCityProps {
    city: City;
}

export default function ShowCity({ city }: ShowCityProps) {
    const { locale } = usePage<SharedData>().props;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('cities'), href: route('admin.cities.index') },
        { title: trans('view_city'), href: route('admin.cities.show', city.id) },
    ];

    const handleDelete = () => {
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
            <Head title={city.name} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.cities.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <MapPin className="h-8 w-8" />
                                {city.name}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span>{trans('created_on')} {new Date(city.created_at).toLocaleDateString(locale)}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('admin.cities.edit', city.id)}>
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
                                    <AlertDialogTitle>{trans('delete_city')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {trans('delete_city_confirmation')}
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
                    {/* City Names */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                {trans('city_names')}
                            </CardTitle>
                            <CardDescription>
                                {trans('multilingual_city_names')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('ar_name')}</dt>
                                        <dd className="text-lg font-medium" dir="rtl">{city.ar_name}</dd>
                                    </div>
                                    <Badge variant="outline">العربية</Badge>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('en_name')}</dt>
                                        <dd className="text-lg font-medium">{city.en_name}</dd>
                                    </div>
                                    <Badge variant="outline">English</Badge>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('fr_name')}</dt>
                                        <dd className="text-lg font-medium">{city.fr_name}</dd>
                                    </div>
                                    <Badge variant="outline">Français</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                {trans('shipping_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('shipping_cost_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center p-6 border rounded-lg bg-muted/50">
                                <div className="text-3xl font-bold text-primary">
                                    {formatCurrency(city.shipping_cost)} {trans('currency_symbol')}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {trans('shipping_cost_per_order')}
                                </p>
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
                                {trans('city_system_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('city_id')}</dt>
                                    <dd className="text-sm font-mono">#{city.id}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('created_at')}</dt>
                                    <dd className="text-sm">{new Date(city.created_at).toLocaleDateString(locale)}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('updated_at')}</dt>
                                    <dd className="text-sm">{new Date(city.updated_at).toLocaleDateString(locale)}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
