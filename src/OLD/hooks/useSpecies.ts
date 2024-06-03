// @ts-nocheck
import { useEffect, useState } from "react";
import { animalServices } from "@/OLD/services/animal.service";

import { sortItems } from "@/OLD/utils/sortItems";

export function useSpecies(filter = false, reload = false) {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    animalServices
      .getSpecies(filter)
      .then((res) => {
        sortItems(res, "field"); // Substitua "field" pelo campo que você deseja ordenar
        setSpecies(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return { species, loadingSpecies: loading, fetchSpecies: fetchData };
}
