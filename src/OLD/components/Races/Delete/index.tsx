// @ts-nocheck
import React, { memo, useEffect } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { useMutation, useQueryClient } from "infinity-forge";
import { animalServices } from "@/OLD/services/animal.service";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id, reload, setReload }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("racas");
  const canDeleteRace = useUserHasPermission("RAC03");

  const { createToast } = useToast();

  const { mutate, loading } = useMutation(
    (id) => animalServices.deleteRace(id),
    {
      onSuccess: () => {
        createToast({ message: "Raça deletada", status: "success" });

        setReload(!reload);
        queryClient.invalidateQueries("getRaces");
      },
      onError: () => {
        createToast({ message: "Erro ao deletar Raça", status: "error" });
      },
    }
  );

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa Raça?"
        onConfirm={() =>
          !permissions?.RAC3
            ? createToast({ message: "Ação não permitida", status: "error" })
            : mutate(id)
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        {canDeleteRace && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
    </div>
  );
});
