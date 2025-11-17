import React from "react";

export default function RisksField({ formData, setFormData, risks }) {

    const addRisk = () => {
        setFormData(prev => ({
            ...prev,
            risks: [...prev.risks, ""]
        }));
    };

    const updateRisk = (index, value) => {
        const newRisks = [...formData.risks];
        newRisks[index] = value;
        setFormData(prev => ({ ...prev, risks: newRisks }));
    };

    const removeRisk = (index) => {
        const newRisks = [...formData.risks];
        newRisks.splice(index, 1);
        setFormData(prev => ({ ...prev, risks: newRisks }));
    };

    return (
        <div>
            {formData.risks.map((riskId, idx) => (
                <div key={idx} className="row g-2 mb-2 align-items-end">
                    <div className="col-md-11">
                        <select
                            className="form-select"
                            value={riskId}
                            onChange={e => updateRisk(idx, e.target.value)}
                        >
                            <option value="">Selecciona</option>
                            {risks.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeRisk(idx)}>✕</button>
                    </div>
                </div>
            ))}

            <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={addRisk}>
                Añadir otro riesgo
            </button>
        </div>
    );
}
