export default function Cell({
  hour,
  date,
  activity,
  onDropActivity,
  onMoveActivity,
  onDeleteActivity,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    if (data.instanceId) {
      onMoveActivity?.(data.instanceId, date, hour);
    } else if (data.activityId) {
      onDropActivity?.(data.activityId, date, hour);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ instanceId: activity.instanceId, activityId: activity.id })
    );
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <td
      rowSpan={activity?.duration || 1}
      colSpan={activity?.daysSpan || 1}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: "relative", height: `${(activity?.duration || 1) * 60}px` }}
    >
      {activity ? (
        <div
          className="bg-success text-white p-1 rounded"
          draggable
          onDragStart={handleDragStart}
          style={{ height: "100%", position: "relative" }}
        >
          {activity.name}
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDeleteActivity?.(activity.instanceId)}
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>
      ) : null}
    </td>
  );
}
