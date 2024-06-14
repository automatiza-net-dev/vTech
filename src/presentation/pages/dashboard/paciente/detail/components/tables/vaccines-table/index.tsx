import { useTable } from "infinity-forge";

import { Patient, Vaccine } from "@/domain";
import { useLoadAllVaccines } from "@/presentation";

import { columns } from "./columns";

export function VaccinesTable(props: Patient) {
  const { data, isFetching } = useLoadAllVaccines(props);

  const { Table } = useTable<Vaccine>({
    
    columnsConfiguration: {
      columns,
    },
    configs: {
      isLoading: isFetching,
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
      errorMessage: "Não há vacinas no momento",
      tableData: data ? data : [],
    },
  });

  return Table;
}
