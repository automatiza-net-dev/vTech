import { useTable } from "infinity-forge";
import { DashboardTableType, SalesPerPeriod } from "@/domain";

import { columns } from "./columns";

import * as S from "./styles";

export function SalesPerPeriodTable({ data, description }: DashboardTableType) {
  const { Table } = useTable<SalesPerPeriod>({
    columnsConfiguration: {
      columns,
    },
    configs: {
      disablePagination: true,
      disableOrdenationTable: true,
      disableGetFilter: true,
      pagination: {
        endPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        page: 1,
        pages: [1],
        pageSize: 1,
        startPage: 1,
        totalItems: 3,
        totalPages: 1,
      },
      errorMessage: "Não há itens no momento",
      tableData: data,
    },
  });

  return (
    <S.SalesPerPeriodTable>
      {description && <h3>{description}</h3>}
      
      {Table}
    </S.SalesPerPeriodTable>
  );
}
