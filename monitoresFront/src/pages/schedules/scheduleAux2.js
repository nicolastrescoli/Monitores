export function placeActivity(cellMap, activity, date, hour, times) {
  const rowIndex = times.indexOf(hour);
  if (rowIndex < 0) return cellMap;

  const instanceId = activity.instanceId || crypto.randomUUID();
  const durationRows = Math.ceil((activity.duration / 60)*4);

  const newMap = structuredClone(cellMap);
  if (!newMap[date]) newMap[date] = {};

  for (let i = 0; i < durationRows; i++) {
    const h = times[rowIndex + i];
    if (!h) return null;
    const cell = newMap[date][h];
    if (cell && cell.instanceId !== instanceId) return null;

    newMap[date][h] = {
      ...activity,
      instanceId,
      isHead: i === 0,
      isTail: i === durationRows - 1,
    };
  }

  return newMap;
}

export function removeActivity(cellMap, instanceId) {
  const newMap = structuredClone(cellMap);
  for (const dateKey in newMap) {
    for (const hourKey in newMap[dateKey]) {
      if (newMap[dateKey][hourKey].instanceId === instanceId) {
        delete newMap[dateKey][hourKey];
      }
    }
    if (Object.keys(newMap[dateKey]).length === 0) delete newMap[dateKey];
  }
  return newMap;
}

