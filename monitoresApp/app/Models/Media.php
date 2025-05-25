<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    public function activities()
    {
        return $this->belongsTo(Activity::class);
    }
}
