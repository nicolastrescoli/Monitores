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

    <h3>{{ $schedule->name }}</h3>

    <form action="{{route('schedule.edit', $schedule)}}" method="POST">
        @csrf
        <button type="submit">Editar</button>
    </form>
    <hr>

    <div class="calendar">

        <div class="grid">

            @php
                if(isset($scheduled)) {
                $occupied = [];
                foreach ($scheduled as $item) {
                    $start = \Carbon\Carbon::parse($item->pivot->start_time);
                    $key = $start->format('Y-m-d-') . str_pad($start->hour, 2, '0', STR_PAD_LEFT);
                    $occupied[$key] = $item->title;
                }
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
    </div>

@endsection
