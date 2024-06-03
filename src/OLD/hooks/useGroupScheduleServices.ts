import { useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export function useGroupScheduleServices(filter) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    scheduleTypeServices
      .getScheduleServiceGroups(filter)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    groupScheduleServices: data,
    loadingGroupScheduleServices: loading,
    fetchGroupScheduleServices: fetchData,
  };
}
