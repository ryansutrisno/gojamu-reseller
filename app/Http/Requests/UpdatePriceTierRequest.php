<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePriceTierRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'min_qty' => ['required', 'integer', 'min:1'],
            'max_qty' => ['nullable', 'integer', 'min:1', 'gte:min_qty'],
            'price_per_pcs' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }
}
