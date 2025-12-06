import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import StructuredForm from "./components/StructuredForm";
import FreeForm from "./components/FreeForm";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchFormData,
  fetchActivityById,
  createActivity,
  updateActivityAction,
} from "../../redux/features/activitySlice";

export default function ActivityForm() {
  const { id: activityId } = useParams(); // si existe, estamos editando

  const isEditing = Boolean(activityId);

  const [mode, setMode] = useState("structured");

  const dispatch = useDispatch();

  const { types, materials, risks } = useSelector((state) => state.activities);
  const { currentActivity } = useSelector((state) => state.activities);

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
    risks: [],
  });

  useEffect(() => {
    if (!types.length || !materials.length || !risks.length) {
      dispatch(fetchFormData());
    }
  }, [dispatch, types, materials, risks]);

  useEffect(() => {
    if (isEditing) dispatch(fetchActivityById(activityId));
  }, [isEditing, activityId, dispatch]);

  useEffect(() => {
    if (!currentActivity) return;
    setFormData((prev) => ({
      ...prev,
      title: currentActivity.activity.title ?? "",
      type_id: currentActivity.activity.type_id ?? "",
      num_participants: currentActivity.activity.num_participants ?? "",
      min_age: currentActivity.activity.min_age ?? "",
      max_age: currentActivity.activity.max_age ?? "",
      duration: currentActivity.activity.duration ?? "",
      objectives: currentActivity.activity.objectives ?? "",
      introduction: currentActivity.activity.introduction ?? "",
      description: currentActivity.activity.description ?? "",
      conclusion: currentActivity.activity.conclusion ?? "",
      materials:
        currentActivity.materials?.map((m) => ({
          id: String(m.id),
          quantity: m.pivot?.quantity || 1,
          notes: m.pivot?.notes || "",
        })) || [],
      risks: currentActivity.risks?.map((r) => String(r.id)) || [],
    }));
  }, [currentActivity]);

  // ---------- 3. Enviar formulario (crear / editar) ----------
  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...formData, mode };

    if (!isEditing) {
      await dispatch(createActivity(payload)).unwrap();
    } else {
      await dispatch(updateActivityAction({ id: activityId, data: payload })).unwrap();
    }
    window.location.href = "/profile"; // FUERZA RECARGAR TODO --> NO PUEDO RECARGAR ACTIVIDADES FAVORITAS POR ESTAR EN EL SLICE DE AUTH.
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
