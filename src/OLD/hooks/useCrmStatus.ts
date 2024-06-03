import { useState, useEffect } from "react";
import { crmStatusService } from "@/OLD/services/crmStatus.service";

export const useListCrmStatus = (reload = false) => {
  const [crmStatus, setCrmStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    crmStatusService
      .getAll()
      .then((res) => setCrmStatus(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    crmStatus,
    loadingCrmStatus: loading,
    fetchCrmStatus: fetchData,
  };
};
