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
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'apiShow']);

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
Route::middleware('auth:sanctum')->delete('/activities/delete/{activity}', [ActivityController::class, 'apiDestroy']);
Route::middleware('auth:sanctum')->post('/activities/{activity}/favorite', [ActivityController::class, 'apiToggleFavorite']);

/*
|--------------------------------------------------------------------------
| CRUD Schedules
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->post('/schedules', [ScheduleController::class, 'store']);


/*
|--------------------------------------------------------------------------
| Faltan
|--------------------------------------------------------------------------
*/


// Recuperar calendario y mostrarlo
// Editar y actualizar calendario
// Eliminar calendario
// Generador de PDF actividad y calendario
// Ruta para enviar formulario de contacto

// Enviar petión amistad
// Cancelar envio de petición
// Aceptar petición
// Rechazar petición
// Mostrar usuarios de la comunidad
// Mostrar perfil de un usuario
// Eliminar amistad

// Recuperar actividad para edición y actualización
// Clonar actividad

// Enviar para revisión
// Cancelar envio de revisión
// Mostrar actividades a revisar
// Aprobar actividad
// Denegar actividad
