<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Material;
use App\Models\Risk;
use App\Models\Type;
use App\Models\AlternativeName;
use App\Models\Media;

class Activity extends Model
{

    protected $fillable = [
        'title', 'num_participants', 'min_age', 'max_age', 'duration', 'objectives', 'introduction', 'description', 'conclusion', 'visibility', 'type_id', 'user_id', 'original_activity_id'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function original()
    {
        return $this->belongsTo(Activity::class, 'original_activity_id');
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class);
    }

    public function risks()
    {
        return $this->belongsToMany(Risk::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    public function alternativeName()
    {
        return $this->hasMany(AlternativeName::class, 'alternativeName_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'media_id');
    }

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoredBy()
    {
        return $this->belongsToMany(User::class);
    }

}

