<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;

use Illuminate\Support\Facades\Auth;


Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

// Route::routegroup(['middleware' => 'auth'], function () {
//     Route::get('/dashboard', [ActivityController::class, 'dashboard'])->name('dashboard');
//     Route::get('/activities/create', [ActivityController::class, 'create'])->name('activities.create');
//     Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
//     Route::get('/activities/{activity}/edit', [ActivityController::class, 'edit'])->name('activities.edit');
//     Route::put('/activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');
//     Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');
// });

Route::middleware('auth')->group(function () {
    Route::get('/activities/create', [ActivityController::class, 'create'])->name('activities.create');
    Route::post('/activities', [ActivityController::class, 'store'])->name('activities.store');
});



Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');


Route::get('/profile', [AuthController::class, 'show'])->name('profile.show');


Route::view('/about', 'info.about')->name('info.about');
Route::view('/contact', 'info.contact')->name('info.contact');

Route::post('/contact', function () {
    // Aquí podrías procesar y enviar el mensaje (por email, base de datos, etc.)
    return back()->with('success', 'Mensaje enviado correctamente.');
})->name('contact.send');


Route::post('/activities/{activity}/favorite', [ActivityController::class, 'toggleFavorite'])
    ->middleware('auth')
    ->name('activities.favorite');



