// @ts-nocheck
import { useEffect, useState } from "react";
import { subgroupsService } from "@/OLD/services/subgroups.service";

export const useSubgroups = (reload = false) => {
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    subgroupsService
      .listSubgroups()
      .then((res) => setSubgroups(res))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    subgroups,
    fetchsubGroups: fetchData,
    loadingSubgroups: loading,
  };
};
