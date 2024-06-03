import { useEffect, useState } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export function useWorkerWithSchedulings() {
  const [workersWithScheduling, setWorkerWithSchedulings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    calendarService
      .getWorkerSchedulers()
      .then((res) => {
        setWorkerWithSchedulings(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    workersWithScheduling,
    loadingWorkersWithScheduling: loading,
    fetchWorkersWithScheduling: fetchData,
  };
}
