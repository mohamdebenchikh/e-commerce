<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
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

        $query = Tag::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $tags = $query->orderBy($sortBy, $sortOrder)
                     ->paginate($perPage)
                     ->withQueryString();

        return inertia('admin/tags/index', [
            'tags' => $tags,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $tag = Tag::create($validated);

        // Handle JSON requests (from admin tags page)
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => trans('tag_created_successfully'),
                'tag' => $tag
            ]);
        }

        // Handle Inertia requests (from create tag dialog)
        return back()->with('success', trans('tag_created_successfully'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name,' . $tag->id],
        ]);

        // Update slug if name changed
        if ($tag->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $tag->update($validated);

        return response()->json([
            'success' => true,
            'message' => trans('tag_updated_successfully'),
            'tag' => $tag->fresh()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): JsonResponse
    {
        // Check if tag is used by any products
        if ($tag->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => trans('tag_cannot_be_deleted_has_products')
            ], 422);
        }

        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => trans('tag_deleted_successfully')
        ]);
    }
}
