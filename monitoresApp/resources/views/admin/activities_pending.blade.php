@extends('layouts.app')

@section('content')
<div class="container">
    <h2 class="mb-4">Actividades pendientes de revisión</h2>
    <div class="row">
        @forelse ($activities as $activity)
            <div class="col-md-6 mb-4">
                <div class="card shadow rounded-4">
                    <div class="card-body">
                        <h5 class="card-title">{{ $activity->title }}</h5>
                        <p class="card-text">
                            <strong>Tipo:</strong> {{ $activity->type->name }}<br>
                            <strong>Edad mínima:</strong> {{ $activity->min_age }}<br>
                            <strong>Participantes:</strong> {{ $activity->num_participants }}<br>
                            <strong>Autor:</strong> {{ $activity->creator->name }}
                        </p>
                        <a href="{{ route('activities.show', $activity) }}" class="btn btn-info btn-sm mb-2">Ver actividad</a>

                        <form action="{{ route('activities.approve', $activity) }}" method="POST" class="d-inline">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-success btn-sm">Aprobar</button>
                        </form>

                        <form action="{{ route('activities.reject', $activity) }}" method="POST" class="d-inline ms-2">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-danger btn-sm">Denegar</button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <p>No hay actividades pendientes.</p>
        @endforelse
    </div>
</div>
@endsection
