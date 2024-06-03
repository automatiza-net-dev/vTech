import { useEffect, useState, useCallback } from "react";
import { calendarService } from "@/OLD/services/calendar.service";

export function useWorkerSchedule(filters, cancelList = true, reload) {
  const [workerSchedule, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (Object?.keys(filters)?.length === 0) {
      return;
    }

    setLoading(true);
    calendarService
      .getWorkerSchedulings(filters)
      .then((res) => {
        !cancelList
          ? setData(
              res.data.filter(
                (item) =>
                  !item?.event?.serviceStatus?.description?.includes(
                    "cancelado"
                  )
              )
            )
          : setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters, reload]);

  return {
    workerSchedule,
    loadingWorkerSchedule: loading,
    fetchWorkerSchedule: fetchData,
  };
}
