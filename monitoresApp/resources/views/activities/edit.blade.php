@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2>Editar actividad</h2>

    <form action="{{ route('activities.update', $activity) }}" method="POST">
        @include('activities.partials._form')

        <button type="submit" class="btn btn-primary">Actualizar actividad</button>
    </form>
</div>
@endsection
