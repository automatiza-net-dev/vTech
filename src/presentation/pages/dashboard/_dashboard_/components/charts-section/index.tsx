import React from "react";
import { FormHandler, Select, Skeleton } from "infinity-forge";

import {
  Cards,
  Chart,
  useLoadDashboard,
  useResizeWindowUpdate,
} from "@/presentation";

import * as S from "./styles";
import { PrecoCard } from "../cards/preco";
import { AdminFilters } from "./admin-filters";

export function ChartsSection({
  type,
  children,
}: {
  type?: "crm" | "admin";
  children?: React.ReactNode;
}) {
  const dashboard = useLoadDashboard({ type });

  const resize = useResizeWindowUpdate();

  const isFetching = dashboard.isFetching || resize;

  const breakColumns =
    dashboard?.data?.charts && dashboard?.data?.charts?.length <= 4;

  function handleGridStyle() {
    switch (type) {
      case "crm":
        return "grid-3";

      default:
        return "";
    }
  }

  return (
    <>
      {type === "admin" && (
        <AdminFilters />
      )}

      <S.ChartsSection
        $gridStyle={handleGridStyle()}
        $breakColumns={breakColumns}
        className="general-dashboard"
      >
        <div className="content_chartsSection">
          <div className="chart_content">
            <div className="top_informations">
              {dashboard.data?.top?.map((dashboardItem) => (
                <PrecoCard key={dashboardItem.name} {...dashboardItem} />
              ))}
            </div>

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
                  {dashboard?.data?.charts?.map((chart) => (
                    <Chart key={chart.name} {...chart} />
                  ))}

                  {children && children}
                </div>
              </div>
            )}
          </div>

          <Cards {...dashboard.data} type={type} isFetching={isFetching} />
        </div>
      </S.ChartsSection>
    </>
  );
}
