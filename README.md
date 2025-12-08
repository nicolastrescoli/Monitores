# Monitores
Referencias:
https://getbootstrap.com/docs/5.3/getting-started/introduction/
https://justfuckingusehtml.com/


Para la integración back-front: npm run build del Front y pegar el contenido de la carpeta dist en la carpeta react del backend.
Pero para hacer POST desde el front, hay que instalar laravel/sanctum

Para conectar back con front hay que instalar sanctum y configurarlo para enviar y recibir cookies y token csrf

composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
php artisan config:publish cors
php artisan install:api

.env: 
# SESSION_DRIVER=database
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173

cors.php
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,

bootstrap/app.php:

<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// 👇 importa el middleware de Sanctum
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 👇 Añadimos el middleware que permite CSRF + cookies desde el frontend
        $middleware->web(append: [
            EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

sanctum.php

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1,127.0.0.1:5173')),


    
'cors' => [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
],

--------------------------------------

npm install react-router-dom



https://4geeks.com/es/lesson/contexto-de-autenticacion-con-react

npm install react-loading-indicators
https://react-loading-indicators.netlify.app/