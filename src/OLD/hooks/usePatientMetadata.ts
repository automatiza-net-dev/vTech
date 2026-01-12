import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";

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

export const usePatientSalesMetadata = (id: string, tutorID?: string, reload = false) => {
  const [salesMetadata, setSalesMetadata] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    petsService
      .getPatientSalesMetadata(id, tutorID)
      // @ts-expect-error bad api
      .then((res) => setSalesMetadata(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, tutorID, reload]);

  return {
    salesMetadata,
    loadingSalesMetadata: loading,
    fetchSalesMetadata: fetchData,
  };
};
