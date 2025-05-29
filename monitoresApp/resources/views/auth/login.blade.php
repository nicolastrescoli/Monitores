@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow border-0">
                <div class="card-header bg-dark text-white">
                    <h4 class="mb-0">Iniciar sesión</h4>
                </div>
                <div class="card-body bg-light">
                    <form action="{{ route('login.submit') }}" method="POST">
                        @csrf

                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <div class="mb-3">
                            <label for="email" class="form-label">Correo electrónico</label>
                            <input type="email" name="email" class="form-control" required value="{{ old('email') }}">
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" name="password" class="form-control" required>
                        </div>

                        <button type="submit" class="btn btn-success w-100">Entrar</button>
                    </form>

                    <p class="mt-3 text-center">¿No tienes cuenta? <a href="{{ route('register') }}">Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
