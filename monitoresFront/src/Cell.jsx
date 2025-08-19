export default function Cell({
  hour,
  date,
  activity,
  activities,
  onDropActivity,
  onDeleteActivity,
  onStartResize,
  onStartHorizontalResize,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const activityId = parseInt(e.dataTransfer.getData("text/plain"));
    onDropActivity?.(activityId, date, hour);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (activity) {
    return (
      <td
        rowSpan={activity.duration}
        colSpan={activity.daysSpan}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ position: "relative", height: `${activity.duration * 60}px` }}
      >
        <div
          className="bg-success text-white p-1 rounded"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", activity.id)}
          style={{ height: "100%", position: "relative" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="col-8">{activity.name}</div>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDeleteActivity(activity.id)}
              style={{ position: "absolute", top: 0, right: 8 }}
            >
              ✖
            </button>
            {/* Resizer horizontal */}
            <div
              className="col-1"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                height: "100%",
                width: 6,
                cursor: "ew-resize",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
              onMouseDown={(e) => onStartHorizontalResize(e, activity.id, activities)}
            ></div>
          </div>

          {/* Resizer vertical */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 10,
              cursor: "ns-resize",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
            onMouseDown={(e) => onStartResize(e, activity.id, activities)}
          ></div>

          {/* Resizer diagonal */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: 12,
              width: 12,
              cursor: "nwse-resize",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
            onMouseDown={(e) => {
              onStartResize(e, activity.id, activities); // vertical
              onStartHorizontalResize(e, activity.id, activities); // horizontal
            }}
          ></div>
        </div>
      </td>
    );
  }

  return <td onDrop={handleDrop} onDragOver={handleDragOver} style={{ height: 60 }} />;
}
