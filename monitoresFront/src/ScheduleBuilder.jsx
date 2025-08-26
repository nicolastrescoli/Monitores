import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activities from "./Activities.jsx";
import Schedule from "./Schedule.jsx";
import { useState } from "react";
import { placeActivity, removeActivity, moveActivity } from "./scheduleAux";

export default function ScheduleBuilder() {
  const activities = [
    { name: "Actividad 1", duration: 1, daysSpan: 1, id: 1 },
    { name: "Actividad 2", duration: 2, daysSpan: 1, id: 2 },
    { name: "Actividad 3", duration: 3, daysSpan: 1, id: 3 },
    { name: "Actividad 4", duration: 4, daysSpan: 1, id: 4 },
    { name: "Actividad 5", duration: 5, daysSpan: 1, id: 5 },
    { name: "Actividad 6", duration: 6, daysSpan: 1, id: 6 },
    { name: "Trampantojo", duration: 7, daysSpan: 1, id: 7 },
  ];

  // Estados para el rango de fechas

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const hourSlots = Array.from({ length: 24 }, (_, i) => ({
    start: i,
    end: i + 1,
  }));

  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const days =
    startDate && endDate
      ? getDatesInRange(startDate, endDate)
      : Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d;
        });

  // Mapa del estado de las celdas
  const [cellMap, setCellMap] = useState({});

  // ---------- HANDLERS ----------

  const handleDropActivity = (activityId, date, hour) => {
    const baseActivity = activities.find((a) => a.id === activityId);
    if (!baseActivity) return;

    setCellMap((prev) =>
      placeActivity(prev, baseActivity, date, hour, days, hourSlots)
    );
  };

  const handleRemoveActivity = (instanceId) => {
    setCellMap((prev) => removeActivity(prev, instanceId));
  };

  const handleMoveActivity = (instanceId, date, hour) => {
    setCellMap((prev) =>
      moveActivity(prev, instanceId, date, hour, days, hourSlots)
    );
  };

  console.log("Cell map updated:", cellMap); // Para depuración

  return (
    <>
      <header className="py-3 text-center">
        <h1 className="mb-0">🌿 Actividades y Juegos</h1>
      </header>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <a className="navbar-brand" href="http://127.0.0.1:8000">
            Inicio
          </a>
          <a className="navbar-brand" href="http://127.0.0.1:8000/profile">
            Perfil
          </a>
          <a className="navbar-brand" href="http://127.0.0.1:8000/community">
            Comunidad
          </a>
          <a className="navbar-brand" href="#">
            Guías
          </a>
          <a className="navbar-brand" href="http://127.0.0.1:8000/about">
            Sobre Nosotros
          </a>
          <a className="navbar-brand" href="http://127.0.0.1:8000/contact">
            Contacto
          </a>
          <a className="navbar-brand" href="http://127.0.0.1:8000/logout">
            Logout
          </a>
        </div>
      </nav>

      <main>
        <h3>Nueva programación</h3>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex col-10 my-3 align-items-center">
            <label>Rango de fechas:</label>
            <div className="d-flex gap-2 col-md-2 mx-2">
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
          </div>
          <div className="d-flex col-2 gap-2">
            <button className="btn btn-dark">Guardar</button>
            <button className="btn btn-dark">Imprimir</button>
          </div>
        </div>

        <div className="calendar d-flex">
          <Activities activities={activities} />

          <Schedule
            days={days}
            hourSlots={hourSlots}
            cellMap={cellMap}
            handleDropActivity={handleDropActivity}
            handleMoveActivity={handleMoveActivity}
            handleRemoveActivity={handleRemoveActivity}
          />
        </div>
      </main>
    </>
  );
}
