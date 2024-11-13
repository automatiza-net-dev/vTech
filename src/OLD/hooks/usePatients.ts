// @ts-nocheck
import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";

export const usePatients = (
  reload = false,
  refresh,
  filters = false,
  fetch = true
) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (filters?.noSearch || !fetch) {
      return;
    }

    setLoading(true);
    await petsService
      .getPatients(filters)
      .then((res) => {
        setPatients(res);
      })
      .catch((_err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [reload, fetch, refresh]);

  return {
    patients,
    loadingPatients: loading,
    fetchPatients: fetchData,
  };
};
