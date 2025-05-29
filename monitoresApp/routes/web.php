<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Autenticación
|--------------------------------------------------------------------------
*/
Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'showLoginForm')->name('login');
    Route::post('/login', 'login')->name('login.submit');
    Route::get('/logout', 'logout')->name('logout');
    Route::get('/register', 'showRegistrationForm')->name('register');
    Route::post('/register', 'register')->name('register.submit');
    Route::get('/profile', 'show')->name('profile.show');
});

/*
|--------------------------------------------------------------------------
| Actividades con autenticación
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->controller(ActivityController::class)->group(function () {
    Route::get('/activities/create', 'create')->name('activities.create');
    Route::get('/activities/{activity}/edit', 'edit')->name('activities.edit');
    Route::post('/activities', 'store')->name('activities.store');
    Route::put('/activities/{activity}', 'update')->name('activities.update');
    Route::post('/activities/delete/{activity}', 'destroy')->name('activities.destroy');
    Route::post('/activities/{activity}/favorite', 'toggleFavorite')->name('activities.favorite');

});

/*
|--------------------------------------------------------------------------
| Actividades sin autenticación
|--------------------------------------------------------------------------
*/
Route::get('/', [ActivityController::class, 'index'])->name('activities.index');
Route::get('/activities/{activity}', [ActivityController::class, 'show'])->name('activities.show');

/*
|--------------------------------------------------------------------------
| Información estática
|--------------------------------------------------------------------------
*/
Route::view('/about', 'info.about')->name('info.about');
Route::view('/contact', 'info.contact')->name('info.contact');
Route::post('/contact', function () {
    // Procesar envío de contacto
    return back()->with('success', 'Mensaje enviado correctamente.');
})->name('contact.send');
