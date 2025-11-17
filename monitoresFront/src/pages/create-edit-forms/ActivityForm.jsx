import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import StructuredForm from "./components/StructuredForm";
import FreeForm from "./components/FreeForm";

export default function ActivityForm() {
  const { id: activityId } = useParams(); // ← si existe, estamos editando

  const isEditing = Boolean(activityId);

  const [mode, setMode] = useState("structured");

  const [types, setTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [risks, setRisks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    type_id: "",
    num_participants: "",
    min_age: "",
    max_age: "",
    duration: "",
    objectives: "",
    introduction: "",
    description: "",
    conclusion: "",
    materials: [],
    risks: [], // ← para modo libre si editamos
  });

  // ---------- 1. Cargar datos base: types, materials, risks ----------
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/activities/formData", {
        withCredentials: true,
      })
      .then((res) => {
        setTypes(res.data.types);
        setMaterials(res.data.materials);
        setRisks(res.data.risks);
      })
      .catch(console.error);
  }, []);

  // ---------- 2. Si estamos editando → cargar actividad ----------
  useEffect(() => {
    if (!isEditing) return;

    axios
      .get(`http://localhost:8000/api/activities/${activityId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const activity = res.data.activity;

        // Prefill structured form fields
        setFormData((prev) => ({
          ...prev,
          title: activity.title ?? "",
          type_id: activity.type_id ?? "",
          num_participants: activity.num_participants ?? "",
          min_age: activity.min_age ?? "",
          max_age: activity.max_age ?? "",
          duration: activity.duration ?? "",
          objectives: activity.objectives ?? "",
          introduction: activity.introduction ?? "",
          description: activity.description ?? "",
          conclusion: activity.conclusion ?? "",
          materials: activity.materials?.map(m => ({
            id: String(m.id),
            quantity: m.pivot?.quantity || 1,
            notes: m.pivot?.notes || ""
          })) || [],

          risks: activity.risks?.map(r => String(r.id)) || [],
        }));
      })
      .catch(console.error);
  }, [isEditing, activityId]);

  // ---------- 3. Enviar formulario (crear / editar) ----------
  async function handleSubmit(e) {
    e.preventDefault();

    const payload = { ...formData, mode };

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/activities/${activityId}`,
          payload,
          { withCredentials: true }
        );
        alert("Actividad actualizada");
      } else {
        await axios.post(
          `http://localhost:8000/api/activities/store`,
          payload,
          { withCredentials: true }
        );
        alert("Actividad creada");
      }

      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      alert("Error al guardar la actividad");
    }
  }

  return (
    <div className="container py-4">
      <h2>{isEditing ? "Editar actividad" : "Nueva actividad"}</h2>

      {!isEditing ? (
        <div className="d-flex flex-column justify-content-center gap-3 mb-4 text-center">
          <h5>Elige un método de creación</h5>

          <div>
            <button
              type="button"
              className={`btn ${
                mode === "structured" ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setMode("structured")}
            >
              Estructurado
            </button>

            <button
              type="button"
              className={`btn ms-2 ${
                mode === "free" ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setMode("free")}
            >
              Libre
            </button>
          </div>
        </div>
      ) : null}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {mode === "structured" ? (
          <StructuredForm
            formData={formData}
            setFormData={setFormData}
            types={types}
            materials={materials}
            risks={risks}
            isEditing={isEditing}
          />
        ) : (
          <FreeForm
            formData={formData}
            setFormData={setFormData}
            types={types}
          />
        )}

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-success">
            {isEditing ? "Actualizar actividad" : "Crear actividad"}
          </button>
        </div>
      </form>
    </div>
  );
}
