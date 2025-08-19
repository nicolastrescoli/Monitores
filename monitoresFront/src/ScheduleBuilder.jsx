import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activities from "./Activities.jsx";
import Schedule from "./Schedule.jsx";
// import useResize from "./useResize";
import { useState } from "react";

export default function ScheduleBuilder() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const hourSlots = Array.from({ length: 24 }, (_, i) => ({ start: i, end: i + 1 }));
  const [assignedActivities, setAssignedActivities] = useState([]);

  // const { startDynamicResize, startHorizontalResize } = useResize(
  //   assignedActivities,
  //   setAssignedActivities
  // );

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

  const handleDropActivity = (activityId, date, hour) => {
  setAssignedActivities((prev) => [
    ...prev,
    {
      // 👇 Generamos un identificador único para cada instancia
      instanceId: `${activityId}-${date.toDateString()}-${hour}-${Date.now()}`,
      id: activityId,
      name: `Actividad ${activityId}`,
      date: date.toDateString(),
      hour,
      duration: 1,
      daysSpan: 1,
    },
  ]);
};

const handleRemoveActivity = (instanceId) => {
  setAssignedActivities((prev) =>
    prev.filter((a) => a.instanceId !== instanceId)
  );
};


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
        <div className="d-flex my-3">
          <label>Rango de fechas:</label>
          <div className="d-flex gap-2 col-md-2">
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
                startDate ? new Date(startDate.getTime() + 14 * 86400000) : null
              }
              placeholderText="Fecha de fin"
              className="form-control"
            />
          </div>
        </div>

        <div className="calendar d-flex">
          <Activities />

          <Schedule
            days={days}
            hourSlots={hourSlots}
            assignedActivities={assignedActivities}
            handleDropActivity={handleDropActivity}
            handleRemoveActivity={handleRemoveActivity}
            // startDynamicResize={startDynamicResize}
            // startHorizontalResize={startHorizontalResize}
          />
        </div>

      </main>
    </>
  );
}
