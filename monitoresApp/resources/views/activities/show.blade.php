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
                    <button class="btn"><a href="{{ route('activity.pdf', $activity) }}">Imprimir en PDF</a></button>
                    <p><strong>Tipo:</strong> {{ $activity->type->name }}</p>
                    <p><strong>Edad recomendada:</strong> {{ $activity->min_age }}+</p>
                    <p><strong>Nº de participantes:</strong> {{ $activity->num_participants }}</p>
                    @if (!empty($activity->duration))
                        <p><strong>Duración estimada:</strong> {{ $activity->duration }} minutos</p>
                    @endif
                    {{-- @if (!empty($activity->score))
                        <p><strong>Puntuación:</strong> {!! str_repeat('⭐', $activity->score) !!}</p>
                    @endif --}}
                </div>
                <p><strong>Autor:</strong> {{ $creator->name ?? 'Anónimo' }}</p>
            </div>

            <hr>

            <h4>Objetivos</h4>
            <p>{{ $activity->objectives }}</p>

            <h4>Introducción</h4>
            <p>{{ $activity->introduction }}</p>

            <h4>Descripción</h4>
            <p>{{ $activity->description }}</p>

            <h4>Conclusion</h4>
            <p>{{ $activity->conclusion }}</p>

            <hr>

            <h4>Materiales</h4>
            <table class="table table-bordered table-striped">
                <tr>
                    <td>Material</td><td>Cantidad</td><td>Notas</td>
                </tr>
                @foreach ($materials as $material)
                    <tr>
                        <td>{{ $material->name }}</td>
                        <td>{{ $material->pivot->quantity }}</td>
                        <td>{{ $material->privot?->notes }}</td>
                    </tr>
                @endforeach
            </table>

            <hr>

            <h4>Riesgos</h4>
            <table class="table table-bordered table-striped">
                <tr>
                    <td>Riesgo</td><td>Medidas de prevención</td>
                </tr>
                @foreach ($risks as $risk)
                    <tr>
                        <td>{{ $risk->description }}</td>
                        <td>{{ $risk->prevention }}</td>
                    </tr>
                @endforeach
            </table>

            <a href="{{ url()->previous() !== url()->current() ? url()->previous() : route('home') }}" class="btn btn-outline-success mt-3">
                ← Volver
            </a>
        </div>
    </div>
</div>
@endsection
