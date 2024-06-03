import { useEffect, useState } from "react";
import { animalServices } from "@/OLD/services/animal.service";
import { petsService } from "@/OLD/services/patient.service";

export function usePatientTutors(
  filter,
  searchWithEmptyFilter = true,
  reload = false,
  fetch = true
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!fetch) return;
    if (!searchWithEmptyFilter && !filter) return;
    if (filter?.noSearch) return;

    const newObj = delete filter.noSearch;

    setLoading(true);
    petsService
      .getTutors({ name: filter })
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, fetch]);

  return {
    patientTutors: data,
    loadingPatientTutors: loading,
    fetchPatientTutors: fetchData,
  };
}
