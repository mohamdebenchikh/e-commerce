<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\DashboardController;


Route::get('/locale/{locale}', function (string $locale) {

    if (! in_array($locale, ['en', 'ar', 'fr'])) {
        abort(400);
    }
    
    session()->put('locale', $locale);

    return back();
})->name('locale');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Image upload for rich text editor
    Route::post('api/upload-image', [\App\Http\Controllers\Api\ImageUploadController::class, 'upload'])->name('api.upload-image');
    Route::delete('api/delete-image', [\App\Http\Controllers\Api\ImageUploadController::class, 'delete'])->name('api.delete-image');

    // Test route for debugging
    Route::get('test-products', function () {
        $products = \App\Models\Product::with('categories', 'images')
            ->where('status', 'published')
            ->paginate(12);

        return Inertia::render('test-products', [
            'products' => $products,
            'debug' => [
                'products_type' => gettype($products),
                'products_class' => get_class($products),
                'has_meta' => isset($products->meta),
                'has_links' => isset($products->links),
                'data_count' => count($products->items()),
            ]
        ]);
    })->name('test-products');

    // MultiSelect demo route
    Route::get('demo/multi-select', function () {
        return Inertia::render('demo/multi-select-demo');
    })->name('demo.multi-select');

    // Products Routes
    Route::get('products', [\App\Http\Controllers\User\ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [\App\Http\Controllers\User\ProductController::class, 'show'])->name('products.show');
    Route::post('products/{product}/add-to-list', [\App\Http\Controllers\User\ProductController::class, 'addToList'])->name('products.add-to-list');
    Route::delete('products/{product}/remove-from-list', [\App\Http\Controllers\User\ProductController::class, 'removeFromList'])->name('products.remove-from-list');
    Route::get('my-products', [\App\Http\Controllers\User\ProductController::class, 'getUserList'])->name('products.my-list');

    // // User Dashboard Routes
    //ignore this routes now 
    // Route::prefix('user')->as('user.')->group(function () {
    //     Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //     // Placeholder routes for other user dashboard pages
    //     Route::get('profile', function () {
    //         return Inertia::render('user/profile');
    //     })->name('profile');

    //     Route::get('orders', function () {
    //         return Inertia::render('user/orders');
    //     })->name('orders');

    //     Route::get('wishlist', function () {
    //         return Inertia::render('user/wishlist');
    //     })->name('wishlist');

    //     Route::get('payments', function () {
    //         return Inertia::render('user/payments');
    //     })->name('payments');

    //     Route::get('notifications', function () {
    //         return Inertia::render('user/notifications');
    //     })->name('notifications');

    //     Route::get('settings', function () {
    //         return Inertia::render('user/settings');
    //     })->name('settings');

    //     Route::get('help', function () {
    //         return Inertia::render('user/help');
    //     })->name('help');
    // });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
