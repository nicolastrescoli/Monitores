import { useState, useEffect, useRef } from "react";
import Paginador from "./components/Paginador.jsx";
import Cell from "./components/Cell.jsx";
import Buttons from "./components/Buttons.jsx";

export default function Table({
  days,
  hourSlots,
  cellMap,
  handleDropActivity,
  handleMoveActivity,
  handleRemoveActivity,
  // isEditing,
  // setIsEditing,
}) {

  const [page, setPage] = useState(0);

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
  }, [page, days]);
  

  const renderTable = (datesSlice, hourSlots) => {
    return (
      <div
        className="table-wrapper"
        ref={tableWrapperRef}
        style={{ maxHeight: "542px", overflowY: "auto" }}
      >
        <table
          className="table table-bordered"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th style={{ width: 60 }}>Hora</th>
              {datesSlice.map((date, colIdx) => (
                <th key={colIdx}>
                  {date ? new Date(date).toLocaleDateString() : ""}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {hourSlots.map((slot, rowIdx) => (
              <tr key={rowIdx}>
                <td>{slot}</td>
                {datesSlice.map((date, colIdx) => {
                  if (!date) {
                    return (
                      <td
                        key={`empty-${rowIdx}-${colIdx}`}
                        style={{
                          border: "none",
                          background: "#e8dbdb",
                          padding: 0,
                        }}
                      />
                    );
                  }

                  // const key = `${rowIdx}-${startIndex + colIdx}`;

                  // // NUEVA CLAVE ============================================================
                  // const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
                  // const key = `${dayKey}:${slot}`;                 // p.ej: "2025-11-18:08:30"
                  // // ======================================================================

                  // const activity = cellMap[key];

                  const dateKey = new Date(date).toISOString().split("T")[0];
                  const activity = cellMap[dateKey]?.[slot] ?? null;

                  return (
                    <Cell
                      hour={slot}
                      date={date}
                      activity={activity} // Pasarle una actividad si estamos trayendo desde la bbdd
                      onDropActivity={handleDropActivity}
                      onMoveActivity={handleMoveActivity}
                      onDeleteActivity={handleRemoveActivity}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // calcular los días de la página actual
  const startIndex = page * 7;
  const endIndex = startIndex + 7;
  let daysSlice = days.slice(startIndex, endIndex);

  // si hay menos de 7 días por página, rellenamos con null
  if (daysSlice.length < 7) {
    const placeholders = Array(7 - daysSlice.length).fill(null);
    daysSlice = [...daysSlice, ...placeholders];
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="col-2"></div>
        <div>
          <Paginador
            days={days}
            page={page}
            endIndex={endIndex}
            daysSlice={daysSlice}
            setPage={setPage}
          />
        </div>
        {/* {isEditing ?  */}
        <Buttons 
        // isEditing={isEditing} setIsEditing={setIsEditing} 
        cellMap={cellMap}/> 
        {/* : ""// Modificar        } */}
      </div>
      {renderTable(daysSlice, hourSlots)}
    </>
  );
}
