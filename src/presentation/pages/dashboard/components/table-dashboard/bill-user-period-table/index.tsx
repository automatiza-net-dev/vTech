import { useTable } from "infinity-forge";

import { columns } from "./columns";
import { BillSalesUser, DashboardTableType } from "@/domain";

import * as S from "./styles";

export function BillSalesUserTable({
  data,
  name,
  type,
  description,
}: DashboardTableType) {
  const { Table } = useTable<BillSalesUser>({
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
      tableData: data[0],
    },
  });

  return (
    <S.BillSalesUserTable>
      {description && <h3>{description}</h3>}
      {Table}
    </S.BillSalesUserTable>
  );
}
