<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\VerifyEmailCustom;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'description',
        'email',
        'password',
        'role',
        'url_image'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailCustom());
    }

    /**
     * Relaciones de amistad unificadas (solicitudes enviadas)
     */
    public function friends()
    {
        return $this->belongsToMany(User::class, 'user_user', 'user_id', 'friend_id')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    /**
     * Relaciones de amistad recibidas
     */
    public function friendOf()
    {
        return $this->belongsToMany(User::class, 'user_user', 'friend_id', 'user_id')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    /**
     * Todas las amistades aceptadas (bidireccionales)
     */
    public function allFriends()
    {
        $sent = $this->friends()->wherePivot('status', 'accepted')->get();
        $received = $this->friendOf()->wherePivot('status', 'accepted')->get();
        return $sent->merge($received)->unique('id');
    }

    /**
     * Solicitudes de amistad pendientes que ha recibido
     */
    public function pendingFriendRequests()
    {
        return $this->friendOf()->wherePivot('status', 'pending');
    }


    // Amigos que el usuario ha enviado y han sido aceptados
    public function sentFriendRequests()
    {
        return $this->belongsToMany(User::class, 'user_user', 'user_id', 'friend_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    // Amigos que el usuario ha recibido y ha aceptado
    public function receivedFriendRequests()
    {
        return $this->belongsToMany(User::class, 'user_user', 'friend_id', 'user_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    /**
     * Obtener el estado de amistad con otro usuario.
     */
    public function friendStatusWith(User $otherUser)
    {
        $sent = $this->friends()->where('friend_id', $otherUser->id)->first();
        if ($sent) return $sent->pivot->status === 'accepted' ? 'friends' : 'pending_sent';

        $received = $this->friendOf()->where('user_id', $otherUser->id)->first();
        if ($received) return $received->pivot->status === 'accepted' ? 'friends' : 'pending_received';

        return 'none';
    }

    /**
     * Programaciones creadas
     */
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Reseñas hechas por el usuario
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Actividades favoritas
     */
    public function favoriteActivities()
    {
        return $this->belongsToMany(Activity::class);
    }
}
