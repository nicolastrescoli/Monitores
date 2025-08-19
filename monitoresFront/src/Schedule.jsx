import Cell from "./Cell.jsx";
import { useState, useEffect } from "react";

export default function Schedule({
  days,
  hourSlots,
  assignedActivities,
  handleDropActivity,
  handleRemoveActivity,
  // startHorizontalResize,
  // startDynamicResize,
}) {

  // Mapa del estado de las celdas
  const [cellMap, setCellMap] = useState({}); 

  // Sincronizar cuando cambie assignedActivities (prop externa)
  useEffect(() => {
    const map = {};
    assignedActivities.forEach((a) => {
      const rowIndex = hourSlots.findIndex((h) => h.start === a.hour);
      const colIndex = days.findIndex(
        (d) => d.toDateString() === a.date
      );
      if (rowIndex >= 0 && colIndex >= 0) {
        map[`${rowIndex}-${colIndex}`] = a;
      }
    });
    setCellMap(map);
  }, [assignedActivities, days, hourSlots]);
  
    console.log("Cell map updated:", cellMap); // Para depuración

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
          </thead>
          <tbody>
            {hours.map((slot, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ borderLeft: "none", borderBottom: "none" }}>
                  {slot.start}:00
                </td>
                {(() => {
                  const cells = [];
                  for (let colIndex = 0; colIndex < datesSlice.length; colIndex++) {
                    const key = `${rowIndex}-${colIndex}`;
                    if (occupied.has(key)) continue; // 👈 saltar si ya está ocupado

                    const date = datesSlice[colIndex];
                    const dateStr = date.toDateString();

                    // 👉 ahora buscamos por fecha + hora, no solo por id
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
                          onDropActivity={(activityId) =>
                            handleDropActivity(activityId, date, slot.start)
                          }
                          // 🔑 eliminamos por instanceId, no por id general
                          onDeleteActivity={() =>
                            handleRemoveActivity(currentActivity.instanceId)
                          }
                          // onStartResize={startDynamicResize}
                          // onStartHorizontalResize={startHorizontalResize}
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
                          onDropActivity={(activityId) =>
                            handleDropActivity(activityId, date, slot.start)
                          }
                          onDeleteActivity={handleRemoveActivity}
                          // onStartResize={startDynamicResize}
                          // onStartHorizontalResize={startHorizontalResize}
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
    <div className="grid col-3 col-md-10">
      {days.length <= 7 ? (
        renderTable(days, hourSlots)
      ) : (
        <>
          {renderTable(days.slice(0, 7), hourSlots)}
          {renderTable(days.slice(7), hourSlots)}
        </>
      )}
    </div>
  );
}
