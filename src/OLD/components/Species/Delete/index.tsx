// @ts-nocheck
import React, { memo } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Popconfirm } from "antd";
import { useMutation } from "infinity-forge";
import { useQueryClient } from "infinity-forge";
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
      queryClient.invalidateQueries(["getSpecies"]);
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
        <FiTrash2
          className="uk-link"
          style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
        />
      </Popconfirm>
    </div>
  );
});
