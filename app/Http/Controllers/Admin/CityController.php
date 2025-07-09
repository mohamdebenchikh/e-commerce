<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $query = City::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ar_name', 'like', "%{$search}%")
                  ->orWhere('fr_name', 'like', "%{$search}%")
                  ->orWhere('en_name', 'like', "%{$search}%");
            });
        }

        $cities = $query->orderBy($sortBy, $sortOrder)
                       ->paginate($perPage)
                       ->withQueryString();

        return Inertia::render('admin/cities/index', [
            'cities' => $cities,
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
    public function create()
    {
        return Inertia::render('admin/cities/create');
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
            'shipping_cost' => ['required', 'numeric', 'min:0'],
        ]);

        City::create($validated);

        return Redirect::route('admin.cities.index')->with('success', 'City created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(City $city)
    {
        return Inertia::render('admin/cities/show', [
            'city' => $city
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(City $city)
    {
        return Inertia::render('admin/cities/edit', [
            'city' => $city
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, City $city): RedirectResponse
    {
        $validated = $request->validate([
            'ar_name' => ['required', 'string', 'max:255'],
            'fr_name' => ['required', 'string', 'max:255'],
            'en_name' => ['required', 'string', 'max:255'],
            'shipping_cost' => ['required', 'numeric', 'min:0'],
        ]);

        $city->update($validated);

        return Redirect::route('admin.cities.index')->with('success', 'City updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(City $city): RedirectResponse
    {
        $city->delete();

        return Redirect::route('admin.cities.index')->with('success', 'City deleted successfully.');
    }
}
