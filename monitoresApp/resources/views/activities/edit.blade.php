@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2>Editar actividad</h2>

    <form action="{{ route('activities.update', $activity) }}" method="POST">
        @include('activities.partials._form')

        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-success">Actualizar actividad</button>
        </div>
    </form>
</div>
@endsection
