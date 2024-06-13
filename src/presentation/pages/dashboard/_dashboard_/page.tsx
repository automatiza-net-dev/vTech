import { Skeleton } from "infinity-forge";

import {
  Chart,
  useLoadDashboard,
  useLoadFinancesResume,
  useLoadCashiersResume,
} from "@/presentation";

import {
  Cards,
  TableDashboard,
  SchedulesDashboard,
  CashiersResumeCards,
  FinancesResumeCards,
  InvoicingBySubgroupTable,
} from "./components";

import * as S from "./styles";

import { useEffect, useState } from "react";

export function useResizeWindowUpdate() {
  const [resize, setResize] = useState(false);

  useEffect(() => {
    if (process.browser) {
      window.addEventListener("resize", () => {
        setResize(true);

        setTimeout(() => {
          setResize(false);
        }, 1000);
      });
    }
  }, []);

  return resize;
}

export function DashboardPage() {
  const dashboard = useLoadDashboard();
  const financesResume = useLoadFinancesResume();
  const cashiersResume = useLoadCashiersResume();
  const resize = useResizeWindowUpdate();

  const isFetching = dashboard.isFetching || resize;

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
  );

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
          {!isFetching && dashboard.data && (
            <div className="charts">
              <div>
                {dashboard.data?.charts?.map((chart) => (
                  <Chart key={chart.name} {...chart} />
                ))}
                {subgroupsDataTable && (
                  <div className="custom-table">
                    {(subgroupsDataTable as any)?.data.length > 0 &&
                      dashboard.data && (
                        <InvoicingBySubgroupTable
                          {...(subgroupsDataTable as any)}
                        />
                      )}
                  </div>
                )}
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

            {TableBudgets &&
              TableBudgets.map((item) => (
                <TableDashboard key={item?.name} {...item} />
              ))}
          </section>
        )}
      </S.Dashboard>

      {!dashboard.isLoading && <SchedulesDashboard />}

      {financesResume?.data && (
        <FinancesResumeCards data={financesResume.data} />
      )}

      {cashiersResume?.data && (
        <CashiersResumeCards data={cashiersResume?.data} />
      )}
    </>
  );
}
