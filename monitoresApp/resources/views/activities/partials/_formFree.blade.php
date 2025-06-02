@csrf

@if(isset($activity->id) && $activity->visibility == 'private')
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
    <label for="description" class="form-label">Contenido libre</label>
    <textarea class="form-control" id="description" name="description" rows="15" required>{{ old('description', $activity->description ?? '') }}</textarea>
</div>

