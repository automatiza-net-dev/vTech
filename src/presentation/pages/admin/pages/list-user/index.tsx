import { useTable } from "infinity-forge";

import { useLoadUsersController } from "@/presentation";

import { ButtonNewCollaborator } from "./components";
import { tableListCollaboratorsConfig } from "./table-configs";

import * as S from "./styles";

export function ListUserPage() {
  const { data, isFetching } = useLoadUsersController();

  const { Table } = useTable({
    columnsConfiguration: {
      columns: tableListCollaboratorsConfig
    },
    configs: {
      isLoading: isFetching,
      tableData: data || [],
      errorMessage: "Nenhum colaborador encontrado.",
    },
  });

  return (
    <S.ListUser>
      <div className="top">
        <div className="box-left">
          <h2>Colaboradores</h2>
        </div>

        <div className="box-right">
          <div>
            <ButtonNewCollaborator />
          </div>
        </div>
      </div>

      {Table}
    </S.ListUser>
  );
}
