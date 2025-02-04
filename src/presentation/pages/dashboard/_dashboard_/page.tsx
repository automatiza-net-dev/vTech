import { useEffect } from "react";

import { Router, useRouter } from "next/router";
import { updateRoute, useQueryClient } from "infinity-forge";

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

export function DashboardPage({ type }: { type?: "crm" | "admin" }) {
  const dashboard = useLoadDashboard({ type });

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
  );

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

      {!type  && <SchedulesDashboard />}

      {!type && <FinancesResumeCards />}

      {!type && <CashiersResumeCards />}
    </>
  );
}
