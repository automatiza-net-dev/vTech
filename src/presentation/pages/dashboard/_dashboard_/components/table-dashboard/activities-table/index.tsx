import { useTable } from "infinity-forge";
import { columns } from "./columns";

import * as S from "./styles";

export function ActivitiesTable(props) {
  const totalRow = [
    {
      description: "Total",
      ...props?.data?.[0]?.total,
    },
  ];

  const { Table } = useTable<any>({
    columnsConfiguration: {
      columns: columns,
    },
    configs: {
      errorMessage: "Não há itens no momento",
      tableData: [...(props as any)?.data?.[0]?.atividades, ...totalRow],
    },
  });

  return (
    <S.ActivitiesTable>
      <h3>ATIVIDADES</h3>
      {Table}
    </S.ActivitiesTable>
  );
}
