import api from "@/OLD/services";

// GET
const getFlowReports = async (params) =>
  await api.get("/reports/flow", { params });

const getCheckingAccountsReports = async (params) =>
  await api.get("/reports/checking-accounts", { params });

const getExpiredReports = async (params) =>
  await api.get("/reports/expired", { params });

const getSalesReports = async (params) =>
  await api.get("/reports/sales", { params });

const getFinancesReport = async (params) =>
  await api.get("/reports/finances", { params });

const getSaleAnalyticsReport = async (params) =>
  await api.get("/reports/sale-analytics", { params });

const getBudgetReport = async (params) =>
  await api.get("/reports/budgets", { params });

const getSchedulingReports = async (params) =>
  await api.get("/reports/scheduling", { params });

const getProductTypesReport = async (params) =>
  await api.get("/reports/product-types", { params });

const getDetailedSalesReport = async (params) =>
  await api.get("/reports/detailed-sales", { params });

const getCompetenceReports = async (params) =>
  api.get("/reports/competence", { params });

const getCashierRegimeReports = async (params) =>
  api.get("/reports/plan-group", { params });

const getBuySuggestionReport = async (params) =>
  await api.get("/reports/buy-suggestion", { params });

const getReceiptsReport = async (params) =>
  await api.get("/reports/receipts", { params });

const getAnaliticalReceiptsReport = async (params) =>
  await api.get("/reports/receipt-analytics", { params });

export const reportsService = {
  getFlowReports,
  getCheckingAccountsReports,
  getExpiredReports,
  getSalesReports,
  getFinancesReport,
  getSaleAnalyticsReport,
  getBudgetReport,
  getSchedulingReports,
  getProductTypesReport,
  getDetailedSalesReport,
  getCompetenceReports,
  getCashierRegimeReports,
  getBuySuggestionReport,
  getReceiptsReport,
  getAnaliticalReceiptsReport
};
