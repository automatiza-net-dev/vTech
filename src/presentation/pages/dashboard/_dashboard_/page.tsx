import {
  TablesSection,
  ChartsSection,
  SchedulesDashboard,
  CashiersResumeCards,
  FinancesResumeCards,
  InvoicingBySubgroupTable,
} from "./components";
import { DashboardProvider, DashboardType, useDashboard } from "./context";

import * as S from "./styles";

export function DashboardPage({ type }: { type?: DashboardType }) {
  return (
    <DashboardProvider type={type}>
      <DashboardContent />
    </DashboardProvider>
  );
}

function DashboardContent() {
  const { dashboard, type } = useDashboard();

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  const subgroupsDataTable = dashboard?.data?.tables?.find(
    (item) => item?.name === "subgroups"
  );

  return (
    <>
      <S.Dashboard $breakColumns={breakColumns}>
        <ChartsSection>
          {subgroupsDataTable && (
            <div className="custom-table">
              {(subgroupsDataTable as any)?.data.length > 0 &&
                dashboard?.data && (
                  <InvoicingBySubgroupTable {...(subgroupsDataTable as any)} />
                )}
            </div>
          )}
        </ChartsSection>

        <TablesSection  />
      </S.Dashboard>

      {!type && <SchedulesDashboard />}

      {!type && <FinancesResumeCards />}

      {!type && <CashiersResumeCards />}
    </>
  );
}
