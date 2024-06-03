// @ts-nocheck
import { Badge, notification, Table, Tag } from "antd";
import { memo, useEffect } from "react";
import { useQuery } from "react-query";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { columns } from "./columns";

export const List = memo(({ searchText }) => {
  const { data, loading } = useQuery(
    ["getAllStatus", searchText],
    () => scheduleTypeServices.getAllStatus(searchText),
    {
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao buscar os status",
        });
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
