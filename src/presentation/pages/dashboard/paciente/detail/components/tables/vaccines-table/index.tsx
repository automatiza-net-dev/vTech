import { useTable } from "infinity-forge";

import { Patient, ScheduleVaccine } from "@/domain";
import { useLoadAllPatientVaccines } from "@/presentation";

import { columns } from "./columns";

export function VaccinesTable(props: Patient) {
  const { data, isFetching } = useLoadAllPatientVaccines(props);

  const { Table } = useTable<ScheduleVaccine | any>({
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
