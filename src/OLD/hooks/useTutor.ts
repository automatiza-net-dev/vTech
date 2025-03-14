// @ts-nocheck
import { useEffect, useState } from "react";
import { petsService } from "@/OLD/services/patient.service";

export const useTutor = (filters = false, reload = false, fetch = true) => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch || !fetch) {
      return;
    }

    setLoading(true);
    petsService
      .getTutors(filters)
      .then((res) => {
        setTutors(res.data)
      })
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    tutors,
    fetchTutors: fetchData,
    loadingTutors: loading,
  };
};
