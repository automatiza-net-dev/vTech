import { NextRouter } from "next/router";
import { IConfigurationsTable } from "../interfaces";

export interface IUseQueryTable {
  router?: NextRouter;
  tableKey: string | null;
  configs?: IConfigurationsTable;
}

export interface IFilterDate {
  range: boolean;
  endDate?: string;
  startDate?: string;
}

export interface IFilterConfigurationsTable {
  date: IFilterDate;
  searchOptions: {
    label: string;
    value: string;
  }[];
  filters: {
    key: string;
    title: string;
    type: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  exportFormats: {
    label: string;
    value: string;
    contentType: string;
  }[];
}
