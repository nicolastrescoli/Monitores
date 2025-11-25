import "react-datepicker/dist/react-datepicker.css";
import Cell2 from "./components/Cell2";
import { useEffect, useState, useRef } from "react";

export default function Schedule2({
  cellMap,
  handleRemoveActivity,
  handleDropActivity,
  isEditing,
  scheduleId,
  startDate,
  endDate,
}) {
  const [localMap, setLocalMap] = useState(cellMap);
  const [dates, setDates] = useState([]);

// Formatear fechas en local YYYY-MM-DD
function formatDateLocal(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

useEffect(() => {
  if (!startDate || !endDate) {
    setLocalMap(cellMap);

    // Inicializar dates a 7 días consecutivos desde el día más antiguo del cellMap
    const keys = Object.keys(cellMap).sort();
    const base = keys[0] || formatDateLocal(new Date());
    const ds = [];
    const start = new Date(base);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      ds.push(formatDateLocal(d));
    }
    setDates(ds);
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const oldValues = Object.values(cellMap);

  // Construir rango de fechas exacto en local
  const dateRange = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateRange.push(formatDateLocal(d));
  }

  // Validar que hay suficientes días para las actividades existentes
  if (dateRange.length < oldValues.length) {
    alert("Has seleccionado menos días que los que ya tienes programados");
    return;
  }

  // Construir nuevo mapa solo con fechas dentro del rango
  const newMap = {};
  let i = 0;
  for (const dateKey of dateRange) {
    newMap[dateKey] = oldValues[i] ?? {};
    i++;
  }

  setLocalMap(newMap);
  setDates(dateRange);
}, [startDate, endDate, cellMap]);


  // ---------------------------------------------------
  // Horas
  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  };

  const times = generateTimes();

  const handleDrop = (e, date, time) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    handleDropActivity?.(data.activityId, date, time, times, data.instanceId);
  };

  // Scroll a 07:30
  const tableWrapperRef = useRef(null);
  useEffect(() => {
    if (tableWrapperRef.current) {
      const row = Array.from(
        tableWrapperRef.current.querySelectorAll("tbody tr")
      ).find((tr) => tr.firstChild.textContent.startsWith("07:30"));
      if (row) {
        row.scrollIntoView({ block: "start" });
      }
    }
  }, []);

  return (
    <div
      className="table-wrapper"
      ref={tableWrapperRef}
      style={{ maxHeight: "542px", overflowY: "auto" }}
    >
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Hora</th>
            {dates.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td style={{ height: 5, padding: 0 }}>{time}</td>
              {dates.map((date) => {
                const activity = localMap[date]?.[time] || null;
                return (
                  <td
                    key={date + time}
                    style={{ height: 5, padding: 0 }}
                    onDrop={(e) => handleDrop(e, date, time)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Cell2
                      activity={activity}
                      handleRemoveActivity={handleRemoveActivity}
                      isEditing={isEditing}
                      scheduleId={scheduleId}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
