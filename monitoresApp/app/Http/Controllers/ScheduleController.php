<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

use App\Models\Activity;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class ScheduleController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        $schedules = $user->schedules()->get();

        return response()->json([
            'schedules' => $schedules,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (Auth::user()->schedules()->count() > 2) {
            return redirect()->route('profile.show')->withErrors(['error' => 'No puedes crear más programaciones.']);
        }

        return redirect(asset('react/index.html'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Chapuza? Guardar directamente el JSON del CellMap para rápido envio y reconstrucción en React. No se van a hacer muchas consultas tampoco.
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'cell_map' => 'required|array',
        ]);

        $schedule = Schedule::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'user_id' => $user->id,
            'cell_map' => $validated['cell_map'],
        ]);

        return response()->json([
            'message' => 'Horario guardado correctamente',
            'schedule' => $schedule,
        ], 201);        
    }

    public function scheduleDetail(Schedule $schedule)
    {
        // Devolver directamente el cell_map del schedule
        // Suponiendo que cell_map se guarda como JSON en la base de datos
        return response()->json([
            'name' => $schedule->name,
            'description' => $schedule->description,
            'cellMap' => $schedule->cell_map,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule, Request $request)
    {
        // Obtener todas las actividades programadas con fecha y hora
        $scheduled = $schedule->activities()->withPivot(['start_time', 'end_time'])->get();

        // Extraer todos los start_time y end_time de la pivot table
        $startTimes = $scheduled->pluck('pivot.start_time')->filter();
        $endTimes = $scheduled->pluck('pivot.end_time')->filter();

        // Si no hay fechas, mostrar los próximos 7 días por defecto
        if ($startTimes->isEmpty() || $endTimes->isEmpty()) {
            $startDate = Carbon::today();
            $dates = collect(range(0, 6))->map(fn($i) => $startDate->copy()->addDays($i));
        } else {
            $startDate = Carbon::parse($startTimes->min())->startOfDay();
            $endDate = Carbon::parse($endTimes->max())->startOfDay();

            $days = $startDate->diffInDays($endDate) + 1;

            $dates = collect(range(0, $days - 1))->map(fn($i) => $startDate->copy()->addDays($i));
        }

        return view('schedule.show', compact('dates', 'scheduled', 'schedule'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule, Request $request)
    {
        if ($request) {
            
        }

        // Obtener todas las actividades programadas con fecha y hora
        $scheduled = $schedule->activities()->withPivot(['start_time', 'end_time'])->get();

        // Extraer todos los start_time y end_time de la pivot table
        $startTimes = $scheduled->pluck('pivot.start_time')->filter();
        $endTimes = $scheduled->pluck('pivot.end_time')->filter();

        // Si no hay fechas, mostrar los próximos 7 días por defecto
        if ($startTimes->isEmpty() || $endTimes->isEmpty()) {
            $startDate = Carbon::today();
            $dates = collect(range(0, 6))->map(fn($i) => $startDate->copy()->addDays($i));
        } else {
            $startDate = Carbon::parse($startTimes->min())->startOfDay();
            $endDate = Carbon::parse($endTimes->max())->startOfDay();

            $days = (int) $request->input('days', 7);

            $dates = collect(range(0, $days - 1))->map(fn($i) => $startDate->copy()->addDays($i));
        }

        $activities = Activity::all();

        return view('schedule.edit', compact('dates', 'activities', 'scheduled', 'schedule'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'cell_map' => 'required|array',
        ]);

        // Asegurarnos de que el usuario es el propietario
        if ($schedule->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $schedule->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'cell_map' => $validated['cell_map'],
        ]);

        return response()->json([
            'message' => 'Horario actualizado correctamente',
            'schedule' => $schedule,
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        $user = auth()->user();

        // Verifica si el usuario es el creador del schedule
        if ($user->id !== $schedule->user_id) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar esta programación.'
            ], 403); // Forbidden
        }

        // Elimina la actividad
        $schedule->delete();

        return response()->json([
            'message' => 'Programación eliminada exitosamente.'
        ], 200);
    }

    public function assign(Request $request, Schedule $schedule)
    {
        $data = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'required|date_format:Y-m-d',
            'hour' => 'required|integer|min:0|max:23',
        ]);

        try {
            $user = Auth::user();

            // Asegura que la fecha venga en formato correcto
            $start = Carbon::parse($data['date'])->startOfDay()->addHours((int) $data['hour']);
            $end = (clone $start)->addHour();

            dd($data, $schedule);

            // Elimina la actividad anterior (si estaba repetida)
            $schedule->activities()->detach($data['activity_id']);

            // La agrega de nuevo con la hora
            $schedule->activities()->attach($data['activity_id'], [
                'start_time' => $start,
                'end_time' => $end,
            ]);

            return redirect()->back()->with('success', 'Actividad asignada correctamente');
        } catch (\Exception $e) {
            Log::error('Error al asignar actividad: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Hubo un error al asignar la actividad');
        }
    }

    public function unassign(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'hour' => 'required|integer|min:0|max:23',
        ]);

        $user = Auth::user();

        $schedule = Schedule::where('user_id', $user->id)->first();
        if (!$schedule) {
            return back()->withErrors('No schedule found.');
        }

        // Convertir fecha y hora en Carbon para rango
        $start = Carbon::parse($data['date'])->setHour((int)$data['hour'])->setMinute(0)->setSecond(0);

        $end = (clone $start)->addHour();

        // Buscar la actividad asignada en ese rango y eliminarla
        $activities = $schedule->activities()->wherePivot('start_time', $start)->wherePivot('end_time', $end)->get();

        foreach ($activities as $activity) {
            $schedule->activities()->detach($activity->id);
        }

        return redirect()->back()->with('success', 'Actividad eliminada correctamente.');
    }


    public function rename(Request $request, Schedule $schedule)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $schedule->name = $request->name;
        $schedule->save();

        // En una petición AJAX se podría devolver JSON, pero como lo haces sin JS fetch,
        // haremos una redirección o simplemente nada (la vista lo manejará).
        if ($request->ajax()) {
            return response()->json(['success' => true]);
        }

        // Esto solo se usará si llegas a enviar de forma tradicional (fallback)
        return back();
    }

    public function generatePdf()
    {
        $pdf = Pdf::loadView('pdf.plantillaSchedule');
        return $pdf->stream('archivo.pdf');
        // return $pdf->download('ejemplo.pdf'); // para forzar descarga
    }

}
