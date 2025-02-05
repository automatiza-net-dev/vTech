export type DashboardTableTypes =
  | "sales-per-period"
  | "sales-per-user"
  | "budgets"
  | "subgroups"
  | "budgetsAvaliadorConsolidado"
  | "billsReviewer"
  | "budgetsVendedorConsolidado"
  | "activities"
  | "RankingVendedores" | "RankingFaturamento" | "RankingTicketMedio";

export type DashboardTable<T = any> = {
  type: string;
  name: DashboardTableTypes;
  data: T[];
  description?: string;
  configs: T[];
  hasData?: boolean;
};

export type Period = {
  new: number;
  recurrent: number;
  total: number;
  percentage: number;
  period: string;
};

export type BillSales = {
  qtd: number;
  value: number;
  avg: number;
};

export type SalesPerPeriod = {
  id: string;
  identification: string;
  period: {
    morning: Period;
    afternoon: Period;
    night: Period;
    dawn: Period;
  };
};

export type BudgetsUser = {
  open: BillSales;
  cancelled: BillSales;
  confirmed: BillSales;
  total: BillSales;
  name: string;
};

export type SalesUser = BillSales & {
  id: string;
  name: string;
  qty: string;
  percentage: string;
  total: string;
};

export type SubgroupInvoicing = {
  description: string;
  quantity: string;
  total: string;
  percentage: string;
  id: string;
};

export type SalesPerUser = {
  identification: string;
  users: SalesUser[];
};

export type BudgetsByUser = {
  id: string;
  identification: string;
  users: BudgetsUser[];
};

export type RankingFaturamento = {
  grupo_economico: string;
  unidade_negocios: string;
  business_unit_id: string;
  total_bills: number;
  participacao: number;
};

export type RankingVendedores = {
  grupo_economico: string;
  unidade_negocios: string;
  business_unit_id: string;
  total_bills: number;
  participacao: number;
  nome_vendedor: string;
  tkt_medio: number;
};

export type RankingTicketMedio = {
  grupo_economico: string;
  unidade_negocios: string;
  business_unit_id: string;
  tkt_medio: number;
}

export type DashboardTableSubgroupDetails = {};

export type DashboardTableSalesPerPeriod = DashboardTable<SalesPerPeriod>;

export type DashboardBillSalesUser = DashboardTable<BudgetsByUser>;

export type DashboardSalesByUser = DashboardTable<SalesPerUser>;

export type DashboardInvoicingBySubgroup = DashboardTable<SubgroupInvoicing>;

export type DashboardRankingFaturamento = DashboardTable<RankingFaturamento>;

export type DashboardRankingVendedores = DashboardTable<RankingVendedores>;

export type DashboardRankingTicketMedio = DashboardTable<RankingTicketMedio>;

export type DashboardTableType =
  | DashboardTableSalesPerPeriod
  | DashboardBillSalesUser
  | DashboardSalesByUser
  | DashboardInvoicingBySubgroup | DashboardRankingFaturamento | DashboardRankingVendedores | DashboardRankingTicketMedio;
