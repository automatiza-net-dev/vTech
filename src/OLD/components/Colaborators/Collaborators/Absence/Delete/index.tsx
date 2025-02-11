// @ts-nocheck
import React, { memo } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id }) {
  const queryClient = useQueryClient();

  const { createToast } = useToast();

  const { mutate, loading } = useMutation(
    (id) => calendarService.deleteAbsence(id),
    {
      onSuccess: () => {
        createToast({
          message: "Indisponibilidade deletada",
          status: "success",
        });

        queryClient.invalidateQueries("getAbsences");
      },
      onError: () => {
        createToast({
          message: "Erro ao deletar indisponibiliade",
          status: "error",
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
        <DeleteTwoTone twoToneColor="red" />
      </Popconfirm>
    </div>
  );
});
