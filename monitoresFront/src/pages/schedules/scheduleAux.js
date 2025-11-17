import axios from "../../axios"; // el archivo que creaste antes

export function placeActivity(cellMap, activity, date, hour, days, hourSlots) {
  const rowIndex = hourSlots.findIndex((h) => h === hour);
  const colIndex = days.findIndex(
    (d) => d.toDateString() === date.toDateString()
  );
  if (rowIndex < 0 || colIndex < 0) return cellMap;

  const instanceId = activity.instanceId || Date.now() + "-" + Math.random();
  const newMap = { ...cellMap };

  const durationRows = Math.ceil(activity.duration / 60); // asumir 60 min por celda, ajustar si tu interval es distinto

  // Verificar solapamientos ignorando celdas propias
  for (let i = 0; i < durationRows; i++) {
    const key = `${rowIndex + i}-${colIndex}`;
    if (newMap[key] && newMap[key].instanceId !== instanceId) {
      return null; // espacio ocupado por otra actividad
    }
  }

  for (let i = 0; i < durationRows; i++) {
    const key = `${rowIndex + i}-${colIndex}`;
    newMap[key] = {
      ...activity,
      instanceId,
      isHead: i === 0,
      isTail: i === durationRows - 1,
      hour, // hora de la celda
      day: date.toLocaleDateString(), // día de la celda en formato "dd/mm/yyyy"
    };
  }

  return newMap;
}

export function removeActivity(cellMap, instanceId) {
  const newMap = { ...cellMap };
  for (const key in newMap) {
    if (newMap[key].instanceId === instanceId) {
      delete newMap[key];
    }
  }
  return newMap;
}

export function moveActivity(cellMap, instanceId, date, hour, days, hourSlots) {
  const activityCells = Object.entries(cellMap).filter(
    ([, val]) => val.instanceId === instanceId
  );
  if (activityCells.length === 0) return cellMap;

  const activity = activityCells[0][1]; // tomar la cabeza

  // primero intentamos colocarla en la nueva posición
  const tempMap = { ...cellMap };
  const newMap = placeActivity(tempMap, activity, date, hour, days, hourSlots);

  if (!newMap) {
    // no se pudo mover porque hay solapamiento
    return cellMap; // mantener la actividad en su lugar
  }

  // eliminar la actividad antigua
  const finalMap = removeActivity(newMap, instanceId);

  // volver a colocarla en su nueva posición con hora y día actualizados
  return placeActivity(finalMap, activity, date, hour, days, hourSlots);
}

export async function saveSchedule(cellMap) {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8000";

  try {
    await axios.get("/sanctum/csrf-cookie");
    await axios.post("/api/schedules/store",
      { cell_map: JSON.parse(cellMap) },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    
  } catch (error) {
    if (error.response) {
      console.error("Código:", error.response.status);
      console.error("Detalles:", error.response.data);
    } else {
      console.error("Error desconocido:", error);
    }
  }
}
