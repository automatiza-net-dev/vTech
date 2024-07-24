import { TableDashboard, useLoadDashboard } from "@/presentation";

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
        </section>
      )}
    </>
  );
}
