import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { trans } from '@/lib/utils';
import { SharedData } from '@/types';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const {locale} = usePage<SharedData>().props;
    const textAlignment = locale === "ar" ? "${textAlignment}" : "text-left";


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title={trans('Log in to your account')}
            description={trans('Enter your email and password below to log in')}
            maxWidth="md"
        >
            <Head title={trans('Log in')} />

            {status && (
                <div className="mb-6 p-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            {/* User Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                </div>
            </div>

            <form className="space-y-6" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="${textAlignment} flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {trans('Email address')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={trans('email@example.com')}
                            className={`${textAlignment} ${errors.email ? 'border-destructive' : ''}`}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="${textAlignment} flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                {trans('Password')}
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-sm" tabIndex={5}>
                                    {trans('Forgot password?')}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={trans('Password')}
                            className={`${textAlignment} ${errors.password ? 'border-destructive' : ''}`}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember" >
                            {trans('remember_me')}
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className='w-full'
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin ml-2" />}
                        {trans('Log in')}
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {trans('Don\'t have an account?')}{' '}
                    <TextLink href={route('register')} tabIndex={5} className="text-primary hover:text-primary/80">
                        {trans('Sign up')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
