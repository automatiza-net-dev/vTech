import { useState, useEffect } from "react";
import { taxationGroupsService } from "@/OLD/services/taxation-group.service";

export const useTaxationGroups = (reload = false) => {
  const [taxationGroups, setTaxationGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    taxationGroupsService
      .listTaxationGroups()
      .then((res) => setTaxationGroups(res))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    taxationGroups,
    loadingTaxationGroups: loading,
    fetchTaxationGroups: fetchData,
  };
};
