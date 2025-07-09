<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        try {
            Log::info('Photo upload request received', [
                'has_file' => $request->hasFile('photo'),
                'file_info' => $request->hasFile('photo') ? [
                    'name' => $request->file('photo')->getClientOriginalName(),
                    'size' => $request->file('photo')->getSize(),
                    'mime' => $request->file('photo')->getMimeType(),
                ] : null
            ]);

            $request->validate([
                'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'], // 5MB max
            ]);

            $user = $request->user();

            // Delete old photo if exists
            if ($user->photo) {
                // If photo is a full URL, extract the path
                if (str_starts_with($user->photo, 'http')) {
                    $photoPath = str_replace(asset('storage/'), '', $user->photo);
                } else {
                    $photoPath = $user->photo;
                }

                if (Storage::disk('public')->exists($photoPath)) {
                    Storage::disk('public')->delete($photoPath);
                }
            }

            // Store new photo and get the path
            $photoPath = Storage::disk('public')->putFile('photos', $request->file('photo'));

            // store to photo url
            $user->update(['photo' => Storage::url($photoPath)]);

            return back()->with('success', 'Profile photo updated successfully.');

        } catch (\Exception $e) {
            Log::error('Photo upload error: ' . $e->getMessage());
            return back()->withErrors(['photo' => 'Failed to upload photo: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Update the user's payment settings.
     */
    public function updatePayment(Request $request): RedirectResponse
    {
        try {
            // Custom validation rules
            $rules = [
                'payment_method' => ['required', 'in:cash,bank'],
            ];

            // Add bank-specific validation if bank transfer is selected
            if ($request->payment_method === 'bank') {
                // Allow predefined banks or custom bank name when "other" is selected
                if ($request->bank_name === 'other') {
                    $rules['custom_bank_name'] = ['required', 'string', 'min:2', 'max:255'];
                } else {
                    $rules['bank_name'] = ['required', 'string', 'in:attijariwafa_bank,banque_populaire,bmce_bank,bmci,cih_bank,credit_agricole,credit_du_maroc,societe_generale,bank_of_africa,al_barid_bank,ccp'];
                }
                $rules['rib_number'] = ['required', 'string', 'size:24', 'regex:/^[A-Z0-9]+$/'];
            }

            $validated = $request->validate($rules, [
                'payment_method.required' => 'Payment method is required.',
                'payment_method.in' => 'Please select a valid payment method.',
                'bank_name.required' => 'Bank name is required for bank transfers.',
                'bank_name.in' => 'Please select a valid bank from the list.',
                'custom_bank_name.required' => 'Please enter the bank name.',
                'custom_bank_name.min' => 'Bank name must be at least 2 characters.',
                'custom_bank_name.max' => 'Bank name must not exceed 255 characters.',
                'rib_number.required' => 'RIB number is required for bank transfers.',
                'rib_number.size' => 'RIB number must be exactly 24 characters.',
                'rib_number.regex' => 'RIB number must contain only letters and numbers.',
            ]);

            $user = $request->user();

            // Update user payment information
            $updateData = [
                'payment_method' => $validated['payment_method'],
            ];

            if ($validated['payment_method'] === 'bank') {
                // Use custom bank name if "other" is selected, otherwise use the selected bank
                if ($request->bank_name === 'other' && isset($validated['custom_bank_name'])) {
                    $updateData['bank_name'] = $validated['custom_bank_name'];
                } else {
                    $updateData['bank_name'] = $validated['bank_name'];
                }
                $updateData['rib_number'] = strtoupper(str_replace(' ', '', $validated['rib_number'])); // Clean and uppercase RIB
            } else {
                // Clear bank details if cash is selected
                $updateData['bank_name'] = null;
                $updateData['rib_number'] = null;
            }

            $user->update($updateData);

            Log::info('Payment settings updated successfully', [
                'user_id' => $user->id,
                'payment_method' => $validated['payment_method'],
                'bank_name' => $updateData['bank_name'] ?? null,
                'is_custom_bank' => $request->bank_name === 'other',
            ]);

            return back()->with('success', 'Payment settings updated successfully.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Payment validation failed', [
                'user_id' => $request->user()->id,
                'errors' => $e->errors(),
                'input' => $request->except(['_token']),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Payment update error: ' . $e->getMessage(), [
                'user_id' => $request->user()->id,
                'input' => $request->except(['_token']),
            ]);
            return back()->withErrors(['payment_method' => 'Failed to update payment settings. Please try again.']);
        }
    }
}
