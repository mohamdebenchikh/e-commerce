<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload a single image
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'folder' => 'string|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            $folder = $request->input('folder', 'products');
            
            // Generate unique filename
            $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            
            // Store the image
            $path = $image->storeAs($folder, $filename, 'public');
            
            // Get the full URL
            $url = Storage::url($path);
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'path' => $path,
                    'url' => $url,
                    'filename' => $filename,
                    'original_name' => $image->getClientOriginalName(),
                    'size' => $image->getSize(),
                    'mime_type' => $image->getMimeType()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple images
     */
    public function uploadMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max per image
            'folder' => 'string|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadedImages = [];
            $folder = $request->input('folder', 'products');
            
            foreach ($request->file('images') as $image) {
                // Generate unique filename
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                
                // Store the image
                $path = $image->storeAs($folder, $filename, 'public');
                
                // Get the full URL
                $url = Storage::url($path);
                
                $uploadedImages[] = [
                    'path' => $path,
                    'url' => $url,
                    'filename' => $filename,
                    'original_name' => $image->getClientOriginalName(),
                    'size' => $image->getSize(),
                    'mime_type' => $image->getMimeType()
                ];
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'data' => $uploadedImages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an image
     */
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $path = $request->input('path');
            
            // Remove /storage/ prefix if present to get the actual storage path
            $storagePath = str_replace('/storage/', '', $path);
            
            if (Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->delete($storagePath);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Image not found'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete multiple images
     */
    public function deleteMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paths' => 'required|array',
            'paths.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $deletedCount = 0;
            $failedPaths = [];
            
            foreach ($request->input('paths') as $path) {
                // Remove /storage/ prefix if present to get the actual storage path
                $storagePath = str_replace('/storage/', '', $path);
                
                if (Storage::disk('public')->exists($storagePath)) {
                    Storage::disk('public')->delete($storagePath);
                    $deletedCount++;
                } else {
                    $failedPaths[] = $path;
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => "Successfully deleted {$deletedCount} images",
                'data' => [
                    'deleted_count' => $deletedCount,
                    'failed_paths' => $failedPaths
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete images: ' . $e->getMessage()
            ], 500);
        }
    }
}
