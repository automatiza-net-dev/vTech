import { useTable } from "infinity-forge";
import { DashboardTableType, SubgroupInvoicing } from "@/domain";

import * as S from "./styles";

import { columns } from "./columns";

export function InvoicingBySubgroupTable(props: DashboardTableType) {

  const { Table } = useTable<SubgroupInvoicing>({
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
      tableData:
        (props.data as any)?.length > 0 ? (props.data as any)[0]?.subgroups : [],
    },
  });

  return (
    <S.InvoicingBySubgroupTable>
      {props.description && <h3>{props.description}</h3>}
      {Table}
    </S.InvoicingBySubgroupTable>
  );
}
