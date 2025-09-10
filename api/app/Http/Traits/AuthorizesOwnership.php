<?php

namespace App\Http\Traits;

use Illuminate\Http\Request;

trait AuthorizesOwnership
{
    /**
     * Authorize that a given model belongs to the authenticated user.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  \Illuminate\Http\Request  $request
     */
    protected function authorizeOwner($model, Request $request)
    {
        if ($model->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
