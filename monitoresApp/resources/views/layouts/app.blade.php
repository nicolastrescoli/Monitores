<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>@yield('title', 'Actividades')</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

</head>
<body>

    <!-- Header opcional -->
    <header class="py-3 text-center">
        <h1 class="mb-0">🌿 Actividades y Juegos</h1>
    </header>

    @if(Auth::check() && Auth::user()->role === 'admin')
        <h2 class="mb-0 py-3 text-center"><a href="{{ route('activities.pending')}}">Panel de Administración</a></h2>
    @endif

    <!-- Navbar opcional -->
    @include('partials.navbar')

    <!-- Contenido principal -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center mt-5">
        <p class="mb-0">&copy; {{ date('Y') }} Actividades Verdes</p>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>

    @stack('scripts')
</body>
</html>
