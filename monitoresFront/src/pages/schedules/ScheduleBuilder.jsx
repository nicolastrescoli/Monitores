import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activities from "./components/Activities.jsx";
import Table from "./Table.jsx";
import { useState, useEffect } from "react";
import { placeActivity, removeActivity, moveActivity } from "./scheduleAux.js";
import { getActivities } from "../../services/api.js";

export default function ScheduleBuilder() {
  const [isEditing, setIsEditing] = useState(true);

  // fetch de actividades
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function fetchActivities() {
      const data = await getActivities();
      setActivities(data);
    }
    fetchActivities();
  }, []);

  // Estados para el rango de fechas Datepicker
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // numero de columnas
  const days =
    startDate && endDate
      ? (() => {
          const dates = [];
          let current = new Date(startDate);
          const end = new Date(endDate);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return dates;
        })()
      : Array.from({ length: 7 }, (_, i) => {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + i);
          return defaultDate;
        });

  // minutos por celda (tamaño de fila)
  const timeInterval = 15;
  // numero de celdas por día (nº de filas)
  const hourSlots = Array.from(
    { length: (24 * 60) / timeInterval },
    (_, i) =>
      `${String(Math.floor((i * timeInterval) / 60)).padStart(2, "0")}:${String(
        (i * timeInterval) % 60
      ).padStart(2, "0")}`
  );

  // Estado del cellMap como objeto row-col
  const [cellMap, setCellMap] = useState({});

  console.log("Cell map updated:", cellMap); // Para depuración

  // ---------- HANDLERS ----------

  const handleDropActivity = (activityId, date, hour) => {
    const baseActivity = activities.find((a) => a.id === activityId);
    if (!baseActivity) return;
    setCellMap((prev) => placeActivity(prev, baseActivity, date, hour, days, hourSlots) || prev );
  };

  const handleRemoveActivity = (instanceId) => {
    setCellMap((prev) => removeActivity(prev, instanceId));
  };

  const handleMoveActivity = (instanceId, date, hour) => {
    setCellMap((prev) => moveActivity(prev, instanceId, date, hour, days, hourSlots) );
  };
  

  return (
    <>
      <div className="d-flex">
        <div className="d-flex flex-column col-2">
          <div>
            <h3>Nueva programación</h3>
            {isEditing && (
              <div className="my-3 align-items-center">
                <details open>
                  <summary>Rango de fechas</summary>
                  <div className="d-flex gap-2 col-md-10 mx-2 my-2">
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
                </details>
              </div>
            )}
          </div>
          {isEditing && <Activities activities={activities} />}
        </div>

        <div className="calendar col-10">
          <Table
            days={days}
            hourSlots={hourSlots}
            cellMap={cellMap}
            handleDropActivity={handleDropActivity}
            handleMoveActivity={handleMoveActivity}
            handleRemoveActivity={handleRemoveActivity}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </>
  );
}
