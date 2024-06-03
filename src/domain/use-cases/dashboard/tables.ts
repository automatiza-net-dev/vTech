export type DashboardTableTypes =
  | "sales-per-period"
  | "sales-per-user"
  | "budgets"
  | "subgroups";

export type DashboardTable<T = any> = {
  type: string;
  name: DashboardTableTypes;
  data: T[];
  description?: string;
  configs: T[];
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

export type DashboardTableSubgroupDetails = {};

export type DashboardTableSalesPerPeriod = DashboardTable<SalesPerPeriod>;

export type DashboardBillSalesUser = DashboardTable<BudgetsByUser>;

export type DashboardSalesByUser = DashboardTable<SalesPerUser>;

export type DashboardInvoicingBySubgroup = DashboardTable<SubgroupInvoicing>;

export type DashboardTableType =
  | DashboardTableSalesPerPeriod
  | DashboardBillSalesUser
  | DashboardSalesByUser
  | DashboardInvoicingBySubgroup;
