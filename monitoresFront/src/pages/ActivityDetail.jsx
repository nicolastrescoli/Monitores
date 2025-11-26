import { useEffect, useState } from "react";
import { getTypes, openActivityPdf } from "../services/api";

export default function ActivityDetail({ activity, creator, materials = [], risks = [], onBack }) {

  const [typeNames, setTypeNames] = useState([]);

  useEffect(() => {
    async function fetchTypes() {
      const types = await getTypes();
      setTypeNames(types)
    };
    fetchTypes();
  },[]);

  const typeName = typeNames[activity.type_id] || "Otro";

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white">
          <h2 className="mb-0">{activity.title}</h2>
        </div>
        <div className="card-body bg-light text-dark">
          <div className="row mb-3">
            <div className="col-md-8">
              <button
                className="btn btn-outline-primary mb-3"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => openActivityPdf(activity.id)}
              >
                Imprimir en PDF
              </button>
              <p><strong>Tipo:</strong> {typeName}</p>
              <p><strong>Edad recomendada:</strong> {activity.min_age}+</p>
              <p><strong>Nº de participantes:</strong> {activity.num_participants}</p>
              {activity.duration && (
                <p><strong>Duración estimada:</strong> {activity.duration} minutos</p>
              )}
            </div>
            <div className="col-md-4">
              <p><strong>Autor:</strong> {creator?.name || "Anónimo"}</p>
            </div>
          </div>

          <hr />

          <h4>Objetivos</h4>
          <p>{activity.objectives}</p>

          <h4>Introducción</h4>
          <p>{activity.introduction}</p>

          <h4>Descripción</h4>
          <p>{activity.description}</p>

          <h4>Conclusión</h4>
          <p>{activity.conclusion}</p>

          <hr />

          <h4>Materiales</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((mat) => (
                <tr key={mat.id}>
                  <td>{mat.name}</td>
                  <td>{mat.pivot?.quantity || "-"}</td>
                  <td>{mat.pivot?.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          <h4>Riesgos</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Riesgo</th>
                <th>Medidas de prevención</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr key={risk.id}>
                  <td>{risk.description}</td>
                  <td>{risk.prevention}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn btn-outline-success mt-3"
            onClick={onBack}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
