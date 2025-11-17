import MaterialsField from "./MaterialsField";
import RisksField from "./RisksField";

export default function StructuredForm({ formData, setFormData, types, materials, risks }) {

    const update = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={e => update("title", e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select
                    className="form-select"
                    value={formData.type_id}
                    onChange={e => update("type_id", e.target.value)}
                    required
                >
                    <option value="">Selecciona</option>
                    {types.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label className="form-label">Nº participantes</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.num_participants}
                        onChange={e => update("num_participants", e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-label">Edad mínima</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.min_age}
                        onChange={e => update("min_age", e.target.value)}
                        required
                    />
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-label">Edad máxima</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.max_age}
                        onChange={e => update("max_age", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Duración</label>
                <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={e => update("duration", e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Objetivos</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={formData.objectives}
                    onChange={e => update("objectives", e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Introducción</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={formData.introduction}
                    onChange={e => update("introduction", e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                    className="form-control"
                    rows="5"
                    value={formData.description}
                    onChange={e => update("description", e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Conclusión</label>
                <textarea
                    className="form-control"
                    rows="3"
                    value={formData.conclusion}
                    onChange={e => update("conclusion", e.target.value)}
                />
            </div>

            <hr />
            <h5>Materiales necesarios</h5>

            <MaterialsField
                formData={formData}
                setFormData={setFormData}
                materials={materials}
            />

            <hr className="my-4" />

            <h5>Riesgos</h5>

            <RisksField
                formData={formData}
                setFormData={setFormData}
                risks={risks}
            />
        </>
    );
}
