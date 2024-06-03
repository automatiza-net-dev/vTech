export type DashboardTableTypes = "sales-per-period" | "bill-user-period";

export type DashboardTable<T = any> = {
  type: string;
  name: DashboardTableTypes;
  data: T[];
  description?: string;
};

export type Period = {
  new: number;
  recurrent: number;
  total: number;
};

export type BillSales = {
  qtd: number;
  total: number;
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

export type BillSalesUser = {
  name: string;
  afternoon: BillSales;
  morning: BillSales;
  night: BillSales;
  dawn: BillSales;
  total: BillSales;
};

export type DashboardTableSalesPerPeriod = DashboardTable<SalesPerPeriod>;

export type DashboardBillSalesUser = DashboardTable<BillSalesUser>;

export type DashboardTableType = DashboardTableSalesPerPeriod | DashboardBillSalesUser;
