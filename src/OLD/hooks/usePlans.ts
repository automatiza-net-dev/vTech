import { useEffect, useState } from "react";
import { planService } from "@/OLD/services/plan.service";

export const usePlans = (filters = false, reload = false, search = true) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!search) {
      return;
    }
    setLoading(true);
    planService
      .listAllPlans(filters)
      .then((res) => {
        const sortedPlans = res.data.sort((a, b) =>
          a.description.localeCompare(b.description)
        );
        setPlans(sortedPlans);
      })
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters, search]);

  return {
    loadingPlans: loading,
    plans,
    fetchPlans: fetchData,
  };
};
