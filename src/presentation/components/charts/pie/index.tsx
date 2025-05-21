import { useEffect, useRef } from "react";

import * as echarts from "echarts";

import { DashboardChart } from "@/domain";
import { TableChart } from "../table-chart";

import * as S from "./styles";

export function PieChart({ configs, legend, title }: DashboardChart) {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current, "westeros");

    configs && !Array.isArray(configs) && chart.setOption(configs as any, true);
  }, []);

  return (
    <>
      <h4>{title}</h4>
      <S.Pie>
        <div ref={chartRef} className="chart_container" />
        {legend && <TableChart data={legend} />}
      </S.Pie>
    </>
  );
}
