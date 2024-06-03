import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";

export function useTutorOrigins(filters = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    petsService
      .getTutorOrigins(filters)
      .then((response) => setData(response.data))
      .catch((_error) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    tutorOrigins: data,
    loadingTutorOrigins: loading,
    fetchTutorOrigins: fetchData,
  };
}

export const useUniquetutorOrigins = (origin) => {
  const [uniqueOrigins, setUniqueOrigins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    if (!origin) {
      setUniqueOrigins([]);
      return;
    }

    petsService
      .getUniqueOrigins({ clientOriginId: origin?.id })
      .then((res) => setUniqueOrigins(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [origin]);

  return {
    uniqueOrigins,
    loadingUniqueOrigins: loading,
    fetchUniqueOrigins: fetchData,
  };
};
