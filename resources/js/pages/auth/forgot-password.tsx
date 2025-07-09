// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { trans } from '@/lib/utils';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout
            title={trans('Forgot password')}
            description={trans('Enter your email to receive a password reset link')}
            maxWidth="md"
        >
            <Head title={trans('Forgot password')} />

            {status && (
                <div className="mb-6 p-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            {/* Mail Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
            </div>

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-right flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {trans('Email address')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={trans('email@example.com')}
                            className={`text-right ${errors.email ? 'border-destructive' : ''}`}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button
                        className="w-full moroccan-gradient text-white border-0 hover:opacity-90 transition-opacity"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin ml-2" />}
                        {trans('Email password reset link')}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    <span>{trans('Or, return to')}</span>{' '}
                    <TextLink href={route('login')} className="text-primary hover:text-primary/80 inline-flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        {trans('log in')}
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
