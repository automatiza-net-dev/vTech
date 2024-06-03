import { useEffect, useState } from "react";
import { hospitalizationPrescriptionsService } from "@/OLD/services/hospitalizationPrescriptions.service";

export const useMedicalPrescription = (id) => {
  const [loading, setLoading] = useState(false);
  const [medicalPrescription, setMedicalPrescription] = useState(false);

  if (!id) {
    return { medicalPrescription };
  }

  const fetchData = () => {
    setLoading(true);

    hospitalizationPrescriptionsService
      .getById(id)
      .then((res) => setMedicalPrescription(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    loadingMedicalPrescription: loading,
    medicalPrescription,
    fetchMedicalPrescription: fetchData,
  };
};
