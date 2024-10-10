import { useTable } from "infinity-forge";

import { columns } from "./columns";
import { useDreGroupsTableActions } from "./actions";

import { DreGroup } from "@/domain";
import { useLoadAllDreGroups } from "@/presentation/hooks";

import * as S from "./styles";

export function DreGroupsTable() {
  const { data, mutate } = useLoadAllDreGroups();
  const actions = useDreGroupsTableActions({ mutate });

  const { Table } = useTable<DreGroup | any>({
    columnsConfiguration: {
      columns,
      actions,
    },
    configs: {
      disableRoutingUpdateFilters: true,
      customFilters: [
        {
          name: "description",
          label: "Nome",
          InputComponent: "Input",
        },
      ] as any,
      errorMessage: "Não há itens no momento",
      tableData: data,
    },
  });

  return <S.DreGroupsTable>{Table}</S.DreGroupsTable>;
}
