import { Error } from "infinity-forge";

import { PieChart } from "./pie";
import { DashboardChart } from "@/domain";

import * as S from "./styles";

export function Chart(props: DashboardChart) {
  function Chart() {
    if (props.hasData) {
      switch (props.type) {
        case "funnel": {
          if (props.configs && typeof props.configs === "string") {
            const svg = props.configs;
            const svgCorreto = svg.replace(/\\n/g, "\n").replace(/\\"/g, '"');
            return <div dangerouslySetInnerHTML={{ __html: svgCorreto }}></div>;
          }
        }

        default:
          return <PieChart {...props} />;
      }
    } else {
      return (
        <div>
          <h2>{(props?.configs as any)?.title?.text}</h2>
          <section>Não há dados para apresentar</section>
        </div>
      );
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
