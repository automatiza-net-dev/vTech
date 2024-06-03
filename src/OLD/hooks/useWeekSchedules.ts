import { useEffect, useState } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export function useWeekSchedules(data) {
  const [weekSchedules, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getScheduleRange(
        `?start=${data.startOf("week").format("YYYY-MM-DD")}&end=${data
          .endOf("week")
          .format("YYYY-MM-DD")}`
      )
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    weekSchedules,
    loadingWeekSchedule: loading,
    fetchWeekSchedule: fetchData,
  };
}
