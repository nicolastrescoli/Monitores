import React from "react";

export default function MaterialsField({ formData, setFormData, materials }) {

    const addMaterial = () => {
        setFormData(prev => ({
            ...prev,
            materials: [...prev.materials, { id: "", quantity: 1, notes: "" }]
        }));
    };

    const updateMaterial = (index, field, value) => {
        const newMaterials = [...formData.materials];
        newMaterials[index][field] = value;
        setFormData(prev => ({ ...prev, materials: newMaterials }));
    };

    const removeMaterial = (index) => {
        const newMaterials = [...formData.materials];
        newMaterials.splice(index, 1);
        setFormData(prev => ({ ...prev, materials: newMaterials }));
    };

    return (
        <div>
            {formData.materials.map((mat, idx) => (
                <div key={idx} className="row g-2 mb-2 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label">Material</label>
                        <select
                            className="form-select"
                            value={mat.id}
                            onChange={e => updateMaterial(idx, "id", e.target.value)}
                            required
                        >
                            <option value="">Selecciona</option>
                            {materials.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Cantidad</label>
                        <input
                            type="number"
                            className="form-control"
                            value={mat.quantity}
                            min="1"
                            onChange={e => updateMaterial(idx, "quantity", e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Notas</label>
                        <input
                            type="text"
                            className="form-control"
                            value={mat.notes}
                            onChange={e => updateMaterial(idx, "notes", e.target.value)}
                        />
                    </div>

                    <div className="col-md-1">
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMaterial(idx)}>✕</button>
                    </div>
                </div>
            ))}

            <button type="button" className="btn btn-outline-primary" onClick={addMaterial}>
                Añadir otro material
            </button>
        </div>
    );
}
