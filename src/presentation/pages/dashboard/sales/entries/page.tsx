import { useQuery } from "infinity-forge";
import { useTable } from "infinity-forge";

import { Entrie } from "@/domain";
import { RemoteEntries } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { columns } from "./table";

import * as S from "./styles";

export function EntriesPageComponent() {
  const { data } = useQuery({
    queryKey: ["RemoteEntries"],
    queryFn: async () => {
      const response = await container
        .get<RemoteEntries>(TypesAutomatiza.RemoteEntries)
        .loadAll({});
      return response;
    },
  });

  const { Table } = useTable<Entrie, keyof typeof TypesAutomatiza>({
    configs: {
      errorMessage: "Nenhuma entrada encontrada.",
      disableOrdenationTable: false,
      tableData: data?.items || [],
    },
    columnsConfiguration: {
      columns,
      actions: {
        detail: (tableItem) => `/entrada/` + tableItem.id,
      },
    },
  });

  return (
    <S.EntriesPageComponent>
      <div className="table-container">{Table}</div>
    </S.EntriesPageComponent>
  );
}
