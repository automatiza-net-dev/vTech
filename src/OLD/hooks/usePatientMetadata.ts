import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";
import { useQuery } from "infinity-forge";

export const usePatientMetadata = (id, reload = false) => {
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    if (!id) {
      return;
    }

    petsService
      .getPatientMetadata(id)
      .then((res) => setMetadata(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    metadata,
    loadingPatientMetadata: loading,
    fetchPatientMetadata: fetchData,
  };
};

export const usePatientSalesMetadata = (id: string, tutorID?: string) => {
  return useQuery({
    queryKey: ['sales-metadata', id, tutorID],
    queryFn: () => petsService.getPatientSalesMetadata(id, tutorID).then((r) => r.data)
  })
};
