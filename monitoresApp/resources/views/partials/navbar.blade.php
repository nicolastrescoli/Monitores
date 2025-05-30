    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ route('activities.index')}}">Inicio</a>
            @if(Auth::check())
            <a class="navbar-brand" href="{{ route('profile.show')}}">Perfil</a>
            <a class="navbar-brand" href="{{ route('community.index')}}">Comunidad</a>
            @else
            <a class="navbar-brand" href="{{ route('login')}}">Login</a>
            <a class="navbar-brand" href="{{ route('register')}}">Registro</a>
            @endif
            <a class="navbar-brand" href="#">Guías</a>
            <a class="navbar-brand" href="{{ route('info.about')}}">Sobre Nosotros</a>
            <a class="navbar-brand" href="{{ route('info.contact')}}">Contacto</a>
            @if(Auth::check())
            <a class="navbar-brand" href="{{ route('logout')}}">Logout</a>
            @endif
        </div>
    </nav>