import React from "react";
import { Skeleton } from "infinity-forge";

import {
  Cards,
  Chart,
  useLoadDashboard,
  useResizeWindowUpdate,
} from "@/presentation";

import * as S from "./styles";

export function ChartsSection({
  type,
  children,
}: {
  type?: "crm";
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
    <S.ChartsSection
      $gridStyle={handleGridStyle()}
      $breakColumns={breakColumns}
      className="general-dashboard"
    >
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

            {children && children}
          </div>
        </div>
      )}

      <Cards {...dashboard.data} isFetching={isFetching} />
    </S.ChartsSection>
  );
}
