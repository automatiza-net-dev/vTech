// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { notification, Popconfirm, Tooltip } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Delete = React.memo(function Delete({
  id,
  setRefreshList,
  reload,
  setReload,
}) {
  const canDeleteScheduleService = useUserHasPermission("ASV03");

  const handleDelete = React.useCallback(() => {
    if (!permissions?.ASV3) {
      return notification.error({ message: "Ação não permitida" });
    }

    scheduleTypeServices
      .deleteScheduleType(id)
      .then((res) => {
        notification.success({
          message: "Sucesso",
          description: "tipo de agendamento deletado!",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar o tipo de agendamento!",
        });
      })
      .finally(() => setReload((prv) => !prv));
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse tipo de agendamento?"
        onConfirm={handleDelete}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        <Tooltip title="Apagar">
          {canDeleteScheduleService && <DeleteTwoTone twoToneColor="red" />}
        </Tooltip>
      </Popconfirm>
    </div>
  );
});
