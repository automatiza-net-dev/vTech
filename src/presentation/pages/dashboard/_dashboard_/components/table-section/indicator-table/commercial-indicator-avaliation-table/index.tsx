import { useTable } from "infinity-forge";

import { columns } from "./columns";

import * as S from "./styles";

export function CommercialIndicatorAvaliationTable(props) {
  const { Table } = useTable<any>({
    columnsConfiguration: {
      columns,
    },
    configs: {
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
      errorMessage: "Não há itens no momento",
      tableData: (props as any)?.data[0]?.users,
    },
  });

  return (
    <S.CommercialIndicatorAvaliationTable>
      <h3>AVALIAÇÃO</h3>
      {Table}
      <div className="total">
        <span>Total Avaliado: {props?.data[0]?.totalOrcamentos}</span>
      </div>
    </S.CommercialIndicatorAvaliationTable>
  );
}
