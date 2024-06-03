import { useLoadUsersController, useTable } from "@/presentation";

import { LayoutAdmin } from "../../layout";
import { ButtonNewCollaborator } from "./components";
import { tableListCollaboratorsConfig } from "./table-configs";

import * as S from "./styles";

export function ListUserPage() {
  const { data, isFetching } = useLoadUsersController();

  const { Table, SearchBar } = useTable({
    tableKey: null,
    router: undefined,
    columnsTable: tableListCollaboratorsConfig,
    configs: {
      isFetching: isFetching,
      tableData: data,
      disableFetch: true,
      disableGetFilter: true,
      disablePagination: true,
      enableSearchInSelf: true,
      disableOrdenationTable: true,
      errorMessage: "Nenhum colaborador encontrado.",
    },
  });

  return (
      <LayoutAdmin>
        <S.ListUser>
          <div className="top">
            <div className="box-left">
              <h2>Colaboradores</h2>
            </div>

            <div className="box-right">
              {SearchBar}

              <div>
                <ButtonNewCollaborator />
              </div>
            </div>
          </div>

          {Table}
        </S.ListUser>
      </LayoutAdmin>
  );
}
