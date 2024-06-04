import { useResizeWindowUpdate } from "./hooks/use-resize-window-update";

import { Skeleton } from "infinity-forge";

import { Chart, useLoadDashboard } from "@/presentation";

import { Cards, TableDashboard, SchedulesDashboard } from "./components";
import { InvoicingBySubgroupTable } from "./components/table-dashboard/invoicing-by-subgroup-table";

import * as S from "./styles";

export function DashboardPage() {
  const dashboard = useLoadDashboard();
  const resize = useResizeWindowUpdate();

  const isFetching = dashboard.isFetching || resize;

  const breakColumns = dashboard?.data && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
  );

  const TableSalesPerPeriod = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-period"
  );

  const TableSalesPerUser = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-user"
  );

  const TableBudgets = dashboard?.data?.tables.find(
    (table) => table.name === "budgets"
  );

  return (
    <>
      <S.Dashboard $breakColumns={breakColumns}>
        <section className="general-dashboard">
          {isFetching && (
            <div className="skeleton">
              <Skeleton
                type="line"
                size={{ height: "600px", width: "100%", margin: "0" }}
              />
            </div>
          )}
          {!isFetching && (
            <div className="charts">
              <div>
                {dashboard.data?.charts?.map((chart) => (
                  <Chart key={chart.name} {...chart} />
                ))}
                <div className="custom-table">
                  {(subgroupsDataTable as any)?.data.length > 0 && (
                    <InvoicingBySubgroupTable
                      {...(subgroupsDataTable as any)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="cards">
            {dashboard.data && <Cards {...dashboard.data} />}
            {isFetching && (
              <div className="cards_skeleton">
                <Skeleton type="line" />
              </div>
            )}
          </div>
        </section>

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

            {TableBudgets && (
              <TableDashboard
                key={TableBudgets.name}
                {...TableBudgets}
              />
            )}
          </section>
        )}
      </S.Dashboard>
      
      {!dashboard.isLoading && <SchedulesDashboard />}
    </>
  );
}
