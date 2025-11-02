<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = ['name', 'description', 'user_id', 'cell_map'];
    protected $casts = [
        'cell_map' => 'array', // para que Laravel lo trate como array/objeto
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activities()
{
    return $this->belongsToMany(Activity::class, 'activity_schedule')
        ->withPivot('day', 'hour', 'cell_uuid', 'instance_id')
        ->withTimestamps();
}

}

