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

// Enviar para revisión
Route::middleware('auth:sanctum')->put('/activities/submit/{activity}', [ActivityController::class,'apiSubmitPublic']);
// Cancelar envio para revisión
Route::middleware('auth:sanctum')->put('/activities/unsubmit/{activity}', [ActivityController::class,'apiCancelSubmission']);

/*
|--------------------------------------------------------------------------
| Tareas admin
|--------------------------------------------------------------------------
*/
// Panel de revisión
Route::middleware('auth:sanctum')->get('/admin/activities/pending', [ActivityController::class,'apiPending']);
Route::middleware('auth:sanctum')->put('/admin/approve/{activity}', [ActivityController::class,'apiSetPublic']);
Route::middleware('auth:sanctum')->put('/admin/reject/{activity}', [ActivityController::class,'apiRejectPublic']);

/*
|--------------------------------------------------------------------------
| CRUD Schedules
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/schedule/{schedule}', [ScheduleController::class, 'scheduleDetail']);
Route::middleware('auth:sanctum')->post('/schedule/store', [ScheduleController::class, 'store']);
Route::middleware('auth:sanctum')->put('/schedule/{schedule}', [ScheduleController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/schedule/{schedule}', [ScheduleController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Usuarios y Social
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/users', [AuthController::class, 'apiIndex']);
// Gestión de peticiones de amistad
Route::middleware('auth:sanctum')->post('/friends/request/{receiver}', [AuthController::class, 'apiSendRequest']);
Route::middleware('auth:sanctum')->post('/friends/accept/{sender}', [AuthController::class, 'apiAcceptRequest']);
Route::middleware('auth:sanctum')->delete('/friends/reject/{sender}', [AuthController::class, 'apiRejectRequest']);
Route::middleware('auth:sanctum')->delete('/friends/cancel/{receiver}', [AuthController::class, 'apiCancelRequest']);
Route::middleware('auth:sanctum')->delete('/friends/remove/{user}', [AuthController::class, 'apiRemoveFriend']);

/*
|--------------------------------------------------------------------------
| Faltan
|--------------------------------------------------------------------------
*/

// Listar calendarios usuario
// Clonar calendario

// Generador de PDF actividad y calendario
// Ruta para enviar formulario de contacto

// Guardar actividad como favorito
// Clonar actividad

// Editar perfil usuario
// Eliminar cuenta de usuario

// Actividades más guardadas
// Usuarios con más actividades publicadas

// ------------------------


// ACTUALIZAR CON STATES
// Enviar petión amistad
// Cancelar envio de petición
// Aceptar petición
// Rechazar petición
// Eliminar amistad


// STATES para los filtros y actividad alatoria
// Novedades otros usuarios