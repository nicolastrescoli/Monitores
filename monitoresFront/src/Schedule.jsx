import Cell from "./Cell.jsx";

export default function Schedule({
  days,
  hourSlots,
  cellMap,
  handleDropActivity,
  handleMoveActivity,
  handleRemoveActivity,
}) {
  const renderTable = (datesSlice, hours) => {
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
                  for (
                    let colIndex = 0;
                    colIndex < datesSlice.length;
                    colIndex++
                  ) {
                    const key = `${rowIndex}-${colIndex}`;
                    if (occupied.has(key)) continue;

                    const activity = cellMap[key];
                    const date = datesSlice[colIndex];

                    if (activity) {
                      cells.push(
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

                      // 👉 marcar celdas ocupadas
                      for (let d = 0; d < activity.daysSpan; d++) {
                        for (let h = 0; h < activity.duration; h++) {
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
                          onMoveActivity={handleMoveActivity}
                          onDeleteActivity={handleRemoveActivity}
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
