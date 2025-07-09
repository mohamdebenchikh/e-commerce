<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductImagesController extends Controller
{
    /**
     * Upload and store product images
     */
    public function store(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'images' => ['required', 'array', 'max:10'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $uploadedImages = [];

        try {
            foreach ($request->file('images') as $file) {
                // Generate unique filename
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                
                // Store file in public disk under products folder
                $path = $file->storeAs('products', $filename, 'public');
                
                // Create full URL
                $url = Storage::disk('public')->url($path);
                
                // Save to database
                $productImage = $product->images()->create([
                    'url' => $url
                ]);

                $uploadedImages[] = [
                    'id' => $productImage->id,
                    'url' => $url,
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize()
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Images uploaded successfully',
                'images' => $uploadedImages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product image
     */
    public function destroy(Product $product, ProductImage $image)
    {
        try {
            // Check if image belongs to the product
            if ($image->product_id !== $product->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image does not belong to this product'
                ], 403);
            }

            // Delete file from storage if URL exists
            if ($image->url) {
                $urlPath = parse_url($image->url, PHP_URL_PATH);
                $filePath = str_replace('/storage/', '', $urlPath);

                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }

            // Delete from database
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update main product image by swapping with selected additional image
     */
    public function updateMain(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'image_id' => ['required', 'integer', 'exists:product_images,id']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find the selected additional image
            $selectedImage = ProductImage::where('id', $request->image_id)
                ->where('product_id', $product->id)
                ->first();

            if (!$selectedImage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected image not found or does not belong to this product'
                ], 404);
            }

            // Get the current main image URL
            $currentMainImageUrl = $product->image;

            // Get the selected image URL
            $selectedImageUrl = $selectedImage->url;

            // Swap the images:
            // 1. Set the selected image URL as the main image
            $product->update([
                'image' => $selectedImageUrl
            ]);

            // 2. Update the selected image record with the previous main image URL
            $selectedImage->update([
                'url' => $currentMainImageUrl
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Main image updated successfully',
                'data' => [
                    'new_main_image' => $selectedImageUrl,
                    'updated_additional_image' => [
                        'id' => $selectedImage->id,
                        'url' => $currentMainImageUrl
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update main image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all product images
     */
    public function index(Product $product)
    {
        try {
            $images = $product->images()->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'images' => $images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                        'created_at' => $image->created_at
                    ];
                }),
                'main_image' => $product->image
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch images: ' . $e->getMessage()
            ], 500);
        }
    }
}
