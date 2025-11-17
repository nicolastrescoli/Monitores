
import { useState, useEffect } from "react";

export default function useResize(assignedActivities, setAssignedActivities) {
  const [resizingActivity, setResizingActivity] = useState(null);
  const [resizingActivityHorizontal, setResizingActivityHorizontal] =
    useState(null);

  const startDynamicResize = (e, activityId) => {
    e.preventDefault();
    const activity = assignedActivities.find((a) => a.id === activityId);
    if (activity) {
      setResizingActivity({
        id: activityId,
        initialY: e.clientY,
        originalDuration: activity.duration,
      });
    }
  };

  const startHorizontalResize = (e, activityId) => {
    e.preventDefault();
    const activity = assignedActivities.find((a) => a.id === activityId);
    if (activity) {
      setResizingActivityHorizontal({
        id: activityId,
        initialX: e.clientX,
        originalDaysSpan: activity.daysSpan,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingActivity) {
        const deltaY = e.clientY - resizingActivity.initialY;
        const deltaDuration = Math.round(deltaY / 60); // 60px = 1h
        const newDuration = Math.max(
          1,
          resizingActivity.originalDuration + deltaDuration
        );
        setAssignedActivities((prev) =>
          prev.map((a) =>
            a.id === resizingActivity.id ? { ...a, duration: newDuration } : a
          )
        );
      }

      if (resizingActivityHorizontal) {
        const deltaX = e.clientX - resizingActivityHorizontal.initialX;
        const deltaDays = Math.round(deltaX / 250); // 250px = 1 día
        const newDays = Math.max(
          1,
          resizingActivityHorizontal.originalDaysSpan + deltaDays
        );
        setAssignedActivities((prev) =>
          prev.map((a) =>
            a.id === resizingActivityHorizontal.id
              ? { ...a, daysSpan: newDays }
              : a
          )
        );
      }
    };

    const handleMouseUp = () => {
      setResizingActivity(null);
      setResizingActivityHorizontal(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingActivity, resizingActivityHorizontal, setAssignedActivities]);

  return { startDynamicResize, startHorizontalResize };
}
