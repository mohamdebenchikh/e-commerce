import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import UpdateProfilePhoto from '@/components/update-profile-photo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { trans } from '@/lib/utils';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: trans('profile_settings'),
        href: '/settings/profile',
    },
];

type ProfileForm = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio: string;
    national_id: string;
    country: string;
    city: string;
    gender: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        first_name: auth.user.first_name || '',
        last_name: auth.user.last_name || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        bio: auth.user.bio || '',
        national_id: auth.user.national_id || '',
        country: auth.user.country || 'Morocco',
        city: auth.user.city || '',
        gender: auth.user.gender || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(trans('profile_updated_success'));
            },
            onError: () => {
                toast.error(trans('profile_update_error'));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('profile_settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Profile Header */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <UpdateProfilePhoto className="flex-shrink-0" />
                                <div className="text-center md:text-left">
                                    <CardTitle className="text-2xl">
                                        {auth.user.first_name} {auth.user.last_name}
                                    </CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        {auth.user.email}
                                    </CardDescription>
                                    {auth.user.bio && (
                                        <p className="text-sm text-muted-foreground mt-2 max-w-md">
                                            {auth.user.bio}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                        {auth.user.city && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {auth.user.city}, {auth.user.country}
                                            </div>
                                        )}
                                        {auth.user.phone && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-4 w-4" />
                                                {auth.user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Profile Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {trans('profile_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('profile_information_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">{trans('first_name')}</Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder={trans('first_name')}
                                            required
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">{trans('last_name')}</Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder={trans('last_name')}
                                            required
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{trans('email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={trans('email')}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">{trans('phone_number')}</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={trans('phone_number')}
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">{trans('bio')}</Label>
                                    <Textarea
                                        id="bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder={trans('bio_placeholder')}
                                        rows={3}
                                    />
                                    <InputError message={errors.bio} />
                                </div>

                                {/* Location & Personal Details */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="national_id">{trans('national_id')}</Label>
                                        <Input
                                            id="national_id"
                                            value={data.national_id}
                                            onChange={(e) => setData('national_id', e.target.value)}
                                            placeholder={trans('national_id')}
                                        />
                                        <InputError message={errors.national_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">{trans('gender')}</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={trans('select_gender')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">{trans('male')}</SelectItem>
                                                <SelectItem value="female">{trans('female')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">{trans('country')}</Label>
                                        <Select value={data.country} onValueChange={(value) => setData('country', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={trans('select_country')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Morocco">{trans('morocco')}</SelectItem>
                                                <SelectItem value="Algeria">{trans('algeria')}</SelectItem>
                                                <SelectItem value="Tunisia">{trans('tunisia')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.country} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">{trans('city')}</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder={trans('city')}
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.city} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            {trans('email_unverified')}{' '}
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="font-medium underline hover:no-underline"
                                            >
                                                {trans('resend_verification')}
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                {trans('verification_sent')}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        {processing ? (
                                            <>
                                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                                {trans('saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {trans('save_changes')}
                                            </>
                                        )}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <Save className="h-4 w-4" />
                                            {trans('saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>


                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
