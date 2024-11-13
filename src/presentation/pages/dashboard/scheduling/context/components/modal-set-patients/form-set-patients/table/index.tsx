
import { useTable } from "infinity-forge";
import { columns } from "./table-configurations";

export function TableAnimals({ data, isLoading }) {

  const { Table } = useTable({
    columnsConfiguration: {
      columns,
    },
    configs: {
      tableData: data || [],
      isLoading: isLoading,
      errorMessage: "Nenhum paciente encontrado",
      // pagination: data.pagination
    },
  });

  return Table;
}
