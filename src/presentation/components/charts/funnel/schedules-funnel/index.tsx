import { DashboardChart } from "@/domain";

import * as S from "./styles";

export function ScheduleFunnel(data: DashboardChart) {
  return (
    <S.SchedulesFunnel>
      <div className="funnel-bg"></div>
    </S.SchedulesFunnel>
  );
}
