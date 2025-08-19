export default function Activities() {
  const activityNames = [
    "Actividad 1",
    "Actividad 2",
    "Actividad 3",
    "Actividad 4",
    "Actividad 5",
    "Actividad 6",
    "Trampantojo",
  ];

  return (
    <div className="activities col-2 pe-3">
      <h3>Actividades</h3>
      {activityNames.map((name, idx) => (
        <div
          className="activity bg-dark text-white p-1 mb-1 rounded"
          draggable
          data-id={idx + 1}
          key={idx}
          onDragStart={(e) => e.dataTransfer.setData("text/plain", idx + 1)}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
