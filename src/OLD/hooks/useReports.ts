// @ts-nocheck
import { useState, useEffect } from "react";

import { financesService } from "@/OLD/services/finances.service";
import { reportsService } from "@/OLD/services/reports.service";

import moment from "moment";

export const useFlowReports = (filters, reload) => {
  const [flowReports, setFlowReports] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return {
        flowReports,
        fetchFlowReports: fetchData,
        loadingFlowReports: loading,
      };
    }
    setLoading(true);
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(filters.toDate).format("YYYY-MM-DD"),
      };
    }

    reportsService
      .getFlowReports(newObj)
      .then((res) => setFlowReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    flowReports,
    fetchFlowReports: fetchData,
    loadingFlowReports: loading,
  };
};

export const useCheckingAccountReports = (filters, reload) => {
  const [checkingAccountReports, setCheckingAccountsReports] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return {
        checkingAccountReports,
        fetchCheckingAccountReports: fetchData,
        loadingCheckingAccountReports: loading,
      };
    }
    setLoading(true);

    reportsService
      .getCheckingAccountsReports({ businessUnit: filters?.businessUnit })
      .then((res) => setCheckingAccountsReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    checkingAccountReports,
    fetchCheckingAccountReports: fetchData,
    loadingCheckingAccountReports: loading,
  };
};

export const useExpiredReports = (filters, reload) => {
  const [expiredReports, setExpiredReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return {
        expiredReports,
        loadingExpiredReports: loading,
        fetchExpiredReports: fetchData,
      };
    }
    setLoading(true);

    reportsService
      .getExpiredReports({ businessUnit: filters?.businessUnit })
      .then((res) => setExpiredReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    expiredReports,
    loadingExpiredReports: loading,
    fetchExpiredReports: fetchData,
  };
};

export const useFinancesReports = (filters, reload) => {
  const [financesReport, setFinancesReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    let newObj = { ...filters };
    let keys = Object.keys(newObj);

    if (keys?.length === 0) {
      setLoading(false);
      return {
        financesReport,
        loadingFinances: loading,
      };
    }

    if (keys.includes("fromIssueDate")) {
      newObj = {
        ...newObj,
        fromIssueDate: moment(filters?.fromIssueDate)
          .startOf("day")
          .toISOString(),
        toIssueDate: moment(filters.toIssueDate).endOf("day").toISOString(),
      };
    }

    if (keys.includes("toExpirationDate")) {
      newObj = {
        ...newObj,
        fromExpirationDate: moment(filters?.fromExpirationDate)
          .startOf("day")
          .toISOString(),
        toExpirationDate: moment(filters.toExpirationDate)
          .endOf("day")
          .toISOString(),
      };
    }

    if (keys.includes("fromCompetenceDate")) {
      newObj = {
        ...newObj,
        fromCompetenteDate: moment(filters?.fromCompetenteDate)
          .startOf("day")
          .toISOString(),
        toCompetenceDate: moment(filters?.toCompetenceDate)
          .endOf("day")
          .toISOString(),
      };
    }

    reportsService
      .getFinancesReport(newObj)
      .then((res) => setFinancesReport(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    financesReport,
    loadingFinances: loading,
    fetchFinances: fetchData,
  };
};

export const useSalesAnalyticsReport = (filters, reload) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const fetchData = () => {
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(filters.toDate).format("YYYY-MM-DD"),
      };
    }

    setLoading(true);
    reportsService
      .getSaleAnalyticsReport(newObj)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    loadingReports: loading,
    reports,
    fetchReports: fetchData,
  };
};

export const useBudgetReport = (filters, reload) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const fetchData = () => {
    setLoading(true);

    if (filters?.noSearch) {
      return;
    }

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromBudgetDate")) {
      newObj = {
        ...newObj,
        fromBudgetDate: moment(filters?.fromBudgetDate)
          .startOf("day")
          .format("YYYY-MM-DD"),
        toBudgetDate: moment(filters.toBudgetDate)
          .endOf("day")
          .format("YYYY-MM-DD"),
      };
    }

    if (keys.includes("fromExpirationtDate")) {
      newObj = {
        ...newObj,
        fromExpirationtDate: moment(filters?.fromExpirationtDate)
          .startOf("day")
          .format("YYYY-MM-DD"),
        toExpirationDate: moment(filters.toExpirationDate)
          .endOf("day")
          .format("YYYY-MM-DD"),
      };
    }

    if (keys.includes("fromFinishedDate")) {
      newObj = {
        ...newObj,
        fromFinishedDate: moment(filters?.fromFinishedDate)
          .startOf("day")
          .format("YYYY-MM-DD"),
        toFinishedDate: moment(filters.toFinishedDate)
          .endOf("day")
          .format("YYYY-MM-DD"),
      };
    }

    reportsService
      .getBudgetReport(newObj)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    loadingReports: loading,
    reports,
    fetchReports: fetchData,
  };
};

export const useScheduleReports = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).startOf("day").format("YYYY-MM-DD"),
        toDate: moment(filters.toDate).endOf("day").format("YYYY-MM-DD"),
      };
    }

    setLoading(true);
    reportsService
      .getSchedulingReports(newObj)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchScheduleReports: fetchData,
  };
};

export const useProductTypesReports = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).startOf("day").format("YYYY-MM-DD"),
        toDate: moment(filters.toDate).endOf("day").format("YYYY-MM-DD"),
      };
    }

    reportsService
      .getProductTypesReport(newObj)
      .then((res) => setReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchScheduleReports: fetchData,
  };
};

export const useDetailedSalesReport = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).startOf("day").format("YYYY-MM-DD"),
        toDate: moment(filters.toDate).endOf("day").format("YYYY-MM-DD"),
      };
    }

    reportsService
      .getDetailedSalesReport(newObj)
      .then((res) => setReports(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if(reload > 0) {
      fetchData();
    }
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchDetailedSalesReports: fetchData,
  };
};

export const useCompetenceReports = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("fromDate")) {
      newObj = {
        ...newObj,
        fromDate: moment(filters?.fromDate).startOf("day").format("YYYYMM"),
        toDate: moment(filters.toDate).endOf("day").format("YYYYMM"),
      };
    }

    reportsService
      .getCompetenceReports(newObj)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchReports: fetchData,
  };
};

export const useCashierRegimeReports = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    reportsService
      .getCashierRegimeReports(filters)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchReports: fetchData,
  };
};

export const useBuySuggestionReport = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    reportsService
      .getBuySuggestionReport(filters)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchReports: fetchData,
  };
};

export const useReceiptsReport = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    reportsService
      .getReceiptsReport(filters)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchReports: fetchData,
  };
};

export const useAnaliticalReceiptsReport = (filters, reload) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    setLoading(true);

    reportsService
      .getAnaliticalReceiptsReport(filters)
      .then((res) => setReports(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    reports,
    loadingReports: loading,
    fetchReports: fetchData,
  };
};
