<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ActivityApproved extends Notification
{
    use Queueable;

    public $activity;

    /**
     * Create a new notification instance.
     */
    public function __construct($activity)
    {
        $this->activity = $activity;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tu actividad ha sido aprobada')
            ->view('emails.activity-approved', [
            'user' => $notifiable,
            'activity' => $this->activity,
            ]);
            // ->greeting('¡Hola ' . $notifiable->name . '!')
            // ->line('Tu actividad "' . $this->activity->title . '" ha sido aprobada por el administrador.')
            // ->line('A partir de ahora estará disponible para toda la comunidad.')
            // ->line('¡Gracias por tu aportación!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
