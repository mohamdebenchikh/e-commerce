<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
