<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'animal_number' => 'required|integer',
            'type_name' => 'required|string|max:255',
            'years' => 'nullable|integer|min:0',
        ];
    }
}
