import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    LoaderCircle,
    ChevronLeft,
    ChevronRight,
    User,
    MapPin,
    Mail,
    CheckCircle,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { StepOne, StepTwo, StepThree } from '@/components/register-steps';
import { trans } from '@/lib/utils';
import { SharedData } from '@/types';
import {
    stepOneSchema,
    stepTwoSchema,
    stepThreeSchema,
    type StepOneForm,
    type StepTwoForm,
    type StepThreeForm,
    type RegisterForm as RegisterFormType
} from '@/schemas/register-schemas';

// Using the RegisterFormType from schemas instead of local type definition

interface City {
    id: number;
    name: string;
}

interface RegisterProps {
    cities: City[];
}

const STEPS = [
    {
        id: 1,
        title: trans('Personal Information'),
        fields: ['first_name', 'last_name', 'phone', 'gender', 'national_id']
    },
    {
        id: 2,
        title: trans('Location & Payment'),
        fields: ['country', 'city', 'payment_method', 'bank_name', 'rib_number']
    },
    {
        id: 3,
        title: trans('Account Setup'),
        fields: ['email', 'password', 'password_confirmation']
    }
];

export default function Register({ cities }: RegisterProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<Partial<RegisterFormType>>({
        country: 'Morocco', // Default to Morocco
    });

    const { locale } = usePage<SharedData>().props;

    // Inertia form for final submission
    const { processing, errors: serverErrors, reset } = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        gender: '',
        national_id: '',
        country: 'Morocco',
        city: '',
        payment_method: '',
        bank_name: '',
        rib_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // React Hook Form instances for each step
    const step1Form = useReactHookForm<StepOneForm>({
        resolver: zodResolver(stepOneSchema),
        defaultValues: {
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            phone: formData.phone || '',
            gender: formData.gender || 'male',
            national_id: formData.national_id || '',
        }
    });

    const step2Form = useReactHookForm<StepTwoForm>({
        resolver: zodResolver(stepTwoSchema),
        defaultValues: {
            country: formData.country || 'Morocco',
            city: formData.city || '',
            payment_method: formData.payment_method || 'cash',
            bank_name: formData.bank_name || '',
            rib_number: formData.rib_number || '',
        }
    });

    const step3Form = useReactHookForm<StepThreeForm>({
        resolver: zodResolver(stepThreeSchema),
        defaultValues: {
            email: formData.email || '',
            password: formData.password || '',
            password_confirmation: formData.password_confirmation || '',
        }
    });

    // Get current form instance based on step
    const getCurrentForm = () => {
        switch (currentStep) {
            case 1: return step1Form;
            case 2: return step2Form;
            case 3: return step3Form;
            default: return step1Form;
        }
    };

    // Merge server errors with form validation errors for display
    const mergedErrors = { ...serverErrors };

    // Set server errors on the appropriate form when they occur
    useEffect(() => {
        if (Object.keys(serverErrors).length > 0) {
            // Set errors on step 1 form
            const step1Fields: (keyof StepOneForm)[] = ['first_name', 'last_name', 'phone', 'gender', 'national_id'];
            step1Fields.forEach(field => {
                const errorMessage = serverErrors[field];
                if (errorMessage && typeof errorMessage === 'string') {
                    step1Form.setError(field, {
                        type: 'server',
                        message: errorMessage
                    });
                }
            });

            // Set errors on step 2 form
            const step2Fields: (keyof StepTwoForm)[] = ['country', 'city', 'payment_method', 'bank_name', 'rib_number'];
            step2Fields.forEach(field => {
                const errorMessage = serverErrors[field];
                if (errorMessage && typeof errorMessage === 'string') {
                    step2Form.setError(field, {
                        type: 'server',
                        message: errorMessage
                    });
                }
            });

            // Set errors on step 3 form
            const step3Fields: (keyof StepThreeForm)[] = ['email', 'password', 'password_confirmation'];
            step3Fields.forEach(field => {
                const errorMessage = serverErrors[field];
                if (errorMessage && typeof errorMessage === 'string') {
                    step3Form.setError(field, {
                        type: 'server',
                        message: errorMessage
                    });
                }
            });
        }
    }, [serverErrors, step1Form, step2Form, step3Form]);

    // Smart validation - jump to step with errors
    useEffect(() => {
        if (Object.keys(serverErrors).length > 0) {
            const errorFields = Object.keys(serverErrors);
            for (const step of STEPS) {
                const hasErrorInStep = step.fields.some(field => errorFields.includes(field));
                if (hasErrorInStep) {
                    setCurrentStep(step.id);
                    break;
                }
            }
        }
    }, [serverErrors]);

    const validateCurrentStep = async (): Promise<boolean> => {
        const currentForm = getCurrentForm();
        const isValid = await currentForm.trigger();

        if (isValid) {
            // Update form data with current step values
            const stepData = currentForm.getValues();
            setFormData(prev => ({ ...prev, ...stepData }));
        }

        return isValid;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid) {
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

    const handleStepClick = async (stepId: number) => {
        // Allow navigation to completed steps or next step if current is valid
        const isValid = await validateCurrentStep();
        if (completedSteps.includes(stepId) || (stepId === currentStep + 1 && isValid)) {
            setCurrentStep(stepId);
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        const isValid = await validateCurrentStep();
        if (currentStep === STEPS.length && isValid) {
            // Combine all form data for submission
            const step1Data = step1Form.getValues();
            const step2Data = step2Form.getValues();
            const step3Data = step3Form.getValues();

            const allData = {
                ...step1Data,
                ...step2Data,
                ...step3Data,
                // Ensure optional fields have default values
                bank_name: step2Data.bank_name || '',
                rib_number: step2Data.rib_number || '',
            };

            console.log('Step 1 data:', step1Data); // Debug log
            console.log('Step 2 data:', step2Data); // Debug log
            console.log('Step 3 data:', step3Data); // Debug log
            console.log('Combined data for submission:', allData); // Debug log

            // Submit directly with data using router.post
            router.post(route('register'), allData, {
                onFinish: () => {
                    console.log('Form submission finished');
                    reset();
                },
                onError: (errors) => {
                    console.log('Server validation errors:', errors); // Debug log
                },
                onSuccess: () => {
                    console.log('Registration successful!');
                }
            });
        }
    };

    const getStepIcon = (stepId: number) => {
        switch (stepId) {
            case 1:
                return <User className="h-5 w-5" />;
            case 2:
                return <MapPin className="h-5 w-5" />;
            case 3:
                return <Mail className="h-5 w-5" />;
            default:
                return stepId;
        }
    };

    const renderStepIndicator = () => (
        <div className="mb-8">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-center mb-4">
                {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <button
                            type="button"
                            onClick={() => handleStepClick(step.id)}
                            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-medium transition-all duration-200 hover:scale-105
                                ${currentStep === step.id
                                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                                    : completedSteps.includes(step.id)
                                        ? 'border-green-500 bg-green-500 text-white cursor-pointer hover:bg-green-600 shadow-md'
                                        : 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50'
                                }`}
                            disabled={!completedSteps.includes(step.id) && step.id !== currentStep}
                        >
                            {completedSteps.includes(step.id) ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                getStepIcon(step.id)
                            )}
                        </button>
                        {index < STEPS.length - 1 && (
                            <div className={`w-16 h-0.5 mx-3 transition-colors duration-200 ${completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-muted'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Labels */}
            <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-8 text-center">
                    {STEPS.map((step) => (
                        <div key={step.id} className="space-y-1">
                            <p className={`text-xs font-medium transition-colors ${currentStep === step.id
                                    ? 'text-primary'
                                    : completedSteps.includes(step.id)
                                        ? 'text-green-600'
                                        : 'text-muted-foreground'
                                }`}>
                                {step.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <StepOne
            form={step1Form}
            errors={mergedErrors}
            processing={processing}
            locale={locale}
        />
    );

    const renderStep2 = () => (
        <StepTwo
            form={step2Form}
            errors={mergedErrors}
            processing={processing}
            locale={locale}
            cities={cities}
        />
    );

    const renderStep3 = () => (
        <StepThree
            form={step3Form}
            errors={mergedErrors}
            processing={processing}
            locale={locale}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
        />
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
                <h2 className="text-xl font-semibold mb-2">{currentStepData?.title || ''}</h2>
                <p className="text-sm text-muted-foreground">
                    {trans('Step')} {currentStep} {trans('of')} {STEPS.length}
                </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {renderCurrentStep()}

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstStep || processing}
                        className="flex items-center gap-2 px-6 py-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {trans('Previous')}
                    </Button>

                    {isLastStep ? (
                        <Button
                            type="submit"
                            disabled={processing}
                            className="moroccan-gradient text-white border-0 hover:opacity-90 transition-opacity flex items-center gap-2 px-8 py-2"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {trans('Create Account')}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={processing}
                            className="moroccan-gradient text-white border-0 hover:opacity-90 transition-opacity flex items-center gap-2 px-6 py-2"
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