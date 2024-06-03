import { useEffect, useState } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export function useMonthSchedules(data) {
  const [monthSchedule, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getScheduleRange(
        `?start=${data.startOf("month").format("YYYY-MM-DD")}&end=${data
          .endOf("month")
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
    monthSchedule,
    loadingMonthSchedule: loading,
    fetchMonthSchedule: fetchData,
  };
}
