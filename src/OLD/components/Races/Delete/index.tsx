// @ts-nocheck
import React, { memo, useEffect } from "react";
import { Popconfirm } from "antd";
import { useMutation } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query";
import { animalServices } from "@/OLD/services/animal.service";
import { FiTrash2 } from "react-icons/fi";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id, reload, setReload }) {
  const queryClient = useQueryClient();

  const permissions = permissionControl("racas");
  const canDeleteRace = useUserHasPermission("RAC03");

  const { createToast } = useToast();

  const { mutate, loading } = useMutation({
    queryKey: ["DeleteAb"],
    queryFn: (id) => animalServices.deleteRace(id),
    onSuccess: () => {
      createToast({ message: "Raça deletada", status: "success" });

      setReload(!reload);
      queryClient.invalidateQueries(["getRaces"]);
    },
    onError: () => {
      createToast({ message: "Erro ao deletar Raça", status: "error" });
    },
  });

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
        {canDeleteRace && (
          <FiTrash2
            className="uk-margin-small-left"
            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
          />
        )}
      </Popconfirm>
    </div>
  );
});
