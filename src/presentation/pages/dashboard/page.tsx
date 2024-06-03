import { useResizeWindowUpdate } from "./hooks/use-resize-window-update";

import {
  Chart,
  Skeleton,
  useLoadDashboard,
  LayoutDashboard,
} from "@/presentation";

import { Cards, TableDashboard, SchedulesDashboard } from "./components";

import * as S from "./styles";

export function DashboardPage() {
  const dashboard = useLoadDashboard();
  const resize = useResizeWindowUpdate();

  const isFetching = dashboard.isFetching || resize;

  return (
    <LayoutDashboard>
      <S.Dashboard>
        {isFetching && (
          <div className="skeleton">
            <Skeleton type="line" />
          </div>
        )}
        {!isFetching && (
          <div className="charts">
            {dashboard.data?.charts?.map((chart) => (
              <Chart key={chart.name} {...chart} />
            ))}
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
      </S.Dashboard>

      {dashboard.data?.tables &&
        dashboard.data?.tables?.length > 0 &&
        dashboard.data?.tables?.map((table) => (
          <TableDashboard key={table.name} {...table} />
        ))}

      {!dashboard.isLoading && <SchedulesDashboard />}
    </LayoutDashboard>
  );
}
