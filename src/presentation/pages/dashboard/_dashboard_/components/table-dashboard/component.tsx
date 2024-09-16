import { DashboardTableType } from "@/domain";

import { BillSalesUserTable } from "./budgets-table";
import { SalesPerPeriodTable } from "./sales-per-period-table";
import { SalesByUserTable } from "./sales-by-user-table";
import { ActivitiesTable } from "./activities-table";

export function TableDashboard(props: DashboardTableType) {
  switch (props.name) {
    case "sales-per-period":
      return props.data.length > 0 && <SalesPerPeriodTable {...props} />;
    case "budgets":
      return props.data.length > 0 && <BillSalesUserTable {...props} />;
    case "sales-per-user":
      return props.configs.length > 0 && <SalesByUserTable {...props} />;
    case "activities":
      return <ActivitiesTable {...props} />;
  }
}
