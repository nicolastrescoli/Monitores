<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activities = Activity::where('is_public', true)->get();
        return view('activities.index', compact('activities'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $types = \App\Models\Type::all();

        if (Auth::user()->favoriteActivities()->count() >= 6) {
            return redirect()->route('profile.show')->withErrors(['error' => 'No puedes crear más actividades, ya tienes 5 favoritas.']);
        }

        return view('activities.create', compact('types'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'num_participants' => 'required|integer|min:1',
            'min_age' => 'required|integer|min:0',
            'max_age' => 'required|integer|min:0',
            'duration' => 'required|integer|min:1',
            'objectives' => 'required|string',
            'introduction' => 'required|string',
            'description' => 'required|string',
            'conclusion' => 'required|string',
            'is_public' => 'boolean',
            'type_id' => 'required|exists:types,id', // Asegúrate de que el tipo exista
        ]);

        $activity = Activity::create($validatedData + ['user_id' => auth()->id()]);

        auth()->user()->favoriteActivities()->attach($activity->id);

        return redirect()->route('profile.show')->with('success', 'Actividad creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        return view('activities.show', compact('activity'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(activity $activity)
    {
        $user = auth()->user();

        // Verifica si el usuario es el creador de la actividad
        if ($user->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para editar esta actividad.']);
        }

        $types = \App\Models\Type::all(); // Asegúrate de que el modelo Type exista
        return view('activities.edit', compact('activity', 'types'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, activity $activity)
    {
        $user = auth()->user();

        // Verifica si el usuario es el creador de la actividad
        if ($user->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para actualizar esta actividad.']);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'num_participants' => 'required|integer|min:1',
            'min_age' => 'required|integer|min:0',
            'max_age' => 'required|integer|min:0',
            'duration' => 'required|integer|min:1',
            'objectives' => 'required|string',
            'introduction' => 'required|string',
            'description' => 'required|string',
            'conclusion' => 'required|string',
            'is_public' => 'boolean',
            'type_id' => 'required|exists:types,id', // Asegúrate de que el tipo exista
        ]);

        $activity->update($validatedData);

        return redirect()->route('profile.show')->with('success', 'Actividad actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(activity $activity)
    {
        $user = auth()->user();

        // Verifica si el usuario es el creador de la actividad
        if ($user->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para eliminar esta actividad.']);
        }

        // Elimina la actividad
        $activity->delete();

        return redirect()->route('profile.show')->with('success', 'Actividad eliminada exitosamente.');
    }

    public function toggleFavorite(Activity $activity)
    {
        $user = auth()->user();

        if ($user->favoriteActivities()->where('activity_id', $activity->id)->exists()) {
            $user->favoriteActivities()->detach($activity->id);
        } else {
            $user->favoriteActivities()->attach($activity->id);
        }

        return redirect()->back()->with('success', 'Favorito actualizado.');
    }

    public function createFromExistent(Request $request)
    {
        //
    }

}
