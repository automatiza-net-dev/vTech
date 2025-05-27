// @ts-nocheck
import React, { memo } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Popconfirm } from "antd";
import { useMutation, useQueryClient } from "infinity-forge";
import { calendarService } from "@/OLD/services/calendar.service";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id }) {
  const queryClient = useQueryClient();

  const { createToast } = useToast();

  const { mutate, loading } = useMutation({
    queryKey: ["DeleteRandom"],
    queryFn: (id) => calendarService.deleteAbsence(id),
    onSuccess: () => {
      createToast({
        message: "Indisponibilidade deletada",
        status: "success",
      });

      queryClient.invalidateQueries(["getAbsences"]);
    },
    onError: () => {
      createToast({
        message: "Erro ao deletar indisponibiliade",
        status: "error",
      });
    },
  });

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
        <FiTrash2 style={{ color: 'red', fontSize: '1.2rem', cursor: 'pointer' }} />
      </Popconfirm>
    </div>
  );
});
