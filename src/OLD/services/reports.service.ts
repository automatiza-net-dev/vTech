import api from "@/OLD/services";

// GET
const getFlowReports = async (params) =>
  await api.get("/reports/flow", { params });

const getCheckingAccountsReports = async (params: Record<string, string>) =>
  await api.get<
    {
      id: string | null;
      identification: string;
      total: number;
      checkingaccounts: {
        id: string;
        description: string;
        account_number: string;
        bank_code: string;
        agency: string;
        balance: number;
        type: string;
      }[];
    }[]
  >("/reports/checking-accounts", { params });

const getFiscalDocumentReport = async (
  params: Record<string, string | boolean>,
) =>
  await api.get<
    {
      dataemissao: string;
      numeronf: string;
      valornf: string;
      tiponota: string;
      status: string | null;
      statusmessage: string | null;
      tag: string;
      cliente: string;
      movimento: string;
      transmissao: string;
      model: string;
      rps_series: string;
      chave: string | null;
      datarecibo: string | null;
      verification_code: string | null;
      cancellation_receipt_date: string | null;
      cancellation_receipt: string | null;
      inutilizacaodata: string | null;
      inutilizacaorecibo: string | null;
      inutilizacaomotivo: string | null;
      authorization_xml_path: string | null;
      authorization_pdf_path: string | null;
    }[]
  >("/reports/fiscal-document", { params });

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

const getIssuedInvoices = async (params) =>
  await api.get("/reports/issued-nfe", { params });

const getNFENFC = async (params) => await api.get("/focus/search", { params });

const getProductStockReport = async (
  params: Record<string, string | string[]>,
) =>
  await api.get<
    {
      productId: string;
      productDescription: string;
      subgroupDescription: string;
      deposits: {
        id: number;
        description: string;
        quantity: number;
      }[];
    }[]
  >("/reports/product-stock", { params });

export const reportsService = {
  getFlowReports,
  getNFENFC,
  getIssuedInvoices,
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
  getAnaliticalReceiptsReport,
  getProductStockReport,
  getFiscalDocumentReport,
};
