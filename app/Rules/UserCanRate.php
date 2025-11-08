<?php

namespace App\Rules;

use App\Models\Rating;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class UserCanRate implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = Auth::user();
        if (!$user) {
            $fail('Anda harus login untuk memberi rating!');
            return;
        }

        $latestRating = Rating::where('user_id', $user->id)
            ->latest('created_at')
            ->first();

        if ($latestRating) {
            $canRateAgainAt = $latestRating->created_at->addHours(24);

            if (now()->lessThan($canRateAgainAt)) {
                $fail('Rating hanya bisa diberikan satu kali setiap 24 jam!');
            }
        }
    }
}
