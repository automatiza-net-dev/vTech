import { useQuery } from "infinity-forge";
import { useTable } from "infinity-forge";

import { EntrieReport } from "@/domain";
import { RemoteReportsEntries } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { columns } from "./table";

import * as S from "./styles";

export function EntriesReportsPageComponent() {
  const { data } = useQuery({
    queryKey: ["RemoteReportsEntries"],
    queryFn: async () => {
      const response = await container
        .get<RemoteReportsEntries>(TypesAutomatiza.RemoteReportsEntries)
        .loadAll({});

      return response;
    },
  });

  const { Table } = useTable<EntrieReport, keyof typeof TypesAutomatiza>({
    configs: {
      errorMessage: "Nenhuma reporte de entrada encontrada.",
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
