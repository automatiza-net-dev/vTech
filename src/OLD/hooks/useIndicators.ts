import { useState, useEffect } from "react";

import { indicatorsService } from "@/OLD/services/indicators.service";

import moment from "moment";

export const useMedianTicket = (filters, reload) => {
  const [medianTicket, setMedianTicket] = useState({});
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
      .getMedianTicket(newObject)
      .then((res) => setMedianTicket(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    medianTicket,
    fetchMedianTicket: fetchData,
    loadingMedianTicket: loading,
  };
};

export const useInvoicingNewClients = (filters, reload) => {
  const [invoicing, setInvoicing] = useState({});
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
      .getNewClients(newObject)
      .then((res) => setInvoicing(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    invoicing,
    fetchInvoicing: fetchData,
    loadingInvoicing: loading,
  };
};

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

export const useInvoicingPaymentMethod = (filters, reload) => {
  const [methods, setMethods] = useState([]);
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
      .getInvoicingPaymentMethod(newObject)
      .then((res) => setMethods(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    methods,
    fetchMethods: fetchData,
    loadingMethods: loading,
  };
};

export const useInvoicingProducts = (filters, reload) => {
  const [products, setProducts] = useState([]);
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
      .getInvoicingProductType({ ...newObject, type: "product" })
      .then((res) => setProducts(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    products,
    loadingProducts: loading,
    fetchProducts: fetchData,
  };
};

export const useInvoicingServices = (filters, reload) => {
  const [services, setServices] = useState([]);
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
      .getInvoicingProductType({ ...newObject, type: "service" })
      .then((res) => setServices(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    services,
    loadingServices: loading,
    fetchServices: fetchData,
  };
};

export const useInvoicingSubgroups = (filters, reload) => {
  const [subgroups, setSubgroups] = useState([]);
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
      .getSubgroupsProductsServices(newObject)
      .then((res) => setSubgroups(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    subgroups,
    loadingSubgroups: loading,
    fetchSubgroups: fetchData,
  };
};

export const useResumeSchedulings = (filters, reload) => {
  const [schedulings, setSchedulings] = useState(false);
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
      .getResumeSchedulings(newObject)
      .then((res) => setSchedulings(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    schedulings,
    loadingSchedulings: loading,
    fetchSchedulings: fetchData,
  };
};

export const useUnconfirmedBudgets = (filters, reload) => {
  const [unconfirmedBudgets, setUnconfirmedBudgets] = useState([]);
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
      .getUnconfirmedBudgets(newObject)
      .then((res) => setUnconfirmedBudgets(res.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    unconfirmedBudgets,
    loadingBudgets: loading,
    fetchBudgets: fetchData,
  };
};

export const useBilling = (filters, reload) => {
  const [billing, setBilling] = useState({});
  const [loading, setLoading] = useState(false);

  const keys = Object.keys(filters);
  let newObject = { ...filters };

  if (keys?.includes("fromDate")) {
    newObject = {
      ...filters,
      fromDate: moment(newObject.fromDate)
        ?.startOf("month")
        .format("YYYY-MM-DD"),
      toDate: moment(newObject.toDate).format("YYYY-MM-DD"),
    };
  }

  const fetchData = () => {
    setLoading(true);

    indicatorsService
      .getBilling(newObject)
      .then((res) => setBilling(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    billing,
    loadingBilling: loading,
    fetchBilling: fetchData,
  };
};

export const useCrmIndicators = (filters, reload) => {
  const [crmIndicators, setCrmIndicators] = useState({});
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
      .getCrmIndicators(newObject)
      .then((res) => setCrmIndicators(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    crmIndicators,
    loadingCrmIndicators: loading,
    fetchCrmIndicators: fetchData,
  };
};

export const useSalesPerPeriod = (filters) => {
  const [sales, setSales] = useState(false);
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
      .getSalesPerPeriod(newObject)
      .then((res) => setSales(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    sales,
    loadingSales: loading,
    fetchSales: fetchData,
  };
};

export const useByTypes = (filters) => {
  const [types, setTypes] = useState(false);
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
      .getByTypes(newObject)
      .then((res) => setTypes(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    types,
    loadingTypes: loading,
    fetchTypes: fetchData,
  };
};

export const useBudgetsByType = (filters) => {
  const [budgets, setBudgets] = useState(false);
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
      .getBudgetsByType(newObject)
      .then((res) => setBudgets(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters?.fromDate]);

  return {
    budgets,
    loadingBudgets: loading,
    fetchBudgets: fetchData,
  };
};

export const useMarketingInvestment = (filters) => {
  const [invData, setInvData] = useState(false);
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
      .getMarketingInvestment(newObject)
      .then((res) => setInvData(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters?.fromDate]);

  return {
    invData,
    loadingInvData: loading,
    fetchInvData: fetchData,
  };
};

export const useCostAcquisition = (filters) => {
  const [cost, setCost] = useState(false);
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
      .getClientCostAcquisition(newObject)
      .then((res) => setCost(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters?.fromDate]);

  return {
    cost,
    loadingCost: loading,
    fetchCost: fetchData,
  };
};

export const useSalesTypes = (filters) => {
  const [salesTypes, setSalesTypes] = useState(false);
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
      .getSalesTypes(newObject)
      .then((res) => setSalesTypes(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    salesTypes,
    loadingSalesTypes: loading,
    fetchSalesTypes: fetchData,
  };
};

export const useAvgInstallmentsSales = (filters) => {
  const [installment, setInstallment] = useState(false);
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
      .getAvgInstallmentsSales(newObject)
      .then((res) => setInstallment(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    installment,
    loadingInstallment: loading,
    fetchSalesInstallment: fetchData,
  };
};

export const useProductTypeSubgroup = (filters) => {
  const [subgroupDetails, setSubgroupDetails] = useState([]);
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
      .getProductTypeSubgroup(newObject)
      .then((res) => setSubgroupDetails(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    subgroupDetails,
    loadingSubgroupDetails: loading,
    fetchSubgroupDetails: fetchData,
  };
};

export const useSubgroupsTree = (filters) => {
  const [subgroupsTree, setSubgroupsTree] = useState([]);
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
      .getSubgroupsTree(newObject)
      .then((res) => setSubgroupsTree(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    subgroupsTree,
    loadingSubgroupsTree: loading,
    fetchSubgroupsTree: fetchData,
  };
};

export const useBudgetsByStatus = (filters, open) => {
  const [budgets, setBudgets] = useState([]);
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

  if (open) {
    newObject = {
      ...newObject,
      status: "ABERTO",
    };
  } else {
    newObject = {
      ...newObject,
      status: "NAO_CONFIRMADO__CANCELADO",
    };
  }

  const fetchData = () => {
    setLoading(true);

    indicatorsService
      .getBudgetsByStatus(newObject)
      .then((res) => setBudgets(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    budgets,
    loadingBudgets: loading,
    fetchBudgets: fetchData,
  };
};
