<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku,'.$productId],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'weight_gram' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'color_key' => ['nullable', 'string', 'max:50'],
            'color_hex' => ['nullable', 'string', 'max:7'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
