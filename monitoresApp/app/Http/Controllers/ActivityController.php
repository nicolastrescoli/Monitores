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

use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function apiIndex()
    {
        $activities = Activity::where('visibility', 'public')->get();
        return response()->json($activities);
    }

    public function apiActivityDetail(Activity $activity)
    {
        // Cargar las relaciones 'materials' y 'risks' con eager loading
        $activity->load('materials', 'risks');

        $creator = $activity->creator;

        // Pasamos la actividad completa, con las relaciones ya cargadas
        return response()->json([
            'activity' => $activity,
            'materials' => $activity->materials,  // colección de materiales con datos pivote
            'risks' => $activity->risks,          // colección de riesgos
            'creator' => $creator,
        ]);
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

    public function formData()
    {
        // Limitar actividades favoritas
        // if (auth()->user()->favoriteActivities()->count() >= 6) {
        //     return response()->json([
        //         'error' => 'No puedes crear más actividades, ya tienes 6 favoritas.'
        //     ], 403);
        // }

        return response()->json([
            'types' => Type::all(),
            'materials' => Material::all(),
            'risks' => Risk::all(),
        ]);
    }

    public function apiStore(Request $request)
    {
        $mode = $request->input('mode', 'structured');

        if ($mode === 'structured') {

            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'objectives' => 'nullable|string',
                'introduction' => 'nullable|string',
                'description' => 'required|string',
                'conclusion' => 'nullable|string',
                'visibility' => 'in:private,pending,public',
                'type_id' => 'required|exists:types,id',

                // React envía arrays JSON correctos
                'materials' => 'array',
                'materials.*.id' => 'required|integer|exists:materials,id',
                'materials.*.quantity' => 'nullable|integer|min:1',
                'materials.*.notes' => 'nullable|string|max:255',

                'risks' => 'nullable|array',
                'risks.*' => 'integer|exists:risks,id'
            ]);

            $activity = Activity::create($validatedData + ['user_id' => auth()->id()]);

            // === MATERIALS ===
            $materials = $request->input('materials', []);
            $materialPivotData = [];

            foreach ($materials as $m) {
                $materialPivotData[$m['id']] = [
                    'quantity' => $m['quantity'] ?? 1,
                    'notes' => $m['notes'] ?? null,
                ];
            }

            $activity->materials()->attach($materialPivotData);

            // === RISKS ===
            $risks = $request->input('risks', []);
            $activity->risks()->sync($risks);

        } else {
            // FREE MODE
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'type_id' => 'required|exists:types,id',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'description' => 'required|string',
                'visibility' => 'in:private,pending,public',
            ]);

            $activity = Activity::create([
                ...$validatedData,
                'user_id' => auth()->id(),
                'objectives' => null,
                'introduction' => null,
                'conclusion' => null,
            ]);
        }

        // === FAVORITOS ===
        auth()->user()->favoriteActivities()->attach($activity->id);

        return response()->json([
            'message' => 'Actividad creada exitosamente.',
            'activity' => $activity
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $mode = $request->input('mode', 'structured');

        if ($mode === 'structured') {
            // Validar y guardar datos del formulario estructurado
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
                'materials' => 'array',
                'materials.*.id' => 'required|integer|exists:materials,id',
                'materials.*.quantity' => 'nullable|integer',
                'materials.*.notes' => 'nullable|string|max:255',
                'risks' => 'nullable|array',
                'risks.*' => 'integer|exists:risks,id', // Si tienes tabla risks
            ]);

            $activity = Activity::create($validatedData + ['user_id' => auth()->id()]);

            // Guardar materiales (pivote con quantity y notes)
            $materials = $request->input('materials', []);
            $materialData = [];

            foreach ($materials as $material) {
                if (isset($material['id']) && is_numeric($material['id']) && $material['id'] > 0) {
                    $materialData[(int)$material['id']] = [
                        'quantity' => $material['quantity'] ?? 1,
                        'notes' => $material['notes'] ?? null,
                    ];
                }
            }

            $activity->materials()->attach($materialData);

            // Guardar riesgos
            $risks = array_filter($request->input('risks', []));
            $activity->risks()->sync($risks);

        } else {
            // Validar todos los campos que envía el formulario libre
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'type_id' => 'required|exists:types,id',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'description' => 'required|string',
                'visibility' => 'in:private,pending,public', // si está en el formulario
            ]);

            // Crear la actividad con user_id y los campos validados
            $activity = new Activity();
            $activity->user_id = auth()->id();
            $activity->title = $validatedData['title'];
            $activity->type_id = $validatedData['type_id'];
            $activity->num_participants = $validatedData['num_participants'];
            $activity->min_age = $validatedData['min_age'];
            $activity->max_age = $validatedData['max_age'];
            $activity->duration = $validatedData['duration'];
            $activity->description = $validatedData['description'];

            $activity->objectives = null;
            $activity->introduction = null;
            $activity->conclusion = null;

            $activity->save();
        }

        // Agregar la actividad a favoritos del usuario
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


    public function apiUpdate(Request $request, Activity $activity)
    {
        $mode = $request->input('mode', 'structured');

        if ($mode === 'structured') {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'objectives' => 'nullable|string',
                'introduction' => 'nullable|string',
                'description' => 'required|string',
                'conclusion' => 'nullable|string',
                'visibility' => 'in:private,pending,public',
                'type_id' => 'required|exists:types,id',

                // Otros campos...
                'materials' => 'nullable|array',
                'materials.*.id' => 'nullable|integer|exists:materials,id',
                'materials.*.quantity' => 'nullable|integer',
                'materials.*.notes' => 'nullable|string|max:255',
                'risks' => 'nullable|array',
                'risks.*' => 'nullable|integer|exists:risks,id', // Si tienes tabla risks
            ]);

            $activity->update($validatedData);

            // Actualizar materiales
            $materials = $request->input('materials', []);
            $materialData = [];

            foreach ($materials as $material) {
                if (isset($material['id']) && is_numeric($material['id']) && $material['id'] > 0) {
                    $materialData[(int)$material['id']] = [
                        'quantity' => $material['quantity'] ?? 1,
                        'notes' => $material['notes'] ?? null,
                    ];
                }
            }

            $activity->materials()->sync($materialData);

            // Actualizar riesgos
            $risks = array_filter($request->input('risks', []));
            $activity->risks()->sync($risks);

        } else {
            // Modo libre
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'type_id' => 'required|exists:types,id',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'description' => 'required|string',
                'visibility' => 'in:private,pending,public',
            ]);

            $activity->update([
                'title' => $validatedData['title'],
                'type_id' => $validatedData['type_id'],
                'num_participants' => $validatedData['num_participants'],
                'min_age' => $validatedData['min_age'],
                'max_age' => $validatedData['max_age'],
                'duration' => $validatedData['duration'],
                'description' => $validatedData['description'],
                'objectives' => $activity->objectives ?? null,
                'introduction' => $activity->introduction ?? null,
                'conclusion' => $activity->conclusion ?? null,
            ]);

            // // Quitar materiales y riesgos si existían antes
            // $activity->materials()->detach();
            // $activity->risks()->detach();
        }

        return response()->json([
            'message' => 'Actividad creada exitosamente.',
            'activity' => $activity
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
    {
        $mode = $request->input('mode', 'structured');

        if ($mode === 'structured') {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'objectives' => 'nullable|string',
                'introduction' => 'nullable|string',
                'description' => 'required|string',
                'conclusion' => 'nullable|string',
                'visibility' => 'in:private,pending,public',
                'type_id' => 'required|exists:types,id',

                // Otros campos...
                'materials' => 'nullable|array',
                'materials.*.id' => 'nullable|integer|exists:materials,id',
                'materials.*.quantity' => 'nullable|integer',
                'materials.*.notes' => 'nullable|string|max:255',
                'risks' => 'nullable|array',
                'risks.*' => 'nullable|integer|exists:risks,id', // Si tienes tabla risks
            ]);

            $activity->update($validatedData);

            // Actualizar materiales
            $materials = $request->input('materials', []);
            $materialData = [];

            foreach ($materials as $material) {
                if (isset($material['id']) && is_numeric($material['id']) && $material['id'] > 0) {
                    $materialData[(int)$material['id']] = [
                        'quantity' => $material['quantity'] ?? 1,
                        'notes' => $material['notes'] ?? null,
                    ];
                }
            }

            $activity->materials()->sync($materialData);

            // Actualizar riesgos
            $risks = array_filter($request->input('risks', []));
            $activity->risks()->sync($risks);

        } else {
            // Modo libre
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'type_id' => 'required|exists:types,id',
                'num_participants' => 'required|integer|min:1',
                'min_age' => 'required|integer|min:0',
                'max_age' => 'required|integer|min:0',
                'duration' => 'required|integer|min:1',
                'description' => 'required|string',
                'visibility' => 'in:private,pending,public',
            ]);

            $activity->update([
                'title' => $validatedData['title'],
                'type_id' => $validatedData['type_id'],
                'num_participants' => $validatedData['num_participants'],
                'min_age' => $validatedData['min_age'],
                'max_age' => $validatedData['max_age'],
                'duration' => $validatedData['duration'],
                'description' => $validatedData['description'],
                'objectives' => $activity->objectives ?? null,
                'introduction' => $activity->introduction ?? null,
                'conclusion' => $activity->conclusion ?? null,
            ]);

            // // Quitar materiales y riesgos si existían antes
            // $activity->materials()->detach();
            // $activity->risks()->detach();
        }

        return redirect()->route('profile.show')->with('success', 'Actividad actualizada exitosamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
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

    /**
     * Remove the specified resource from storage.
     */
    public function apiDestroy(Activity $activity)
    {
        $user = auth()->user();

        // Verifica si el usuario es el creador de la actividad
        if ($user->id !== $activity->user_id) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar esta actividad.'
            ], 403); // Forbidden
        }

        // Elimina la actividad
        $activity->delete();

        return response()->json([
            'message' => 'Actividad eliminada exitosamente.'
        ], 200);
    }

    public function clone(Activity $activity)
    {
        $user = auth()->user();
        $types = Type::all();
        $materials = Material::all();
        $risks = Risk::all();

        // Crear una nueva instancia de la actividad sin guardarla
        $clonedActivity = Activity::make([
            'title' => $activity->title,
            'num_participants' => $activity->num_participants,
            'min_age' => $activity->min_age,
            'max_age' => $activity->max_age,
            'duration' => $activity->duration,
            'objectives' => $activity->objectives,
            'introduction' => $activity->introduction,
            'description' => $activity->description,
            'conclusion' => $activity->conclusion,
            'type_id' => $activity->type_id,
            'visibility' => 'private',
            'original_activity_id' => $activity->id,
        ]);

        // Preparar los materiales con sus datos pivot (quantity y notes)
        $selectedMaterials = [];
        foreach ($activity->materials as $material) {
            $selectedMaterials[$material->id] = [
                'quantity' => $material->pivot->quantity,
                'notes' => $material->pivot->notes,
            ];
        }

        // Preparar los riesgos seleccionados
        $selectedRiskIds = $activity->risks->pluck('id')->toArray();

        return view('activities.create', [
            'activity' => $clonedActivity,
            'user' => $user,
            'types' => $types,
            'materials' => $materials,
            'risks' => $risks,
        ])
        ->withInput([
            'materials' => $activity->materials->map(fn($material) => [
                'id' => $material->id,
                'quantity' => $material->pivot->quantity,
                'notes' => $material->pivot->notes,
            ])->toArray(),
            'risks' => $activity->risks->pluck('id')->toArray(),
        ]);
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

    public function apiToggleFavorite(Activity $activity)
    {
        $user = auth()->user();
        $added = false;

        if ($user->favoriteActivities()->where('activity_id', $activity->id)->exists()) {
            $user->favoriteActivities()->detach($activity->id);
        } else {
            $user->favoriteActivities()->attach($activity->id);
            $added = true;
        }

        return response()->json([
            'success' => true,
            'added' => $added,
            'activity_id' => $activity->id
        ]);
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

    public function apiSubmitPublic(Request $request, Activity $activity)
    {
        if (!$activity) {
            return response()->json(['message' => 'Actividad no encontrada.']);
        }

        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->id !== $activity->user_id) {
            return response()->json(['message' => 'No tienes permiso para públicar esta actividad.']);
        }

        $activity->visibility = 'pending'; // Cambia a 'pending' para revisión
        $activity->save();

        return response()->json(['message' => 'Actividad enviada para revisar.']);
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

    public function apiCancelSubmission(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->id !== $activity->user_id) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para cancelar la publicación de esta actividad.']);
        }

        $activity->visibility = 'private'; // Cambia a 'private'
        $activity->save();

        return response()->json(['message' => 'Actividad retirada de revisión.']);
    }

    public function pending()
    {
        $activities = Activity::where('visibility', 'pending')->with('creator')->get();
        return view('admin.activities_pending', compact('activities'));
    }

    public function apiPending()
    {
        $activities = Activity::where('visibility', 'pending')->with('creator')->get();
        return response()->json(['activities' => $activities]);
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

    public function apiSetPublic(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'No tienes permiso para hacer pública esta actividad.']);
        }

        $activity->visibility = 'public';
        $activity->save();

        return response()->json(['message' => 'Actividad publicada exitosamente.']);
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

    public function apiRejectPublic(Request $request, Activity $activity)
    {
        // Verifica si el usuario es el creador de la actividad
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'No tienes permiso para denegar la publicación de esta actividad.']);
        }

        $activity->visibility = 'private'; // Cambia a 'private'
        $activity->save();

        return response()->json(['message' =>  'Actividad denegada exitosamente.']);
    }

    public function generatePdf(Activity $activity)
    {
        $data = [
            'title' => $activity->title,
            'num_participants' => $activity->num_participants,
            'min_age' => $activity->min_age,
            'max_age' => $activity->max_age,
            'duration' => $activity->duration,
            'objectives' => $activity->objectives,
            'introduction' => $activity->introduction,
            'description' => $activity->description,
            'conclusion' => $activity->conclusion,
            'visibility' => $activity->visibility,
            'type' => $activity->type ? $activity->type->name : null,
            'creator' => $activity->creator ? $activity->creator->name : null,
            'materials' => $activity->materials->map(function ($material) {
                return [
                    'name' => $material->name,
                    'quantity' => $material->pivot->quantity,
                    'notes' => $material->pivot->notes,
                ];
            })->toArray(),
            'risks' => $activity->risks->map(function ($risk) {
                return [
                    'name' => $risk->name,
                    'description' => $risk->description,
                ];
            })->toArray(),
        ];

        $pdf = Pdf::loadView('pdf.plantillaActivity', $data);

        // return $pdf->stream('archivo.pdf');
        return $pdf->download('ejemplo.pdf'); // para forzar descarga
    }

    public function topFavorites()
    {
        $topActivities = DB::table('activity_user')
            ->select('activity_id', DB::raw('COUNT(*) as favorites_count'))
            ->groupBy('activity_id')
            ->orderByDesc('favorites_count')
            ->take(5)
            ->get();

        return response()->json([
            'top_favorites' => $topActivities
        ]);
    }


}
