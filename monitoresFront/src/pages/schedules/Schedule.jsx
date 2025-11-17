import { useState, useEffect, useRef } from "react";
import Paginador from "./Paginador.jsx";
import Cell from "./Cell.jsx";
import { saveSchedule } from "./scheduleAux.js";

export default function Schedule({
  days,
  hourSlots,
  cellMap,
  handleDropActivity,
  handleMoveActivity,
  handleRemoveActivity,
}) {
  // Handlers de botones Guardar, Imprimir, Salir
  function handleStoreSchedule(cellMap) {
    try {
      saveSchedule(JSON.stringify(cellMap));
    } catch (error) {
      console.log("Error al guardar", error);
    }
  }

  const handlePrint = () => {};
  const handleExit = () => {
    window.location.href = "/profile";
  };

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

                  const key = `${rowIdx}-${startIndex + colIdx}`;
                  const activity = cellMap[key];

                  return (
                    <Cell
                      key={key}
                      hour={slot}
                      date={date}
                      activity={activity}
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
        <div className="d-flex gap-2 col-2">
          <button
            className="btn btn-dark"
            onClick={() => handleStoreSchedule(cellMap)}
          >
            Guardar
          </button>
          <button className="btn btn-dark" onClick={handlePrint}>
            Imprimir
          </button>
          <button className="btn btn-dark" onClick={handleExit}>
            Salir
          </button>
        </div>
      </div>
      {renderTable(daysSlice, hourSlots)}
    </>
  );
}
