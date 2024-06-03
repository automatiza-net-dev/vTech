import { useState, useEffect } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export function useReturnablesSchedulings(patientId) {
  const [lastSchedules, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getReturnablesSchedulings(patientId)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    lastSchedules,
    loadingLastMonthSchedules: loading,
    fetchLastMonthSchedules: fetchData,
  };
}
