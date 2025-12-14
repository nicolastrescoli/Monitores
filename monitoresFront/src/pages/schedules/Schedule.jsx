import "react-datepicker/dist/react-datepicker.css";
import Cell from "./components/Cell";
import { useEffect, useState, useRef } from "react";

export default function Schedule({
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
    const keys = Object.keys(cellMap).sort();

    // MODO SIN startDate / endDate
    if (!startDate || !endDate) {
      setLocalMap(cellMap);

      // Si no hay fechas ya fijadas en UI (primer render)
      if (dates.length === 0) {
        const base = keys[0] || formatDateLocal(new Date());

        const initialDates = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(base);
          d.setDate(d.getDate() + i);
          initialDates.push(formatDateLocal(d));
        }

        setDates(initialDates);
        return;
      }

      // Si ya hay fechas en UI mantenerlas
      let updatedDates = [...dates];

      // Asegurar mínimo 7 días siempre
      while (updatedDates.length < 7) {
        const last = new Date(updatedDates[updatedDates.length - 1]);
        last.setDate(last.getDate() + 1);
        updatedDates.push(formatDateLocal(last));
      }

      // IMPORTANTE: NO reconstruimos ni reordenamos el mapa aquí
      setDates(updatedDates);
      return;
    }

    // MODO CON RANGO DEFINIDO
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateRange = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dateRange.push(formatDateLocal(new Date(d)));
    }

    // Asegurar mínimo 7 días visibles
    while (dateRange.length < 7) {
      const last = new Date(dateRange[dateRange.length - 1]);
      last.setDate(last.getDate() + 1);
      dateRange.push(formatDateLocal(last));
    }

    // Reconstruir mapa pero sin reordenar actividades existentes
    const newMap = {};
    dateRange.forEach((dateKey) => {
      newMap[dateKey] = cellMap[dateKey] ?? {};
    });

    setLocalMap(newMap);
    setDates(dateRange);
  }, [startDate, endDate, cellMap]);

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
      style={{
        maxHeight: "542px",
        maxWidth: "1500px",
        overflowY: "auto",
        overflowX: "auto",
      }}
    >
      <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: 75 }}>Hora</th>
            {dates.map((date) => {
              const formatted = new Date(date).toLocaleDateString("es-ES");
              return (
                <th key={date} style={{ width: 200 }}>
                  {formatted}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td style={{ height: 5, width: 75, padding: 0 }}>{time}</td>
              {dates.map((date) => {
                const activity = localMap[date]?.[time] || null;
                return (
                  <td
                    key={date + time}
                    style={{ width: 200, height: 5, padding: 0 }}
                    onDrop={(e) => handleDrop(e, date, time)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Cell
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
