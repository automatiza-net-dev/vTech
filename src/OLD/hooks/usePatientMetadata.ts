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

export const usePatientSalesMetadata = (id, reload = false) => {
  const [salesMetadata, setSalesMetadata] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    petsService
      .getPatientSalesMetadata(id)
      .then((res) => setSalesMetadata(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    salesMetadata,
    loadingSalesMetadata: loading,
    fetchSalesMetadata: fetchData,
  };
};
