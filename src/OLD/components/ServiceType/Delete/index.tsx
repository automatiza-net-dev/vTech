// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Popconfirm } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({
  id,
  _setRefreshList,
  reload,
  setReload,
}) {
  const canDeleteTypeScheduleService = useUserHasPermission("ATS03");
  const { createToast } = useToast();

  const handleDelete = React.useCallback(() => {
    if (!canDeleteTypeScheduleService) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    scheduleTypeServices
      .deleteSingleScheduleServiceGroup(id)
      .then((res) => {
        return createToast({
          message: "tipo de serviço deletado!",
          status: "success",
        });
      })
      .catch((err) => {
        return createToast({
          message: "Erro ao deletar o tipo de serviço!",
          status: "error",
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
        {canDeleteTypeScheduleService && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
    </div>
  );
});
