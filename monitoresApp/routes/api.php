<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ScheduleController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Lista de actividades en JSON para ser pedida por React
Route::get('/activities', [ActivityController::class, 'apiIndex']);
// Guardar nuevo calendario desde React
Route::post('/schedules', [ScheduleController::class, 'store']);
