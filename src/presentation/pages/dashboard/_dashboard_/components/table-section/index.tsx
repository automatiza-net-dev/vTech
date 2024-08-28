import { TableDashboard, useLoadDashboard } from "@/presentation";
import { IndicatorTable } from "./indicator-table";

export function TablesSection() {
  const dashboard = useLoadDashboard({});

  const TableSalesPerPeriod = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-period"
  );

  const TableSalesPerUser = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-user"
  );

  const TableBudgets = dashboard?.data?.tables?.filter(
    (table) => table.name === "budgets"
  );

  const IndicatorTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "budgetsAvaliadorConsolidado"
  );

  const BillsReviewerTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "billsReviewer"
  );

  return (
    <>
      {dashboard.data?.tables && dashboard.data?.tables?.length > 0 && (
        <section className="tables-section">
          <div className="row">
            {TableSalesPerPeriod && (
              <TableDashboard
                key={TableSalesPerPeriod.name}
                {...TableSalesPerPeriod}
              />
            )}

            {TableSalesPerUser && (
              <TableDashboard
                key={TableSalesPerUser.name}
                {...TableSalesPerUser}
              />
            )}
          </div>

          {TableBudgets &&
            TableBudgets.map((item) => (
              <TableDashboard key={item?.name} {...item} />
            ))}

          {IndicatorTableData && (
            <IndicatorTable
              indicator={dashboard.data.tables.find(
                (item) => item.name === "budgetsAvaliadorConsolidado"
              )}
            />
          )}

          {BillsReviewerTableData && (
            <IndicatorTable
              indicator={dashboard.data.tables.find(
                (item) => item.name === "billsReviewer"
              )}
            />
          )}
        </section>
      )}
    </>
  );
}
