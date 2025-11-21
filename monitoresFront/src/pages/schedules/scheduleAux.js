import axios from "../../axios"; // el archivo que creaste antes

// export function placeActivity(cellMap, activity, date, hour, days, hourSlots) {
//   const rowIndex = hourSlots.findIndex((h) => h === hour);
//   const colIndex = days.findIndex(
//     (d) => d.toDateString() === date.toDateString()
//   );
//   if (rowIndex < 0 || colIndex < 0) return cellMap;

//   const instanceId = activity.instanceId || Date.now() + "-" + Math.random();
//   const newMap = { ...cellMap };

//   const durationRows = Math.ceil(activity.duration / 60); // asumir 60 min por celda, ajustar si tu interval es distinto

//   // Verificar solapamientos ignorando celdas propias
//   for (let i = 0; i < durationRows; i++) {
//     const key = `${rowIndex + i}-${colIndex}`;

//     if (newMap[key] && newMap[key].instanceId !== instanceId) {
//       return null; // espacio ocupado por otra actividad
//     }
//   }

//   for (let i = 0; i < durationRows; i++) {
//     const key = `${rowIndex + i}-${colIndex}`;
//     newMap[key] = {
//       ...activity,
//       instanceId, // OK
//       isHead: i === 0, // OK
//       isTail: i === durationRows - 1, // OK
//       hour, // hora de la celda // start
//       day: date.toLocaleDateString(), // día de la celda en formato "dd/mm/yyyy" 
//     };
//   }

//   return newMap;
// }

// export function placeActivity(cellMap, activity, date, hour, days, hourSlots) {
//   const rowIndex = hourSlots.findIndex((h) => h === hour);
//   const colIndex = days.findIndex(
//     (d) => d.toDateString() === date.toDateString()
//   );
//   if (rowIndex < 0 || colIndex < 0) return cellMap;

//   const instanceId = activity.instanceId || Date.now() + "-" + Math.random();
//   const newMap = { ...cellMap };

//   // Formato estable YYYY-MM-DD
//   const dayKey = date.toISOString().split("T")[0];

//   const durationRows = Math.ceil(activity.duration / 60);

//   // --- 1. Comprobar solapamiento ---
//   for (let i = 0; i < durationRows; i++) {
//     const row = rowIndex + i;
//     const slotHour = hourSlots[row];

//     if (!slotHour) continue;

//     const key = `${dayKey}:${slotHour}`;

//     if (newMap[key] && newMap[key].instanceId !== instanceId) {
//       return null; // solapamiento con otra actividad
//     }
//   }

//   // --- 2. Colocar la actividad en el mapa ---
//   for (let i = 0; i < durationRows; i++) {
//     const row = rowIndex + i;
//     const slotHour = hourSlots[row];

//     if (!slotHour) continue;

//     const key = `${dayKey}:${slotHour}`;

//     newMap[key] = {
//       ...activity,
//       instanceId,
//       isHead: i === 0,
//       isTail: i === durationRows - 1,
//       hour: slotHour,
//       day: dayKey, // estandarizado
//     };
//   }

//   return newMap;
// }

export function placeActivity(cellMap, activity, date, hour, days, hourSlots) {
  const dateKey = date.toISOString().split("T")[0];
  const rowIndex = hourSlots.indexOf(hour);
  if (rowIndex < 0) return cellMap;

  const instanceId = activity.instanceId || Date.now() + "-" + Math.random();
  const durationRows = Math.ceil(activity.duration / 60);

  const newMap = structuredClone(cellMap);
  if (!newMap[dateKey]) newMap[dateKey] = {};

  // evitar solapamientos
  for (let i = 0; i < durationRows; i++) {
    const h = hourSlots[rowIndex + i];
    if (!h) return null;

    const cell = newMap[dateKey][h];
    if (cell && cell.instanceId !== instanceId) return null;
  }

  // escribir celdas
  for (let i = 0; i < durationRows; i++) {
    const h = hourSlots[rowIndex + i];

    newMap[dateKey][h] = {
      ...activity,
      instanceId,
      isHead: i === 0,
      isTail: i === durationRows - 1
    };
  }

  return newMap;
}

// export function removeActivity(cellMap, instanceId) {
//   const newMap = { ...cellMap };
//   for (const key in newMap) {
//     if (newMap[key].instanceId === instanceId) {
//       delete newMap[key];
//     }
//   }
//   return newMap;
// }

export function removeActivity(cellMap, instanceId) {
  const newMap = structuredClone(cellMap);

  for (const dateKey in newMap) {
    for (const hourKey in newMap[dateKey]) {
      if (newMap[dateKey][hourKey].instanceId === instanceId) {
        delete newMap[dateKey][hourKey];
      }
    }
    // si un día queda vacío, lo eliminamos
    if (Object.keys(newMap[dateKey]).length === 0) {
      delete newMap[dateKey];
    }
  }

  return newMap;
}


// export function moveActivity(cellMap, instanceId, date, hour, days, hourSlots) {
//   const activityCells = Object.entries(cellMap).filter(
//     ([, val]) => val.instanceId === instanceId
//   );
//   if (activityCells.length === 0) return cellMap;

//   const activity = activityCells[0][1]; // tomar la cabeza

//   // primero intentamos colocarla en la nueva posición
//   const tempMap = { ...cellMap };
//   const newMap = placeActivity(tempMap, activity, date, hour, days, hourSlots);

//   if (!newMap) {
//     // no se pudo mover porque hay solapamiento
//     return cellMap; // mantener la actividad en su lugar
//   }

//   // eliminar la actividad antigua
//   const finalMap = removeActivity(newMap, instanceId);

//   // volver a colocarla en su nueva posición con hora y día actualizados
//   return placeActivity(finalMap, activity, date, hour, days, hourSlots);
// }

export function moveActivity(cellMap, instanceId, date, hour, days, hourSlots) {
  // encontrar todas las celdas de esta instancia
  const activityCells = [];

  for (const dateKey in cellMap) {
    for (const hourKey in cellMap[dateKey]) {
      if (cellMap[dateKey][hourKey].instanceId === instanceId) {
        activityCells.push({
          dateKey,
          hourKey,
          cell: cellMap[dateKey][hourKey]
        });
      }
    }
  }

  if (activityCells.length === 0) return cellMap;

  // tomar la cabecera
  const head = activityCells.find((c) => c.cell.isHead) || activityCells[0];
  const activity = head.cell;

  // intentar colocar en el nuevo lugar (sobre una copia)
  const tempMap = structuredClone(cellMap);
  const proposed = placeActivity(tempMap, activity, date, hour, days, hourSlots);

  // no cabe → cancelar
  if (!proposed) return cellMap;

  // borrar la actividad original
  const cleaned = removeActivity(proposed, instanceId);

  // colocar ahora de verdad
  return placeActivity(cleaned, activity, date, hour, days, hourSlots);
}










export async function saveSchedule(cellMap) {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8000";

  try {
    await axios.get("/sanctum/csrf-cookie");
    await axios.post("/api/schedule/store",
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
