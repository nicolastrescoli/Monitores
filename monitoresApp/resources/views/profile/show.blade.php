@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">

            <div class="card shadow border-0">
                <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Mi Perfil</h4>
                    {{-- <a href="{{ route('profile.edit') }}" class="btn btn-sm btn-outline-light">Editar</a> --}}
                </div>

                <div class="card-body bg-light text-dark">
                    <div class="row mb-3">
                        <div class="col-md-4 text-center">
                            <img src="{{ Auth::user()->avatar ?? 'https://placehold.co/150' }}" class="rounded-circle img-thumbnail mb-2" alt="Avatar" style="width: 150px; height: 150px;">
                        </div>
                        <div class="col-md-8">
                            <p><strong>Nombre:</strong> {{ $user->name }}</p>
                            <p><strong>Email:</strong> {{ $user->email }}</p>
                            <p><strong>Descripción:</strong> {{ $user->description ?? 'Empieza a escribir tu descripción' }}</p>
                            <p><strong>Registrado desde:</strong> {{ $user->created_at->format('d/m/Y') }}</p>
                        </div>
                    </div>

                    <hr>

                    <div class="d-flex justify-content-between">
                        <h5 class="mb-3">Mis actividades</h5>

                        <div class="d-flex gap-2">
                        <button><a href="{{route('activities.create')}}">Nueva actividad</a></button>
                        <button><a href="{{route('activities.create')}}">Nueva a partir de otra</a></button>
                        </div>
                    </div>

                    @if ($user->favoriteActivities->isEmpty())
        <div class="alert alert-info">Aún no has añadido ninguna actividad a favoritos.</div>
    @else
        <div class="row">
            <div id="listaactivities" class="row gy-4">
                @each ('partials.activityCard', $user->favoriteActivities, 'activity')
            </div>
                        </div>
                    @endif

                    <hr>
                    
                    <h5 class="mb-3">Mis programaciones</h5>

                </div>
            </div>

        </div>
    </div>
</div>
@endsection
