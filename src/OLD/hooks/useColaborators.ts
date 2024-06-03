// @ts-nocheck
import { useEffect, useState } from "react";
import { clinicService } from "@/OLD/services/clinic.service";

export const useColaborator = (id, reload) => {
  const [colaborator, setColaborator] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    clinicService
      .getCollabById(id)
      .then((res) => setColaborator(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    colaborator,
    loadingColaborator: loading,
    fetchColaborator: fetchData,
  };
};

export const useColaborators = (fetch = true) => {
  const [colaborators, setColaborators] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!fetch) {
      return;
    }
    setLoading(true);
    clinicService
      .getColaborators({})
      .then((res) => setColaborators(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [fetch]);

  return {
    colaborators,
    loadingColaborators: loading,
    fetchColaborators: fetchData,
  };
};
