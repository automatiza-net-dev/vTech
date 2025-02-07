// @ts-nocheck
import React, { memo, useCallback } from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { notification, Popconfirm } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { useMutation, useQueryClient } from "react-query";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Delete = memo(function Delete({ id }) {
  const queryClient = useQueryClient();

  const canDeleteScheduleStatus = useUserHasPermission("AST03");

  const { mutate, loading } = useMutation(
    (id) => scheduleTypeServices.deleteStatus(id),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Status deletado",
        });
        queryClient.invalidateQueries("getAllStatus");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar status",
        });
      },
    }
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse status?"
        onConfirm={() =>
          !permissions?.AST3
            ? notification.error({ message: "Ação não permitida" })
            : mutate(id)
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
          {canDeleteScheduleStatus && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
    </div>
  );
});
