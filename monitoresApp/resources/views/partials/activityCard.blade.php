<div class="col-md-4 activity-item"
     data-nombre="{{ strtolower($activity->title) }}"
     data-tipo="{{ $activity->type->name }}"
     data-edad="{{ $activity->min_age }}"
     data-participantes="{{ $activity->participants }}"
>
    <div class="card h-100 border-0 shadow-lg rounded-4
      @if (!auth()->check() || $activity->user_id !== auth()->id())
          border-secondary bg-white
      @else
          border-success bg-info
      @endif
    ">

        <div class="card-body d-flex flex-column justify-content-between">
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

            <div class="mt-3">
              @if (!auth()->check() || $activity->user_id !== auth()->id())
                <form action="{{ route('activities.favorite', $activity) }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-sm {{ auth()->user()?->favoriteActivities->contains($activity) ? 'btn-warning' : 'btn-outline-secondary' }}">
                        {{ auth()->user()?->favoriteActivities->contains($activity) ? '★ Favorito' : '☆ Añadir a favoritos' }}
                    </button>
                </form>
              @else
                  <a href="{{ route('activities.edit', $activity) }}" class="btn btn-sm btn-warning ms-1">
                      Editar actividad
                  </a>

                  <form action="{{ route('activities.destroy', $activity) }}" method="POST" class="d-inline ms-1">
                      @csrf
                      @method('DELETE')
                      <button type="submit" class="btn btn-outline-danger btn-sm">
                          Eliminar
                      </button>
                  </form>
              @endif
            </div>
        </div>
    </div>
</div>
