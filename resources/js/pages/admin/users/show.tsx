import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { trans } from '@/lib/utils';
import { User, type BreadcrumbItem, type SharedData } from '@/types';
import { ArrowLeft, Edit, Trash2, UserCheck, UserX, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ShowUserProps {
    user: User;
}

export default function ShowUser({ user }: ShowUserProps) {
    const { locale } = usePage<SharedData>().props;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('users'), href: route('admin.users.index') },
        { title: trans('view_user'), href: route('admin.users.show', user.id) },
    ];

    const handleDelete = () => {
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                toast.success(trans('user_deleted_successfully'));
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    };

    const handleToggleStatus = () => {
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
            <Head title={`${user.first_name} ${user.last_name}`} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.users.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {trans('back')}
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Badge variant={user.active ? 'default' : 'secondary'}>
                                    {user.active ? trans('active') : trans('inactive')}
                                </Badge>
                                <span>•</span>
                                <span>{trans('member_since')} {new Date(user.created_at).toLocaleDateString(locale)}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleToggleStatus}>
                            {user.active ? (
                                <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    {trans('deactivate')}
                                </>
                            ) : (
                                <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    {trans('activate')}
                                </>
                            )}
                        </Button>
                        
                        <Button asChild>
                            <Link href={route('admin.users.edit', user.id)}>
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
                                    <AlertDialogTitle>{trans('delete_user')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {trans('delete_user_confirmation')}
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
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                {trans('personal_information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('first_name')}</dt>
                                    <dd className="text-sm">{user.first_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('last_name')}</dt>
                                    <dd className="text-sm">{user.last_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('national_id')}</dt>
                                    <dd className="text-sm">{user.national_id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('gender')}</dt>
                                    <dd className="text-sm capitalize">{user.gender}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                {trans('contact_information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('email')}</dt>
                                        <dd className="text-sm">{user.email}</dd>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('phone')}</dt>
                                        <dd className="text-sm">{user.phone}</dd>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('location')}</dt>
                                        <dd className="text-sm">{user.city}, {user.country}</dd>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                {trans('payment_information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('payment_method')}</dt>
                                    <dd className="text-sm">
                                        <Badge variant="outline">
                                            {user.payment_method === 'cash' ? trans('cash') : trans('bank')}
                                        </Badge>
                                    </dd>
                                </div>
                                {user.payment_method === 'bank' && (
                                    <>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">{trans('bank_name')}</dt>
                                            <dd className="text-sm">{user.bank_name || trans('not_specified')}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">{trans('rib_number')}</dt>
                                            <dd className="text-sm font-mono">{user.rib_number || trans('not_specified')}</dd>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {trans('account_information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('account_status')}</dt>
                                    <dd className="text-sm">
                                        <Badge variant={user.active ? 'default' : 'secondary'}>
                                            {user.active ? trans('active') : trans('inactive')}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('created_at')}</dt>
                                    <dd className="text-sm">{new Date(user.created_at).toLocaleDateString(locale)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">{trans('updated_at')}</dt>
                                    <dd className="text-sm">{new Date(user.updated_at).toLocaleDateString(locale)}</dd>
                                </div>
                                {user.email_verified_at && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">{trans('email_verified_at')}</dt>
                                        <dd className="text-sm">{new Date(user.email_verified_at).toLocaleDateString(locale)}</dd>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
