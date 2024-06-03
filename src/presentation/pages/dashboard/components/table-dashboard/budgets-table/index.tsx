import { useTable } from "infinity-forge";

import { columns } from "./columns";
import { BudgetsUser, DashboardTableType } from "@/domain";

import * as S from "./styles";

export function BillSalesUserTable({
  data,

  description,
}: DashboardTableType) {
  const formattedData = (data as any)[0].units[0].users.map((item) => ({
    name: item.name,
    cancelled: {
      value: item?.totalCancelledValue,
      qtd: item?.cancelled,
      avg: item?.avgCancelledValue,
    },
    open: {
      value: item?.totalOpenValue,
      qtd: item?.open,
      avg: item?.avgOpenValue,
    },
    confirmed: {
      value: item?.totalConfirmedValue,
      qtd: item?.confirmed,
      avg: item?.avgConfirmedValue,
    },
    total: {
      value: item?.totalValue,
      qtd: item?.totalBudgets,
      avg: item?.totalValue,
    },
  }));

  const { Table } = useTable<BudgetsUser>({
    columnsConfiguration: { columns },
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
      tableData: formattedData,
    },
  });

  return (
    <S.BillSalesUserTable>
      {description && <h3>{description}</h3>}
      {Table}
    </S.BillSalesUserTable>
  );
}
