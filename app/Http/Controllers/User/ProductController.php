<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of published products for users.
     */
    public function index(Request $request): Response
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

        // Category filter
        if ($categoryId = $request->get('category')) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        // Price range filter
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['name', 'price', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        // Get user's product list IDs for UI state
        $userProductIds = [];
        if (Auth::check()) {
            $userProductIds = Auth::user()->productList()->pluck('products.id')->toArray();
        }

        // Get categories for filter
        $categories = Category::active()->ordered()->get();

        return Inertia::render('user/products/index', [
            'products' => [
                'data' => $products->items(),
                'links' => $products->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'from' => $products->firstItem(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'to' => $products->lastItem(),
                    'total' => $products->total(),
                ]
            ],
            'categories' => $categories,
            'userProductIds' => $userProductIds,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ]
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        if ($product->status !== 'published') {
            abort(404);
        }

        // Check if user has this product in their list
        $isInUserList = false;
        if (Auth::check()) {
            $isInUserList = Auth::user()->productList()->where('products.id', $product->id)->exists();
        }

        return Inertia::render('user/products/show', [
            'product' => $product->load('categories', 'images'),
            'isInUserList' => $isInUserList,
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
    public function getUserList(Request $request): Response
    {
        $user = Auth::user();
        
        $query = $user->productList()->with('categories', 'images');

        // Search in user's list
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'user_product_list.created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return Inertia::render('user/products/list', [
            'products' => [
                'data' => $products->items(),
                'links' => $products->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'from' => $products->firstItem(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'to' => $products->lastItem(),
                    'total' => $products->total(),
                ]
            ],
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ]
        ]);
    }
}
