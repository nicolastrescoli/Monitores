import "react-datepicker/dist/react-datepicker.css";
import Cell2 from "./components/Cell2";
import { useEffect, useState, useRef } from "react";

export default function Schedule2({
  cellMap,
  handleRemoveActivity,
  handleDropActivity,
  isEditing
}) {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const allDates = Object.keys(cellMap).sort();
    const oldestDate = allDates[0] || new Date().toISOString().split("T")[0];

    const tableDates = [];
    const start = new Date(oldestDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      tableDates.push(d.toISOString().split("T")[0]);
    }

    setDates(tableDates);
  }, [cellMap]);

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

  // Referencia para mostrar la tabla desde las 8:00
  const tableWrapperRef = useRef(null);
  useEffect(() => {
    // Buscar la fila que corresponde a las 8:00
    if (tableWrapperRef.current) {
      const row = Array.from(
        tableWrapperRef.current.querySelectorAll("tbody tr")
      ).find((tr) => tr.firstChild.textContent.startsWith("07:45"));
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
              <td>{time}</td>
              {dates.map((date) => {
                const activity = cellMap[date]?.[time] || null;
                return (
                  <td
                    key={date + time}
                    style={{ height: 15, padding: 0 }}
                    onDrop={(e) => handleDrop(e, date, time)}
                    onDragOver={(e) => e.preventDefault()} // permite el drop
                  >
                    <Cell2
                      activity={activity}
                      handleRemoveActivity={handleRemoveActivity}
                      isEditing={isEditing}
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
