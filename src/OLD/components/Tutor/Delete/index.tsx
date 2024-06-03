// @ts-nocheck
// Core
import React, { useState } from "react";

// Components
import { Popconfirm, Tooltip, notification } from "antd";

// Services
import { petsService } from "@/OLD/services/patient.service";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

export const Delete = React.memo(function Delete({ id, reload, setReload }) {
  const [loading, setLoading] = useState(false);

  const mutate = (id) => {
    setLoading(true);
    petsService
      .deletePatient(id)
      .then((_res) =>
        notification.success({ message: "Tutor removido com sucesso!" })
      )
      .catch((_err) => {
        notification.error({
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
          notification.warning({ message: "Verificar funcionalidade" })
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
        loading={loading}
      >
        <Tooltip title="Deletar">
          <DeleteTwoTone twoToneColor="red" className="uk-margin-small-top" />
        </Tooltip>
      </Popconfirm>
    </div>
  );
});
