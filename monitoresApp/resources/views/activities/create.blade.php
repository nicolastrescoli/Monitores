@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h2>Nueva actividad</h2>

    <div class="d-flex flex-column justify-content-center gap-3 mb-4 text-center">
        <h5>Elige un método de creación</h5>
        <div>
            <button type="button" id="btnStructured" class="btn btn-primary">Estructurado</button>
            <button type="button" id="btnFree" class="btn btn-outline-secondary">Libre</button>
        </div>
    </div>

    <form action="{{ route('activities.store') }}" method="POST" enctype="multipart/form-data" id="activityForm">
        @csrf

        <input type="hidden" name="mode" id="modeInput" value="structured">

        <div id="formStructured">
            @include('activities.partials._form')
        </div>

        <div id="formFree" style="display: none;">
            @include('activities.partials._formFree')
        </div>

        <div class="d-flex justify-content-end mt-3">
            <button type="submit" class="btn btn-success">Guardar actividad</button>
        </div>
    </form>
</div>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const btnStructured = document.getElementById('btnStructured');
        const btnFree = document.getElementById('btnFree');
        const formStructured = document.getElementById('formStructured');
        const formFree = document.getElementById('formFree');
        const modeInput = document.getElementById('modeInput');

        let currentMode = 'structured';

        function disableForm(formDiv, disabled = true) {
            const inputs = formDiv.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.disabled = disabled);
        }

        function activateStructured() {
            formStructured.style.display = 'block';
            formFree.style.display = 'none';
            currentMode = 'structured';
            modeInput.value = 'structured';

            disableForm(formStructured, false);
            disableForm(formFree, true);

            btnStructured.classList.remove('btn-outline-primary');
            btnStructured.classList.add('btn-primary');
            btnFree.classList.remove('btn-primary');
            btnFree.classList.add('btn-outline-secondary');
        }

        function activateFree() {
            formStructured.style.display = 'none';
            formFree.style.display = 'block';
            currentMode = 'free';
            modeInput.value = 'free';

            disableForm(formStructured, true);
            disableForm(formFree, false);

            btnFree.classList.remove('btn-outline-secondary');
            btnFree.classList.add('btn-primary');
            btnStructured.classList.remove('btn-primary');
            btnStructured.classList.add('btn-outline-primary');
        }

        btnStructured.addEventListener('click', activateStructured);
        btnFree.addEventListener('click', activateFree);

        // Inicializar al cargar
        activateStructured();
    });
</script>
@endpush
@endsection
