import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData, type Category } from '@/types';
import { ArrowLeft, Edit, Trash2, FolderOpen, Calendar, Globe, FileText, Image, Settings, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface ShowCategoryProps {
    category: Category;
}

export default function ShowCategory({ category }: ShowCategoryProps) {
    const { locale } = usePage<SharedData>().props;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('categories'), href: route('admin.categories.index') },
        { title: trans('view_category'), href: route('admin.categories.show', category.id) },
    ];

    const handleDelete = () => {
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
            <Head title={category.name} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.categories.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <FolderOpen className="h-8 w-8" />
                                {category.name}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <span>{trans('created_on')} {new Date(category.created_at).toLocaleDateString(locale)}</span>
                                <Badge variant={category.is_active ? "default" : "secondary"}>
                                    {category.is_active ? trans('active') : trans('inactive')}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('admin.categories.edit', category.id)}>
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
                                    <AlertDialogTitle>{trans('delete_category')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {trans('delete_category_confirmation')}
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
                    {/* Category Names */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                {trans('category_names')}
                            </CardTitle>
                            <CardDescription>
                                {trans('multilingual_category_names')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('ar_name')}</dt>
                                        <dd className="text-lg font-medium" dir="rtl">{category.ar_name}</dd>
                                    </div>
                                    <Badge variant="outline">العربية</Badge>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('en_name')}</dt>
                                        <dd className="text-lg font-medium">{category.en_name}</dd>
                                    </div>
                                    <Badge variant="outline">English</Badge>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('fr_name')}</dt>
                                        <dd className="text-lg font-medium">{category.fr_name}</dd>
                                    </div>
                                    <Badge variant="outline">Français</Badge>
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
                                {trans('category_visual_representation')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {category.image ? (
                                <div className="text-center">
                                    <img 
                                        src={category.image} 
                                        alt={category.name}
                                        className="w-full max-w-xs mx-auto rounded-lg border object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                    <Image className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground mt-2">{trans('no_image_uploaded')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Descriptions */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {trans('category_descriptions')}
                            </CardTitle>
                            <CardDescription>
                                {trans('multilingual_category_descriptions')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">العربية</Badge>
                                        <span className="text-sm font-medium text-muted-foreground">{trans('ar_description')}</span>
                                    </div>
                                    <div className="p-3 border rounded-lg bg-muted/50" dir="rtl">
                                        {category.ar_description || (
                                            <span className="text-muted-foreground italic">{trans('no_description_provided')}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">English</Badge>
                                        <span className="text-sm font-medium text-muted-foreground">{trans('en_description')}</span>
                                    </div>
                                    <div className="p-3 border rounded-lg bg-muted/50">
                                        {category.en_description || (
                                            <span className="text-muted-foreground italic">{trans('no_description_provided')}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Français</Badge>
                                        <span className="text-sm font-medium text-muted-foreground">{trans('fr_description')}</span>
                                    </div>
                                    <div className="p-3 border rounded-lg bg-muted/50">
                                        {category.fr_description || (
                                            <span className="text-muted-foreground italic">{trans('no_description_provided')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                {trans('category_configuration_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('status')}</dt>
                                        <dd className="text-lg font-medium">
                                            <Badge variant={category.is_active ? "default" : "secondary"}>
                                                {category.is_active ? trans('active') : trans('inactive')}
                                            </Badge>
                                        </dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('sort_order')}</dt>
                                        <dd className="text-lg font-medium">
                                            <Badge variant="outline">{category.sort_order}</Badge>
                                        </dd>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('slug')}</dt>
                                        <dd className="text-lg font-mono text-muted-foreground">{category.slug}</dd>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {trans('system_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('category_system_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        {trans('category_id')}
                                    </dt>
                                    <dd className="text-sm font-mono">#{category.id}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('created_at')}</dt>
                                    <dd className="text-sm">{new Date(category.created_at).toLocaleDateString(locale)}</dd>
                                </div>
                                
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('updated_at')}</dt>
                                    <dd className="text-sm">{new Date(category.updated_at).toLocaleDateString(locale)}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
