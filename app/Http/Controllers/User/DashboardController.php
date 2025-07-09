<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Mock data - replace with real data from your models
        $stats = [
            'totalOrders' => 24,
            'pendingOrders' => 3,
            'completedOrders' => 21,
            'totalSpent' => 1250.00
        ];

        $recentOrders = [
            [
                'id' => 1,
                'orderNumber' => 'ORD-001',
                'date' => '2024-01-15',
                'status' => 'completed',
                'total' => 89.99,
                'items' => 2
            ],
            [
                'id' => 2,
                'orderNumber' => 'ORD-002',
                'date' => '2024-01-14',
                'status' => 'pending',
                'total' => 156.50,
                'items' => 3
            ],
            [
                'id' => 3,
                'orderNumber' => 'ORD-003',
                'date' => '2024-01-12',
                'status' => 'completed',
                'total' => 75.25,
                'items' => 1
            ]
        ];

        return Inertia::render('user-dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
