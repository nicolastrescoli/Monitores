<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    public function activities()
    {
        return $this->belongsToMany(Activity::class);
    }
}

