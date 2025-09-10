<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Farm;

class StoreAnimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'animal_number' => 'required|string',
            'type_name' => 'required|string|max:255',
            'years' => 'nullable|integer|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $farm = $this->route('farm');

            if ($farm && $farm->animals()->count() >= 3) {
                $validator->errors()->add('farm_id', 'Each farm can have max 3 animals');
            }
        });
    }
}
