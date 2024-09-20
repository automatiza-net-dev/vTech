import { useState, useEffect } from "react";
import { treatmentService } from "@/OLD/services/treatments.service";

import moment from "moment";

export const useTreatments = (filters, reload) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("from")) {
      newObj = {
        ...newObj,
        from: moment(filters?.from).toISOString(),
        to: moment(filters.to).toISOString(),
      };
    }

    treatmentService
      .searchTreatments(newObj)
      .then((res) => setTreatments(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    treatments,
    fetchTreatments: fetchData,
    loadingTreatments: loading,
  };
};

export const useTreatment = (id, reload) => {
  const [treatment, setTreatment] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    treatmentService
      .showTreatment(id)
      .then((res) => setTreatment(res.data[0]))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, id]);

  return {
    treatment,
    loadingTreatment: loading,
    fetchTreatment: fetchData,
  };
};

export const useSearchDateExecutions = (filters, reload) => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    treatmentService
      .searchDateExecutions(filters)
      .then((res) => setExecutions(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    filters?.date && fetchData();
  }, [filters, reload]);

  return {
    executions,
    fetchExecutions: fetchData,
    loadingExecutions: loading,
  };
};
