<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;

class Material extends Model
{
    public function activities()
    {
        return $this->belongsToMany(Activity::class)->withPivot(['quantity', 'notes']);
    }
}

