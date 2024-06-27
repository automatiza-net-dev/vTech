import { Skeleton } from "infinity-forge";

import { Chart, useLoadDashboard, useResizeWindowUpdate } from "@/presentation";

import {
  Cards,
  TablesSection,
  SchedulesDashboard,
  CashiersResumeCards,
  FinancesResumeCards,
  InvoicingBySubgroupTable,
} from "./components";

import * as S from "./styles";

export function DashboardPage() {
  const dashboard = useLoadDashboard();

  const resize = useResizeWindowUpdate();

  const isFetching = dashboard.isFetching || resize;

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
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

          <Cards {...dashboard.data} isFetching={isFetching} />
        </section>

        <TablesSection />
      </S.Dashboard>

      <SchedulesDashboard />

      <FinancesResumeCards />

      <CashiersResumeCards />
    </>
  );
}
