import { useState, useEffect } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export const useScheduleTypeServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    scheduleTypeServices
      .getScheduleServiceTypes()
      .then((res) => setServices(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    fetchServices: fetchData,
    services,
    loadingServices: loading,
  };
};
