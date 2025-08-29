import { useState, useEffect, useRef } from "react";
import Paginador from "./Paginador.jsx";
import Cell from "./Cell.jsx";

export default function Schedule({
  days,
  hourSlots,
  cellMap,
  handleDropActivity,
  handleMoveActivity,
  handleRemoveActivity,
}) {

  // Handlers de botones Guardar, Imprimir, Salir
  const handleStoreSchedule = async () => {
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
        body: JSON.stringify({ cellMap }), // estado actual del calendario
      });

      const data = await response.json();

      if (data.success) {
        alert("Calendario guardado correctamente ✅");
      } else {
        alert("Error al guardar el calendario ❌");
      }
    } catch (error) {
      console.error("Error guardando calendario:", error);
      alert("Error al guardar calendario ❌");
    }
  };

  const handlePrint = () => {};
  const handleExit = () => {};

  const [page, setPage] = useState(0);

  // Referencia para mostrar la tabla desde las 8:00
  const tableWrapperRef = useRef(null);

  useEffect(() => {
    // Buscar la fila que corresponde a las 8:00
    if (tableWrapperRef.current) {
      const row = Array.from(
        tableWrapperRef.current.querySelectorAll("tbody tr")
      ).find((tr) => tr.firstChild.textContent.startsWith("7:00"));
      if (row) {
        row.scrollIntoView({ block: "start" });
      }
    }
  }, [page, days]);

  const renderTable = (datesSlice, hours) => {
    return (
      <div
        className="table-wrapper"
        ref={tableWrapperRef}
        style={{ maxHeight: "542px", overflowY: "auto" }} // scrollable
      >
        <table
          className="table table-bordered"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th style={{ width: 60 }}>Hora</th>
              {datesSlice.map((date, index) => (
                <th key={index}>{date ? date.toLocaleDateString() : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((slot, rowIndex) => (
              <tr key={rowIndex}>
                <td>{slot.start}:00</td>
                {datesSlice.map((date, colIndex) => {
                  const key = `${rowIndex}-${colIndex + page * 7}`;

                  if (!date) {
                    // Celda vacía → hueco sin borde
                    return (
                      <td
                        key={key}
                        style={{
                          border: "none",
                          borderRight: true, // quita el borde
                          background: "#e8dbdb", // totalmente transparente
                          padding: 0, // opcional: quitar padding
                        }}
                      ></td>
                    );
                  }

                  const activity = cellMap[key];
                  return (
                    <Cell
                      key={key}
                      hour={slot.start}
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
          <button className="btn btn-dark" onClick={handleStoreSchedule}>
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
