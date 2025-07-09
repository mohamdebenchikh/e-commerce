import React from 'react';
import { User, CreditCard } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PhoneInput from '@/components/ui/phone-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trans } from '@/lib/utils';
import { StepOneForm } from '@/schemas/register-schemas';

interface StepOneProps {
    form: UseFormReturn<StepOneForm>;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    locale: string;
}

export default function StepOne({ form, errors, processing, locale }: StepOneProps) {
    const isRTL = locale === 'ar';
    const textAlignment = isRTL ? 'text-right' : 'text-left';

    return (
        <Form {...form}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <User className="h-4 w-4" />
                                    {trans('First Name')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        autoFocus
                                        disabled={processing}
                                        placeholder={trans('Enter your first name')}
                                        className={textAlignment}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                {errors.first_name && (
                                    <p className="text-sm text-destructive">{errors.first_name}</p>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <User className="h-4 w-4" />
                                    {trans('Last Name')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        disabled={processing}
                                        placeholder={trans('Enter your last name')}
                                        className={textAlignment}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                {errors.last_name && (
                                    <p className="text-sm text-destructive">{errors.last_name}</p>
                                )}
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{trans('Phone Number')}</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={trans('Enter your phone number')}
                                    disabled={processing}
                                    defaultCountryCode="+212"
                                />
                            </FormControl>
                            <FormMessage />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone}</p>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <User className="h-4 w-4" />
                                {trans('Gender')}
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className={textAlignment}>
                                        <SelectValue placeholder={trans('Select your gender')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male" className={textAlignment}>{trans('Male')}</SelectItem>
                                    <SelectItem value="female" className={textAlignment}>{trans('Female')}</SelectItem>
                                    <SelectItem value="other" className={textAlignment}>{trans('Other')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            {errors.gender && (
                                <p className="text-sm text-destructive">{errors.gender}</p>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="national_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CreditCard className="h-4 w-4" />
                                {trans('National ID')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    disabled={processing}
                                    placeholder={trans('Enter your national ID')}
                                    className={textAlignment}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            {errors.national_id && (
                                <p className="text-sm text-destructive">{errors.national_id}</p>
                            )}
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    );
}
