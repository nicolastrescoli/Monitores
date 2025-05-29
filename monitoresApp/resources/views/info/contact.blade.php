@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="card border-0 shadow">
        <div class="card-header bg-dark text-white">
            <h2>Contacto</h2>
        </div>
        <div class="card-body bg-light text-dark">
            <p class="mb-4">¿Tienes alguna pregunta, sugerencia o propuesta? ¡Estamos encantados de escucharte!</p>

            <form method="POST" action="{{ route('contact.send') }}">
                @csrf
                <div class="mb-3">
                    <label for="name" class="form-label">Nombre</label>
                    <input type="text" name="name" id="name" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input type="email" name="email" id="email" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="message" class="form-label">Mensaje</label>
                    <textarea name="message" id="message" rows="5" class="form-control" required></textarea>
                </div>

                <button type="submit" class="btn btn-success">Enviar</button>
            </form>
        </div>
    </div>
</div>
@endsection
