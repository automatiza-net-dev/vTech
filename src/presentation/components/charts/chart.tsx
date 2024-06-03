import { Error } from "infinity-forge";

import { PieChart } from "./pie";
import { DashboardChart } from "@/domain";
import { Funnel } from "./funnel";

import * as S from "./styles";

export function Chart(props: DashboardChart) {
  function Chart() {
    switch (props.type) {
      case "funnel":
        return <Funnel {...props} />;

      default:
        return <PieChart {...props} />;
    }
  }

  return (
    <Error name="Chart">
      <S.Chart $hasLegend={!!props.legend}>
        <Chart />
      </S.Chart>
    </Error>
  );
}
