<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class);
    }
}

