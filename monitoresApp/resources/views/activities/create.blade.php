@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2>Crear nueva actividad</h2>

    <form action="{{ route('activities.store') }}" method="POST">
        @include('activities.partials._form')

        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-success">Guardar actividad</button>
        </div>
    </form>
</div>
@endsection
