import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin/admin-layout';
import InputError from '@/components/input-error';
import { trans } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CreateUserForm {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    national_id: string;
    gender: string;
    country: string;
    city: string;
    payment_method: string;
    bank_name: string;
    rib_number: string;
    password: string;
    password_confirmation: string;
    active: boolean;
    [key:string] : string | boolean
}

const moroccanBanks = [
    { value: 'attijariwafa_bank', label: 'Attijariwafa Bank' },
    { value: 'banque_populaire', label: 'Banque Populaire' },
    { value: 'bmce_bank', label: 'BMCE Bank' },
    { value: 'bmci', label: 'BMCI' },
    { value: 'cih_bank', label: 'CIH Bank' },
    { value: 'credit_agricole', label: 'Crédit Agricole du Maroc' },
    { value: 'credit_du_maroc', label: 'Crédit du Maroc' },
    { value: 'societe_generale', label: 'Société Générale Maroc' },
    { value: 'bank_of_africa', label: 'Bank of Africa' },
    { value: 'al_barid_bank', label: 'Al Barid Bank' },
    { value: 'ccp', label: 'CCP (Centre de Chèques Postaux)' },
    { value: 'other', label: trans('other_bank') },
];

export default function CreateUser() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: trans('dashboard'), href: route('admin.dashboard') },
        { title: trans('users'), href: route('admin.users.index') },
        { title: trans('create_user'), href: route('admin.users.create') },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<CreateUserForm>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        national_id: '',
        gender: '',
        country: 'Morocco',
        city: '',
        payment_method: 'cash',
        bank_name: '',
        rib_number: '',
        password: '',
        password_confirmation: '',
        active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.users.store'), {
            onSuccess: () => {
                toast.success(trans('user_created_successfully'));
                reset();
            },
            onError: () => {
                toast.error('Failed to create user');
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('create_user')} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.users.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {trans('back')}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{trans('create_user')}</h1>
                        <p className="text-muted-foreground">
                            {trans('create_new_user_account')}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('personal_information')}</CardTitle>
                            <CardDescription>
                                {trans('enter_user_personal_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">{trans('first_name')}</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
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
                                        required
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="national_id">{trans('national_id')}</Label>
                                    <Input
                                        id="national_id"
                                        value={data.national_id}
                                        onChange={(e) => setData('national_id', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.national_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label>{trans('gender')}</Label>
                                    <RadioGroup
                                        value={data.gender}
                                        onValueChange={(value) => setData('gender', value)}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male">{trans('male')}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female">{trans('female')}</Label>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.gender} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('contact_information')}</CardTitle>
                            <CardDescription>
                                {trans('enter_user_contact_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{trans('email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">{trans('phone')}</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">{trans('country')}</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.country} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">{trans('city')}</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.city} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('payment_information')}</CardTitle>
                            <CardDescription>
                                {trans('configure_user_payment_method')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <Label className="text-base font-medium">{trans('payment_method')}</Label>
                                <RadioGroup
                                    value={data.payment_method}
                                    onValueChange={(value) => setData('payment_method', value)}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                        <RadioGroupItem value="cash" id="cash" />
                                        <Label htmlFor="cash" className="cursor-pointer font-medium">
                                            {trans('cash')}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                        <RadioGroupItem value="bank" id="bank" />
                                        <Label htmlFor="bank" className="cursor-pointer font-medium">
                                            {trans('bank')}
                                        </Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.payment_method} />
                            </div>

                            {data.payment_method === 'bank' && (
                                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_name">{trans('bank_name')}</Label>
                                        <Select
                                            value={data.bank_name}
                                            onValueChange={(value) => setData('bank_name', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={trans('select_bank')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {moroccanBanks.map((bank) => (
                                                    <SelectItem key={bank.value} value={bank.value}>
                                                        {bank.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.bank_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rib_number">{trans('rib_number')}</Label>
                                        <Input
                                            id="rib_number"
                                            value={data.rib_number}
                                            onChange={(e) => setData('rib_number', e.target.value)}
                                            placeholder={trans('rib_number_placeholder')}
                                            maxLength={24}
                                        />
                                        <InputError message={errors.rib_number} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('account_settings')}</CardTitle>
                            <CardDescription>
                                {trans('configure_user_account_settings')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">{trans('password')}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">{trans('confirm_password')}</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="active"
                                    checked={data.active}
                                    onCheckedChange={(checked) => setData('active', checked)}
                                />
                                <Label htmlFor="active">{trans('active_account')}</Label>
                            </div>
                            <InputError message={errors.active} />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('admin.users.index')}>
                                {trans('cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? trans('creating') : trans('create_user')}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
