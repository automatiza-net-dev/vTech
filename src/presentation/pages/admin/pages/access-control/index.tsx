import { Table, SearchBar, useRolesControllers } from "@/presentation";

import { LayoutAdmin } from "../../layout";
import { tableConfiguration } from "./table-configuration";

import * as S from "./styles";

export function AccessControlsPage() {
  const { data } = useRolesControllers();

  return (
    <S.ListUser>
      <div className="top">
        <div className="box-left">
          <h2>Controles de acesso</h2>
        </div>

        <div className="box-right">
          <SearchBar isFetching={false} options={[]} />

          <div></div>
        </div>
      </div>

      {data && data.length && (
        <Table
          configs={{
            tableData: data,
            disableFetch: true,
            disableGetFilter: true,
            disablePagination: true,
            enableSearchInSelf: true,
            disableOrdenationTable: true,
            errorMessage: "Nenhum controle de acesso encontrado.",
          }}
          columnsTable={tableConfiguration}
          tableInformations={{
            items: data,
            hasNextPage: false,
            hasPreviousPage: false,
            pageIndex: 0,
            pageSize: 0,
            totalCount: 0,
            totalPages: 0,
          }}
        />
      )}
    </S.ListUser>
  );
}
