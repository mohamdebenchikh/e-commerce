import React from 'react';
import { MapPin, CreditCard, Building } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trans } from '@/lib/utils';
import { StepTwoForm } from '@/schemas/register-schemas';

interface City {
    id: number;
    name: string;
}

interface StepTwoProps {
    form: UseFormReturn<StepTwoForm>;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    locale: string;
    cities: City[];
}

export default function StepTwo({ form, errors, processing, locale, cities }: StepTwoProps) {
    const isRTL = locale === 'ar';
    const textAlignment = isRTL ? 'text-right' : 'text-left';
    const spaceDirection = isRTL ? 'space-x-reverse space-x-3' : 'space-x-3';

    return (
        <Form {...form}>
            <div className="space-y-6">
                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <MapPin className="h-4 w-4" />
                                    {trans('Country')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        disabled={processing}
                                        placeholder={trans('Enter your country')}
                                        className={textAlignment}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                {errors.country && (
                                    <p className="text-sm text-destructive">{errors.country}</p>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <MapPin className="h-4 w-4" />
                                    {trans('City')}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        disabled={processing}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className={textAlignment}>
                                            <SelectValue placeholder={trans('Select your city')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.id.toString()}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                {errors.city && (
                                    <p className="text-sm text-destructive">{errors.city}</p>
                                )}
                            </FormItem>
                        )}
                    />
                </div>

                {/* Payment Method Selection */}
                <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className={`${textAlignment} block text-base font-medium`}>
                                {trans('Preferred Payment Method')} *
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="space-y-4"
                                >
                                    {/* Cash Plus Option */}
                                    <div className={`flex items-center ${spaceDirection} p-4 border rounded-lg hover:bg-muted/50 transition-colors`}>
                                        <RadioGroupItem value="cash" id="cash" />
                                        <div className={`flex-1 ${textAlignment}`}>
                                            <Label
                                                htmlFor="cash"
                                                className="cursor-pointer font-medium"
                                            >
                                                {trans('Cash Plus')}
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {trans('Receive your earnings in cash from any Cash Plus agency in Morocco')}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>

                                    {/* Bank Transfer Option */}
                                    <div className={`flex items-center ${spaceDirection} p-4 border rounded-lg hover:bg-muted/50 transition-colors`}>
                                        <RadioGroupItem value="bank" id="bank" />
                                        <div className={`flex-1 ${textAlignment}`}>
                                            <Label htmlFor="bank" className="cursor-pointer font-medium">
                                                {trans('Bank Transfer')}
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {trans('Receive your earnings directly in your bank account')}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                            <Building className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            {errors.payment_method && (
                                <p className="text-sm text-destructive">{errors.payment_method}</p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Bank Details - Show only if bank transfer is selected */}
                {form.watch('payment_method') === 'bank' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                    <h3 className={`font-medium ${textAlignment}`}>{trans('Bank Account Information')}</h3>

                        <FormField
                            control={form.control}
                            name="bank_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`${textAlignment} block`}>
                                        {trans('Bank Name')} *
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={textAlignment}>
                                                <SelectValue placeholder={trans('Select Bank')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="attijariwafa" className={textAlignment}>
                                                {trans('Attijariwafa Bank')}
                                            </SelectItem>
                                            <SelectItem value="bmce" className={textAlignment}>
                                                {trans('BMCE Bank')}
                                            </SelectItem>
                                            <SelectItem value="bmci" className={textAlignment}>
                                                {trans('BMCI')}
                                            </SelectItem>
                                            <SelectItem value="cih" className={textAlignment}>
                                                {trans('CIH Bank')}
                                            </SelectItem>
                                            <SelectItem value="creditagricole" className={textAlignment}>
                                                {trans('Crédit Agricole du Maroc')}
                                            </SelectItem>
                                            <SelectItem value="sgmb" className={textAlignment}>
                                                {trans('Société Générale Maroc')}
                                            </SelectItem>
                                            <SelectItem value="cdm" className={textAlignment}>
                                                {trans('Bank Al-Maghrib')}
                                            </SelectItem>
                                            <SelectItem value="cfm" className={textAlignment}>
                                                {trans('Crédit du Maroc')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {errors.bank_name && (
                                        <p className="text-sm text-destructive">{errors.bank_name}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rib_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`${textAlignment} block`}>
                                        {trans('RIB Number')} *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="230 XXX XXXXXXXXXXXX XX"
                                            className={`${textAlignment} font-mono`}
                                            disabled={processing}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {errors.rib_number && (
                                        <p className="text-sm text-destructive">{errors.rib_number}</p>
                                    )}
                                    <p className={`text-xs text-muted-foreground ${textAlignment}`}>
                                        {trans('Enter your 24-digit RIB number')}
                                    </p>
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </div>
        </Form>
    );
}
