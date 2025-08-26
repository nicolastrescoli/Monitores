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
    return (
      <div className="table-wrapper">
        <table className="table table-bordered" style={{ tableLayout: "fixed", zIndex: -1 }}>
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
                <td>{slot.start}:00</td>
                {datesSlice.map((date, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
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

  return (
    <div className="grid col-3 col-md-10">
      {days.length <= 7
        ? renderTable(days, hourSlots)
        : (
          <>
            {renderTable(days.slice(0, 7), hourSlots)}
            {renderTable(days.slice(7), hourSlots)}
          </>
        )}
    </div>
  );
}
