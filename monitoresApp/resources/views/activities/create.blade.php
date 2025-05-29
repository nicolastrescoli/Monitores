@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2>Crear nueva actividad</h2>

    <form action="{{ route('activities.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="title" class="form-label">Título</label>
            <input type="text" class="form-control" id="title" name="title" required>
        </div>

        <div class="mb-3">
            <label for="type_id" class="form-label">Tipo</label>
            <select class="form-select" id="type_id" name="type_id" required>
                @foreach ($types as $type)
                    <option value="{{ $type->id }}">{{ $type->name }}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="num_participants" class="form-label">Nº de participantes</label>
            <input type="number" class="form-control" id="num_participants" name="num_participants" required>
        </div>

        <div class="mb-3">
            <label for="min_age" class="form-label">Edad mínima</label>
            <input type="number" class="form-control" id="min_age" name="min_age" required>
        </div>

        <div class="mb-3">
            <label for="max_age" class="form-label">Edad máxima</label>
            <input type="number" class="form-control" id="max_age" name="max_age" required>
        </div>

        <div class="mb-3">
            <label for="duration" class="form-label">Duración</label>
            <input type="number" class="form-control" id="duration" name="duration" required>
        </div>

        <div class="mb-3">
            <label for="objectives" class="form-label">Objetivos</label>
            <textarea class="form-control" id="objectives" name="objectives" rows="3" required></textarea>
        </div>

        <div class="mb-3">
            <label for="introduction" class="form-label">Introducción</label>
            <textarea class="form-control" id="introduction" name="introduction" rows="3" required></textarea>
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Descripción</label>
            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
        </div>

        <div class="mb-3">
            <label for="conclusion" class="form-label">Conclusión</label>
            <textarea class="form-control" id="conclusion" name="conclusion" rows="3" required></textarea>
        </div>

        <div class="mb-3 form-check">
            <input type="hidden" name="is_public" value="0">
            <label class="form-check-label" for="is_public">Esta actividad será privada y añadida a tus favoritos</label>
        </div>

        <button type="submit" class="btn btn-success">Guardar actividad</button>
    </form>
</div>
@endsection
