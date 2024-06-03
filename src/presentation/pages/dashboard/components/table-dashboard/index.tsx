import { DashboardTableType } from "@/domain";

import { BillSalesUserTable } from "./bill-user-period-table";
import { SalesPerPeriodTable } from "./sales-per-period-table";

export function TableDashboard(props: DashboardTableType) {
  switch (props.name) {
    case "sales-per-period":
      return <SalesPerPeriodTable {...props} />;
    case "bill-user-period":
      return <BillSalesUserTable {...props} />;
  }
}
