import { useTable } from "infinity-forge";
import { VaccineProtocol } from "@/domain";

import { columns } from "./columns";

export function ProtocolsTable(props: {
  data: VaccineProtocol;
  actions: any;
  type: string;
}) {
  const { Table } = useTable<VaccineProtocol>({
    columnsConfiguration: {
      columns: columns(props.type),
      actions: {
        custom: props.actions,
      },
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
      tableData: (props?.data || []) as any,
    },
  });

  return Table;
}
