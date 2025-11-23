import Activities from "./components/Activities.jsx";
import { useState, useEffect } from "react";
import Schedule2 from "./Schedule2.jsx";
import Buttons from "./components/Buttons.jsx";
import { getSchedule } from "../../services/api.js";
import { useParams } from "react-router-dom";
import { placeActivity, removeActivity } from "./scheduleAux2.js";
import { useLocation } from "react-router-dom"; // para traer states pasados por <Link>

export default function ScheduleBuilder2() {
  const { id: scheduleId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cellMap, setCellMap] = useState({});
  const [isEditing, setIsEditing] = useState(scheduleId && false);
  const [originalData, setOriginalData] = useState(null); // Para deshacer cambios si sale sin guardar

  // Actividades creadas y guardadas del usuario
  const location = useLocation();
  const activities = location.state?.favoriteActivities || [];

  // Cargar schedule solo si existe un id
  useEffect(() => {
    async function fetchSchedule() {
      if (!scheduleId) {
        setCellMap({});
        return;
      }

      try {
        const res = await getSchedule(scheduleId);
        setCellMap(res.cellMap || {});
        setName(res.name || "");
        setDescription(res.description || "");
      } catch (err) {
        console.error("Error cargando schedule:", err);
        setCellMap({});
      }
    }
    fetchSchedule();
  }, [scheduleId]);

  const handleMoveActivity = (cellMap, instanceId, date, hour, times) => {
    const newMap = structuredClone(cellMap);
    let activity = null;

    for (const dateKey in newMap) {
      for (const hourKey in newMap[dateKey]) {
        const cell = newMap[dateKey][hourKey];
        if (cell.instanceId === instanceId) {
          if (!activity) activity = { ...cell };
          delete newMap[dateKey][hourKey];
        }
      }
    }

    if (!activity) return cellMap;
    return placeActivity(newMap, activity, date, hour, times);
  };

  const handleDropActivity = (activityId, date, hour, times, instanceId) => {
    if (instanceId) {
      setCellMap(
        (prev) =>
          handleMoveActivity(prev, instanceId, date, hour, times) || prev
      );
    } else {
      const baseActivity = activities.find((a) => a.id === activityId);
      if (!baseActivity) return;
      setCellMap(
        (prev) => placeActivity(prev, baseActivity, date, hour, times) || prev
      );
    }
  };

  const handleRemoveActivity = (instanceId) => {
    setCellMap((prev) => removeActivity(prev, instanceId));
  };

  return (
    <div className="d-flex">
      <div className="d-flex flex-column col-2 me-4">
        {!scheduleId || isEditing ? (
          <>
          <h3>
            <input
              type="text"
              value={name}
              placeholder="Nueva Programación"
              onChange={(e) => setName(e.target.value)}
            />
          </h3>
          <textarea 
            value={description}
            placeholder="descripción..."
            onChange={(e) => setDescription(e.target.value)}/>
          </>
        ) : (
          <>
            <h3>{name ? name : "Nueva programación"}</h3>
            <p>{description ? description : "Ninguna descripción"}</p>
          </>
        )}
        {(!scheduleId || isEditing) && (<><Activities activities={activities} /></>)}
      </div>
      <div className="calendar col">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="col-2"></div>
          <div>
            {/* <Paginador
            days={days}
            page={page}
            endIndex={endIndex}
            daysSlice={daysSlice}
            setPage={setPage}
          /> */}
          </div>
          <Buttons
            scheduleId={scheduleId}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            name={name}
            description={description}
            cellMap={cellMap}
            onEditStart={() => {
              // Guardar snapshot al editar
              setOriginalData({
                name,
                description,
                cellMap: structuredClone(cellMap),
              });
            }}
            onCancelEdit={() => {
              // Al salir sin guardar
              if (originalData) {
                setName(originalData.name);
                setDescription(originalData.description);
                setCellMap(structuredClone(originalData.cellMap));
              }
              setIsEditing(false);
            }}
          />
        </div>
        <Schedule2
          cellMap={cellMap}
          handleRemoveActivity={handleRemoveActivity}
          handleDropActivity={handleDropActivity}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
