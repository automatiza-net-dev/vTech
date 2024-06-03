import { useState, useEffect } from "react";
import { hospitalizationService } from "@/OLD/services/hospitalization.service";
import { hospitalizationOccurences } from "@/OLD/services/hospitalizationsOcurrences.service";

export const useHospitalizations = () => {
  const [hospitalizations, setHospitalizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    hospitalizationService
      .listHospitalizations()
      .then((res) => setHospitalizations(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    hospitalizations,
    loadingHospitalizations: loading,
    fetchHospitalizations: fetchData,
  };
};

export const useCompleteHospitalizations = (filters, reload) => {
  const [hospitalizations, setHospitalizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    hospitalizationService
      .listCompleteHospitalizations(filters)
      .then((res) => setHospitalizations(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    hospitalizations,
    fetchHospitalizations: fetchData,
    loadingHospitalizations: loading,
  };
};

export const useParsedHospitalizations = (filters, reload) => {
  const [hospitalizations, setHospitalizations] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    hospitalizationService
      .getParsedHospitalizations(filters)
      .then((res) => setHospitalizations(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    hospitalizations,
    fetchHospitalizations: fetchData,
    loadingHospitalizations: loading,
  };
};

export const useShowOccurrence = (id) => {
  const [occurrence, setOccurrence] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    hospitalizationOccurences
      .getOccurrence(id)
      .then((res) => setOccurrence(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    occurrence,
    loadingOccurrence: loading,
    fetchOccurrence: fetchData,
  };
};
