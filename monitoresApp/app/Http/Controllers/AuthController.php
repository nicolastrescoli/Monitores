<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;
use App\Models\Schedule;

class AuthController extends Controller
{

    public function apiRegister(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json(['message' => 'Usuario registrado', 'user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed', 
            'url_image' => 'sometimes|string|nullable'
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['description'])) {
            $user->description = $validated['description'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        // Actualizar contraseña (si se envía)
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if (array_key_exists('url_image', $validated)) {
            $user->url_image = $validated['url_image'];
        }

        // // Subir imagen si viene en el request Storage público configurado (php artisan storage:link)
        // if ($request->hasFile('url_image')) {

        //     // Eliminar la imagen anterior si existe
        //     if ($user->url_image && Storage::disk('public')->exists($user->url_image)) {
        //         Storage::disk('public')->delete($user->url_image);
        //     }

        //     // Guardar archivo nuevo
        //     $path = $request->file('url_image')->store('users', 'public');

        //     // Guardar ruta en DB
        //     $user->url_image = $path; // ejemplo: users/3kd829d.png
        // }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado exitosamente.',
            'user' => $user
        ]);
    }

    public function apiLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function apiLogout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function apiShow(Request $request, User $user = null)
    {
        // Si no se pasa usuario, usamos el autenticado
        $user = $user ?? Auth::user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Actividades del usuario mostrado
        // $favoriteActivities = Activity::where('user_id', $user->id)->get();
        $favoriteActivities = $user->favoriteActivities()->get();

        // Schedules del usuario mostrado
        $schedules = Schedule::where('user_id', $user->id)->get();

        // Solo si es mi perfil
        if ($user->id === Auth::id()) {
            // $favoriteActivities = $user->favoriteActivities()->get(); // Actividades favoritas
            $user->load(['sentFriendRequests', 'receivedFriendRequests']);// Cargar relaciones necesarias
            $user->contacts = $user->allFriends(); // Contactos
        }

        // Adjuntamos las favoritas y contactos al objeto user
        $user->favoriteActivities = $favoriteActivities;
        $user->schedules = $schedules;

        return response()->json([
            'user' => $user,
            // 'activities' => $activities,
            // 'favoriteActivities' => $favoriteActivities ?? $activities,
            // 'schedules' => $schedules,
            // 'contacts' => $contacts ?? null,
        ]);
    }

    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            return redirect('');
        }

        return redirect()->back()->withErrors(['email' => 'Credenciales inválidas.']);
    }

    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,organization',
        ]);

        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'role' => $validatedData['role'],
        ]);

        return redirect('/')->withSuccess('Registro exitoso');
    }

    public function show(User $user)
    {
        $user = Auth::user();
        $activities = Activity::where('user_id', $user->id)->get();
        $favorites = $user->favoredActivities()->with('creator')->get();
        $schedules = $user->schedules()->with('activities')->get();

        // Carga explícitamente las relaciones
        $user->load(['sentFriendRequests', 'receivedFriendRequests']);

        // Une y elimina duplicados
        $contacts = $user->sentFriendRequests->merge($user->receivedFriendRequests)->unique('id');

        return view('profile.show', ['user' => $user, 'activities' => $activities, 'favorites' => $favorites, 'schedules' => $schedules, 'contacts' => $contacts,]);
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('activities.index');
    }

    // -------------------------
    // Relaciones de comunidad
    // -------------------------

    public function sendRequest(User $receiver)
    {
        $sender = auth()->user();

        if ($sender->id === $receiver->id) return back()->with('error', 'No puedes agregarte a ti mismo.');
        if ($sender->sentFriendRequests()->where('friend_id', $receiver->id)->exists()) {
            return back()->with('error', 'Solicitud ya enviada.');
        }

        $sender->friends()->attach($receiver->id, ['status' => 'pending']);
        return back()->with('success', 'Solicitud enviada.');
    }

    public function apiSendRequest(User $receiver)
    {
        $sender = auth()->user();

        // if ($sender->id === $receiver->id) return back()->with('error', 'No puedes agregarte a ti mismo.');
        // if ($sender->sentFriendRequests()->where('friend_id', $receiver->id)->exists()) {
        //     return back()->with('error', 'Solicitud ya enviada.');
        // }

        $sender->friends()->attach($receiver->id, ['status' => 'pending']);
        return response()->json(['message' => 'Solicitud enviada']);
    }

    public function acceptRequest(User $sender)
    {
        $receiver = auth()->user();
        $receiver->friendOf()->updateExistingPivot($sender->id, ['status' => 'accepted']);
        return back()->with('success', 'Solicitud aceptada.');
    }

    public function apiAcceptRequest(User $sender)
    {
        $receiver = auth()->user();
        $receiver->friendOf()->updateExistingPivot($sender->id, ['status' => 'accepted']);
        return response()->json(['message' => 'Solicitud aceptada']);
    }

    public function rejectRequest(User $sender)
    {
        $receiver = auth()->user();
        $receiver->friendOf()->detach($sender->id);
        return back()->with('success', 'Solicitud rechazada.');
    }

    public function apiRejectRequest(User $sender)
    {
        $receiver = auth()->user();
        $receiver->friendOf()->detach($sender->id);
        return response()->json(['message' => 'Solicitud rechazada']);
    }

    public function cancelRequest(User $receiver)
    {
        $sender = auth()->user();
        $sender->friends()->detach($receiver->id);
        return back()->with('success', 'Solicitud de amistad cancelada.');
    }

    public function apiCancelRequest(User $receiver)
    {
        $sender = auth()->user();
        $sender->friends()->detach($receiver->id);
        return response()->json(['message' => 'Solicitud cancelada']);
    }

    // Eliminar amistad
    public function removeFriend(User $user)
    {
        $authUser = auth()->user();

        // Eliminar si el usuario autenticado envió la solicitud
        if ($authUser->friends()->where('friend_id', $user->id)->exists()) {
            $authUser->friends()->detach($user->id);
            return redirect('profile.show')->with('success', 'Amistad eliminada.');
        }

        // Eliminar si el otro usuario envió la solicitud
        if ($authUser->friendOf()->where('user_id', $user->id)->exists()) {
            $authUser->friendOf()->detach($user->id);
            return redirect('profile.show')->with('success', 'Amistad eliminada.');
        }

        return back()->with('error', 'No tienes una amistad con este usuario.');
    }

    public function apiRemoveFriend(User $user)
    {
        $authUser = auth()->user();

        // Eliminar si el usuario autenticado envió la solicitud
        if ($authUser->friends()->where('friend_id', $user->id)->exists()) {
            $authUser->friends()->detach($user->id);
            return response()->json(['message' => 'Amistad eliminada.']);
        }

        // Eliminar si el otro usuario envió la solicitud
        if ($authUser->friendOf()->where('user_id', $user->id)->exists()) {
            $authUser->friendOf()->detach($user->id);
            return response()->json(['message' => 'Amistad eliminada.']);
        }

        return response()->json(['error' => 'No tienes una amistad con este usuario.']);
    }

    // Mostrar la comunidad y el perfil de los usuarios/comunidad
    public function index()
    {
        $users = User::where('id', '!=', auth()->id())->get();
        return view('community.index', compact('users'));
    }

    // Mostrar la comunidad y el perfil de los usuarios/comunidad
    public function apiIndex()
    {
        $users = User::where('id', '!=', auth()->id())
            ->get()
            ->map(function ($user) {
                $user->friend_status = auth()->user()->friendStatusWith($user);
                return $user;
            });

        return response()->json([
            'users' => $users
        ]);
    }

    public function showUser(User $user)
    {
        // Carga explícitamente las relaciones
        $user->load(['sentFriendRequests', 'receivedFriendRequests']);
        $activities = Activity::where('user_id', $user->id)->get();

        // Une y elimina duplicados
        $contacts = $user->sentFriendRequests->merge($user->receivedFriendRequests)->unique('id');

        return view('profile.show', ['user' => $user, 'activities' => $activities, 'contacts' => $contacts,]);
    }

    public function destroy(User $user)
    {
        $currentUser = Auth::user();

        // Solo el propio usuario o un admin puede eliminar
        if ($currentUser->id !== $user->id && !$currentUser->is_admin) {
            return response()->json([
                'message' => 'No tienes permisos para eliminar este usuario.'
            ], 403);
        }

        try {
            $user->delete();
            return response()->json([
                'message' => 'Usuario eliminado correctamente.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el usuario.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
