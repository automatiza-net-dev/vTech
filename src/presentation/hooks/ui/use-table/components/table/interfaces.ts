import { IColumnTable, IConfigurationsTable } from "../../interfaces";
import { IResponseGetTableInformations } from "../../query/service";

type colunm = keyof any;

interface IShowHiden {
  text: string;
  filterBased: colunm;
  disable: string[];
  enable: string[];
}

interface ITableProps {
  columnsTable: IColumnTable[];
  configs: IConfigurationsTable;
  tableInformations?: IResponseGetTableInformations;
}

export type { ITableProps, IShowHiden };
