@csrf

@if(isset($activity))
    @method('PUT')
@endif

<div class="mb-3">
    <label for="title" class="form-label">Título</label>
    <input type="text" class="form-control" id="title" name="title"
           value="{{ old('title', $activity->title ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="type_id" class="form-label">Tipo</label>
    <select class="form-select" id="type_id" name="type_id" required>
        @foreach ($types as $type)
            <option value="{{ $type->id }}"
                {{ (old('type_id') ?? ($activity->type_id ?? '')) == $type->id ? 'selected' : '' }}>
                {{ $type->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="mb-3">
    <label for="num_participants" class="form-label">Nº de participantes</label>
    <input type="number" class="form-control" id="num_participants" name="num_participants"
           value="{{ old('num_participants', $activity->num_participants ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="min_age" class="form-label">Edad mínima</label>
    <input type="number" class="form-control" id="min_age" name="min_age"
           value="{{ old('min_age', $activity->min_age ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="max_age" class="form-label">Edad máxima</label>
    <input type="number" class="form-control" id="max_age" name="max_age"
           value="{{ old('max_age', $activity->max_age ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="duration" class="form-label">Duración</label>
    <input type="number" class="form-control" id="duration" name="duration"
           value="{{ old('duration', $activity->duration ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="objectives" class="form-label">Objetivos</label>
    <textarea class="form-control" id="objectives" name="objectives" rows="3" required>{{ old('objectives', $activity->objectives ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label for="introduction" class="form-label">Introducción</label>
    <textarea class="form-control" id="introduction" name="introduction" rows="3" required>{{ old('introduction', $activity->introduction ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label for="description" class="form-label">Descripción</label>
    <textarea class="form-control" id="description" name="description" rows="3" required>{{ old('description', $activity->description ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label for="conclusion" class="form-label">Conclusión</label>
    <textarea class="form-control" id="conclusion" name="conclusion" rows="3" required>{{ old('conclusion', $activity->conclusion ?? '') }}</textarea>
</div>

<hr>
<h5>Materiales necesarios</h5>

<div id="materials-container" class="mb-3">
    {{-- Se agregará automáticamente una fila al cargar --}}
</div>

<button type="button" class="btn btn-outline-primary" onclick="addMaterialRow()">Añadir otro material</button>

<hr class="my-4">

<h5>Riesgos</h5>
<div id="risks-container"></div>
<button type="button" class="btn btn-outline-secondary btn-sm mt-2" onclick="addRiskRow()">Añadir otro riesgo</button>

@push('scripts')
<script>
    let materialIndex = 0;
    const materials = {!! json_encode($materials) !!};
    const existingMaterials = {!! json_encode(old('materials', isset($activity) ? $activity->materials->map(function ($material) {
        return [
            'id' => $material->id,
            'quantity' => $material->pivot->quantity,
            'notes' => $material->pivot->notes,
        ];
    }) : [])) !!};

    function addMaterialRow(material = {}, showLabels = false) {
        const container = document.getElementById('materials-container');

        const row = document.createElement('div');
        row.classList.add('row', 'g-2', 'mb-2', 'align-items-end');

        let options = `<option value="">Selecciona</option>`;
        materials.forEach(mat => {
            const selected = mat.id == material.id ? 'selected' : '';
            options += `<option value="${mat.id}" ${selected}>${mat.name}</option>`;
        });

        row.innerHTML = `
            <div class="col-md-4">
                ${showLabels ? '<label class="form-label">Material</label>' : ''}
                <select name="materials[${materialIndex}][id]" class="form-select" required>
                    ${options}
                </select>
            </div>

            <div class="col-md-3">
                ${showLabels ? '<label class="form-label">Cantidad</label>' : ''}
                <input type="number" name="materials[${materialIndex}][quantity]" class="form-control" value="${material.quantity ?? ''}" min="1" required>
            </div>

            <div class="col-md-4">
                ${showLabels ? '<label class="form-label">Notas</label>' : ''}
                <input type="text" name="materials[${materialIndex}][notes]" class="form-control" value="${material.notes ?? ''}">
            </div>

            <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.row').remove()">✕</button>
            </div>
        `;

        container.appendChild(row);
        materialIndex++;
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (existingMaterials.length > 0) {
            existingMaterials.forEach((m, i) => addMaterialRow(m, i === 0));
        } else {
            addMaterialRow({}, true); // primera fila con labels
        }
    });
</script>

<script>
    let riskIndex = 0;
    const risks = {!! json_encode($risks) !!};
    const existingRisks = {!! json_encode(old('risks', isset($activity) ? $activity->risks->pluck('id') : [])) !!};

    function addRiskRow(selectedRiskId = '', showLabels = false) {
        const container = document.getElementById('risks-container');

        const row = document.createElement('div');
        row.classList.add('row', 'g-2', 'mb-2', 'align-items-end');

        let options = `<option value="">Selecciona</option>`;
        risks.forEach(risk => {
            const selected = risk.id == selectedRiskId ? 'selected' : '';
            options += `<option value="${risk.id}" ${selected}>${risk.name}</option>`;
        });

        row.innerHTML = `
            <div class="col-md-11">
                ${showLabels ? '<label class="form-label">Riesgo</label>' : ''}
                <select name="risks[${riskIndex}]" class="form-select" required>
                    ${options}
                </select>
            </div>

            <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.row').remove()">✕</button>
            </div>
        `;

        container.appendChild(row);
        riskIndex++;
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (existingRisks.length > 0) {
            existingRisks.forEach((riskId, i) => addRiskRow(riskId, i === 0));
        } else {
            addRiskRow('', true); // primera fila con label
        }
    });
</script>
@endpush
