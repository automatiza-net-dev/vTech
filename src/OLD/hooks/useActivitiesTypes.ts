import { useState, useEffect } from "react";
import { activitiesService } from "@/OLD/services/activities.service";

export const useActivitiesTypes = () => {
  const [actTypes, setActTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    activitiesService
      .getAll()
      .then((res) => setActTypes(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    actTypes,
    loadingActTypes: loading,
  };
};
