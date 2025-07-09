<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $query = Category::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ar_name', 'like', "%{$search}%")
                  ->orWhere('fr_name', 'like', "%{$search}%")
                  ->orWhere('en_name', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy($sortBy, $sortOrder)
                          ->paginate($perPage)
                          ->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ar_name' => ['required', 'string', 'max:255'],
            'fr_name' => ['required', 'string', 'max:255'],
            'en_name' => ['required', 'string', 'max:255'],
            'ar_description' => ['nullable', 'string'],
            'fr_description' => ['nullable', 'string'],
            'en_description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        // Generate slug from English name
        $validated['slug'] = Str::slug($validated['en_name']);

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = url('storage/' . $path);
        }

        Category::create($validated);

        return Redirect::route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): Response
    {
        return Inertia::render('admin/categories/show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'ar_name' => ['required', 'string', 'max:255'],
            'fr_name' => ['required', 'string', 'max:255'],
            'en_name' => ['required', 'string', 'max:255'],
            'ar_description' => ['nullable', 'string'],
            'fr_description' => ['nullable', 'string'],
            'en_description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ]);

        // Update slug if English name changed
        if ($category->en_name !== $validated['en_name']) {
            $validated['slug'] = Str::slug($validated['en_name']);
        }

        // Handle image upload if present
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image) {
                $oldPath = str_replace(url('storage/'), '', $category->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('image')->store('categories', 'public');
            $validated['image'] = url('storage/' . $path);
        }

        $category->update($validated);

        return Redirect::route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Delete image if exists
        if ($category->image) {
            $path = str_replace(url('storage/'), '', $category->image);
            Storage::disk('public')->delete($path);
        }

        $category->delete();

        return Redirect::route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
