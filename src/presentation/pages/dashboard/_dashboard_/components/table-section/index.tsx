import { TableDashboard } from "@/presentation";

import { useDashboard } from "../../context";

import { IndicatorTable } from "./indicator-table";
import { SellerIndicatorTable } from "./seller-indicator-table";

export function TablesSection() {
  const { dashboard } = useDashboard();

  const tableSalesPerPeriod = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-period"
  );

  const tableSalesPerUser = dashboard?.data?.tables?.find(
    (table) => table.name === "sales-per-user"
  );

  const rankingFaturamento = dashboard?.data?.tables?.find(
    (table) => table.name === "RankingFaturamento"
  );

  const rankingVendedores = dashboard?.data?.tables?.find(
    (table) => table.name === "RankingVendedores"
  );

  const rankingTicketMedio = dashboard?.data?.tables?.find(
    (table) => table.name === "RankingTicketMedio"
  );

  const tableBudgets = dashboard?.data?.tables?.filter(
    (table) => table.name === "budgets"
  );

  const indicatorTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "budgetsAvaliadorConsolidado"
  );

  const sellerindicatorTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "budgetsVendedorConsolidado"
  );

  const billsReviewerTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "billsReviewer"
  );

  const activitiesTableData = dashboard?.data?.tables?.find(
    (table) => table.name === "activities"
  );

  return (
    <>
      {dashboard?.data?.tables && dashboard?.data?.tables?.length > 0 && (
        <section className="tables-section">
          {(rankingFaturamento || rankingTicketMedio) && (
            <div className="row" style={{ marginBottom: 20, marginTop: 20 }}>
              {rankingFaturamento && <TableDashboard {...rankingFaturamento} />}

              {rankingTicketMedio && <TableDashboard {...rankingTicketMedio} />}
            </div>
          )}

          {rankingVendedores && (
            <TableDashboard
              key={rankingVendedores.name}
              {...rankingVendedores}
            />
          )}

          <div className="row">
            {tableSalesPerPeriod && (
              <TableDashboard
                key={tableSalesPerPeriod.name}
                {...tableSalesPerPeriod}
              />
            )}

            {tableSalesPerUser && (
              <TableDashboard
                key={tableSalesPerUser.name}
                {...tableSalesPerUser}
              />
            )}
          </div>

          {tableBudgets &&
            tableBudgets.map((item) => (
              <TableDashboard key={item?.name} {...item} />
            ))}

          {activitiesTableData && activitiesTableData?.hasData && (
            <TableDashboard
              key={activitiesTableData.name}
              {...activitiesTableData}
            />
          )}

          {billsReviewerTableData && (
            <IndicatorTable
              indicator={dashboard?.data.tables.find(
                (item) => item.name === "billsReviewer"
              )}
            />
          )}

          {indicatorTableData && (
            <IndicatorTable
              indicator={dashboard?.data.tables.find(
                (item) => item.name === "budgetsAvaliadorConsolidado"
              )}
            />
          )}

          {sellerindicatorTableData && (
            <SellerIndicatorTable
              indicator={dashboard?.data.tables.find(
                (item) => item.name === "budgetsVendedorConsolidado"
              )}
            />
          )}
        </section>
      )}
    </>
  );
}
