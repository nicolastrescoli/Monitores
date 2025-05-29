@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="card shadow-lg border-0">
        <div class="card-header bg-dark text-white">
            <h2 class="mb-0">{{ $activity->title }}</h2>
        </div>
        <div class="card-body bg-light text-dark">
            <div class="row">
                <div class="col-md-8">
                    <p><strong>Tipo:</strong> {{ $activity->type->name }}</p>
                    <p><strong>Edad recomendada:</strong> {{ $activity->min_age }}+</p>
                    <p><strong>Nº de participantes:</strong> {{ $activity->participants }}</p>
                    @if (!empty($activity->duration))
                        <p><strong>Duración estimada:</strong> {{ $activity->duration }} minutos</p>
                    @endif
                    {{-- @if (!empty($activity->materials))
                        <p><strong>Materiales necesarios:</strong> {{ $activity->materials }}</p>
                    @endif
                    @if (!empty($activity->score))
                        <p><strong>Puntuación:</strong> {!! str_repeat('⭐', $activity->score) !!}</p>
                    @endif --}}
                </div>
                <div class="col-md-4">
                    {{-- Imagen opcional --}}
                    @if($activity->image)
                        <img src="{{ asset('storage/' . $activity->image) }}" class="img-fluid rounded" alt="{{ $activity->title }}">
                    @else
                        <img src="https://via.placeholder.com/300x200?text=Actividad" class="img-fluid rounded" alt="Sin imagen">
                    @endif
                </div>
            </div>

            <hr>

            <h4>Descripción</h4>
            <p>{{ $activity->description }}</p>

            <a href="{{ route('activities.index') }}" class="btn btn-outline-success mt-3">
                ← Volver a la lista de actividades
            </a>
        </div>
    </div>
</div>
@endsection
