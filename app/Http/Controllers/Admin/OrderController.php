<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Response;

class OrderController extends Controller
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
        $status = $request->get('status');

        $query = Order::with(['user', 'product']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                  ->orWhere('client_phone', 'like', "%{$search}%")
                  ->orWhere('tracking_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('product', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $orders = $query->orderBy($sortBy, $sortOrder)
                       ->paginate($perPage)
                       ->withQueryString();

        return inertia('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'status' => $status,
            ],
            'statuses' => [
                'pending' => 'Pending',
                'confirmed' => 'Confirmed',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled'
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $users = \App\Models\User::where('active', true)
                                ->select('id', 'first_name', 'last_name', 'email')
                                ->get();

        $products = Product::where('status', 'published')
                          ->where('stock_quantity', '>', 0)
                          ->select('id', 'name', 'price', 'stock_quantity')
                          ->get();

        return inertia('admin/orders/create', [
            'users' => $users,
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'client_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'client_phone' => 'required|string|max:20',
            'shipping_cost' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'user_profit' => 'required|numeric|min:0',
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
            'notes' => 'nullable|string|max:1000',
            'tracking_number' => 'nullable|string|max:100',
            'estimated_delivery' => 'nullable|date|after:today',
        ]);

        $order = Order::create($validated);

        return redirect()->route('admin.orders.index')
                        ->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): Response
    {
        $order->load(['user', 'product']);

        return inertia('admin/orders/show', [
            'order' => $order
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order): Response
    {
        $order->load(['user', 'product']);

        return inertia('admin/orders/edit', [
            'order' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
            'client_name' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:500',
            'client_phone' => 'sometimes|required|string|max:20',
            'shipping_cost' => 'sometimes|required|numeric|min:0',
            'sale_price' => 'sometimes|required|numeric|min:0',
            'user_profit' => 'sometimes|required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'tracking_number' => 'nullable|string|max:100',
            'estimated_delivery' => 'nullable|date|after:today',
        ]);

        $order->update($validated);

        return redirect()->route('admin.orders.index')
                        ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('admin.orders.index')
                        ->with('success', 'Order deleted successfully.');
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string|max:100',
        ]);

        $success = match($validated['status']) {
            'confirmed' => $order->markAsConfirmed(),
            'shipped' => $order->markAsShipped($validated['tracking_number'] ?? null),
            'delivered' => $order->markAsDelivered(),
            'cancelled' => $order->markAsCancelled(),
            default => $order->update(['status' => $validated['status']])
        };

        if ($success) {
            return back()->with('success', 'Order status updated successfully.');
        }

        return back()->with('error', 'Failed to update order status.');
    }
}
