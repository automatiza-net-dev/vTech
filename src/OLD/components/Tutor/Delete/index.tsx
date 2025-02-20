// @ts-nocheck
// Core
import React, { useState } from "react";

// Components
import { Popconfirm } from "antd";

// Services
import { petsService } from "@/OLD/services/patient.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";
import { useToast } from "infinity-forge";

export const Delete = React.memo(function Delete({ id, reload, setReload }) {
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();

  const mutate = (id) => {
    setLoading(true);
    petsService
      .deletePatient(id)
      .then((_res) =>
        createToast({
          status: "success",
          message: "Tutor removido com sucesso!",
        })
      )
      .catch((_err) => {
        createToast({
          status: "error",
          message:
            "Houve um erro ao remover o tutor, tente novamente mais tarde...",
        });

        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse tutor?"
        onConfirm={() =>
          createToast({ status: "error", message: "Verificar funcionalidade" })
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        <DeleteTwoTone twoToneColor="red" className="uk-margin-small-top" />
      </Popconfirm>
    </div>
  );
});
