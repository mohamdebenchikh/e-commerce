import React from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { trans } from '@/lib/utils';
import { StepThreeForm } from '@/schemas/register-schemas';

interface StepThreeProps {
    form: UseFormReturn<StepThreeForm>;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    locale: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    setShowPassword: (show: boolean) => void;
    setShowConfirmPassword: (show: boolean) => void;
}

export default function StepThree({
    form,
    errors,
    processing,
    locale,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword
}: StepThreeProps) {
    const isRTL = locale === 'ar';
    const textAlignment = isRTL ? 'text-right' : 'text-left';
    const buttonPosition = isRTL ? 'left-0' : 'right-0';

    return (
        <Form {...form}>
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Mail className="h-4 w-4" />
                                {trans('Email Address')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    autoComplete="email"
                                    disabled={processing}
                                    placeholder={trans('email@example.com')}
                                    className={textAlignment}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Lock className="h-4 w-4" />
                                {trans('Password')}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        disabled={processing}
                                        placeholder={trans('Enter your password')}
                                        className={`${textAlignment} ${isRTL ? 'pl-10' : 'pr-10'}`}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className={`absolute ${buttonPosition} top-0 h-full px-3 py-2 hover:bg-transparent`}
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={processing}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                            <p className={`text-sm text-muted-foreground ${textAlignment}`}>
                                {trans('Password must be at least 8 characters long')}
                            </p>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`${textAlignment} flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Lock className="h-4 w-4" />
                                {trans('Confirm Password')}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        disabled={processing}
                                        placeholder={trans('Confirm your password')}
                                        className={`${textAlignment} ${isRTL ? 'pl-10' : 'pr-10'}`}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className={`absolute ${buttonPosition} top-0 h-full px-3 py-2 hover:bg-transparent`}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={processing}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                            )}
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    );
}
