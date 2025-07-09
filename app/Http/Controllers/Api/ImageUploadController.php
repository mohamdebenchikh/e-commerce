<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload image for rich text editor
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB max
        ]);

        try {
            $image = $request->file('image');
            
            // Generate unique filename
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            
            // Store in public disk under editor-images directory
            $path = $image->storeAs('editor-images', $filename, 'public');
            
            // Get the full URL
            $url = Storage::disk('public')->url($path);
            
            return response()->json([
                'success' => true,
                'url' => $url,
                'filename' => $filename,
                'original_name' => $image->getClientOriginalName(),
                'size' => $image->getSize(),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete uploaded image
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'filename' => 'required|string',
        ]);

        try {
            $filename = $request->input('filename');
            $path = 'editor-images/' . $filename;
            
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500);
        }
    }
}
