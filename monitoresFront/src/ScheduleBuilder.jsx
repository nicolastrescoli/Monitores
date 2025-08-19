import React from "react";
import Cell from "./Cell.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Activities from "./Activities.jsx";
import Schedule from "./Schedule.jsx";

export default function ScheduleBuilder() {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [hourSlots, setHourSlots] = React.useState(
    Array.from({ length: 24 }, (_, i) => ({
      start: 0 + i,
      end: 23 + i,
    }))
  );

  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Días a mostrar, según rango seleccionado o 7 días por defecto
  const days =
    startDate && endDate
      ? getDatesInRange(startDate, endDate)
      : Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d;
        });

  const [assignedActivities, setAssignedActivities] = React.useState([]);
  const [resizingActivity, setResizingActivity] = React.useState(null);
  const [resizingActivityHorizontal, setResizingActivityHorizontal] =
    React.useState(null);

  const startHorizontalResize = (e, activityId) => {
    e.preventDefault();
    const activity = assignedActivities.find((a) => a.id === activityId);
    if (activity) {
      setResizingActivityHorizontal({
        id: activityId,
        initialX: e.clientX,
        originalDaysSpan: activity.daysSpan,
      });
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingActivity) {
        // vertical (ya lo tienes)
        const deltaY = e.clientY - resizingActivity.initialY;
        const deltaDuration = Math.round(deltaY / 60);
        const newDuration = Math.max(
          1,
          resizingActivity.originalDuration + deltaDuration
        );
        setAssignedActivities((prev) =>
          prev.map((a) =>
            a.id === resizingActivity.id ? { ...a, duration: newDuration } : a
          )
        );
      }

      if (resizingActivityHorizontal) {
        // horizontal
        const deltaX = e.clientX - resizingActivityHorizontal.initialX;
        const deltaDays = Math.round(deltaX / 250); // 250px = 1 día (ajusta según ancho columna)
        const newDays = Math.max(
          1,
          resizingActivityHorizontal.originalDaysSpan + deltaDays
        );
        setAssignedActivities((prev) =>
          prev.map((a) =>
            a.id === resizingActivityHorizontal.id
              ? { ...a, daysSpan: newDays }
              : a
          )
        );
      }
    };

    const handleMouseUp = () => {
      if (resizingActivity) setResizingActivity(null);
      if (resizingActivityHorizontal) setResizingActivityHorizontal(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingActivity, resizingActivityHorizontal]);

  const startDynamicResize = (e, activityId) => {
    e.preventDefault();
    const activity = assignedActivities.find((a) => a.id === activityId);
    if (activity) {
      setResizingActivity({
        id: activityId,
        initialY: e.clientY,
        originalDuration: activity.duration,
      });
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingActivity) {
        const deltaY = e.clientY - resizingActivity.initialY;
        const deltaDuration = Math.round(deltaY / 60); // 60px = 1h
        const newDuration = Math.max(
          1,
          resizingActivity.originalDuration + deltaDuration
        );
        setAssignedActivities((prev) =>
          prev.map((a) =>
            a.id === resizingActivity.id ? { ...a, duration: newDuration } : a
          )
        );
      }
    };

    const handleMouseUp = () => {
      if (resizingActivity) {
        setResizingActivity(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingActivity]);

  const handleDropActivity = (activityId, date, hour) => {
    setAssignedActivities((prev) => {
      const existing = prev.find((a) => a.id === activityId);
      if (existing) {
        return prev.map((a) =>
          a.id === activityId ? { ...a, date: date.toDateString(), hour } : a
        );
      }
      return [
        ...prev,
        {
          id: activityId,
          name: `Actividad ${activityId}`,
          date: date.toDateString(),
          hour,
          duration: 1,
          daysSpan: 1,
        },
      ];
    });
  };

  const handleRemoveActivity = (activityId) => {
    setAssignedActivities((prev) => prev.filter((a) => a.id !== activityId));
  };

  // Ahora renderTable recibe los días y las franjas horarias (hourSlots)
  const renderTable = (datesSlice, hours) => {
    // Mapa de celdas ocupadas: key = `${rowIndex}-${colIndex}`
    const occupied = new Set();

    return (
      <div className="table-wrapper">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Hora</th>
              {datesSlice.map((date, index) => (
                <th key={index}>{date.toLocaleDateString()}</th>
              ))}
            </tr>
            <tr>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {hours.map((slot, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ borderLeft: "none", borderBottom: "none" }}>
                  {slot.start}:00
                </td>
                {(() => {
                  const cells = [];
                  for (
                    let colIndex = 0;
                    colIndex < datesSlice.length;
                    colIndex++
                  ) {
                    const key = `${rowIndex}-${colIndex}`;
                    if (occupied.has(key)) continue; // 👈 saltar si ya está ocupado

                    const date = datesSlice[colIndex];
                    const dateStr = date.toDateString();

                    const currentActivity = assignedActivities.find(
                      (a) => a.date === dateStr && a.hour === slot.start
                    );

                    if (currentActivity) {
                      cells.push(
                        <Cell
                          key={key}
                          hour={slot.start}
                          date={date}
                          activity={currentActivity}
                          onDropActivity={handleDropActivity}
                          onDeleteActivity={handleRemoveActivity}
                          onStartResize={startDynamicResize}
                          onStartHorizontalResize={startHorizontalResize}
                        />
                      );

                      // 👉 marcar celdas ocupadas vertical y horizontalmente
                      for (let d = 0; d < currentActivity.daysSpan; d++) {
                        for (let h = 0; h < currentActivity.duration; h++) {
                          occupied.add(`${rowIndex + h}-${colIndex + d}`);
                        }
                      }
                    } else {
                      cells.push(
                        <Cell
                          key={key}
                          hour={slot.start}
                          date={date}
                          onDropActivity={handleDropActivity}
                          onDeleteActivity={handleRemoveActivity}
                          onStartResize={startDynamicResize}
                          onStartHorizontalResize={startHorizontalResize}
                        />
                      );
                    }
                  }
                  return cells;
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

          <Schedule days={days} renderTable={renderTable} hourSlots={hourSlots} />

          {/* <div className="grid col-10">
            {days.length <= 7 && renderTable(days, hourSlots)}
            {days.length > 7 && (
              <>
                {renderTable(days.slice(0, 7), hourSlots)}
                {renderTable(days.slice(7), hourSlots)}
              </>
            )}
          </div> */}
        </div>
      </main>
    </>
  );
}
