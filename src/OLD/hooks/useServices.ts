import { useEffect, useState, useCallback } from "react";

import { servicesService } from "@/OLD/services/services.service";

export const useServices = (filters, reload) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    if (filters?.noSearch) {
      return;
    }

    servicesService
      .getAllServices(filters)
      .then((res) => setServices(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    services,
    loadingServices: loading,
    fetchServices: fetchData,
  };
};
