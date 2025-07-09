<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\LogoutController;
use App\Http\Controllers\Admin\Settings\ProfileController;
use App\Http\Controllers\Admin\Settings\PasswordController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImagesController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ImageUploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->as('admin.')->group(function () {

    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [LoginController::class, 'index'])->name('login.index');
        Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // User Management
        Route::resource('users', UserController::class);
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

        // City Management
        Route::resource('cities', CityController::class);

        // Category Management
        Route::resource('categories', CategoryController::class);

        // Tag Management
        Route::resource('tags', TagController::class);

        // Product Management
        Route::resource('products', ProductController::class);
        Route::post('products/store-complete', [ProductController::class, 'storeComplete'])->name('products.store-complete');

    // Product Images routes
    Route::prefix('products/{product}/images')->name('products.images.')->group(function () {
        Route::get('/', [ProductImagesController::class, 'index'])->name('index');
        Route::post('/', [ProductImagesController::class, 'store'])->name('store');
        Route::delete('/{image}', [ProductImagesController::class, 'destroy'])->name('destroy');
        Route::patch('/main', [ProductImagesController::class, 'updateMain'])->name('update-main');
    });

        // Image Upload Management
        Route::prefix('images')->as('images.')->group(function () {
            Route::post('upload', [ImageUploadController::class, 'upload'])->name('upload');
            Route::post('upload-multiple', [ImageUploadController::class, 'uploadMultiple'])->name('upload-multiple');
            Route::delete('delete', [ImageUploadController::class, 'delete'])->name('delete');
            Route::delete('delete-multiple', [ImageUploadController::class, 'deleteMultiple'])->name('delete-multiple');
        });

        // Order Management
        Route::resource('orders', OrderController::class);
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');

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
