import { useState, useEffect } from "react";
import { clinicService } from "@/OLD/services/clinic.service";

export const useUserBusinessUnits = (id, reload) => {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);

  const fetchUnits = () => {
    setLoading(true);

    clinicService
      .getClinicsByUser({
        id,
      })
      .then((res) => setUnits(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUnits();
  }, [reload]);

  return {
    fetchUnits,
    loadingFetchUnits: loading,
    units,
  };
}
