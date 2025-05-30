<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use App\Models\Type;
use App\Models\Material;
use App\Models\Risk;
use App\Models\AlternativeName;
use App\Models\Media;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activities = Activity::where('visibility', 'public')->get();
        return view('activities.index', compact('activities'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $types = Type::all();
        $materials = Material::all();
        $risks = Risk::all();

        if (Auth::user()->favoriteActivities()->count() >= 6) {
            return redirect()->route('profile.show')->withErrors(['error' => 'No puedes crear más actividades, ya tienes 5 favoritas.']);
        }

        return view('activities.create', [
            'types' => $types,
            'materials' => $materials,
            'risks' => $risks,
        ]);
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
            'visibility' => 'in:private,pending,public',
            'type_id' => 'required|exists:types,id',

            // Otros campos...
            'materials' => 'required|array|min:1',
            'materials.*.id' => 'required|integer|exists:materials,id',
            'materials.*.quantity' => 'nullable|integer|min:1',
            'materials.*.notes' => 'nullable|string|max:255',
        ]);

        $activity = Activity::create($validatedData + ['user_id' => auth()->id()]);

        // Guardar materiales (pivote con quantity y notes)
        // Recoger el array completo con id, quantity y notes
        $materials = $request->input('materials', []);

        $materialData = [];

        foreach ($materials as $material) {
            if (isset($material['id']) && is_numeric($material['id']) && $material['id'] > 0) {
                $materialData[(int)$material['id']] = [
                    'quantity' => $material['quantity'] ?? null,
                    'notes' => $material['notes'] ?? null,
                ];
            }
        }

        $activity->materials()->attach($materialData);

        $risks = array_filter($request->input('risks', []));
        $activity->risks()->sync($risks);

        auth()->user()->favoriteActivities()->attach($activity->id);
        
        return redirect()->route('profile.show')->with('success', 'Actividad creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        // Cargar las relaciones 'materials' y 'risks' con eager loading
        $activity->load('materials', 'risks');

        $creator = $activity->creator;

        // Pasamos la actividad completa, con las relaciones ya cargadas
        return view('activities.show', [
            'activity' => $activity,
            'materials' => $activity->materials,  // colección de materiales con datos pivote
            'risks' => $activity->risks,          // colección de riesgos
            'creator' => $creator,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(activity $activity)
    {
        $user = auth()->user();
        $types = Type::all();
        $materials = Material::all();
        $risks = Risk::all();

        // Verifica si el usuario es el creador de la actividad
        if ($user->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para editar esta actividad.']);
        }

        return view('activities.edit', [
            'activity' => $activity,
            'types' => $types,
            'materials' => $materials,
            'risks' => $risks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
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
            'visibility' => 'in:private,pending,public',
            'type_id' => 'required|exists:types,id',

            // Otros campos...
            'materials' => 'required|array|min:1',
            'materials.*.id' => 'required|integer|exists:materials,id',
            'materials.*.quantity' => 'nullable|integer|min:1',
            'materials.*.notes' => 'nullable|string|max:255',
        ]);

        $activity->update($validatedData);

        // Actualizar materiales: sincronizar tabla pivote con quantity y notes
        $materials = $request->input('materials', []);
        $materialData = [];

        foreach ($materials as $material) {
            if (isset($material['id']) && is_numeric($material['id']) && $material['id'] > 0) {
                $materialData[(int)$material['id']] = [
                    'quantity' => $material['quantity'] ?? null,
                    'notes' => $material['notes'] ?? null,
                ];
            }
        }

        $activity->materials()->sync($materialData);

        // Sincronizar riesgos
        $risks = array_filter($request->input('risks', []));
        $activity->risks()->sync($risks);

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

    public function submitPublic(Request $request, Activity $activity)
    {
        if (!$activity) {
            return redirect()->back()->withErrors(['error' => 'Actividad no encontrada.']);
        }

        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para públicar esta actividad.']);
        }

        $activity->visibility = 'pending'; // Cambia a 'pending' para revisión
        $activity->save();

        return redirect()->route('profile.show')->with('success', 'Actividad enviada para revisar.');
    }

    public function cancelSubmission(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para cancelar la publicación de esta actividad.']);
        }

        $activity->visibility = 'private'; // Cambia a 'private'
        $activity->save();

        return redirect()->route('profile.show')->with('success', 'Actividad retirada de revisión.');
    }

    public function pending()
    {
        $activities = Activity::where('visibility', 'pending')->with('creator')->get();
        return view('admin.activities_pending', compact('activities'));
    }


    public function setPublic(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para hacer pública esta actividad.']);
        }

        $activity->visibility = 'public'; // Cambia a 'public'
        $activity->save();

        return redirect()->route('profile.show')->with('success', 'Actividad publicada exitosamente.');
    }

    public function rejectPublic(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para denegar la publicación de esta actividad.']);
        }

        $activity->visibility = 'private'; // Cambia a 'private'
        $activity->save();

        return redirect()->route('profile.show')->with('success', 'Actividad denegada exitosamente.');
    }

}
