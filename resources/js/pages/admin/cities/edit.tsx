import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import InputError from '@/components/input-error';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type City } from '@/types';
import { ArrowLeft, Save, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface EditCityForm {
    ar_name: string;
    en_name: string;
    fr_name: string;
    shipping_cost: string;
    [key: string]: string;
}

interface EditCityProps {
    city: City;
}

export default function EditCity({ city }: EditCityProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('cities'), href: route('admin.cities.index') },
        { title: trans('edit_city'), href: route('admin.cities.edit', city.id) },
    ];

    const { data, setData, patch, processing, errors } = useForm<EditCityForm>({
        ar_name: city.ar_name || '',
        en_name: city.en_name || '',
        fr_name: city.fr_name || '',
        shipping_cost: city.shipping_cost?.toString() || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('admin.cities.update', city.id), {
            onSuccess: () => {
                toast.success(trans('city_updated_successfully'));
            },
            onError: () => {
                toast.error('Failed to update city');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('edit_city')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.cities.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {trans('back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('edit_city')}</h1>
                        <p className="text-muted-foreground">
                            {trans('update_city_information')}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* City Names */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                {trans('city_names')}
                            </CardTitle>
                            <CardDescription>
                                {trans('enter_city_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ar_name">{trans('ar_name')}</Label>
                                    <Input
                                        id="ar_name"
                                        value={data.ar_name}
                                        onChange={(e) => setData('ar_name', e.target.value)}
                                        placeholder="الدار البيضاء"
                                        required
                                        dir="rtl"
                                    />
                                    <InputError message={errors.ar_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en_name">{trans('en_name')}</Label>
                                    <Input
                                        id="en_name"
                                        value={data.en_name}
                                        onChange={(e) => setData('en_name', e.target.value)}
                                        placeholder="Casablanca"
                                        required
                                    />
                                    <InputError message={errors.en_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fr_name">{trans('fr_name')}</Label>
                                    <Input
                                        id="fr_name"
                                        value={data.fr_name}
                                        onChange={(e) => setData('fr_name', e.target.value)}
                                        placeholder="Casablanca"
                                        required
                                    />
                                    <InputError message={errors.fr_name} />
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
                                {trans('configure_shipping_cost')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shipping_cost">{trans('shipping_cost')}</Label>
                                <div className="relative">
                                    <Input
                                        id="shipping_cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.shipping_cost}
                                        onChange={(e) => setData('shipping_cost', e.target.value)}
                                        placeholder="0.00"
                                        required
                                        className="pr-16"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        {trans('currency_symbol')}
                                    </div>
                                </div>
                                <InputError message={errors.shipping_cost} />
                                <p className="text-xs text-muted-foreground">
                                    {trans('shipping_cost_description')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('admin.cities.index')}>
                                {trans('cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? trans('updating') : trans('update_city')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
