import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";

export const useProfessions = () => {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    petsService
      .getTutorProfessions()
      .then((res) => setProfessions(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    professions,
    loadingProfessions: loading,
    fetchProfessions: fetchData,
  };
};
