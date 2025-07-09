import { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin/admin-layout';
import InputError from '@/components/input-error';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, FolderOpen, FileText, Image, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CreateCategoryForm {
    ar_name: string;
    en_name: string;
    fr_name: string;
    ar_description: string;
    en_description: string;
    fr_description: string;
    image: File | null;
    is_active: boolean;
    sort_order: number;
    [key: string]: string | number | boolean | File | null;
}

export default function CreateCategory() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('categories'), href: route('admin.categories.index') },
        { title: trans('create_category'), href: route('admin.categories.create') },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<CreateCategoryForm>({
        ar_name: '',
        en_name: '',
        fr_name: '',
        ar_description: '',
        en_description: '',
        fr_description: '',
        image: null,
        is_active: true,
        sort_order: 0,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.categories.store'), {
            onSuccess: () => {
                toast.success(trans('category_created_successfully'));
                reset();
                setImagePreview(null);
            },
            onError: () => {
                toast.error('Failed to create category');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('create_category')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.categories.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {trans('back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('create_category')}</h1>
                        <p className="text-muted-foreground">
                            {trans('create_new_category')}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Category Names */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                {trans('category_names')}
                            </CardTitle>
                            <CardDescription>
                                {trans('enter_category_names_in_all_languages')}
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
                                        placeholder="الإلكترونيات"
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
                                        placeholder="Electronics"
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
                                        placeholder="Électronique"
                                        required
                                    />
                                    <InputError message={errors.fr_name} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Descriptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {trans('category_descriptions')}
                            </CardTitle>
                            <CardDescription>
                                {trans('enter_category_descriptions_optional')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ar_description">{trans('ar_description')}</Label>
                                    <Textarea
                                        id="ar_description"
                                        value={data.ar_description}
                                        onChange={(e) => setData('ar_description', e.target.value)}
                                        placeholder="وصف الفئة باللغة العربية"
                                        rows={3}
                                        dir="rtl"
                                    />
                                    <InputError message={errors.ar_description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="en_description">{trans('en_description')}</Label>
                                    <Textarea
                                        id="en_description"
                                        value={data.en_description}
                                        onChange={(e) => setData('en_description', e.target.value)}
                                        placeholder="Category description in English"
                                        rows={3}
                                    />
                                    <InputError message={errors.en_description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fr_description">{trans('fr_description')}</Label>
                                    <Textarea
                                        id="fr_description"
                                        value={data.fr_description}
                                        onChange={(e) => setData('fr_description', e.target.value)}
                                        placeholder="Description de la catégorie en français"
                                        rows={3}
                                    />
                                    <InputError message={errors.fr_description} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                {trans('category_image')}
                            </CardTitle>
                            <CardDescription>
                                {trans('upload_category_image_optional')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">{trans('image')}</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <InputError message={errors.image} />
                                <p className="text-xs text-muted-foreground">
                                    {trans('image_upload_description')}
                                </p>
                            </div>
                            {imagePreview && (
                                <div className="mt-4">
                                    <Label>{trans('image_preview')}</Label>
                                    <div className="mt-2">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded-md border"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                {trans('category_settings')}
                            </CardTitle>
                            <CardDescription>
                                {trans('configure_category_settings')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">{trans('active')}</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">{trans('sort_order')}</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.sort_order} />
                                    <p className="text-xs text-muted-foreground">
                                        {trans('sort_order_description')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('admin.categories.index')}>
                                {trans('cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? trans('creating') : trans('create_category')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
