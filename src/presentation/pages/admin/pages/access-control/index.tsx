import { Button, Table, useFiltersTable } from "infinity-forge";

import { useRolesControllers } from "@/presentation";

import { tableConfiguration } from "./table-configuration";

import * as S from "./styles";
import { Edit } from "./table-configuration/actions/edit";
import { useRouter } from "next/router";

export function AccessControlsPage() {
  const {filtersObject
} = useFiltersTable()
  const { data, isFetching } = useRolesControllers({ filters: filtersObject });

  return (
    <S.ListUser>
      <Edit  />
      <Table
        configs={{
          tableData: data || [],
          isLoading: isFetching,
          errorMessage: "Nenhum controle de acesso encontrado.",
          customFilters: [{ InputComponent: "Input", label: "Nome", name: "name", onChangeMode: "blur" }]
        }}
        columnsConfiguration={{ columns: tableConfiguration }}
        isFetching={isFetching}
      />
    </S.ListUser>
  );
}
