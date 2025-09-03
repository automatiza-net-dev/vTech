// @ts-nocheck
import { Table } from "antd";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { convertDate } from "@/OLD/utils/convertDate";
import { Delete } from "../Delete";
import { Edit } from "../Edit";
import { columns } from "./colums";

export const List = memo(({ refreshTable, setRefreshTable, serviceType }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const handleCreateData = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getScheduleServiceGroups(serviceType)
      .then((res) => {
        setData(
          res.data.map((item) => {
            return {
              ...item,
              description: (
                <Link
                  href={`/dashboard/tipos-agendamento/visualizar/${item.id}`}
                >
                  <div>{item.description}</div>
                </Link>
              ),
              created_at: convertDate(item.created_at),
              status: item.active ? "Ativo" : "Inativo",
              actions: item.economic_group_id ? (
                <div className="uk-flex">
                  <Delete
                    id={item.id}
                    setRefreshTable={setRefreshTable}
                    reload={refreshTable}
                    setReload={setRefreshTable}
                  />
                  <Edit
                    id={item.id}
                    setRefreshTable={setRefreshTable}
                    icon={true}
                    reload={refreshTable}
                    setReload={setRefreshTable}
                  />
                </div>
              ) : (
                <div className="">
                  <span style={{ fontWeight: 'bold' }}>Padrão</span>
                </div>
              ),
            };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshTable, serviceType]);

  useEffect(() => {
    handleCreateData();
  }, [refreshTable, handleCreateData]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={serviceType === "" ? [] : data}
        loading={loading}
        locale={{
          emptyText:
            serviceType === "" ? (
              <>Digite acima detalhes sobre o tipo de agendamento solicitado</>
            ) : (
              <>Nenhum Resultado encontrado</>
            ),
        }}
      />
    </div>
  );
});
