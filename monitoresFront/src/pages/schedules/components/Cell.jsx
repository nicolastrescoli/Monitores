import { typeColors } from "./typeColors";

export default function Cell({ activity, handleRemoveActivity, isEditing, scheduleId }) {
  if (!activity) return null;

  const dragProps = isEditing || !scheduleId // Solo draggable si estamos editando o creando
    ? {
        draggable: true,
        onDragStart: (e) => {
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
              instanceId: activity.instanceId,
              duration: activity.duration,
            })
          );
        },
      }
    : {};

  const color = typeColors[activity.type_id] || "dark"

  return (
    <div
      className={`bg-${color} text-white p-1`}
      {...dragProps}
      style={{
        borderTopLeftRadius: activity.isHead ? 8 : 0,
        borderBottomLeftRadius: activity.isTail ? 8 : 0,
        borderTopRightRadius: activity.isHead ? 8 : 0,
        borderBottomRightRadius: activity.isTail ? 8 : 0,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {activity.isHead && (
        <>
          <span>
            <strong>{activity.title}</strong>
          </span>

          {(isEditing || !scheduleId) && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleRemoveActivity?.(activity.instanceId)}
              style={{
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          )}
        </>
      )}
    </div>
  );
}
