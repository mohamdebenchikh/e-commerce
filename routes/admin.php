<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\LogoutController;
use App\Http\Controllers\Admin\Settings\ProfileController;
use App\Http\Controllers\Admin\Settings\PasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->as('admin.')->group(function () {

    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [LoginController::class, 'index'])->name('login.index');
        Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::redirect('settings', 'settings/profile');

        Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

        Route::get('settings/appearance', function () {
            return Inertia::render('admin/settings/appearance');
        })->name('appearance');

        Route::get('/logout', [LogoutController::class, 'logout'])->name('logout');
    });
});
