// @ts-nocheck
import { Badge, Table, Tag } from "antd";
import { memo, useEffect } from "react";
import { useQuery } from "infinity-forge";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { columns } from "./columns";
import { useToast } from "infinity-forge";

export const List = memo(({ searchText }) => {
  const { createToast } = useToast();

  const { data, loading } = useQuery(
    ["getAllStatus", searchText],
    () => scheduleTypeServices.getAllStatus(searchText),
    {
      onError: () => {
        createToast({ message: "Erro ao buscar os status", status: "error" });
      },
    }
  );

  return (
    <Table
      dataSource={searchText === "" ? [] : data}
      columns={columns}
      loading={loading}
      locale={{
        emptyText:
          searchText === "" ? (
            <>Digite acima detalhes sobre o serviço solicitado</>
          ) : (
            <>Nenhum Resultado encontrado</>
          ),
      }}
    />
  );
});
