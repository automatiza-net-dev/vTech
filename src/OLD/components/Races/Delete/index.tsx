// @ts-nocheck
import React, { memo, useEffect } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { notification, Popconfirm } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { animalServices } from "@/OLD/services/animal.service";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export const Delete = memo(function Delete({ id, reload, setReload }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("racas");

  const canDeleteRace = useUserHasPermission("RAC03");

  const { mutate, loading } = useMutation(
    (id) => animalServices.deleteRace(id),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Raça deletada",
        });
        setReload(!reload);
        queryClient.invalidateQueries("getRaces");
      },
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar Raça",
        });
      },
    }
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa Raça?"
        onConfirm={() =>
          !permissions?.RAC3
            ? notification.error({ message: "Ação não permitida" })
            : mutate(id)
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        {canDeleteRace && (
            <DeleteTwoTone twoToneColor="red" />
        )}
      </Popconfirm>
    </div>
  );
});
