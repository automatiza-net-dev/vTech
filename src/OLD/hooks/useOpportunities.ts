import { useEffect, useState } from "react";
import { opportunitiesService } from "@/OLD/services/opportunities.service";

import moment from "moment";

export const useOpportunities = (filters, reload, fetch) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch || !fetch) {
      return;
    }

    setLoading(true);

    if (!filters?.contactFrom) {
      delete filters?.contactFrom;
      delete filters?.contactTo;
    }

    if (!filters?.openingFrom) {
      delete filters?.openingFrom;
      delete filters?.openingToTo;
    }

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("contactFrom")) {
      newObj = {
        ...newObj,
        contactFrom: moment(filters?.contactFrom).format("YYYY-MM-DD"),
        contactTo: moment(filters.contactTo).format("YYYY-MM-DD"),
      };
    }

    if (keys.includes("openingFrom")) {
      newObj = {
        ...newObj,
        openingFrom: moment(filters?.openingFrom).format("YYYY-MM-DD"),
        openingTo: moment(filters?.openingTo).format("YYYY-MM-DD"),
      };
    }

    opportunitiesService
      .getAll(newObj)
      .then((res) => setOpportunities(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    !filters?.noSearch && fetchData();
  }, [reload]);

  return {
    opportunities,
    loadingOpportunities: loading,
  };
};

export const useKanbanOpportunities = (filters, reload, fetch = true) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  const keys = Object.keys(filters);
  let newObj = { ...filters };

  const fetchData = () => {
    if (!fetch || filters?.noSearch) {
      return;
    }
    setLoading(true);

    if (!filters?.dateFrom) {
      delete filters?.dateFrom;
      delete filters?.dateTo;
    }

    if (!filters?.contactFrom) {
      delete filters?.contactFrom;
      delete filters?.contactTo;
    }

    if (!filters?.openingFrom) {
      delete filters?.openingFrom;
      delete filters?.openingToTo;
    }

    if (keys.includes("openingFrom")) {
      newObj = {
        ...newObj,
        openingFrom: moment(filters?.openingFrom).format("YYYY-MM-DD"),
        openingTo: moment(filters?.openingTo).format("YYYY-MM-DD"),
      };
    }

    if (keys.includes("contactFrom")) {
      newObj = {
        ...newObj,
        contactFrom: moment(filters?.contactFrom).format("YYYY-MM-DD"),
        contactTo: moment(filters?.contactTo).format("YYYY-MM-DD"),
      };
    }

    if (keys.includes("dateFrom")) {
      newObj = {
        ...newObj,
        dateFrom: moment(filters?.dateFrom).format("YYYY-MM-DD"),
        dateTo: moment(filters?.dateTo).format("YYYY-MM-DD"),
      };
    }

    opportunitiesService
      .getAllKanban(newObj)
      .then((res) => setOpportunities(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    opportunities,
    loadingOpportunities: loading,
  };
};

export const useShowOpportunity = (id, reload) => {
  const [opportunity, setOpportunity] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    opportunitiesService
      .showOpportunity(id)
      .then((res) => setOpportunity(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, reload]);

  return {
    opportunity,
    loadingOpportunity: loading,
  };
};

export const useShowActivities = (filters, reload, fetch) => {
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch || !fetch) {
      return;
    }

    setLoading(true);
    if (!filters?.fromDate) {
      delete filters?.fromDate;
      delete filters?.toDate;
    }
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(filters?.toDate).format("YYYY-MM-DD"),
      };
    }

    if (newObj.status === "all") {
      delete newObj.status;
    }

    opportunitiesService
      .getAllActivities(newObj)
      .then((res) => setAllActivities(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    loadingActivities: loading,
    fetchActivities: fetchData,
    allActivities,
  };
};

export const useSyncableOpportunities = (filters) => {
  const [opportunities, setOpportunities] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    opportunitiesService
      .getSyncableOpportunities(filters)
      .then((res) => setOpportunities(res?.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    filters?.client && fetchData();
  }, [filters]);

  return {
    opportunities,
    loadingOpportunities: loading,
    fetchOpportunities: fetchData,
  };
};
