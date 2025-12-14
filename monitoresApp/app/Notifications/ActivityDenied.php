<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ActivityDenied extends Notification
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
            ->subject('Actividad no publicada')
            ->greeting('¡Hola ' . $notifiable->name . '!')
            ->line('Tu solicitud de publicación de la actividad "' . $this->activity->title . '" ha sido desestimada.')
            ->line('Sigue participando y haciendo crecer esta comunidad.')
            ->line('¡Gracias por tu colaboración!');
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
