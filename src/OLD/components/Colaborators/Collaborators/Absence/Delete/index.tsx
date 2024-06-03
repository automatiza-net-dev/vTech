// @ts-nocheck
import React, { memo } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { notification, Popconfirm, Tooltip } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";

export const Delete = memo(function Delete({ id }) {
  const queryClient = useQueryClient();

  const { mutate, loading } = useMutation(
    (id) => calendarService.deleteAbsence(id),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Indisponibilidade deletada",
        });
        queryClient.invalidateQueries("getAbsences");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar indisponibiliade",
        });
      },
    }
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa indisponibiliade?"
        onConfirm={() => mutate(id)}
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        <Tooltip title="Deletar">
          <DeleteTwoTone twoToneColor="red" />
        </Tooltip>
      </Popconfirm>
    </div>
  );
});
