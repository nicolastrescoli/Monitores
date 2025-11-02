<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AuthController;

// Lista de actividades en JSON para ser pedida por React
Route::get('/activities', [ActivityController::class, 'apiIndex']);
// Detalle de actividad
Route::get('/activities/{activity}', [ActivityController::class, 'apiActivityDetail']);

Route::post('/login', [AuthController::class, 'apiLogin']);
Route::post('/logout', [AuthController::class, 'apiLogout']);
Route::post('/register', [AuthController::class, 'apiRegister']);
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'apiShow']);


// Guardar nuevo calendario desde React
Route::post('/schedules', [ScheduleController::class, 'store']);