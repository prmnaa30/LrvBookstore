<?php

namespace App\Http\Requests;

use App\Rules\UserCanRate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRatingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'author_id' => 'required|integer|exists:authors,id',
            'book_id' => [
                'required',
                'integer',
                Rule::exists('books', 'id')->where('author_id', $this->input('author_id')),
                new UserCanRate(),
            ],
            'rating' => 'required|integer|min:1|max:10',
        ];
    }
}
