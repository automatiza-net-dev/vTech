import { useTable } from "@/presentation";

import { columnsTable } from "./table-configurations";

export function TableClients({ data, isLoading }) {

  const { Table } = useTable({
    columnsTable,
    tableKey: "/route",
    configs: {
      tableData: data,
      isFetching: isLoading,
      errorMessage: "Nenhum cliente encontrado",
      enableInifniteScrollPagination: true,
      disableOrdenationTable: true,
      disablePagination: true
    },
  });

  return Table;
}
