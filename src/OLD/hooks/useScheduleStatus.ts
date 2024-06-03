import { useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export function useScheduleStatus(filter) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    scheduleTypeServices
      .getAllStatus(filter)
      .then((res) => {
        setData(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    scheduleStatus: data,
    loadingScheduleStatus: loading,
    fetchScheduleStatus: fetchData,
  };
}
