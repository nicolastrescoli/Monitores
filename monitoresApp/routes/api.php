<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TypeController;

use Illuminate\Foundation\Auth\EmailVerificationRequest;

use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

Route::get('/test-mail', function () {
    Mail::raw('Email real desde Brevo 🎉', function ($message) {
        $message->to('ocioeducativoes@gmail.com')
                ->subject('Prueba Brevo Laravel');
    });

    return 'Email enviado';
});


/*
|--------------------------------------------------------------------------
| Autenticación y gesión de cuenta de usuario
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'apiLogin']);
Route::post('/logout', [AuthController::class, 'apiLogout']);
Route::post('/register', [AuthController::class, 'apiRegister']);
Route::middleware(['auth:sanctum', 'verified'])->get('/profile', [AuthController::class, 'apiShow']); // Ver perfil propio
Route::middleware(['auth:sanctum', 'verified'])->get('/profile/{user}', [AuthController::class, 'apiShow']); // Ver perfil de otro usuario
Route::middleware(['auth:sanctum', 'verified'])->put('/user/{user}', [AuthController::class, 'update']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/user/{user}', [AuthController::class, 'destroy']);
// Verificar email
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify'); // ESTE ->name es OBLIGATORIO, laravel lo usa internamente
// Reenviar email de verificación
Route::middleware('auth:sanctum')->post('/email/resend', [AuthController::class, 'resendVerfificationEmail']);

/*
|--------------------------------------------------------------------------
| CRUD Actividades
|--------------------------------------------------------------------------
*/
// Top actividades favoritas
Route::get('/activities/top-favorites', [ActivityController::class, 'topFavorites']);
Route::get('/activities', [ActivityController::class, 'apiIndex']);
// Envía lista de categorias, materiales y riesgos para el formulario
Route::middleware(['auth:sanctum', 'verified'])->get('/activities/formData', [ActivityController::class, 'formData']);
Route::middleware(['auth:sanctum', 'verified'])->post('/activities/store', [ActivityController::class, 'apiStore']);
Route::get('/activities/{activity}', [ActivityController::class, 'apiActivityDetail']);
Route::middleware(['auth:sanctum', 'verified'])->put('/activities/{activity}', [ActivityController::class, 'apiUpdate']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/activities/{activity}', [ActivityController::class, 'apiDestroy']);
Route::middleware(['auth:sanctum', 'verified'])->post('/activities/favorite/{activity}', [ActivityController::class, 'apiToggleFavorite']);

// Enviar para revisión
Route::middleware(['auth:sanctum', 'verified'])->put('/activities/submit/{activity}', [ActivityController::class,'apiSubmitPublic']);
// Cancelar envio para revisión
Route::middleware(['auth:sanctum', 'verified'])->put('/activities/unsubmit/{activity}', [ActivityController::class,'apiCancelSubmission']);

/*
|--------------------------------------------------------------------------
| Tareas admin
|--------------------------------------------------------------------------
*/
// Panel de revisión
Route::middleware(['auth:sanctum', 'verified'])->get('/admin/activities/pending', [ActivityController::class,'apiPending']);
Route::middleware(['auth:sanctum', 'verified'])->put('/admin/approve/{activity}', [ActivityController::class,'apiSetPublic']);
Route::middleware(['auth:sanctum', 'verified'])->put('/admin/reject/{activity}', [ActivityController::class,'apiRejectPublic']);

/*
|--------------------------------------------------------------------------
| CRUD Schedules
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'verified'])->get('/schedule/{schedule}', [ScheduleController::class, 'scheduleDetail']);
Route::middleware(['auth:sanctum', 'verified'])->post('/schedule/store', [ScheduleController::class, 'store']);
Route::middleware(['auth:sanctum', 'verified'])->put('/schedule/{schedule}', [ScheduleController::class, 'update']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/schedule/{schedule}', [ScheduleController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Comunidad y Social
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'verified'])->get('/users', [AuthController::class, 'apiIndex']);
// Gestión de peticiones de amistad
Route::middleware(['auth:sanctum', 'verified'])->post('/friends/request/{receiver}', [AuthController::class, 'apiSendRequest']);
Route::middleware(['auth:sanctum', 'verified'])->post('/friends/accept/{sender}', [AuthController::class, 'apiAcceptRequest']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/friends/reject/{sender}', [AuthController::class, 'apiRejectRequest']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/friends/cancel/{receiver}', [AuthController::class, 'apiCancelRequest']);
Route::middleware(['auth:sanctum', 'verified'])->delete('/friends/remove/{user}', [AuthController::class, 'apiRemoveFriend']);

/*
|--------------------------------------------------------------------------
| Generador PDFs
|--------------------------------------------------------------------------
*/
Route::get('/pdf/activity/{activity}', [ActivityController::class, 'generatePdf']);
Route::get('/pdf/schedule/{schedule}', [ScheduleController::class, 'generatePdf']);

/*
|--------------------------------------------------------------------------
| Otros
|--------------------------------------------------------------------------
*/
// Recuperar tabla types
Route::get('/types', [TypeController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Faltan
|--------------------------------------------------------------------------
*/

// Eliminar cuenta de usuario
// Eliminar vistas blade y sobrantes