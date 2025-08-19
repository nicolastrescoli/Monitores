export default function Activities({activities}) {

  return (
    <div className="activities col-2 pe-3">
      <h3>Actividades</h3>
      {activities.map((_, idx) => (
        <div
          className="activity bg-dark text-white p-1 mb-1 rounded"
          draggable
          data-id={idx + 1}
          key={idx}
          onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ instanceId: _.instanceId, activityId: _.id }
    ))}
        >
          {activities[idx].name}
        </div>
      ))}
    </div>
  );
}
