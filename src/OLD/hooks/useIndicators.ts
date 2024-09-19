import { useState, useEffect } from "react";

import { indicatorsService } from "@/OLD/services/indicators.service";

import moment from "moment";

export const useClientOrigin = (filters, reload) => {
  const [origins, setOrigins] = useState([]);
  const [loading, setLoading] = useState(false);

  const keys = Object.keys(filters);
  let newObject = { ...filters };

  if (keys?.includes("fromDate")) {
    newObject = {
      ...filters,
      fromDate: moment(newObject.fromDate).format("YYYY-MM-DD"),
      toDate: moment(newObject.toDate).format("YYYY-MM-DD"),
    };
  }

  const fetchData = () => {
    setLoading(true);

    indicatorsService
      .getMedianTicketOrigin(newObject)
      .then((res) => setOrigins(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    origins,
    fetchOrigins: fetchData,
    loadingOrigins: loading,
  };
};
