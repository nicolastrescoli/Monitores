@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="mb-4">Comunidad</h1>

    <div class="row">
        <!-- Usuarios -->
        <div class="col-md-6">
            <h3>Usuarios</h3>
            <div class="row">
                @foreach ($users->where('role', 'user') as $otherUser)
                    @if ($otherUser->id !== auth()->id())
                        @include('community.partials.user-card', ['otherUser' => $otherUser])
                    @endif
                @endforeach
            </div>
        </div>

        <!-- Organizaciones -->
        <div class="col-md-6">
            <h3>Organizaciones</h3>
            <div class="row">
                @foreach ($users->where('role', 'organization') as $otherUser)
                    @if ($otherUser->id !== auth()->id())
                        @include('community.partials.user-card', ['otherUser' => $otherUser])
                    @endif
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection
