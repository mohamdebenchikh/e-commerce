<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'details' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'sku' => ['required', 'string', Rule::unique('products')->ignore($productId)],
            'status' => ['required', 'in:draft,published'],
            'is_featured' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:1000'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            'description.required' => 'Product description is required.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a valid number.',
            'price.min' => 'Product price cannot be negative.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'stock_quantity.integer' => 'Stock quantity must be a whole number.',
            'stock_quantity.min' => 'Stock quantity cannot be negative.',
            'sku.required' => 'Product SKU is required.',
            'sku.unique' => 'This SKU is already taken by another product.',
            'status.required' => 'Product status is required.',
            'status.in' => 'Product status must be either draft or published.',
            'category_ids.array' => 'Categories must be provided as a list.',
            'category_ids.*.integer' => 'Each category ID must be a valid number.',
            'category_ids.*.exists' => 'One or more selected categories do not exist.',
            'tag_ids.array' => 'Tags must be provided as a list.',
            'tag_ids.*.integer' => 'Each tag ID must be a valid number.',
            'tag_ids.*.exists' => 'One or more selected tags do not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'description' => 'product description',
            'details' => 'product details',
            'price' => 'product price',
            'stock_quantity' => 'stock quantity',
            'sku' => 'product SKU',
            'status' => 'product status',
            'is_featured' => 'featured status',
            'category_ids' => 'categories',
            'tag_ids' => 'tags',
        ];
    }
}
