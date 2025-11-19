<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Autenticación
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'apiLogin']);
Route::post('/logout', [AuthController::class, 'apiLogout']);
Route::post('/register', [AuthController::class, 'apiRegister']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'apiShow']); // Ver perfil propio
Route::middleware('auth:sanctum')->get('/profile/{user}', [AuthController::class, 'apiShow']); // Ver perfil de otro usuario

/*
|--------------------------------------------------------------------------
| CRUD Actividades
|--------------------------------------------------------------------------
*/
Route::get('/activities', [ActivityController::class, 'apiIndex']);
// Envía lista de categorias, materiales y riesgos para el formulario
Route::middleware('auth:sanctum')->get('/activities/formData', [ActivityController::class, 'formData']);
Route::middleware('auth:sanctum')->post('/activities/store', [ActivityController::class, 'apiStore']);
Route::get('/activities/{activity}', [ActivityController::class, 'apiActivityDetail']);
Route::middleware('auth:sanctum')->put('/activities/{activity}', [ActivityController::class, 'apiUpdate']);
Route::middleware('auth:sanctum')->delete('/activities/{activity}', [ActivityController::class, 'apiDestroy']);
Route::middleware('auth:sanctum')->post('/activities/favorite/{activity}', [ActivityController::class, 'apiToggleFavorite']);

/*
|--------------------------------------------------------------------------
| CRUD Schedules
|--------------------------------------------------------------------------
*/
// Route::get('/schedules', [ScheduleController::class, 'index']);
Route::middleware('auth:sanctum')->post('/schedules/store', [ScheduleController::class, 'store']);
// Route::get('/schedules/{schedule}', [ScheduleController::class, 'scheduleDetail']);

/*
|--------------------------------------------------------------------------
| Usuaruios y Social
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/users', [AuthController::class, 'apiIndex']);
// Rutas de gestión de peticiones de amistad
Route::post('/friends/request/{receiver}', [AuthController::class, 'apiSendRequest']);
Route::post('/friends/accept/{sender}', [AuthController::class, 'apiAcceptRequest']);
Route::delete('/friends/reject/{sender}', [AuthController::class, 'apiRejectRequest']);
Route::delete('/friends/cancel/{receiver}', [AuthController::class, 'apiCancelRequest']);

/*
|--------------------------------------------------------------------------
| Faltan
|--------------------------------------------------------------------------
*/


// Recuperar calendario y mostrarlo
// Listar calendarios usuario
// Editar y actualizar calendario
// Eliminar calendario
// Generador de PDF actividad y calendario
// Ruta para enviar formulario de contacto

// Enviar petión amistad
// Cancelar envio de petición
// Aceptar petición
// Rechazar petición
// Mostrar perfil de un usuario
// Eliminar amistad

// Clonar actividad

// Enviar para revisión
// Cancelar envio de revisión
// Mostrar actividades a revisar
// Aprobar actividad
// Denegar actividad


// Editar perfil usuario
// Eliminar cuenta de usuario