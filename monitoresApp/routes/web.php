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
    // Rutas de autenticación
    Route::get('/login', 'showLoginForm')->name('login');
    Route::post('/login', 'login')->name('login.submit');
    Route::get('/logout', 'logout')->name('logout');
    Route::get('/register', 'showRegistrationForm')->name('register');
    Route::post('/register', 'register')->name('register.submit');
    Route::get('/profile', 'show')->name('profile.show');
});

Route::controller(AuthController::class)->group(function () {
    // Rutas de gestión de peticiones de amistad
    Route::post('/friends/request/{receiver}', 'sendRequest')->name('friends.request');
    Route::post('/friends/accept/{sender}', 'acceptRequest')->name('friends.accept');
    Route::delete('/friends/reject/{sender}', 'rejectRequest')->name('friends.reject');
    Route::delete('/friends/cancel/{receiver}', 'cancelRequest')->name('friends.cancel');


    // Rutas para ver la comunidad
    Route::get('/community', 'index')->name('community.index');
    Route::get('/community/{user}', 'showUser')->name('community.show');

    //Ruta para eliminar amistad
    Route::delete('/friends/remove/{user}', 'removeFriend')->name('friends.remove');
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

    // Enviar para revisión
    Route::post('/activities/{activity}/submit', 'submitPublic')->name('activities.submit');
    // Cancelar envio para revisión
    Route::put('/activities/{activity}/unsubmit', 'cancelSubmission')->name('activities.cancelSubmission');
    // Panel de revisión
    Route::get('/admin/activities/pending','pending')->name('activities.pending');
    // Aprobar publicación
    Route::put('/activities/{activity}/approve', 'setPublic')->name('activities.approve');
    // Denegar publicación
    Route::put('/activities/{activity}/reject', 'rejectPublic')->name('activities.reject');

});

/*
|--------------------------------------------------------------------------
| Actividades sin autenticación
|--------------------------------------------------------------------------
*/

Route::controller(ActivityController::class)->group(function () {
    Route::get('/', 'index')->name('activities.index');
    Route::get('/activities/{activity}', 'show')->name('activities.show');
});


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
