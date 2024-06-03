import {
  ComposeOption,
  BarSeriesOption,
  LineSeriesOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  DatasetComponentOption,
  PieSeriesOption,
} from "echarts";
import { DashboardTableType } from "./tables";

type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>;

export type DashboardFunnel = {
  attended?: number;
  clients?: number;
  id?: string;
  identification?: string;
  sales?: number;
  scheduled?: number;
};

export type DashboardChart = {
  configs?: ECOption & DashboardFunnel[];
  legend?: {
    itemStyle?: { color: string };
    name?: string;
    percentage?: null | string;
    value?: number;
  }[];
  name?: string;
  type?: "pie" | "bar" | "line" | "funnel";
};

export type DashboardCard = {
  name: string;
  items: {
    description: string;
    value: number;
    percentage: string;
  }[];
};

export type Dashboard = {
  charts: DashboardChart[];
  cards: DashboardCard[];
  tables: DashboardTableType[];
};
