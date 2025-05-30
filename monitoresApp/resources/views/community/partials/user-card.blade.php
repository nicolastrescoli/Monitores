<div class="col-md-12 mb-3">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ $otherUser->name }}</h5>
            <p class="card-text">{{ $otherUser->email }}</p>

            @php
                $authUser = auth()->user();
                $status = $authUser->friendStatusWith($otherUser);
            @endphp

            @if ($status === 'friends')
                <span class="badge bg-success">Amigos</span>
                <form method="POST" action="{{ route('friends.remove', $otherUser) }}" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger">Eliminar amistad</button>
                </form>
            @elseif ($status === 'pending_sent')
                <span class="badge bg-warning text-dark">Solicitud enviada</span>
                <form method="POST" action="{{ route('friends.cancel', $otherUser) }}" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-secondary">Cancelar solicitud</button>
                </form>
            @elseif ($status === 'pending_received')
                <form method="POST" action="{{ route('friends.accept', $otherUser) }}" class="d-inline">
                    @csrf
                    <button class="btn btn-sm btn-success">Aceptar</button>
                </form>
                <form method="POST" action="{{ route('friends.reject', $otherUser) }}" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger">Rechazar</button>
                </form>
            @else
                <form method="POST" action="{{ route('friends.request', $otherUser) }}">
                    @csrf
                    <button class="btn btn-sm btn-primary">Enviar solicitud</button>
                </form>
            @endif
        </div>
    </div>
</div>
