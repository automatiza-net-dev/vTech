import { useEffect, useState } from "react";
import { dailyMovementsService } from "@/OLD/services/dailyMovements.service";

export const useDailyMovements = (reload, filters) => {
  const [movements, setAllMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    dailyMovementsService
      .listAllMovements(filters)
      .then((res) => setAllMovements(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return { movements, loadingMovements: loading, fetchMovements: fetchData };
};

export const useDailyMovementsSearch = (filters, reload) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    dailyMovementsService
      .dailyMovementsSearch(filters)
      .then((res) => setMovements(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters, reload]);

  return {
    movements,
    loadingMovements: loading,
    fetchMovements: fetchData,
  };
};
