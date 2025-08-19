@php
    $isOwner = auth()->check() && $activity->user_id === auth()->id();
    $isFavorite = auth()->user()?->favoriteActivities->contains($activity);
    $isOwnerWithPublic = $isOwner && $activity->visibility === 'public';
@endphp

<div class="col-md-4 activity-item"
     data-nombre="{{ strtolower($activity->title) }}"
     data-tipo="{{ $activity->type->name }}"
     data-edad="{{ $activity->min_age }}"
     data-participantes="{{ $activity->num_participants }}"
>
    <div class="card h-100 border-0 shadow-lg rounded-4 {{ $isOwner ? 'border-success bg-info' : 'border-secondary bg-white' }}">
        <div class="card-body d-flex flex-column justify-content-between">

            {{-- Información de la actividad --}}
            <div>
                <a href="{{ route('activities.show', $activity->id) }}" class="text-decoration-none text-dark">
                    <h5 class="card-title text-primary">{{ $activity->title }}</h5>
                    <p class="card-text text-dark">
                        <span class="badge bg-success mb-1">{{ $activity->type->name }}</span><br>
                        <strong>Edad:</strong> {{ $activity->min_age }}+<br>
                        <strong>Participantes:</strong> {{ $activity->num_participants }}
                    </p>
                </a>
            </div>

            {{-- Acciones del usuario --}}
            @unless($isOwnerWithPublic)
                <div class="mt-3">
                    @if ($isOwner)
                        {{-- Editar y eliminar --}}
                        <a href="{{ route('activities.edit', $activity) }}" class="btn btn-sm btn-warning ms-1">
                            Editar
                        </a>

                        <form action="{{ route('activities.destroy', $activity) }}" method="POST" class="d-inline ms-1">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger btn-sm">
                                Eliminar
                            </button>
                        </form>
                        @elseif (
                            $activity->visibility === 'public' &&
                            (!Auth::check() || !isset($user))
                        )
                        {{-- Favoritos --}}
                        <form action="{{ route('activities.favorite', $activity) }}" method="POST" class="d-inline">
                            @csrf
                            <button type="submit" class="btn btn-sm {{ $isFavorite ? 'btn-warning' : 'btn-outline-secondary' }}">
                                {{ $isFavorite ? '★ Favorito' : '☆ Añadir a favoritos' }}
                            </button>
                        </form>
                    @endif
                    @if ($isFavorite && $activity->visibility === 'public')
                        <form action="{{ route('activities.clone', $activity) }}" method="POST" class="d-inline">
                            @csrf
                            <button type="submit" class="btn btn-sm"> Modificar
                            </button>
                        </form>
                    @endif
                </div>

                {{-- Publicación (enviar/cancelar) --}}
                @if ($isOwner)
                    <div class="mt-3">
                        @if ($activity->visibility === 'private')
                            <form action="{{ route('activities.submit', $activity) }}" method="POST" class="d-inline ms-1">
                                @csrf
                                <button type="submit" class="btn btn-primary btn-sm">
                                    Solicitar publicación
                                </button>
                            </form>
                        @elseif ($activity->visibility === 'pending')
                            <form action="{{ route('activities.cancelSubmission', $activity) }}" method="POST" class="d-inline ms-1">
                                @csrf
                                @method('PUT')
                                <button type="submit" class="btn btn-outline-warning btn-sm">
                                    Cancelar envío
                                </button>
                            </form>
                        @endif
                    </div>
                @endif
            @endunless

        </div>
    </div>
</div>
