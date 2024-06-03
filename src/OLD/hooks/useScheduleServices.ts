// @ts-nocheck
import { useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export function useScheduleServices(filter) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    scheduleTypeServices
      .getScheduleServiceTypes(`?description=${filter}`)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    scheduleServices: data,
    loadingScheduleServices: loading,
    fetchScheduleServices: fetchData,
  };
}
