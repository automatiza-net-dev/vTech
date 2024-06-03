// @ts-nocheck
import { Table } from "antd";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "../Delete";
import { Edit } from "../Edit";
import { columns } from "./colums";

export const List = memo(({ refreshTable, setRefreshTable, filters }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const handleCreateData = useCallback(() => {
    setLoading(true);

    scheduleTypeServices
      .getScheduleServiceTypes(filters)
      .then((res) => {
        setData(
          res.data.map((item) => {
            return {
              ...item,
              description: (
                <Link
                  href={`/dashboard/categorias-agendamento/visualizar/${item.id}`}
                >
                  <div>{item.description}</div>
                </Link>
              ),
              created_at: convertDate(item.created_at),
              status: item.active ? "Ativo" : "Inativo",
              allowReturn: item?.allow_return ? "Sim" : "Não",
              actions: (
                <div className="uk-flex">
                  <Delete
                    id={item.id}
                    setRefreshTable={setRefreshTable}
                    reload={reload}
                    setReload={setReload}
                  />
                  <Edit
                    id={item.id}
                    icon={true}
                    reload={reload}
                    setReload={setReload}
                  />
                </div>
              ),
            };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload, filters]);

  useEffect(() => {
    handleCreateData();
  }, [refreshTable, handleCreateData]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={Object.keys(filters).length === 0 ? [] : data}
        loading={loading}
        locale={{
          emptyText:
            Object.keys(filters).length === 0 ? (
              <>Digite acima detalhes sobre o serviço solicitado</>
            ) : (
              <>Nenhum Resultado encontrado</>
            ),
        }}
      />
    </div>
  );
});
