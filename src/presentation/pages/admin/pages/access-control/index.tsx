import { Table } from "infinity-forge";

import { useRolesControllers } from "@/presentation";

import { tableConfiguration } from "./table-configuration";

import * as S from "./styles";

export function AccessControlsPage() {
  const { data, isFetching } = useRolesControllers();

  return (
    <S.ListUser>
      <h2>Controles de acesso</h2>

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
