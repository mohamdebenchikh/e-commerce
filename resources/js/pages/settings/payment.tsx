import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { CreditCard, Save, Banknote, Building, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { trans } from '@/lib/utils';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: trans('payment_settings'),
        href: '/settings/payment',
    },
];

// Moroccan Banks List
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
    { value: 'ccp', label: 'Centre de Chèques Postaux (CCP)' },
    { value: 'other', label: trans('other_bank') },
];

type PaymentForm = {
    payment_method: string;
    bank_name: string;
    custom_bank_name: string;
    rib_number: string;
};

// Custom validation functions
const validateRIB = (rib: string): string | null => {
    if (!rib) return null;

    // Remove spaces and convert to uppercase
    const cleanRIB = rib.replace(/\s/g, '').toUpperCase();

    if (cleanRIB.length !== 24) {
        return trans('rib_length_error');
    }

    // Check if it contains only numbers and letters
    if (!/^[A-Z0-9]+$/.test(cleanRIB)) {
        return trans('rib_format_error');
    }

    return null;
};

export default function Payment() {
    const { auth } = usePage<SharedData>().props;
    const [ribError, setRibError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Check if the current bank_name is a predefined bank or custom
    const isCustomBank = auth.user.bank_name && !moroccanBanks.some(bank => bank.value === auth.user.bank_name);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<PaymentForm>({
        payment_method: auth.user.payment_method || '',
        bank_name: isCustomBank ? 'other' : (auth.user.bank_name || ''),
        custom_bank_name: isCustomBank ? auth.user.bank_name : '',
        rib_number: auth.user.rib_number || '',
    });

    // Handle RIB number change with validation
    const handleRibChange = (value: string) => {
        setData('rib_number', value);

        if (value && data.payment_method === 'bank') {
            setIsValidating(true);
            setTimeout(() => {
                const error = validateRIB(value);
                setRibError(error);
                setIsValidating(false);
            }, 500);
        } else {
            setRibError(null);
            setIsValidating(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Custom validation before submit
        if (data.payment_method === 'bank') {
            if (!data.bank_name) {
                toast.error(trans('bank_name_required'));
                return;
            }

            // If "other" bank is selected, check for custom bank name
            if (data.bank_name === 'other' && !data.custom_bank_name.trim()) {
                toast.error(trans('custom_bank_name_required'));
                return;
            }

            if (!data.rib_number) {
                toast.error(trans('rib_number_required'));
                return;
            }

            const ribValidationError = validateRIB(data.rib_number);
            if (ribValidationError) {
                setRibError(ribValidationError);
                toast.error(ribValidationError);
                return;
            }
        }

        patch(route('settings.payment.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(trans('payment_updated_success'));
                setRibError(null);
            },
            onError: (errors) => {
                console.error('Payment update errors:', errors);
                if (errors.rib_number) {
                    setRibError(errors.rib_number);
                }
                toast.error(trans('payment_update_error'));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trans('payment_settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                {trans('payment_information')}
                            </CardTitle>
                            <CardDescription>
                                {trans('payment_information_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-base font-medium">{trans('payment_method')}</Label>
                                    <RadioGroup
                                        value={data.payment_method}
                                        onValueChange={(value) => setData('payment_method', value)}
                                        className="space-y-4"
                                    >
                                        {/* Cash Option */}
                                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value="cash" id="cash" />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="cash"
                                                    className="cursor-pointer font-medium flex items-center gap-2"
                                                >
                                                    <Banknote className="h-4 w-4" />
                                                    {trans('cash')}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {trans('cash_payment_description')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bank Transfer Option */}
                                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <RadioGroupItem value="bank" id="bank" />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="bank"
                                                    className="cursor-pointer font-medium flex items-center gap-2"
                                                >
                                                    <Building className="h-4 w-4" />
                                                    {trans('bank')}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {trans('bank_payment_description')}
                                                </p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    <InputError message={errors.payment_method} />
                                </div>

                                {data.payment_method === 'bank' && (
                                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Building className="h-4 w-4" />
                                            {trans('bank_details')}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="bank_name">{trans('bank_name')}</Label>
                                                <Select
                                                    value={data.bank_name}
                                                    onValueChange={(value) => setData('bank_name', value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={trans('select_bank')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {moroccanBanks.map((bank) => (
                                                            <SelectItem key={bank.value} value={bank.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <Building className="h-4 w-4" />
                                                                    {bank.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.bank_name} />
                                                {!data.bank_name && data.payment_method === 'bank' && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {trans('bank_name_required')}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Custom Bank Name Input - Show when "other" is selected */}
                                            {data.bank_name === 'other' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="custom_bank_name">{trans('custom_bank_name')}</Label>
                                                    <Input
                                                        id="custom_bank_name"
                                                        value={data.custom_bank_name}
                                                        onChange={(e) => setData('custom_bank_name', e.target.value)}
                                                        placeholder={trans('enter_bank_name')}
                                                        required={data.bank_name === 'other'}
                                                    />
                                                    <InputError message={errors.custom_bank_name} />
                                                    {data.bank_name === 'other' && !data.custom_bank_name.trim() && (
                                                        <p className="text-xs text-destructive flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {trans('custom_bank_name_required')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="rib_number" className="flex items-center gap-2">
                                                    {trans('rib_number')}
                                                    <span className="text-xs text-muted-foreground">({trans('24_characters')})</span>
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="rib_number"
                                                        value={data.rib_number}
                                                        onChange={(e) => handleRibChange(e.target.value)}
                                                        placeholder={trans('rib_number_placeholder')}
                                                        required={data.payment_method === 'bank'}
                                                        maxLength={24}
                                                        className={`pr-10 ${ribError ? 'border-destructive' : data.rib_number && !ribError && data.rib_number.length === 24 ? 'border-green-500' : ''}`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        {isValidating ? (
                                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                        ) : data.rib_number && !ribError && data.rib_number.length === 24 ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : ribError ? (
                                                            <AlertCircle className="h-4 w-4 text-destructive" />
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* Character count */}
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className={`${data.rib_number.length === 24 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                        {data.rib_number.length}/24 {trans('characters')}
                                                    </span>
                                                    {data.rib_number && (
                                                        <span className="text-muted-foreground">
                                                            {trans('format')}: XXXX XXXX XXXX XXXX XXXX XXXX
                                                        </span>
                                                    )}
                                                </div>

                                                <InputError message={errors.rib_number} />
                                                {ribError && (
                                                    <p className="text-xs text-destructive flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {ribError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            {trans('bank_details_note')}
                                        </div>
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
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {trans('saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {trans('save_payment_settings')}
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
            </SettingsLayout>
        </AppLayout>
    );
}
