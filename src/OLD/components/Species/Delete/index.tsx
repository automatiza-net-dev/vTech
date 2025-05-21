// @ts-nocheck
import React, { memo } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { useMutation, useQueryClient } from "infinity-forge";
import { animalServices } from "@/OLD/services/animal.service";

import { permissionControl } from "@/OLD/utils/permissionsControlFake";
import { useToast } from "infinity-forge";

export const Delete = memo(function Delete({ id, reload, setReload }) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const permissions = permissionControl("especies");

  const { mutate, loading } = useMutation({
    queryKey: ["Deletea"],
    queryFn: (id) => animalServices.deleteSpecie(id),
    onSuccess: () => {
      createToast({ message: "Espécie deletada", status: "success" });

      setReload(!reload);
      queryClient.invalidateQueries("getSpecies");
    },
    onError: () => {
      createToast({ message: "Erro ao deletar espécie", status: "error" });
    },
  });

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa espécie?"
        onConfirm={() =>
          !permissions?.ESP3
            ? createToast({ message: "Ação não permitida", status: "error" })
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
