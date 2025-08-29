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
    if (!activity) return;
    e.dataTransfer.setData("application/json",
      JSON.stringify({ instanceId: activity.instanceId, activityId: activity.id })
    );
  };

  const handleDragOver = (e) => e.preventDefault();

  if (!activity) {
    return <td onDrop={handleDrop} onDragOver={handleDragOver} style={{ height: 60 }} />;
  }

  return (
    <td
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        borderTopLeftRadius: activity.isHead ? 8 : 0,
        borderBottomLeftRadius: activity.isTail ? 8 : 0,
        borderTopRightRadius: activity.isHead ? 8 : 0,
        borderBottomRightRadius: activity.isTail ? 8 : 0,
        padding: 0,
        height: 60,
      }}
    >
      <div
        className="bg-success text-white p-1"
        draggable
        onDragStart={handleDragStart}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {activity.isHead && (
          <>
            <span><strong>{activity.title}</strong></span>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDeleteActivity?.(activity.instanceId)}
              style={{
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </>
        )}
      </div>
    </td>
  );
}
