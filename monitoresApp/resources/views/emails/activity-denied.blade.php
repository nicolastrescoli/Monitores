<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Actividad Rechazada</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="600" style="background: #ffffff; padding: 30px; border-radius: 8px;">
                    
                    {{-- Logo --}}
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="{{ config('app.url') }}/images/logo.png" alt="Logo" height="60">
                        </td>
                    </tr>

                    {{-- Título --}}
                    <tr>
                        <td>
                            <h2 style="color: #2d3748;">Actividad no publicada</h2>
                        </td>
                    </tr>

                    {{-- Contenido --}}
                    <tr>
                        <td style="color: #4a5568; font-size: 15px;">
                            <p>Hola <strong>{{ $user->name }}</strong>,</p>

                            <p>
                                Tu solicitud de publicación de la actividad
                                <strong>“{{ $activity->title }}”</strong>
                                ha sido desestimada.
                            </p>

                            <p>Sigue participando y haciendo crecer esta comunidad.</p>
                        </td>
                    </tr>

                    {{-- Botón --}}
                    <tr>
                        <td align="center" style="padding: 25px 0;">
                            <a href="{{ config('app.frontend_url') }}/activities/{{ $activity->id }}"
                               style="
                                background-color: #38a169;
                                color: #ffffff;
                                padding: 12px 25px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: bold;
                               ">
                                Ver actividad
                            </a>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="color: #718096; font-size: 13px; text-align: center;">
                            <p>
                                Gracias por contribuir a la comunidad 💚<br>
                                <strong>{{ config('app.name') }}</strong>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
