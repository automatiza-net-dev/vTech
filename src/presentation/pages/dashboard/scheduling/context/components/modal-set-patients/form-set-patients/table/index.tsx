import { useTable } from "@/presentation";

import { columnsTable } from "./table-configurations";

export function TableAnimals({ data, isLoading }) {

  const { Table } = useTable({
    columnsTable,
    tableKey: "/route",
    configs: {
      tableData: data,
      isFetching: isLoading,
      errorMessage: "Nenhum paciente encontrado",
      enableInifniteScrollPagination: true,
      disableOrdenationTable: true,
      disablePagination: true
    },
  });

  return Table;
}
