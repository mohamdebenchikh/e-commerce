import * as z from 'zod';
import { trans } from '@/lib/utils';

// Step 1: Personal Information Schema
export const stepOneSchema = z.object({
    first_name: z
        .string()
        .min(1, trans('First name is required'))
        .min(2, trans('First name must be at least 2 characters'))
        .max(50, trans('First name must not exceed 50 characters'))
        .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, trans('First name can only contain letters')),
    
    last_name: z
        .string()
        .min(1, trans('Last name is required'))
        .min(2, trans('Last name must be at least 2 characters'))
        .max(50, trans('Last name must not exceed 50 characters'))
        .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, trans('Last name can only contain letters')),
    
    phone: z
        .string()
        .min(1, trans('Phone number is required'))
        .refine((phone) => {
            if (!phone || phone.trim() === '') return false;

            // Remove all spaces and non-digit characters except +
            const cleanPhone = phone.replace(/[^\d+]/g, '');

            // Must start with + and have at least 8 digits total
            if (!cleanPhone.startsWith('+')) return false;

            // Remove the + and check if remaining are all digits
            const digits = cleanPhone.substring(1);
            if (!/^\d+$/.test(digits)) return false;

            // Check length (country code + number should be 7-15 digits)
            return digits.length >= 7 && digits.length <= 15;
        }, trans('Please enter a valid phone number')),
    
    gender: z
        .enum(['male', 'female', 'other'], {
            errorMap: () => ({ message: trans('Please select a gender') })
        }),
    
    national_id: z
        .string()
        .min(1, trans('National ID is required'))
        .min(8, trans('National ID must be at least 8 characters'))
        .max(20, trans('National ID must not exceed 20 characters'))
        .regex(/^[A-Z0-9]+$/, trans('National ID can only contain letters and numbers'))
});

// Step 2: Location & Payment Schema
export const stepTwoSchema = z.object({
    country: z
        .string()
        .min(1, trans('Country is required'))
        .min(2, trans('Country must be at least 2 characters'))
        .max(100, trans('Country must not exceed 100 characters')),

    city: z
        .string()
        .min(1, trans('City is required')),

    payment_method: z
        .enum(['cash', 'bank'], {
            errorMap: () => ({ message: trans('Please select a payment method') })
        }),

    bank_name: z
        .string()
        .optional(),

    rib_number: z
        .string()
        .optional()
}).superRefine((data, ctx) => {
    // Validate bank fields when bank transfer is selected
    if (data.payment_method === 'bank') {
        if (!data.bank_name || data.bank_name.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: trans('Bank name is required when bank payment is selected'),
                path: ['bank_name']
            });
        }

        if (!data.rib_number) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: trans('RIB number is required when bank payment is selected'),
                path: ['rib_number']
            });
        } else {
            const cleanRib = data.rib_number.replace(/\s/g, '');
            if (!/^\d{16,24}$/.test(cleanRib)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: trans('RIB number must be 16-24 digits'),
                    path: ['rib_number']
                });
            }
        }
    }
});

// Step 3: Account Setup Schema
export const stepThreeSchema = z.object({
    email: z
        .string()
        .min(1, trans('Email is required'))
        .email(trans('Please enter a valid email address'))
        .max(255, trans('Email must not exceed 255 characters')),
    
    password: z
        .string()
        .min(1, trans('Password is required'))
        .min(8, trans('Password must be at least 8 characters'))
        .max(255, trans('Password must not exceed 255 characters'))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, trans('Password must contain at least one uppercase letter, one lowercase letter, and one number')),
    
    password_confirmation: z
        .string()
        .min(1, trans('Password confirmation is required'))
}).refine((data) => data.password === data.password_confirmation, {
    message: trans('Passwords do not match'),
    path: ['password_confirmation']
});

// Combined schema for final submission (without superRefine for merging)
export const registerSchema = z.object({
    // Step 1 fields
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    phone: z.string().min(1),
    gender: z.enum(['male', 'female', 'other']),
    national_id: z.string().min(1),
    // Step 2 fields
    country: z.string().min(1),
    city: z.string().min(1),
    payment_method: z.enum(['cash', 'bank']),
    bank_name: z.string().optional(),
    rib_number: z.string().optional(),
    // Step 3 fields
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(1),
});

// Type definitions
export type StepOneForm = z.infer<typeof stepOneSchema>;
export type StepTwoForm = z.infer<typeof stepTwoSchema>;
export type StepThreeForm = z.infer<typeof stepThreeSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
