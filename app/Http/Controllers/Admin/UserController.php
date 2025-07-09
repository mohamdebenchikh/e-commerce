<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users with pagination and search.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $query = User::query();

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%");
            });
        }

        // Sorting
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'max:20', 'unique:users'],
            'national_id' => ['required', 'string', 'max:50', 'unique:users'],
            'gender' => ['required', 'in:male,female'],
            'country' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', 'in:cash,bank'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'rib_number' => ['nullable', 'string', 'max:24'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'active' => ['boolean'],
        ]);

        // Handle bank validation
        if ($validated['payment_method'] === 'bank') {
            $request->validate([
                'bank_name' => ['required', 'string', 'max:255'],
                'rib_number' => ['required', 'string', 'size:24'],
            ]);
        }

        $validated['password'] = Hash::make($validated['password']);
        $validated['active'] = $request->boolean('active', true);

        User::create($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'national_id' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'gender' => ['required', 'in:male,female'],
            'country' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', 'in:cash,bank'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'rib_number' => ['nullable', 'string', 'max:24'],
            'active' => ['boolean'],
        ]);

        // Handle bank validation
        if ($validated['payment_method'] === 'bank') {
            $request->validate([
                'bank_name' => ['required', 'string', 'max:255'],
                'rib_number' => ['required', 'string', 'size:24'],
            ]);
        }

        // Handle password update if provided
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $validated['password'] = Hash::make($request->password);
        }

        $validated['active'] = $request->boolean('active', true);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle user active status.
     */
    public function toggleStatus(User $user): RedirectResponse
    {
        $user->update(['active' => !$user->active]);

        $status = $user->active ? 'activated' : 'deactivated';

        return redirect()->back()
            ->with('success', "User {$status} successfully.");
    }
}
