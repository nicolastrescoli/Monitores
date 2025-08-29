<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScheduleController;


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

/*
|--------------------------------------------------------------------------
| Peticiones de amistad y comunidad
|--------------------------------------------------------------------------
*/
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
    Route::post('/activities/{activity}/clone', 'clone')->name('activities.clone');
    Route::post('/activities', 'store')->name('activities.store');
    Route::put('/activities/{activity}', 'update')->name('activities.update');
    Route::delete('/activities/delete/{activity}', 'destroy')->name('activities.destroy');
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

/*
|--------------------------------------------------------------------------
| Generador de PDF
|--------------------------------------------------------------------------
*/
Route::get('/{activity}/pdf', [ActivityController::class, 'generatePdf'])->name('activity.pdf');

/*
|--------------------------------------------------------------------------
| Programador de calendario
|--------------------------------------------------------------------------
*/

// Uso de Blade (sin React) -- versión anterior
Route::post('/schedule/store', [ScheduleController::class, 'store'])->name('schedule.store');
Route::post('/schedule/{schedule}/edit', [ScheduleController::class, 'edit'])->name('schedule.edit');
Route::post('/schedules/{schedule}/rename', [ScheduleController::class, 'rename'])->name('schedule.rename');
// Route::get('/schedule/{schedule}', [ScheduleController::class, 'show'])->name('schedule.show');

Route::post('/calendar/assign', [ScheduleController::class, 'assign'])
    ->name('calendar.assign');
Route::delete('/calendar/unassign', [ScheduleController::class, 'unassign'])->name('calendar.unassign');

// Uso de React para el programador

Route::get('/schedule/create', [ScheduleController::class, 'create'])
->name('schedule.create'); // Redirige a la aplicación React

// Rutas bajo el middleware 'api'
Route::middleware('api')->group(function () {

    Route::get('/api/activities', [ActivityController::class, 'apiIndex']); // Lista de actividades en JSON para ser pedida por React

    // Route::post('/schedules', [ScheduleController::class, 'store']);

});