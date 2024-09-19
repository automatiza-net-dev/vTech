import { useTable } from "infinity-forge";

import { columns } from "./columns";

import * as S from "./styles";

export function CommercialIndicatorAvaliationTable(props) {
  const { Table } = useTable<any>({
    columnsConfiguration: {
      columns,
    },
    configs: {
      errorMessage: "Não há itens no momento",
      tableData: (props as any)?.data?.[0]?.users,
    },
  });

  return (
    <S.CommercialIndicatorAvaliationTable>
      <h3 className="uppercase">Plano de Tratamento</h3>
      {Table}
      <div className="total">
        <span>
          Total Planos de Tratamento: {props?.data?.[0]?.totalOrcamentos}
        </span>
      </div>
    </S.CommercialIndicatorAvaliationTable>
  );
}
