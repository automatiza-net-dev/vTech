import { useTable } from "infinity-forge";

import { columns } from "./columns";

import * as S from "./styles";

export function CommercialIndicatorAccomplishedTable(props) {
  const { Table } = useTable<any>({
    columnsConfiguration: {
      columns: columns(props.name !== "billsReviewer"),
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
    <S.CommercialIndicatorAccomplishedTable>
      <h3>REALIZADO</h3>
      {Table}
      <div className="total">
        <span>Total Realizado: {props?.data[0]?.totalConfirmados}</span>
      </div>
    </S.CommercialIndicatorAccomplishedTable>
  );
}
