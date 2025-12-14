<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;

// class VerifyEmailCustom extends Notification
// {
//     use Queueable;

//     /**
//      * Create a new notification instance.
//      */
//     public function __construct()
//     {
//         //
//     }

//     /**
//      * Get the notification's delivery channels.
//      *
//      * @return array<int, string>
//      */
//     public function via(object $notifiable): array
//     {
//         return ['mail'];
//     }

//     /**
//      * Get the mail representation of the notification.
//      */
//     public function toMail(object $notifiable): MailMessage
//     {
//         return (new MailMessage)
//             ->line('The introduction to the notification.')
//             ->action('Notification Action', url('/'))
//             ->line('Thank you for using our application!');
//     }

//     /**
//      * Get the array representation of the notification.
//      *
//      * @return array<string, mixed>
//      */
//     public function toArray(object $notifiable): array
//     {
//         return [
//             //
//         ];
//     }
// }

class VerifyEmailCustom extends VerifyEmail
{
    /**
     * Personalizamos el email
     */
    public function toMail($notifiable)
    {
        $verifyUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Confirma tu cuenta')
            ->greeting('¡Bienvenido!')
            ->line('Gracias por registrarte. Para activar tu cuenta, confirma tu email.')
            ->action('Confirmar cuenta', $verifyUrl)
            ->line('Si no has creado esta cuenta, ignora este correo.')
            ->salutation('Atentamente, El equipo de OcioEducativo.es');
    }
}