<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

use App\Models\Activity;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use Illuminate\Support\Facades\Log;
class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $days = (int) $request->input('days', 7);
        $startDate = \Carbon\Carbon::today();
        $dates = collect(range(0, $days - 1))->map(fn($i) => $startDate->copy()->addDays($i));

        $activities = Activity::all();

        $user = Auth::user();
        $schedule = Schedule::firstOrCreate(['user_id' => $user->id]);

        // Obtener todas las actividades programadas con fecha y hora
        $scheduled = $schedule->activities()->withPivot(['start_time', 'end_time'])->get();

        return view('schedule.index', compact('dates', 'activities', 'scheduled'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, schedule $schedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(schedule $schedule)
    {
        //
    }

    public function assign(Request $request)
    {
        $data = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'date' => 'required|date_format:Y-m-d',
            'hour' => 'required|integer|min:0|max:23',
        ]);

        try {
            $user = Auth::user();

            $schedule = Schedule::firstOrCreate(
                ['user_id' => $user->id],
                ['name' => 'Calendario de ' . $user->name]
            );

            // Asegura que la fecha venga en formato correcto
            $start = Carbon::parse($data['date'])->startOfDay()->addHours((int) $data['hour']);
            $end = (clone $start)->addHour();


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


}
