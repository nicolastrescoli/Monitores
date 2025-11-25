import Activities from "./components/Activities.jsx";
import { useState, useEffect } from "react";
import Schedule2 from "./Schedule2.jsx";
import Buttons from "./components/Buttons.jsx";
import { getSchedule } from "../../services/api.js";
import { useParams } from "react-router-dom";
import { placeActivity, removeActivity } from "./scheduleAux2.js";
import { useLocation } from "react-router-dom"; // para traer states pasados por <Link>
import DatePicker from "react-datepicker";
import DescriptionModal from "./DescriptionModal.jsx";

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

  // Estados para el rango de fechas Datepicker
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="d-flex">
      <div className="d-flex flex-column col-2 me-3">
        {!scheduleId || isEditing ? (
          <>
            <h3>
              <input
                type="text"
                className="col-11"
                value={name}
                placeholder="Nueva Programación"
                onChange={(e) => setName(e.target.value)}
              />
            </h3>
            <div className="d-flex gap-2 col-md-11 my-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Fecha de inicio"
                className="form-control"
                maxDate={endDate}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={
                  startDate
                    ? new Date(startDate.getTime() + 14 * 86400000)
                    : null
                }
                placeholderText="Fecha de fin"
                className="form-control"
              />
            </div>
            <Activities activities={activities} />
          </>
        ) : (
          <>
            <h3>{name ? name : "Nueva programación"}</h3>
            <p>{description ? description : "Ninguna descripción"}</p>
          </>
        )}
      </div>
      <div className="calendar col">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {!scheduleId || isEditing ? (
            <DescriptionModal description={description} setDescription={setDescription}/> 
            ) : (
              <div className="col-2"></div>  
            )
          }
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
          scheduleId={scheduleId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
}
