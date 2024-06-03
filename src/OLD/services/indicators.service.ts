import api from "@/OLD/services";

const getMedianTicket = async (params, consolidated = false) =>
  await api.get(
    `/indicators/median-ticket${consolidated ? "-consolidated" : ""}`,
    { params }
  );

const getMedianTicketOrigin = async (params, consolidated = false) =>
  await api.get(
    `/indicators/median-ticket-origin${consolidated ? "-consolidated" : ""}`,
    { params }
  );

const getInvoicingProductType = async (params, consolidated = false) =>
  await api.get(
    `/indicators/invoicing-product-type${consolidated ? "-consolidated" : ""}`,
    { params }
  );

const getInvoicingPaymentMethod = async (params, consolidated = false) =>
  await api.get(
    `/indicators/invoicing-payment-method${
      consolidated ? "-consolidated" : ""
    }`,
    { params }
  );

const getNewClients = async (params, consolidated = false) =>
  await api.get(
    `/indicators/invoicing-new-clients${consolidated ? "-consolidated" : ""}`,
    { params }
  );

const getSubgroupsProductsServices = async (params) =>
  await api.get("/indicators/subgroups", { params });

const getResumeSchedulings = async (params) =>
  await api.get("/indicators/scheduling", { params });

const getUnconfirmedBudgets = async (params) =>
  await api.get("/indicators/unconfirmed-budgets", { params });

const getBilling = async (params) =>
  await api.get("/indicators/billing", { params });

const getCrmIndicators = async (params) =>
  await api.get("/indicators/crm", { params });

const getSalesPerPeriod = async (params) =>
  await api.get("indicators/sales-per-period", { params });

const getByTypes = async (params) =>
  await api.get("/indicators/product-type", { params });

const getBudgetsByType = async (params) =>
  await api.get("/indicators/budgets", { params });

const getMarketingInvestment = async (params) =>
  await api.get("/indicators/marketing", { params });

const getClientCostAcquisition = async (params) =>
  await api.get("/indicators/cost-of-acquisition", { params });

const getSalesTypes = async (params) =>
  await api.get("/indicators/bill-payment-format", { params });

const getAvgInstallmentsSales = async (params) =>
  await api.get("/indicators/installment-avg", { params });

const getProductTypeSubgroup = async (params) =>
  await api.get("/indicators/invoicing-product-type-subgroup", { params });

const getSubgroupsTree = async (params) =>
  await api.get("/indicators/subgroup-tree", { params });

const getBudgetsByStatus = async (params) =>
  await api.get("/indicators/budgets-by-status", { params });

export const indicatorsService = {
  getMedianTicket,
  getMedianTicketOrigin,
  getInvoicingProductType,
  getInvoicingPaymentMethod,
  getNewClients,
  getSubgroupsProductsServices,
  getResumeSchedulings,
  getUnconfirmedBudgets,
  getBilling,
  getCrmIndicators,
  getSalesPerPeriod,
  getByTypes,
  getBudgetsByType,
  getMarketingInvestment,
  getClientCostAcquisition,
  getSalesTypes,
  getAvgInstallmentsSales,
  getProductTypeSubgroup,
  getSubgroupsTree,
  getBudgetsByStatus
};
