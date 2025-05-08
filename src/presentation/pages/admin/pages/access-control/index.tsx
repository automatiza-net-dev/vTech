import { Button, Table } from "infinity-forge";

import { useRolesControllers } from "@/presentation";

import { tableConfiguration } from "./table-configuration";

import * as S from "./styles";
import { Edit } from "./table-configuration/actions/edit";

export function AccessControlsPage() {
  const { data, isFetching } = useRolesControllers();

  return (
    <S.ListUser>

      <Edit  />
      <Table
        configs={{
          tableData: data || [],
          isLoading: isFetching,
          errorMessage: "Nenhum controle de acesso encontrado.",
        }}
        columnsConfiguration={{ columns: tableConfiguration }}
        isFetching={isFetching}
      />
    </S.ListUser>
  );
}
