// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { notification, Popconfirm, Tooltip } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

export const Delete = React.memo(function Delete({
  id,
  _setRefreshList,
  reload,
  setReload,
}) {
  const canDeleteTypeScheduleService = useUserHasPermission("ATS03");

  const handleDelete = React.useCallback(() => {
    if (!canDeleteTypeScheduleService) {
      return notification.error({ message: "Ação não permitida" });
    }

    scheduleTypeServices
      .deleteSingleScheduleServiceGroup(id)
      .then((res) => {
        notification.success({
          message: "Sucesso",
          description: "tipo de serviço deletado!",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar o tipo de serviço!",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse tipo de serviço?"
        onConfirm={handleDelete}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        <Tooltip title="Apagar">
          {canDeleteTypeScheduleService && <DeleteTwoTone twoToneColor="red" />}
        </Tooltip>
      </Popconfirm>
    </div>
  );
});
