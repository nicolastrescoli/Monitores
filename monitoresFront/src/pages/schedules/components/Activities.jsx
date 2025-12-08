import { typeColors } from "./typeColors";

export default function Activities({ activities }) {
  return (
    <div className="activities pe-3">
      <h3>Actividades</h3>
      <div
        className="table-wrapper"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {activities.map((activity) => {
          const color = typeColors[activity.type_id] || "dark";

          return (
            <div
              className={`activity bg-${color} text-white p-2 mb-1 rounded`}
              draggable
              data-id={activity.id}
              key={activity.id}
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({
                    instanceId: activity.instanceId ?? null,
                    activityId: activity.id,
                  })
                )
              }
            >
              {activity.title} - {activity.duration} min
            </div>
          );
        })}
      </div>
    </div>
  );
}
