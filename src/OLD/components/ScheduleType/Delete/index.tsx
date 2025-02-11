// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { Popconfirm } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({
  id,
  setRefreshList,
  reload,
  setReload,
}) {
  const canDeleteScheduleService = useUserHasPermission("ASV03");

  const { createToast } = useToast();

  const handleDelete = React.useCallback(() => {
    if (!permissions?.ASV3) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    scheduleTypeServices
      .deleteScheduleType(id)
      .then((res) => {
        return createToast({
          message: "tipo de agendamento deletado!",
          status: "success",
        });
      })
      .catch((err) => {
        return createToast({
          message: "Erro ao deletar o tipo de agendamento!",
          status: "error",
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
        {canDeleteScheduleService && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
    </div>
  );
});
