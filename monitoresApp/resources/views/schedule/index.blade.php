@extends('layouts.app')

    <style>
        .calendar { display: flex; }
        .activities { width: 250px; padding: 10px; border-right: 1px solid #ccc; }
        .activity { padding: 8px; background: #f0f0f0; margin: 5px 0; cursor: grab; border-radius: 5px; }
        .grid { overflow-x: auto; flex-grow: 1; }
        table { border-collapse: collapse; width: 100%; min-width: 1000px; }
        th, td { border: 1px solid #ccc; padding: 10px; vertical-align: top; min-width: 120px; height: 60px; }
        .dropzone { background: #fff; min-height: 40px; }
        .dropzone.hover { background: #e6f7ff; }
    </style>

@section('content')

    <h3>Calendario de Programacion</h3>
    <hr>
    <p>Arrastra las actividades a las horas correspondientes en el calendario.</p>

    <form method="GET">
        <label>Días a mostrar (1-15):</label>
        <input type="number" name="days" min="1" max="15" value="{{ request('days', 7) }}">
        <button type="submit">Actualizar</button>
    </form>

    <hr>

    <div class="calendar">
        <div class="activities">
            <h3>Actividades</h3>
            @foreach ($activities as $activity)
                <div class="activity" draggable="true" data-id="{{ $activity->id }}">
                    {{ $activity->title }}
                </div>
            @endforeach
        </div>

        <div class="grid">

            @php
                $occupied = [];
                foreach ($scheduled as $item) {
                    $start = \Carbon\Carbon::parse($item->pivot->start_time);
                    $key = $start->format('Y-m-d-') . str_pad($start->hour, 2, '0', STR_PAD_LEFT);
                    $occupied[$key] = $item->title;
                }
            @endphp

            <table>
                <thead>
                    <tr>
                        @foreach ($dates as $date)
                            <th>{{ $date->format('d/m') }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @for ($hour = 8; $hour <= 20; $hour++)
                        <tr>
                            @foreach ($dates as $date)
                                <td>
                                    @php
                                        $cellKey = $date->format('Y-m-d') . '-' . str_pad($hour, 2, '0', STR_PAD_LEFT);
                                    @endphp

                                    <div class="dropzone"
                                        data-date="{{ $date->toDateString() }}"
                                        data-hour="{{ $hour }}">
                                        
                                        @if (isset($occupied[$cellKey]))
                                            <strong>{{ $occupied[$cellKey] }}</strong><br>

                                            <form method="POST" action="{{ route('calendar.unassign') }}" style="display:inline;">
                                                @csrf
                                                @method('DELETE')
                                                <input type="hidden" name="date" value="{{ $date->toDateString() }}">
                                                <input type="hidden" name="hour" value="{{ $hour }}">
                                                <button type="submit" style="font-size: 0.8em; padding: 2px 6px; margin-top: 3px; cursor:pointer;">Eliminar</button>
                                            </form>
                                        @else
                                            <small>{{ $hour }}:00</small>
                                        @endif

                                    </div>
                                </td>

                            @endforeach
                        </tr>
                    @endfor
                </tbody>
            </table>
        </div>
        <form id="assign-form" method="POST" action="{{ route('calendar.assign') }}" style="display: none;">
            @csrf
            <input type="hidden" name="activity_id" id="form-activity-id">
            <input type="hidden" name="date" id="form-date">
            <input type="hidden" name="hour" id="form-hour">
        </form>
    </div>

<script>
    const draggables = document.querySelectorAll('.activity');
    const dropzones = document.querySelectorAll('.dropzone');

    draggables.forEach(el => {
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('activity_id', e.target.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('hover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hover');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('hover');

            const activityId = e.dataTransfer.getData('activity_id');
            const date = zone.dataset.date;
            const hour = zone.dataset.hour;

            console.log({ activityId, date, hour });


            document.getElementById('form-activity-id').value = activityId;
            document.getElementById('form-date').value = date;
            document.getElementById('form-hour').value = hour;

            document.getElementById('assign-form').submit();
        });
    });
</script>


@endsection
