import { useState, useEffect } from "react";
import { clinicService } from "@/OLD/services/clinic.service";

export const useSingleInvite = (id) => {
  const [invite, setInvite] = useState<{email?: string, user_id?: string}>({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    clinicService
      .showInvite(id)
      .then((res) => setInvite(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    invite,
    loadingInvite: loading,
    fetchInvite: fetchData,
  };
};
