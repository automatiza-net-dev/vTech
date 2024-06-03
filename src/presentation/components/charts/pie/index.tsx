import { useEffect, useRef } from "react";

import * as echarts from "echarts";

import { DashboardChart } from "@/domain";
import { TableChart } from "../table-chart";

import * as S from "./styles";

export function PieChart({ configs, legend }: DashboardChart) {
  const chartRef = useRef<any>();

  useEffect(() => {
    const chart = echarts.init(chartRef.current, "westeros");

    !configs.length && chart.setOption(configs as any, true);
  }, []);

  return (
    <S.Pie>
      <div ref={chartRef} className="chart_container" />

      {legend && <TableChart data={legend} />}
    </S.Pie>
  );
}
