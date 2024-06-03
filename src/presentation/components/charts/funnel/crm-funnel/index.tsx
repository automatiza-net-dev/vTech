import { DashboardChart } from "@/domain";

import * as S from "./styles";

export function CrmFunnel(data: DashboardChart) {
  return (
    <S.OpportunitiesFunnel>
      <div className="funnel-bg"></div>
    </S.OpportunitiesFunnel>
  );
}
