// @ts-nocheck
import { useEffect, useState } from "react";
import { dailyCasherService } from "@/OLD/services/dailyCasher.service";

import moment from "moment";

export const useDailyCasher = (
  reload = false,
  filters = false,
  isComplete = false
) => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    const newObj = {
      ...filters,
      fromOpening: moment(filters?.fromBill).subtract(3, "hours").toISOString(),
      toOpening: moment(filters?.toBill).subtract(3, "hours").toISOString(),
    };

    if (isComplete) {
      newObj.complete = "1";
    }

    !filters?.fromBill && delete newObj.fromOpening;
    !filters?.toBill && delete newObj.toOpening;

    dailyCasherService
      .listDailyCashiers(newObj)
      .then((res) =>
        setCashiers(
          filters?.id
            ? res.data.find((casher) => casher.id === filters?.id)
            : res.data
        )
      )
      .catch((_err) => {
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return { cashiers, cashiersLoading: loading, fetchDailyCashiers: fetchData };
};

export const useDumpDailyCasher = (id) => {
  const [reports, setReports] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    dailyCasherService
      .dumpDailyCashier(id)
      .then((res) => setReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    reports,
    reportsLoading: loading,
    fetchDailyCashiers: fetchData,
  };
};

export const useInfoDailyCasher = (id) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    dailyCasherService
      .getInfoDailyCasher(id)
      .then((res) => setInfo(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    info,
    loadingDailyCashierInfo: loading,
    fetchDailyCashierInfo: fetchData,
  };
};
