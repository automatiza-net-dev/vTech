// @ts-nocheck
import React, { memo, useCallback } from "react";

import { FiTrash2 } from "react-icons/fi";

import { Popconfirm } from "antd";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { useMutation } from "@/presentation/use-query";
import { useQueryClient } from "@/presentation/use-query";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id }) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const canDeleteScheduleStatus = useUserHasPermission("AST03");

  const { mutate, loading } = useMutation({
    queryKey: ["DeleteHHHUHU"],
    queryFn: (id) => scheduleTypeServices.deleteStatus(id),
    onSuccess: () => {
      createToast({ message: "Status deletado", status: "success" });

      queryClient.invalidateQueries(["getAllStatus"]);
    },
    onError: () => {
      createToast({ message: "Erro ao deletar status", status: "error" });
    },
  });

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse status?"
        onConfirm={() =>
          !permissions?.AST3
            ? createToast({ message: "Ação não permitida", status: "error" })
            : mutate(id)
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        {canDeleteScheduleStatus && (
          <FiTrash2
            className="uk-margin-small-left"
            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
          />
        )}
      </Popconfirm>
    </div>
  );
});
