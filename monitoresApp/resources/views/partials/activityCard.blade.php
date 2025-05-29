      <div class="col-md-4 activity-item"
           data-nombre="{{ strtolower($activity->title) }}"
           data-tipo="{{ $activity->type->name }}"
           data-edad="{{ $activity->min_age }}"
           data-participantes="{{ $activity->participants }}"
        >
        <a href="{{ route('activities.show', $activity->id) }}" class="text-decoration-none text-dark">
        <div class="card h-100 border-0 shadow-lg rounded-4 bg-white">
          <div class="card-body d-flex justify-content-between">
            <div>
            <h5 class="card-title text-primary">{{ $activity->title }}</h5>
            <p class="card-text text-dark">
              <span class="badge bg-success mb-1">{{ $activity->type->name }}</span><br>
              <strong>Edad:</strong> {{ $activity->min_age }}+<br>
              <strong>Participantes:</strong> {{ $activity->participants }}
            </p>
            </div>
            <form action="{{ route('activities.favorite', $activity) }}" method="POST" class="d-inline">
          @csrf
          <button type="submit" class="btn btn-sm {{ auth()->user()?->favoriteActivities->contains($activity) ? 'btn-warning' : 'btn-outline-secondary' }}">
              {{ auth()->user()?->favoriteActivities->contains($activity) ? '★ Favorito' : '☆ Añadir a favoritos' }}
          </button>
        </form>
          </div>
                  
        </div>
        </a>
      </div>