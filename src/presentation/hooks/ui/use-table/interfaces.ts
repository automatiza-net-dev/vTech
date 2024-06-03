import { NextRouter } from "next/router";

interface IColumnTable {
  id: string;
  label: string;
  width?: number;
  type?: "a-z" | "number" | "date";
  Component?: {
    Element: any;
    props: { [key: string]: any };
    allProps?: boolean;
    defaultProps: { [key: string]: any };
  };
}

interface IParamsTable {
  search?: {
    param: string;
    query: string;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
  ord?: {
    asc: boolean;
    indice: number;
  };
  page?: number;
}

interface IConfigurationsTable {
  disableFetch?: boolean;
  tableData?: any;
  tableFullWidth?: boolean;
  disablePagination?: boolean;
  disableOrdenationTable?: boolean;
  disableGetFilter?: boolean;
  errorMessage: string;
  enableSearchInSelf?: boolean;
  isFetching?: boolean;
  enableInifniteScrollPagination?: boolean;
}

interface IUseTableProps {
  configs: IConfigurationsTable;
  router?: NextRouter;
  tableKey: string | null;
  columnsTable: IColumnTable[];
}

interface IFiltersOnSubmit {
  json: string;
  value: { [key: string]: { [key: string]: any } };
}

export type {
  IFiltersOnSubmit,
  IUseTableProps,
  IParamsTable,
  IColumnTable,
  IConfigurationsTable,
};

