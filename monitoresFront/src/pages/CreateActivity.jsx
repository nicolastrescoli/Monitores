import { useState, useEffect } from "react";
import axios from "axios";
import StructuredForm from "./StructuredForm";
import FreeForm from "./FreeForm";

export default function CreateActivity() {
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
    risks: [],
  });

  // Cargar datos iniciales
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData, mode };
    try {
      await axios.post("http://localhost:8000/api/activities/store", payload, {
        withCredentials: true,
      });
      alert("Actividad creada!");
      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      alert("Error al crear la actividad");
    }
  };

  return (
    <div className="container py-4">
      <h2>Nueva actividad</h2>

      {/* Selector de modo */}
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

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {mode === "structured" ? (
          <StructuredForm
            formData={formData}
            setFormData={setFormData}
            types={types}
            materials={materials}
            risks={risks}
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
            Guardar actividad
          </button>
        </div>
      </form>
    </div>
  );
}
