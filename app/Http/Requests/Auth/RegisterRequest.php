<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            // Step 1: Personal Information
            'first_name' => 'required|string|max:255|min:2',
            'last_name' => 'required|string|max:255|min:2',
            'phone' => [
                'required',
                'string',
                'max:20',
                'min:10',
                'unique:users,phone',
                'regex:/^[\+]?[0-9\s\-\(\)]+$/' // Allow international phone formats
            ],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'national_id' => [
                'required',
                'string',
                'max:50',
                'min:5',
                'unique:users,national_id',
                'regex:/^[A-Z0-9]+$/' // Alphanumeric uppercase
            ],

            // Step 2: Location & Payment
            'country' => 'required|string|max:255|min:2',
            'city' => 'required|exists:cities,id',
            'payment_method' => ['required', Rule::in(['cash', 'bank'])],

            // Step 3: Account Setup
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        // Conditional validation for bank payment method
        if ($this->input('payment_method') === 'bank') {
            $rules['bank_name'] = 'required|string|max:255|min:2';
            $rules['rib_number'] = [
                'required',
                'string',
                'max:50',
                'min:16',
                'unique:users,rib_number',
                'regex:/^[0-9\s]+$/' // Numbers and spaces for RIB formatting
            ];
        } else {
            // When cash payment is selected, bank fields are optional/nullable
            $rules['bank_name'] = 'nullable|string|max:255';
            $rules['rib_number'] = 'nullable|string|max:50';
        }

        return $rules;
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Additional validation for bank payment method
            if ($this->input('payment_method') === 'bank') {
                // Ensure bank name is provided and valid
                if (empty($this->input('bank_name'))) {
                    $validator->errors()->add('bank_name', __('Bank name is required when bank payment is selected.'));
                }

                // Ensure RIB number is provided and valid
                if (empty($this->input('rib_number'))) {
                    $validator->errors()->add('rib_number', __('RIB number is required when bank payment is selected.'));
                } else {
                    // Additional RIB validation
                    $ribNumber = preg_replace('/\s+/', '', $this->input('rib_number'));
                    if (strlen($ribNumber) < 16 || strlen($ribNumber) > 24) {
                        $validator->errors()->add('rib_number', __('RIB number must be between 16 and 24 digits.'));
                    }
                }
            }
        });
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Personal Information Messages
            'first_name.required' => __('The first name field is required.'),
            'first_name.min' => __('The first name must be at least 2 characters.'),
            'last_name.required' => __('The last name field is required.'),
            'last_name.min' => __('The last name must be at least 2 characters.'),
            'phone.required' => __('The phone number field is required.'),
            'phone.unique' => __('This phone number is already registered.'),
            'phone.regex' => __('Please enter a valid phone number.'),
            'phone.min' => __('The phone number must be at least 10 characters.'),
            'gender.required' => __('Please select your gender.'),
            'gender.in' => __('Please select a valid gender option.'),
            'national_id.required' => __('The national ID field is required.'),
            'national_id.unique' => __('This national ID is already registered.'),
            'national_id.regex' => __('Please enter a valid national ID (letters and numbers only).'),
            'national_id.min' => __('The national ID must be at least 5 characters.'),
            
            // Location & Payment Messages
            'country.required' => __('The country field is required.'),
            'country.min' => __('The country name must be at least 2 characters.'),
            'city.required' => __('The city field is required.'),
            'city.min' => __('The city name must be at least 2 characters.'),
            'payment_method.required' => __('Please select a payment method.'),
            'payment_method.in' => __('Please select a valid payment method.'),
            'bank_name.required_if' => __('The bank name field is required when bank payment is selected.'),
            'bank_name.min' => __('The bank name must be at least 2 characters.'),
            'rib_number.required_if' => __('The RIB number field is required when bank payment is selected.'),
            'rib_number.unique' => __('This RIB number is already registered.'),
            'rib_number.regex' => __('Please enter a valid RIB number (numbers and spaces only).'),
            'rib_number.min' => __('The RIB number must be at least 16 characters.'),
            
            // Account Setup Messages
            'email.required' => __('The email field is required.'),
            'email.email' => __('Please enter a valid email address.'),
            'email.unique' => __('This email address is already registered.'),
            'password.required' => __('The password field is required.'),
            'password.confirmed' => __('The password confirmation does not match.'),
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => __('first name'),
            'last_name' => __('last name'),
            'phone' => __('phone number'),
            'gender' => __('gender'),
            'national_id' => __('national ID'),
            'country' => __('country'),
            'city' => __('city'),
            'payment_method' => __('payment method'),
            'bank_name' => __('bank name'),
            'rib_number' => __('RIB number'),
            'email' => __('email address'),
            'password' => __('password'),
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Group errors by step for better UX
        $errors = $validator->errors()->toArray();
        $stepErrors = $this->groupErrorsByStep($errors);
        
        // Add step information to the session for frontend handling
        session()->flash('validation_step_errors', $stepErrors);
        
        parent::failedValidation($validator);
    }

    /**
     * Group validation errors by registration step.
     *
     * @param array $errors
     * @return array
     */
    private function groupErrorsByStep(array $errors): array
    {
        $stepFields = [
            1 => ['first_name', 'last_name', 'phone', 'gender', 'national_id'],
            2 => ['country', 'city', 'payment_method', 'bank_name', 'rib_number'],
            3 => ['email', 'password', 'password_confirmation'],
        ];

        $stepErrors = [];
        
        foreach ($errors as $field => $messages) {
            foreach ($stepFields as $step => $fields) {
                if (in_array($field, $fields)) {
                    $stepErrors[$step][$field] = $messages;
                    break;
                }
            }
        }

        return $stepErrors;
    }
}
