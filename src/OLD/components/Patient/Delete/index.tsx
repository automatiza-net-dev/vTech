// @ts-nocheck
import React from "react";

import { DeleteTwoTone } from "@ant-design/icons";

import { notification, Popconfirm, Tooltip } from "antd";
import { petsService } from "@/OLD/services/patient.service";

export const Delete = React.memo(function Delete({ id, setRefreshList }) {
  const handleDelete = React.useCallback(() => {
    petsService
      .deletePatient(id)
      .then((res) => {
        notification.success({
          message: "Sucesso",
          description: "Paciente deletado!",
        });
        setRefreshList();
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao deletar o paciente!",
        });
      });
  }, [id]);

  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir esse paciente?"
        onConfirm={() =>
          notification.warning({ message: "verificar funcionalidade" })
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        <Tooltip title="Apagar">
          <DeleteTwoTone twoToneColor="red" />
        </Tooltip>
      </Popconfirm>
    </div>
  );
});
