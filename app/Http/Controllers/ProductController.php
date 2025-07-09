<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of published products.
     */
    public function index(Request $request)
    {
        $query = Product::with('categories', 'images')
            ->where('status', 'published');

        // Search filter
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Price range filter
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Category filter
        if ($categoryId = $request->get('category')) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['created_at', 'price', 'name'];
        
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return Inertia::render('user/products/index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'category' => $categoryId,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ]
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        if ($product->status !== 'published') {
            abort(404);
        }

        return Inertia::render('user/products/show', [
            'product' => $product->load('categories', 'images')
        ]);
    }

    /**
     * Add product to user's list.
     */
    public function addToList(Product $product)
    {
        $user = Auth::user();
        
        if (!$user->productList()->where('product_id', $product->id)->exists()) {
            $user->productList()->attach($product->id);
            return back()->with('success', 'Product added to your list successfully');
        }

        return back()->with('error', 'Product is already in your list');
    }

    /**
     * Remove product from user's list.
     */
    public function removeFromList(Product $product)
    {
        $user = Auth::user();
        
        $user->productList()->detach($product->id);
        
        return back()->with('success', 'Product removed from your list successfully');
    }

    /**
     * Get user's product list.
     */
    public function getList()
    {
        $user = Auth::user();
        
        $products = $user->productList()
            ->with('categories', 'images')
            ->paginate(12);

        return Inertia::render('Products/List', [
            'products' => $products
        ]);
    }
}
