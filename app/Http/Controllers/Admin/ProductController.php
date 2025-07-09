<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $status = $request->get('status');
        $category = $request->get('category');

        $query = Product::with('categories', 'images');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($category) {
            $query->whereHas('categories', function ($q) use ($category) {
                $q->where('categories.id', $category);
            });
        }

        // Add allowed sort fields for the data table
        $allowedSortFields = ['name', 'price', 'stock_quantity', 'created_at', 'sku'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }

        $products = $query->orderBy($sortBy, $sortOrder)
                         ->paginate($perPage)
                         ->withQueryString();

        $categories = Category::active()->ordered()->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => $request->all(),
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // Get validated data from the request
        $validated = $request->validated();

        // Set default values for required fields
        $validated['slug'] = Str::slug($validated['name']);
        $validated['status'] = 'draft'; // Default status
        $validated['stock_quantity'] = 0; // Default stock
        $validated['is_featured'] = false; // Default not featured

        // Create product with minimal data
        $product = Product::create($validated);

        // Redirect to edit page for full product setup
        return redirect()->route('admin.products.edit', $product)
            ->with('success', 'Product created successfully! Now add categories, additional images, and other details.');
    }

    /**
     * Store a fully detailed product (used when updating from edit page)
     */
    public function storeComplete(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'details' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published'],
            'sku' => ['required', 'string', 'unique:products'],
            'image' => ['nullable', 'string'], // Now expecting URL string
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
            'additional_images' => ['nullable', 'array'],
            'additional_images.*' => ['string'], // Now expecting URL strings
        ]);

        // Image is already uploaded and we have the URL
        $validated['slug'] = Str::slug($validated['name']);

        // Create product
        $product = Product::create($validated);

        // Attach categories if provided
        if ($request->has('category_ids') && is_array($request->category_ids)) {
            $product->categories()->attach($request->category_ids);
        }

        // Handle additional images
        if ($request->has('additional_images') && is_array($request->additional_images)) {
            foreach ($request->additional_images as $imageUrl) {
                // Extract the path from the URL for storage
                $imagePath = str_replace('/storage/', '', $imageUrl);
                $product->images()->create([
                    'url' => $imagePath,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('categories', 'images');
        return Inertia::render('admin/products/show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load('categories', 'images', 'tags');
        $categories = Category::active()->ordered()->get();
        $tags = \App\Models\Tag::ordered()->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
            'tags' => $tags
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        // Update slug if name changed
        if ($product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Remove category_ids and tag_ids from validated data before updating product
        $categoryIds = $validated['category_ids'] ?? [];
        $tagIds = $validated['tag_ids'] ?? [];
        unset($validated['category_ids'], $validated['tag_ids']);

        // Update product
        $product->update($validated);

        // Sync categories and tags (both are optional, so sync with empty array if not provided)
        $product->categories()->sync($categoryIds);
        $product->tags()->sync($tagIds);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete main image if it exists
        if ($product->image) {
            // Extract the path from the URL for storage deletion
            $imagePath = str_replace('/storage/', '', $product->image);
            Storage::disk('public')->delete($imagePath);
        }

        // Delete additional images
        foreach ($product->images as $image) {
            if ($image->url) {
                // Extract the path from the URL for storage deletion
                $imagePath = str_replace('/storage/', '', $image->url);
                Storage::disk('public')->delete($imagePath);
            }
        }

        // Delete product and related data (images will be deleted via cascade)
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
