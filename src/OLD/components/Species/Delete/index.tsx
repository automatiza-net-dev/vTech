// @ts-nocheck
import React, { memo } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { notification, Popconfirm } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { animalServices } from "@/OLD/services/animal.service";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";

export const Delete = memo(function Delete({ id, reload, setReload }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("especies");

  const { mutate, loading } = useMutation(
    (id) => animalServices.deleteSpecie(id),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Espécie deletada",
        });
        setReload(!reload);
        queryClient.invalidateQueries("getSpecies");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar espécie",
        });
      },
    }
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa espécie?"
        onConfirm={() =>
          !permissions?.ESP3
            ? notification.error({ message: "Ação não permitida" })
            : mutate(id)
        }
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
