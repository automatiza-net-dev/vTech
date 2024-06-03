import { useState, useEffect } from "react";
import { petsService } from "@/OLD/services/patient.service";

export const usePatientAnimalHairTypes = () => {
  const [hairTypes, setHairTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    petsService
      .getPatientHairTypes()
      .then((res) => {
        const sortedData = res.data.sort((a, b) =>
          a.description.localeCompare(b.description)
        );
        setHairTypes(sortedData);
      })
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    hairTypes,
    fetchHairTypes: fetchData,
    loadingHairTypes: loading,
  };
};
