@extends('layouts.app')

@section('content')
<div class="container py-4">
  <!-- Filtros -->
  <div class="row g-3 mb-4 bg-light p-3 rounded shadow-sm">
    <div class="col-md-2">
      <input type="text" id="filtroNombre" class="form-control border-primary" placeholder="🔍 Nombre">
    </div>
    <div class="col-md-2">
      <select id="filtroTipo" class="form-select border-success">
        <option value="">🎯 Tipo</option>
        <option>Juego</option>
        <option>Actividad Física</option>
        <option>Manualidad</option>
      </select>
    </div>
    <div class="col-md-2">
      <input type="number" id="filtroEdadMin" class="form-control border-warning" placeholder="👶 Edad mínima">
    </div>
    <div class="col-md-2">
      <input type="number" id="filtroEdadMax" class="form-control border-warning" placeholder="🧓 Edad máxima">
    </div>
    <div class="col-md-2">
      <input type="number" id="filtroParticipantes" class="form-control border-info" placeholder="👥 Participantes">
    </div>
    <div class="col-md-2">
      <select id="ordenarPor" class="form-select border-dark">
        <option value="">↕️ Ordenar por</option>
        <option value="nombre">Nombre</option>
        <option value="tipo">Tipo</option>
        <option value="edad">Edad</option>
        <option value="participantes">Participantes</option>
        <option value="puntuacion">Puntuación</option>
      </select>
    </div>
  </div>

  <!-- Botón aleatorio -->
  <div class="text-end mb-4">
    <button id="btnAleatorio" class="btn btn-outline-primary btn-lg">
      🎲 Actividad Aleatoria
    </button>
  </div>

  <!-- Lista de actividades -->
  <div id="listaactivities" class="row gy-4">
    @each ('partials.activityCard', $activities, 'activity')
  </div>
</div>
@endsection

@push('scripts')
<script>
  function filtrarYOrdenar() {
    const nombre = document.getElementById("filtroNombre").value.toLowerCase();
    const tipo = document.getElementById("filtroTipo").value;
    const edadMin = parseInt(document.getElementById("filtroEdadMin").value) || 0;
    const edadMax = parseInt(document.getElementById("filtroEdadMax").value) || 99;
    const participantes = parseInt(document.getElementById("filtroParticipantes").value);
    const ordenarPor = document.getElementById("ordenarPor").value;

    const items = Array.from(document.querySelectorAll(".activity-item"));

    let filtrados = items.filter(item => {
      const actNombre = item.dataset.nombre;
      const actTipo = item.dataset.tipo;
      const actEdad = parseInt(item.dataset.edad);
      const actParticipantes = parseInt(item.dataset.participantes);

      return actNombre.includes(nombre)
        && (!tipo || actTipo === tipo)
        && actEdad >= edadMin && actEdad <= edadMax
        && (isNaN(participantes) || actParticipantes === participantes);
    });

    if (ordenarPor) {
      filtrados.sort((a, b) => {
        const va = a.dataset[ordenarPor];
        const vb = b.dataset[ordenarPor];
        return isNaN(va) ? va.localeCompare(vb) : va - vb;
      });
    }

    const contenedor = document.getElementById("listaactivities");
    contenedor.innerHTML = "";
    filtrados.forEach(item => contenedor.appendChild(item));
  }

  document.querySelectorAll("input, select").forEach(el =>
    el.addEventListener("input", filtrarYOrdenar)
  );

  document.getElementById("btnAleatorio").addEventListener("click", () => {
    const items = document.querySelectorAll(".activity-item");
    const random = items[Math.floor(Math.random() * items.length)];
    const contenedor = document.getElementById("listaactivities");
    contenedor.innerHTML = "";
    contenedor.appendChild(random);
  });
</script>
@endpush
