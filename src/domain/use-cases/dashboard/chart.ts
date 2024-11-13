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
  configs?: (ECOption & DashboardFunnel[]) | string;
  hasData: boolean;
  title?: string;
  legend?: [
    {
      itemStyle?: { color: string };
      title?: string;
      value?: string;
    }[]
  ];
  name?: string;
  type?: "pie" | "bar" | "line" | "funnel";
};

export type DashboardCard = {
  name: string;
  faturamento_realizado?: {
    description: string;
    value: string;
  };
  items: {
    description: string;
    value: number;
    percentage: string;
    icone?: string;
  }[];
};

export type DashboardCardBoundBilling = {
  name: string;
  items: {
    description: string;
    value: number;
    percentage: string;
    categories: {
      categoria: string;
      faturamento: number;
      porcentagem: number;
      grupos: {
        grupo: string;
        porcentagem: number;
        total: number;
        origem_clientes: {
          origem: string;
          porcentagem: number;
          total: number;
        }[];
      }[];
    }[];
  };
};

export type Dashboard = {
  charts: DashboardChart[];
  cards: DashboardCard[];
  tables: DashboardTableType[];
};
