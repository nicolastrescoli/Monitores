export default function Activities({activities}) {

  return (
    <div className="activities pe-3">
      <h3>Actividades</h3>
      {activities.map((activity) => (
        <div
          className="activity bg-dark text-white p-2 mb-1 rounded"
          draggable
          data-id={activity.id}
          key={activity.id}
          onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ instanceId: activity.instanceId ?? null, activityId: activity.id }
    ))}
        >
          {activity.title} - {activity.duration} min
        </div>
      ))}
    </div>
  );
}
