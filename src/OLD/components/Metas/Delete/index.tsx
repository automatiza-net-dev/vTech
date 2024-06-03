// @ts-nocheck
import React, { memo } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { notification, Popconfirm, Tooltip } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { metasService } from "@/OLD/services/metas.service";

export const Delete = memo(function Delete({ id, canDelete }) {
  const queryClient = useQueryClient();

  const { mutate, loading } = useMutation((id) => metasService.deleteMeta(id), {
    onSuccess: () => {
      notification.success({
        message: "Sucesso",
        description: "Meta deletada",
      });
      queryClient.invalidateQueries("metas");
    },
    onError: () => {
      notification.error({
        message: "Erro",
        description: "Erro ao deletar Raça",
      });
    },
  });

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa Meta?"
        onConfirm={() =>
          !canDelete
            ? notification.error({ message: "Ação não permitida" })
            : mutate(id)
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        {canDelete && (
          <Tooltip title="Deletar">
            <DeleteTwoTone twoToneColor="red" />
          </Tooltip>
        )}
      </Popconfirm>
    </div>
  );
});
