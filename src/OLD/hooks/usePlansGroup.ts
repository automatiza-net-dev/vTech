import { useState, useEffect } from "react";
import { plansGroupService } from "@/OLD/services/plansGroup.service";

export const usePlansGroup = (filters = false, reload = false) => {
  const [plansGroup, setPlansGroup] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    plansGroupService
      .index(filters)
      .then((res) => setPlansGroup(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    plansGroup,
    loadingPlansGroup: loading,
    fetchPlansGroup: fetchData,
  };
};
