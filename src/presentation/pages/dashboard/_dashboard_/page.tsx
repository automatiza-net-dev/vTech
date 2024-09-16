import { useEffect } from "react";

import { useRouter } from "next/router";
import { updateRoute } from "infinity-forge";

import { useLoadDashboard } from "@/presentation";

import {
  TablesSection,
  ChartsSection,
  SchedulesDashboard,
  CashiersResumeCards,
  FinancesResumeCards,
  InvoicingBySubgroupTable,
} from "./components";

import * as S from "./styles";

export function DashboardPage({ type }: { type?: "crm" }) {
  const router = useRouter();
  const dashboard = useLoadDashboard({ type });

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
  );

  useEffect(() => {
    if (router?.query?.reload === "true") {
      updateRoute({
        params: { reload: undefined },
        router,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }
  }, [router.query?.reload]);

  return (
    <>
      <S.Dashboard $breakColumns={breakColumns}>
        <ChartsSection type={type}>
          {subgroupsDataTable && (
            <div className="custom-table">
              {(subgroupsDataTable as any)?.data.length > 0 &&
                dashboard.data && (
                  <InvoicingBySubgroupTable {...(subgroupsDataTable as any)} />
                )}
            </div>
          )}
        </ChartsSection>

        <TablesSection />
      </S.Dashboard>

      <SchedulesDashboard />

      <FinancesResumeCards />

      <CashiersResumeCards />
    </>
  );
}
