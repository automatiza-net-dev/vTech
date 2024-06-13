import { useTable } from "infinity-forge";
import { DashboardTableType, SalesUser } from "@/domain";

import { columns } from "./columns";
import * as S from "./styles";

export function SalesByUserTable(props: DashboardTableType) {
  const { Table } = useTable<SalesUser>({
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
      tableData: (props as any).configs[0].users,
    },
  });

  return (
    <S.SalesByUserTable className="sales_by_user_table">
      {props.description && <h3>{props.description}</h3>}
      {Table}
    </S.SalesByUserTable>
  );
}
