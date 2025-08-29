import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activities from "./Activities.jsx";
import Schedule from "./Schedule.jsx";
import { useState, useEffect } from "react";
import { placeActivity, removeActivity, moveActivity } from "./scheduleAux";

export default function ScheduleBuilder() {
  // fetch de actividades
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // fetch("/activities.json") // Provisional para pruebas locales
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error al cargar actividades:", err));
  }, []);

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
        <h1 className="mb-0">🌿 Ocio Educativo</h1>
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
        <div className="d-flex">
          <div className="d-flex flex-column col-2">
            <div>
              <h3>Nueva programación</h3>
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
            </div>
            <Activities activities={activities} />
          </div>

          <div className="calendar col-10">
            <Schedule
              days={days}
              hourSlots={hourSlots}
              cellMap={cellMap}
              handleDropActivity={handleDropActivity}
              handleMoveActivity={handleMoveActivity}
              handleRemoveActivity={handleRemoveActivity}
            />
          </div>
        </div>
      </main>

      <footer class="py-4 text-center mt-2">
        <p class="mb-0">&copy; {new Date().getFullYear()} Actividades Verdes</p>
      </footer>
    </>
  );
}
