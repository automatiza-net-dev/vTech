import { Button, Table, useFiltersTable } from "infinity-forge";

import { useRolesControllers } from "@/presentation";

import { tableConfiguration } from "./table-configuration";

import * as S from "./styles";
import { Edit } from "./table-configuration/actions/edit";
import { useRouter } from "next/router";
import { useState } from "react";

export function AccessControlsPage() {
  // const { filtersObject } = useFiltersTable();
  const [filters, setFilters] = useState({});
  const { data, isFetching, refetch } = useRolesControllers({ filters });

  return (
    <S.ListUser>
      <Edit filters={filters} setFilters={setFilters} refresh={refetch} />
      <Table
        configs={{
          tableData: data || [],
          isLoading: isFetching,
          errorMessage: "Nenhum controle de acesso encontrado.",
          customFilters: [
            // {
            //   InputComponent: "Input",
            //   label: "Nome",
            //   name: "name",
            //   onChangeMode: "blur",
            // },
          ],
        }}
        columnsConfiguration={{ columns: tableConfiguration }}
      />
    </S.ListUser>
  );
}
