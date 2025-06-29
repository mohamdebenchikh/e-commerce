import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { trans } from '@/lib/utils';

type RegisterForm = {
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    national_id: string;
    country: string;
    city: string;
    payment_method: string;
    bank_name: string;
    rib_number: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const STEPS = [
    {
        id: 1,
        title: 'Personal Information',
        fields: ['first_name', 'last_name', 'phone', 'gender', 'national_id']
    },
    {
        id: 2,
        title: 'Location & Payment',
        fields: ['country', 'city', 'payment_method', 'bank_name', 'rib_number']
    },
    {
        id: 3,
        title: 'Account Setup',
        fields: ['email', 'password', 'password_confirmation']
    }
];

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        phone: '',
        gender: '',
        national_id: '',
        country: '',
        city: '',
        payment_method: '',
        bank_name: '',
        rib_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Smart validation - jump to step with errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const errorFields = Object.keys(errors);
            for (const step of STEPS) {
                const hasErrorInStep = step.fields.some(field => errorFields.includes(field));
                if (hasErrorInStep) {
                    setCurrentStep(step.id);
                    break;
                }
            }
        }
    }, [errors]);

    const validateCurrentStep = (): boolean => {
        const currentStepFields = STEPS.find(step => step.id === currentStep)?.fields || [];
        
        // Basic validation for required fields
        for (const field of currentStepFields) {
            if (!data[field as keyof RegisterForm]) {
                return false;
            }
        }

        // Additional validation for specific fields
        if (currentStep === 3) {
            if (data.password !== data.password_confirmation) {
                return false;
            }
            if (data.password.length < 8) {
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepId: number) => {
        // Allow navigation to completed steps or next step if current is valid
        if (completedSteps.includes(stepId) || (stepId === currentStep + 1 && validateCurrentStep())) {
            setCurrentStep(stepId);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (currentStep === STEPS.length && validateCurrentStep()) {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <button
                        type="button"
                        onClick={() => handleStepClick(step.id)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors
                            ${currentStep === step.id 
                                ? 'border-primary bg-primary text-primary-foreground' 
                                : completedSteps.includes(step.id)
                                    ? 'border-green-500 bg-green-500 text-white cursor-pointer hover:bg-green-600'
                                    : 'border-muted-foreground text-muted-foreground'
                            }`}
                        disabled={!completedSteps.includes(step.id) && step.id !== currentStep && !(step.id === currentStep + 1 && validateCurrentStep())}
                    >
                        {step.id}
                    </button>
                    {index < STEPS.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 ${completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first_name">{trans('First Name')}</Label>
                    <Input
                        id="first_name"
                        type="text"
                        required
                        autoFocus
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        disabled={processing}
                        placeholder={trans('Enter your first name')}
                    />
                    <InputError message={errors.first_name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last_name">{trans('Last Name')}</Label>
                    <Input
                        id="last_name"
                        type="text"
                        required
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        disabled={processing}
                        placeholder={trans('Enter your last name')}
                    />
                    <InputError message={errors.last_name} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">{trans('Phone Number')}</Label>
                <Input
                    id="phone"
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Enter your phone number')}
                />
                <InputError message={errors.phone} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="gender">{trans('Gender')}</Label>
                <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={trans('Select your gender')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">{trans('Male')}</SelectItem>
                        <SelectItem value="female">{trans('Female')}</SelectItem>
                        <SelectItem value="other">{trans('Other')}</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.gender} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="national_id">{trans('National ID')}</Label>
                <Input
                    id="national_id"
                    type="text"
                    required
                    value={data.national_id}
                    onChange={(e) => setData('national_id', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Enter your national ID')}
                />
                <InputError message={errors.national_id} />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="country">{trans('Country')}</Label>
                    <Input
                        id="country"
                        type="text"
                        required
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        disabled={processing}
                        placeholder={trans('Enter your country')}
                    />
                    <InputError message={errors.country} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="city">{trans('City')}</Label>
                    <Input
                        id="city"
                        type="text"
                        required
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        disabled={processing}
                        placeholder={trans('Enter your city')}
                    />
                    <InputError message={errors.city} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="payment_method">{trans('Payment Method')}</Label>
                <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={trans('Select payment method')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bank_transfer">{trans('Bank Transfer')}</SelectItem>
                        <SelectItem value="mobile_money">{trans('Mobile Money')}</SelectItem>
                        <SelectItem value="paypal">{trans('PayPal')}</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.payment_method} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="bank_name">{trans('Bank Name')}</Label>
                <Input
                    id="bank_name"
                    type="text"
                    required
                    value={data.bank_name}
                    onChange={(e) => setData('bank_name', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Enter your bank name')}
                />
                <InputError message={errors.bank_name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="rib_number">{trans('RIB Number')}</Label>
                <Input
                    id="rib_number"
                    type="text"
                    required
                    value={data.rib_number}
                    onChange={(e) => setData('rib_number', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Enter your RIB number')}
                />
                <InputError message={errors.rib_number} />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="email">{trans('Email Address')}</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder={trans('email@example.com')}
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">{trans('Password')}</Label>
                <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Enter your password')}
                />
                <InputError message={errors.password} />
                <p className="text-sm text-muted-foreground">
                    {trans('Password must be at least 8 characters long')}
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password_confirmation">{trans('Confirm Password')}</Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    disabled={processing}
                    placeholder={trans('Confirm your password')}
                />
                <InputError message={errors.password_confirmation} />
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return renderStep1();
        }
    };

    const currentStepData = STEPS.find(step => step.id === currentStep);
    const isLastStep = currentStep === STEPS.length;
    const isFirstStep = currentStep === 1;

    return (
        <AuthLayout 
            title={trans('Create an account')} 
            description={trans('Enter your details below to create your account')}
        >
            <Head title={trans('Register')} />
            
            {renderStepIndicator()}
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{trans(currentStepData?.title || '')}</h2>
                <p className="text-sm text-muted-foreground">
                    {trans('Step')} {currentStep} {trans('of')} {STEPS.length}
                </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {renderCurrentStep()}

                <div className="flex justify-between mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstStep || processing}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {trans('Previous')}
                    </Button>

                    {isLastStep ? (
                        <Button 
                            type="submit" 
                            disabled={!validateCurrentStep() || processing}
                            className="flex items-center gap-2"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {trans('Create Account')}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!validateCurrentStep() || processing}
                            className="flex items-center gap-2"
                        >
                            {trans('Next')}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {trans('Already have an account?')}{' '}
                    <TextLink href={route('login')}>
                        {trans('Log in')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}